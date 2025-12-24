"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        clinicName: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/submit-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    message: `[Contacto Web] ${formData.message}`,
                }),
            })

            const result = await response.json()

            if (result.success) {
                toast({
                    title: "Mensaje Enviado",
                    description: "Gracias por contactarnos. Te responderemos en breve.",
                    className: "bg-green-50 border-green-200"
                })
                setFormData({
                    clinicName: '',
                    name: '',
                    email: '',
                    phone: '',
                    message: ''
                })
            } else {
                throw new Error(result.error)
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo enviar el mensaje. Por favor intenta de nuevo.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
                        Hablemos
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        ¿Tienes dudas sobre cómo ServicAI puede transformar tu clínica? Estamos aquí para ayudarte.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-6">Información de Contacto</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Email</p>
                                        <a href="mailto:support@servicai.app" className="text-gray-600 hover:text-blue-600">support@servicai.app</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Teléfono (Voz)</p>
                                        <a href="tel:+12518424239" className="text-gray-600 hover:text-blue-600">+1 251-842-4239</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Oficina</p>
                                        <p className="text-gray-600">Madrid, España</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Horario de Soporte</p>
                                        <p className="text-gray-600">Lunes a Viernes, 9:00 - 18:00</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input
                                        id="name"
                                        required
                                        placeholder="Tu nombre"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="clinic">Clínica (Opcional)</Label>
                                    <Input
                                        id="clinic"
                                        placeholder="Nombre de clínica"
                                        value={formData.clinicName}
                                        onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="tu@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    required
                                    placeholder="+34 600..."
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Mensaje</Label>
                                <Textarea
                                    id="message"
                                    placeholder="¿En qué podemos ayudarte?"
                                    className="min-h-[120px]"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                {loading ? "Enviando..." : "Enviar Mensaje"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
