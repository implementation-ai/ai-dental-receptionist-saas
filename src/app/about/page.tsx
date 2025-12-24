import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Heart, Shield, Lightbulb } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            {/* Hero Section */}
            <section className="container mx-auto px-4 md:px-6 mb-16 text-center">
                <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">
                    Nuestra Misión
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
                    Humanizando la Tecnología Dental
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    En ServicAI, creemos que la inteligencia artificial no viene a reemplazar al personal, sino a empoderarlo. Nuestra misión es eliminar el caos administrativo de las clínicas dentales.
                </p>
            </section>

            {/* Values Grid */}
            <section className="container mx-auto px-4 md:px-6 mb-24">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <Card className="border-none shadow-md bg-white">
                        <CardContent className="pt-6 text-center">
                            <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Lightbulb className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Innovación</h3>
                            <p className="text-gray-500 text-sm">
                                Tecnología de vanguardia adaptada a necesidades reales.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-md bg-white">
                        <CardContent className="pt-6 text-center">
                            <div className="mx-auto bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Heart className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Empatía</h3>
                            <p className="text-gray-500 text-sm">
                                Diseñamos pensando en el paciente y en tu equipo.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-md bg-white">
                        <CardContent className="pt-6 text-center">
                            <div className="mx-auto bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Seguridad</h3>
                            <p className="text-gray-500 text-sm">
                                Tus datos y los de tus pacientes son sagrados.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-md bg-white">
                        <CardContent className="pt-6 text-center">
                            <div className="mx-auto bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Cercanía</h3>
                            <p className="text-gray-500 text-sm">
                                Soporte humano siempre que lo necesites.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Story Section */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">Nuestra Historia</h2>
                        <p className="text-gray-600 leading-relaxed">
                            ServicAI nació cuando observamos que el 30% de las llamadas a clínicas dentales se perdían simplemente porque la recepción estaba ocupada atendiendo a un paciente presencial.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Decidimos crear una solución que no sonara como un "robot", sino como un miembro más del equipo: amable, eficiente y siempre disponible. Hoy, ayudamos a cientos de clínicas a dar la mejor primera impresión posible.
                        </p>
                    </div>
                    <div className="flex-1 w-full relative h-[300px] bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl overflow-hidden flex items-center justify-center text-white">
                        {/* Placeholder for team image */}
                        <div className="text-center">
                            <span className="text-6xl font-bold opacity-20">2024</span>
                            <p className="mt-2 font-medium opacity-80">Fundada en Madrid</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
