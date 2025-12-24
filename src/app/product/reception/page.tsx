import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Phone, CheckCircle2, Mic, Clock, Globe } from "lucide-react"

export default function ReceptionPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="py-20 bg-blue-50/50">
                <div className="container mx-auto px-4 text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Phone className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
                        Recepción IA 24/7
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                        La recepcionista que nunca duerme, nunca se enferma y atiende cientos de llamadas simultáneas con la amabilidad humana.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8">
                            <Link href="/#pricing">Empezar Ahora</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="mt-1 bg-green-100 p-2 rounded-lg h-fit">
                                    <Clock className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Disponibilidad Total</h3>
                                    <p className="text-gray-600">
                                        Olvida el "horario de oficina". Tu clínica dental estará abierta para captar pacientes a las 3 AM o un domingo por la tarde.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 bg-purple-100 p-2 rounded-lg h-fit">
                                    <Mic className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Voz Natural</h3>
                                    <p className="text-gray-600">
                                        Utilizamos modelos de voz ultra-realistas. Tus pacientes sentirán que hablan con una persona amable y profesional, no con un robot.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 bg-orange-100 p-2 rounded-lg h-fit">
                                    <Globe className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Multi-idioma (Próximamente)</h3>
                                    <p className="text-gray-600">
                                        Atiende a pacientes internacionales en inglés, francés o alemán sin costes extra.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Representation */}
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-lg">
                            <div className="border-b pb-4 mb-4 flex justify-between items-center">
                                <span className="font-mono text-sm text-gray-500">Log de Llamada #3921</span>
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Completada</span>
                            </div>
                            <div className="space-y-4 text-sm font-mono">
                                <div className="bg-white p-3 rounded shadow-sm border border-gray-100 w-3/4">
                                    <span className="text-xs text-blue-500 block mb-1">Paciente (Domingo 14:30)</span>
                                    "Hola, se me ha roto una muela y me duele mucho."
                                </div>
                                <div className="bg-blue-600 text-white p-3 rounded shadow-sm w-3/4 ml-auto">
                                    <span className="text-xs text-blue-200 block mb-1">ServicAI</span>
                                    "Lo siento mucho, entiendo que debe doler. Como es una urgencia, voy a buscarte el hueco más cercano con el Dr. Martínez para mañana a primera hora. ¿Te parece bien?"
                                </div>
                            </div>
                            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                <span>Cita de Urgencia Bloqueada en Agenda</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
