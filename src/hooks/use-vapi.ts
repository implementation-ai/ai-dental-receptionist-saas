"use client";

import { useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "demo-public-key");

export function useVapi() {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Event listeners
        const onCallStart = () => setIsSessionActive(true);
        const onCallEnd = () => setIsSessionActive(false);
        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);
        const onError = (e: any) => {
            console.error("Vapi error details:", JSON.stringify(e, null, 2));
            const errorMessage = e?.error?.message || e?.message || "Error en la llamada de voz.";
            setError(errorMessage);
            setIsSessionActive(false);
        };

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("error", onError);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("error", onError);
        };
    }, []);

    const startCall = async () => {
        setError(null);
        try {
            const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
            if (!assistantId) {
                throw new Error("Assistant ID not configured");
            }
            
            // Force Spanish System Prompt
            const assistantOverrides = {
                model: {
                    provider: "openai",
                    model: "gpt-4-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "Eres Riley, una recepcionista dental experta y amable de la clínica 'Dental AI'. Tu función es ayudar a los pacientes a agendar citas. Hablas SIEMPRE en español. Eres profesional, empática y eficiente. Cuando un usuario pregunte por disponibilidad, usa la herramienta checkAvailability. Para confirmar, usa bookAppointment. NO inventes horas libres. Si no sabes algo, pregunta amablemente. Sé breve y concisa en tus respuestas habladas."
                        }
                    ]
                },
                voice: {
                    provider: "11labs",
                    voiceId: "sarah", // Example Spanish-friendly voice or keep default if good
                },
                firstMessage: "¡Hola! Soy Riley, de la clínica dental. ¿En qué puedo ayudarte hoy?"
            };

            await vapi.start(assistantId, assistantOverrides);
        } catch (err: any) {
            console.error("Failed to start call:", err);
            setError(err.message || "No se pudo iniciar la llamada.");
        }
    };

    const stopCall = () => {
        vapi.stop();
    };

    const toggleCall = () => {
        if (isSessionActive) {
            stopCall();
        } else {
            startCall();
        }
    };

    return {
        isSessionActive,
        isSpeaking,
        error,
        startCall,
        stopCall,
        toggleCall,
    };
}
