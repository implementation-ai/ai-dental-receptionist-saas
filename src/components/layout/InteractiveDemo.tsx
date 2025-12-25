"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, Phone, PhoneOff, Mic, MicOff, Volume2, Calendar, Loader2 } from "lucide-react"
import { useGeminiLive } from "@/hooks/use-gemini-live"
import { cn } from "@/lib/utils"

export function InteractiveDemo() {
    const {
        isSessionActive,
        isSpeaking,
        isUserSpeaking,
        transcript,
        error,
        toggleCall,
        startCall,
        stopCall
    } = useGeminiLive()

    const [messages, setMessages] = useState<{ role: 'ia' | 'user', text: string }[]>([
        { role: 'ia', text: "¡Hola! Soy el asistente inteligente de tu clínica dental. ¿En qué puedo ayudarte hoy?" }
    ])

    // Update messages based on transcript changes
    useEffect(() => {
        if (transcript) {
            // We'll simplify this for the demo: 
            // The hook gives us a full transcript, we'll try to show the latest part.
            // In a real app, you'd want structured turns from the server.
        }
    }, [transcript])

    return (
        <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
            <Card className="relative overflow-hidden border border-gray-100 shadow-2xl bg-white p-2">
                <div className="rounded-xl bg-gray-50 overflow-hidden border border-gray-100 min-h-[400px] flex flex-col">
                    {/* Header */}
                    <div className="bg-white p-4 border-b flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <Bot className={cn(
                                "h-8 w-8 p-1 rounded-lg transition-colors",
                                isSessionActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                            )} />
                            <div>
                                <p className="font-semibold text-sm">Asistente Dental IA</p>
                                <p className={cn(
                                    "text-xs flex items-center gap-1",
                                    isSessionActive ? "text-green-600" : "text-gray-400"
                                )}>
                                    <span className={cn(
                                        "block h-1.5 w-1.5 rounded-full",
                                        isSessionActive ? "bg-green-500 animate-pulse" : "bg-gray-400"
                                    )}></span>
                                    {isSessionActive ? "Llamada en curso..." : "En línea ahora"}
                                </p>
                            </div>
                        </div>
                        {isSessionActive && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 animate-pulse">
                                Hablando ahora...
                            </Badge>
                        )}
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[300px] scrollbar-hide">
                        {!isSessionActive && messages.map((m, i) => (
                            <div key={i} className={cn(
                                "p-3 rounded-lg shadow-sm w-3/4 animate-in fade-in slide-in-from-bottom-2 duration-500",
                                m.role === 'ia' ? "bg-blue-600 text-white ml-auto" : "bg-white border border-gray-100"
                            )}>
                                <span className={cn("text-[10px] block mb-1", m.role === 'ia' ? "text-blue-200" : "text-gray-400")}>
                                    {m.role === 'ia' ? "IA Receptionist" : "Paciente"}
                                </span>
                                {m.text}
                            </div>
                        ))}

                        {isSessionActive && (
                            <>
                                <div className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm w-3/4 animate-in fade-in duration-300">
                                    <span className="text-[10px] text-gray-400 block mb-1">Tú (Hablando...)</span>
                                    {isUserSpeaking ? (
                                        <div className="flex gap-1 items-center h-5">
                                            <div className="w-1 h-3 bg-blue-400 animate-bounce" />
                                            <div className="w-1 h-4 bg-blue-500 animate-bounce" />
                                            <div className="w-1 h-2 bg-blue-400 animate-bounce" />
                                        </div>
                                    ) : "Escuchando tu voz..."}
                                </div>

                                {transcript && (
                                    <div className="p-3 bg-blue-600 text-white rounded-lg shadow-sm w-3/4 ml-auto animate-in scale-in-95 duration-200">
                                        <span className="text-[10px] text-blue-200 block mb-1">IA Receptionist</span>
                                        {transcript}
                                    </div>
                                )}
                            </>
                        )}

                        {error && (
                            <div className="p-2 bg-red-50 text-red-600 text-center text-xs rounded border border-red-100">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Footer / Controls */}
                    <div className="p-4 bg-white border-t mt-auto flex justify-center items-center gap-4">
                        {!isSessionActive ? (
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-8 shadow-lg shadow-blue-100"
                                onClick={toggleCall}
                            >
                                <Mic className="h-5 w-5" />
                                Probar Demo Interactiva
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full h-12 w-12 border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={stopCall}
                                >
                                    <PhoneOff className="h-5 w-5" />
                                </Button>
                                <div className="flex items-center gap-6 px-4 py-2 bg-gray-50 rounded-full border">
                                    <div className="flex gap-1 items-center">
                                        {isUserSpeaking ? (
                                            <span className="text-xs font-semibold text-blue-600 animate-pulse">USUARIO</span>
                                        ) : isSpeaking ? (
                                            <span className="text-xs font-semibold text-green-600 animate-pulse">IA HABLANDO</span>
                                        ) : (
                                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">SILENCIO</span>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Card>

            {/* Visual Decorative elements */}
            {isSessionActive && (
                <div className="absolute -right-4 -top-4 animate-bounce">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 gap-1 px-3 py-1 shadow-lg">
                        <Volume2 className="h-3 w-3" /> Audio en Real-Time
                    </Badge>
                </div>
            )}
        </div>
    )
}
