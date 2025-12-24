"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export function useGeminiLive() {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false); // Assistant speaking
    const [isUserSpeaking, setIsUserSpeaking] = useState(false); // User speaking (VAD)
    const [transcript, setTranscript] = useState<string>("");
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1.0);
    const [error, setError] = useState<string | null>(null);

    // WebSocket
    const wsRef = useRef<WebSocket | null>(null);

    // Audio Capture
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    // Audio Playback (Queue)
    const audioQueueRef = useRef<Float32Array[]>([]);
    const isPlayingRef = useRef(false);

    // Safety refs
    const isCleaningUpRef = useRef(false);
    const isMutedRef = useRef(false); // Sync ref for processor

    // Sync Mute State
    useEffect(() => {
        isMutedRef.current = isMuted;
    }, [isMuted]);

    // Sync Volume
    useEffect(() => {
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = volume;
        }
    }, [volume]);

    const { toast } = useToast();

    const cleanup = useCallback(() => {
        if (isCleaningUpRef.current) return;
        isCleaningUpRef.current = true;

        console.log("Cleaning up audio resources...");

        try {
            if (processorNodeRef.current) {
                processorNodeRef.current.onaudioprocess = null;
                processorNodeRef.current.disconnect();
                processorNodeRef.current = null;
            }
            if (sourceNodeRef.current) {
                sourceNodeRef.current.disconnect();
                sourceNodeRef.current = null;
            }
            if (gainNodeRef.current) {
                gainNodeRef.current.disconnect();
                gainNodeRef.current = null;
            }
            if (audioContextRef.current) {
                if (audioContextRef.current.state !== 'closed') {
                    audioContextRef.current.close().catch(e => console.warn("Error closing AudioContext:", e));
                }
                audioContextRef.current = null;
            }
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
                mediaStreamRef.current = null;
            }

            if (wsRef.current) {
                wsRef.current.onclose = null;
                wsRef.current.onerror = null;
                wsRef.current.onmessage = null;
                wsRef.current.close();
                wsRef.current = null;
            }
        } catch (e) {
            console.error("Error during cleanup:", e);
        }

        setIsSessionActive(false);
        setIsSpeaking(false);
        setIsUserSpeaking(false);
        isCleaningUpRef.current = false;
    }, []);

    const startCall = async () => {
        if (isCleaningUpRef.current) return;
        setError(null);
        setTranscript(""); // Reset transcript on new call

        try {
            // 1. Connect WebSocket
            const wsUrl = process.env.NEXT_PUBLIC_GEMINI_WS_URL;
            if (!wsUrl) {
                console.error("Missing NEXT_PUBLIC_GEMINI_WS_URL");
                setError("Configuration Error: Missing WebSocket URL");
                return;
            }
            let ws: WebSocket;
            try {
                ws = new WebSocket(wsUrl);
            } catch (wsError) {
                console.error("Failed to construct WebSocket:", wsError);
                setError("Invalid WebSocket URL configuration");
                return;
            }
            wsRef.current = ws;

            ws.onopen = () => {
                console.log("Connected to Gemini Stream Service");
                setIsSessionActive(true);

                // Client-Side Kickstart: Send explicit "Hello" text trigger
                // This ensures AudioContext is ready and breaks any silence deadlock
                const initialTrigger = {
                    clientContent: {
                        turns: [{
                            role: "user",
                            parts: [{ text: "Hola, preséntate brevemente." }]
                        }],
                        turnComplete: true
                    }
                };
                ws.send(JSON.stringify(initialTrigger));
            };

            ws.onerror = (e) => {
                console.error("WebSocket Error:", e);
                if (!isCleaningUpRef.current) {
                    try {
                        setError("Error de conexión con el servidor");
                    } catch (err) {
                        console.warn("Failed to set error state:", err);
                    }
                }
                cleanup();
            };

            ws.onclose = (event) => {
                console.log("Disconnected from Gemini", event.code, event.reason);
                if (!isCleaningUpRef.current && event.code !== 1000 && event.code !== 1005 && event.code !== 1006) {
                    // Ignore 1000 (Normal), 1005 (No Status), and 1006 (Abnormal - likely server restart)
                    try {
                        setError(`Conexión cerrada: ${event.code}`);
                    } catch (err) {
                        console.warn("Failed to set error state:", err);
                    }
                }
                cleanup();
            };

            ws.onmessage = async (event) => {
                if (isCleaningUpRef.current) return;

                try {
                    const data = JSON.parse(event.data);

                    if (data.error) {
                        console.error("Server Error:", data.error);
                        setError(`Error del servidor: ${data.error}`);
                        return;
                    }

                    if (data.text) {
                        setTranscript(prev => prev + data.text);
                    }

                    if (data.audioChunk) {
                        setIsSpeaking(true);
                        playAudioChunk(data.audioChunk);
                    }
                } catch (parseErr) {
                    console.error("Error parsing msg:", parseErr);
                }
            };

            // 2. Start Microphone
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            if (!AudioContextClass) throw new Error("Browser does not support AudioContext");

            const audioContext = new AudioContextClass({ sampleRate: 24000 });
            audioContextRef.current = audioContext;

            const source = audioContext.createMediaStreamSource(stream);
            sourceNodeRef.current = source;

            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            processorNodeRef.current = processor;

            // Gain node for Volume Control (Output)
            const gainNode = audioContext.createGain();
            gainNode.gain.value = volume;
            gainNode.connect(audioContext.destination);
            gainNodeRef.current = gainNode;

            let silenceStart = Date.now();
            let isSpeechDetected = false;
            let audioBuffer: Float32Array[] = [];

            const SILENCE_THRESHOLD = 0.01;
            const SILENCE_DURATION = 1500;

            processor.onaudioprocess = (e) => {
                if (isCleaningUpRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
                if (isMutedRef.current) {
                    setIsUserSpeaking(false);
                    return;
                }

                const inputData = e.inputBuffer.getChannelData(0);

                let sum = 0;
                for (let i = 0; i < inputData.length; i++) {
                    sum += inputData[i] * inputData[i];
                }
                const rms = Math.sqrt(sum / inputData.length);

                if (rms > SILENCE_THRESHOLD) {
                    silenceStart = Date.now();
                    isSpeechDetected = true;
                    setIsUserSpeaking(true); // Update UI state
                    audioBuffer.push(new Float32Array(inputData));
                } else {
                    if (isSpeechDetected) {
                        audioBuffer.push(new Float32Array(inputData));
                        if (Date.now() - silenceStart > SILENCE_DURATION) {
                            setIsUserSpeaking(false); // Update UI state
                            if (wsRef.current?.readyState === WebSocket.OPEN) {
                                const length = audioBuffer.reduce((acc, chunk) => acc + chunk.length, 0);
                                const result = new Float32Array(length);
                                let offset = 0;
                                for (const chunk of audioBuffer) {
                                    result.set(chunk, offset);
                                    offset += chunk.length;
                                }
                                const pcmData = floatTo16BitPCM(result);
                                const base64Audio = arrayBufferToBase64(pcmData);
                                wsRef.current.send(JSON.stringify({
                                    realtimeInput: {
                                        mediaChunks: [{ mimeType: "audio/pcm", data: base64Audio }]
                                    }
                                }));
                            }
                            audioBuffer = [];
                            isSpeechDetected = false;
                        }
                    } else {
                        setIsUserSpeaking(false);
                    }
                }
            };

            source.connect(processor);
            processor.connect(audioContext.destination);

        } catch (err: any) {
            console.error("Failed to start call:", err);
            setError(err.message || "Could not access microphone"); // Simple string error for UI
            cleanup();
        }
    };

    const stopCall = () => {
        cleanup();
    };

    const toggleCall = () => {
        if (isSessionActive) stopCall();
        else startCall();
    };

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    const playAudioChunk = async (base64Data: string) => {
        if (isCleaningUpRef.current || !audioContextRef.current || audioContextRef.current.state === 'closed') return;

        try {
            const binaryString = window.atob(base64Data);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const int16Data = new Int16Array(bytes.buffer);
            const floatData = new Float32Array(int16Data.length);

            for (let i = 0; i < int16Data.length; i++) {
                floatData[i] = int16Data[i] / 32768.0;
            }

            const audioCtx = audioContextRef.current;
            const buffer = audioCtx.createBuffer(1, floatData.length, 24000);
            buffer.getChannelData(0).set(floatData);

            const source = audioCtx.createBufferSource();
            source.buffer = buffer;

            // Connect to GainNode (Volume) instead of Destination directly
            if (gainNodeRef.current) {
                source.connect(gainNodeRef.current);
            } else {
                source.connect(audioCtx.destination);
            }

            source.onended = () => setIsSpeaking(false);
            source.start();
            setIsSpeaking(true);

        } catch (e) {
            console.error("Error playing audio chunk:", e);
        }
    };

    // Helper: Utils
    const floatTo16BitPCM = (input: Float32Array) => {
        const output = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
            const s = Math.max(-1, Math.min(1, input[i]));
            output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return output.buffer;
    };

    const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const sendTextMessage = (text: string) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.warn("Cannot send text: WebSocket not connected");
            return;
        }

        const message = {
            clientContent: {
                turns: [{
                    role: "user",
                    parts: [{ text: text }]
                }],
                turnComplete: true
            }
        };

        wsRef.current.send(JSON.stringify(message));
    };

    return {
        isSessionActive,
        isSpeaking,
        isUserSpeaking,
        transcript,
        isMuted,
        volume,
        error,
        startCall,
        stopCall,
        toggleCall,
        toggleMute,
        setVolume,
        sendTextMessage
    };
}
