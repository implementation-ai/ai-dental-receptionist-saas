import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plug, Calendar, Database, ShieldCheck } from "lucide-react"

export default function IntegrationPage() {
    return (
        <div className="min-h-screen bg-white">
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <div className="bg-gray-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Plug className="w-8 h-8 text-gray-700" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
                        Integraciones
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                        ServicAI se conecta con las herramientas que ya usas. Sin cambiar tu forma de trabajar, solo potenciándola.
                    </p>
                </div>
            </section>

            <section className="py-24 container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="flex gap-4 items-start">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Google Calendar</h3>
                                <p className="text-gray-600">Integración nativa y bidireccional. Cualquier cambio en tu móvil se refleja en la IA al instante.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Database className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Software de Gestión (Gesden, etc.)</h3>
                                <p className="text-gray-600">Para planes Enterprise, ofrecemos integración vía API con los principales software de gestión dental del mercado.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <ShieldCheck className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">CRM & Marketing</h3>
                                <p className="text-gray-600">Conecta los leads capturados con Salesforce, HubSpot o tu herramienta de email marketing.</p>
                            </div>
                        </div>
                    </div>

                    {/* "Logos" Grid - Simulated text */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-32 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400 text-xl">
                            Google Calendar
                        </div>
                        <div className="h-32 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400 text-xl">
                            Gesden
                        </div>
                        <div className="h-32 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400 text-xl">
                            Outlook
                        </div>
                        <div className="h-32 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400 text-xl">
                            HubSpot
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
