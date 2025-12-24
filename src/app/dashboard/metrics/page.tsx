import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Users, Clock, ArrowUpRight, Phone } from "lucide-react"

export default function MetricsPage() {
    return (
        <div className="space-y-8 max-w-6xl">
            {/* Visión General */}
            <section className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard de Métricas</h1>
                <p className="text-lg text-muted-foreground max-w-3xl">
                    Bienvenido a tu centro de control. Este <strong>dashboard de recepción dental</strong> está diseñado para ofrecerte una <strong>visión general</strong> completa del rendimiento de tu clínica. Aquí transformamos datos en decisiones: optimiza tus horarios, ajusta tu personal y mide el impacto real de la IA en tu facturación.
                </p>
            </section>

            {/* Métricas Clave */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight">Métricas Clave de Tu IA</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tasa de Respuesta</CardTitle>
                            <Phone className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">98.5%</div>
                            <p className="text-xs text-muted-foreground">
                                +12% vs mes anterior
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                                La <strong>métrica de recepción de llamadas</strong> más crítica. Indica que casi ningún paciente se queda sin atención.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Citas Agendadas</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+42</div>
                            <p className="text-xs text-muted-foreground">
                                Automáticamente en Calendar
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                                Pacientes que cerraron cita sin intervención humana.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Nuevos Pacientes</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">18</div>
                            <p className="text-xs text-muted-foreground">
                                Capturados fuera de horario
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                                Oportunidades que antes se perdían por no estar operativas.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tiempo Ahorrado</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24h</div>
                            <p className="text-xs text-muted-foreground">
                                Este mes
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                                Horas liberadas para que tu personal se enfoque en la atención presencial.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Medir el ROI */}
            <section className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">Medir el ROI de tu Recepción</h2>
                    <p className="text-muted-foreground">
                        Para <strong>medir el rendimiento de recepción en clínica dental</strong>, no basta con contar llamadas. Nuestro sistema calcula el valor monetario estimado de cada cita agendada automáticamente.
                    </p>
                    <ul className="space-y-2 list-disc pl-5 text-gray-600">
                        <li>Identifica qué tratamientos generan más volumen de llamadas.</li>
                        <li>Compara el coste de la IA vs horas extras de personal.</li>
                        <li>Visualiza el crecimiento de facturación mensual atribuido a la recuperación de llamadas perdidas.</li>
                    </ul>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <span className="font-bold text-green-700">ROI en Tiempo Real: 340%</span>
                        </div>
                        <p className="text-sm text-green-800">
                            Por cada 1€ invertido en AI Dental Receptionist, tu clínica ha generado 3.40€ en nuevas citas este mes.
                        </p>
                    </div>
                </div>
                <Card className="bg-slate-50 flex items-center justify-center border-dashed">
                    <div className="text-center p-6">
                        <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 font-medium">Gráfico de Crecimiento de Ingresos</p>
                        <p className="text-xs text-gray-400">(Visualización de datos simulada para demostración)</p>
                    </div>
                </Card>
            </section>

            {/* Casos de Uso */}
            <section className="space-y-6 pt-4">
                <h2 className="text-2xl font-semibold tracking-tight">Casos de Uso: Toma Decisiones con Datos</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Optimización de Personal</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Detecta los picos de llamadas no atendidas y ajusta los turnos de tus recepcionistas para cubrir las horas de mayor demanda presencial, dejando a la IA el resto.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Marketing Efectivo</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            ¿Lanzaste una campaña de blanqueamiento? Mide exactamente cuántas llamadas y citas generó esa campaña específica a través de las etiquetas de la IA.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Control de Calidad</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Revisa las transcripciones de las llamadas atendidas por la IA para entender las dudas más frecuentes de tus pacientes y mejorar tus protocolos.
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-12 text-center bg-blue-50 rounded-2xl">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">¿Listo para maximizar la rentabilidad de tu clínica?</h3>
                <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                    No dejes que los datos se pierdan. Empieza a tomar decisiones basadas en métricas reales de IA hoy mismo.
                </p>
                <div className="flex justify-center gap-4">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-xl">
                        Actualizar mi Plan
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" className="bg-white">
                        Ver Demo Completa
                    </Button>
                </div>
            </section>
        </div>
    )
}
