import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Check, ArrowRight } from "lucide-react"

export default function SchedulingPage() {
    return (
        <div className="min-h-screen bg-white">
            <section className="py-20 bg-green-50/50">
                <div className="container mx-auto px-4 text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
                        Agendado Automático
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                        Sincronización bidireccional con tu agenda. La IA ve tus huecos libres y agenda citas sin solapamientos.
                    </p>
                </div>
            </section>

            <section className="py-24 container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold mb-3">Integración Google Calendar</h3>
                        <p className="text-gray-500 mb-4">
                            Conecta tus calendarios existentes en segundos.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Sincronización Real-Time</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Gestión de doctores</li>
                        </ul>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold mb-3">Reglas Inteligentes</h3>
                        <p className="text-gray-500 mb-4">
                            Tú defines las reglas de tu clínica.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Duración por tratamiento</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Bloqueos de emergencia</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Prioridad pacientes nuevos</li>
                        </ul>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold mb-3">Confirmaciones</h3>
                        <p className="text-gray-500 mb-4">
                            Reduce el ausentismo (No-Show).
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> SMS automático</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Email recordatorio</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 h-12 px-8">
                        <Link href="/contact">Ver Demo de Agenda</Link>
                    </Button>
                </div>
            </section>
        </div>
    )
}
