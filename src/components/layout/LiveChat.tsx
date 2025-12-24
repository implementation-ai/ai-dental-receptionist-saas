"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Mic, X, MessageSquare, StopCircle, AlertCircle, Volume2, VolumeX, Pause, Play } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { useGeminiLive } from "@/hooks/use-gemini-live"

export function LiveChat() {
    const [isOpen, setIsOpen] = useState(false)
    const {
        isSessionActive, isSpeaking, isUserSpeaking,
        transcript, isMuted, volume,
        startCall, stopCall, toggleMute, setVolume, sendTextMessage,
        error
    } = useGeminiLive()
    const { toast } = useToast()
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll transcript
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcript]);

    const handleStartCall = () => {
        if (!permissionCheck()) return;
        startCall();
    }

    const permissionCheck = () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            toast({
                title: "Error de micrófono",
                description: "Tu navegador no soporta llamadas de voz o no tiene permisos.",
                variant: "destructive"
            })
            return false;
        }
        return true;
    }

    const chips = [
        "¿Cuáles son sus horarios?",
        "¿Cuánto cuesta una limpieza?",
        "Quiero agendar una cita",
        "¿Aceptan seguros?"
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4 font-sans">
            {isOpen && (
                <div className="bg-white rounded-3xl shadow-2xl p-6 w-[360px] border border-blue-100 flex flex-col h-[520px] animate-in slide-in-from-bottom-10 fade-in duration-300 relative overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 z-10">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${isSessionActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                            <h3 className="font-bold text-lg text-gray-900 tracking-tight">Asistente Dental IA</h3>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-gray-100">
                            <X className="h-4 w-4 text-gray-500" />
                        </Button>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col overflow-hidden relative z-10">

                        {/* Status Visualizer */}
                        <div className="flex-shrink-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-4 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden transition-all duration-500">
                            {/* Background Animations */}
                            {isSpeaking && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                                    <div className="w-32 h-32 bg-blue-400 rounded-full blur-2xl animate-pulse" />
                                </div>
                            )}

                            {error ? (
                                <div className="text-center">
                                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                                    <p className="text-xs text-red-600 font-medium px-2">{error}</p>
                                </div>
                            ) : isSessionActive ? (
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${isSpeaking ? 'bg-gradient-to-br from-indigo-500 to-purple-500 scale-110 shadow-indigo-500/50' :
                                        isUserSpeaking ? 'bg-gradient-to-br from-emerald-400 to-teal-500 scale-105 shadow-emerald-500/40' :
                                            'bg-white border-4 border-blue-100'
                                        }`}>
                                        {isSpeaking ? (
                                            <Mic className="h-8 w-8 text-white animate-pulse" />
                                        ) : isUserSpeaking ? (
                                            <Mic className="h-8 w-8 text-white animate-bounce" />
                                        ) : (
                                            <div className="flex gap-1 h-3 items-center">
                                                <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce delay-0" />
                                                <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce delay-100" />
                                                <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce delay-200" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-4 text-sm font-semibold text-slate-700 uppercase tracking-widest text-[10px]">
                                        {isSpeaking ? "Respondiendo..." : isUserSpeaking ? "Escuchando..." : "Esperando..."}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center space-y-2">
                                    <p className="text-sm font-medium text-slate-600">Hola, soy tu asistente virtual.</p>
                                    <p className="text-xs text-slate-400 max-w-[200px] mx-auto">Pregúntame sobre precios, citas o servicios dentales.</p>
                                </div>
                            )}
                        </div>

                        {/* Transcript Area (Chat) */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto mb-4 space-y-3 px-1 custom-scrollbar">
                            {transcript ? (
                                <div className="flex flex-col gap-2">
                                    <div className="bg-slate-100 text-slate-700 p-3 rounded-2xl rounded-tl-none text-sm leading-relaxed self-start max-w-[90%] shadow-sm">
                                        {transcript}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-2 mt-2">
                                    {chips.map((chip, i) => (
                                        <button key={i} className="text-left text-xs bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 p-3 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
                                            onClick={() => {
                                                if (!isSessionActive) {
                                                    handleStartCall();
                                                    // Small delay to allow connection to establish before sending text
                                                    setTimeout(() => sendTextMessage(chip), 2000);
                                                } else {
                                                    sendTextMessage(chip);
                                                }
                                            }}>
                                            <span className="font-medium text-blue-600 mr-2">✦</span> {chip}
                                        </button>
                                    ))}
                                </div>
                            )
                            }
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="mt-auto space-y-3 z-10 pt-2 border-t border-slate-100">
                        {isSessionActive && (
                            <div className="flex items-center gap-3 px-1">
                                <Button size="icon" variant="outline" className={`rounded-full h-10 w-10 border-slate-200 ${isMuted ? 'bg-red-50 text-red-500 border-red-200' : 'text-slate-600'}`} onClick={toggleMute}>
                                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                </Button>
                                <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-full px-3 h-10">
                                    <Volume2 className="h-4 w-4 text-slate-400" />
                                    <Slider defaultValue={[1]} max={1.5} step={0.1} value={[volume]} onValueChange={(val) => setVolume(val[0])} className="w-full" />
                                </div>
                            </div>
                        )}

                        {!isSessionActive ? (
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 rounded-xl shadow-blue-200 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                                onClick={handleStartCall}
                            >
                                <Mic className="mr-2 h-5 w-5" /> Iniciar Conversación
                            </Button>
                        ) : (
                            <Button
                                variant="destructive"
                                className="w-full h-11 rounded-xl font-medium bg-red-50 hover:bg-red-100 text-red-600 border border-red-100"
                                onClick={stopCall}
                            >
                                <StopCircle className="mr-2 h-4 w-4" /> Finalizar
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={`h-16 w-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center ${isOpen ? 'bg-slate-800 rotate-90' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}
            >
                {isOpen ? <X className="h-7 w-7 text-white" /> : <MessageSquare className="h-7 w-7 text-white" />}
                {!isOpen && !isSessionActive && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
                    </span>
                )}
            </Button>
        </div>
    )
}
