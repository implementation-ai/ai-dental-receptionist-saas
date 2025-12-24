import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, TrendingUp, Users } from "lucide-react"

export default function DashboardFeaturePage() {
    return (
        <div className="min-h-screen bg-white">
            <section className="py-20 bg-purple-50/50">
                <div className="container mx-auto px-4 text-center">
                    <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <BarChart3 className="w-8 h-8 text-purple-600" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
                        Dashboard de Métricas
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                        Lo que no se mide, no se mejora. Controla el pulso de tu clínica con datos en tiempo real.
                    </p>
                </div>
            </section>

            <section className="py-24 container mx-auto px-4">
                <div className="bg-gray-900 rounded-3xl p-8 md:p-16 text-white shadow-2xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Toma el control total</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="bg-gray-800 p-3 rounded-lg">
                                        <TrendingUp className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">ROI en Tiempo Real</h3>
                                        <p className="text-gray-400">Visualiza cuánto valor está generando la IA para tu clínica cada día.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-gray-800 p-3 rounded-lg">
                                        <Users className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Análisis de Pacientes</h3>
                                        <p className="text-gray-400">Entiende qué tratamientos demandan más tus pacientes y a qué horas llaman.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mock UI */}
                        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 opacity-90 hover:opacity-100 transition-opacity">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-medium">Resumen Semanal</span>
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">+12% vs semana anterior</span>
                            </div>
                            <div className="space-y-3">
                                <div className="h-24 bg-gray-700/50 rounded flex items-end justify-between p-2 px-4 gap-2">
                                    <div className="w-full bg-blue-500 h-[40%] rounded-t opacity-50"></div>
                                    <div className="w-full bg-blue-500 h-[60%] rounded-t opacity-70"></div>
                                    <div className="w-full bg-blue-500 h-[30%] rounded-t opacity-50"></div>
                                    <div className="w-full bg-blue-500 h-[80%] rounded-t opacity-90"></div>
                                    <div className="w-full bg-blue-500 h-[50%] rounded-t opacity-60"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <div className="bg-gray-700/50 p-3 rounded">
                                        <div className="text-xs text-gray-400">Llamadas</div>
                                        <div className="text-xl font-bold">142</div>
                                    </div>
                                    <div className="bg-gray-700/50 p-3 rounded">
                                        <div className="text-xs text-gray-400">Citas Cerradas</div>
                                        <div className="text-xl font-bold text-green-400">38</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
