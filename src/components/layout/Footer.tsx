import Link from "next/link"
import { Mail, Phone, MessageCircle } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
            <div className="container mx-auto px-4 md:px-6 grid gap-8 md:grid-cols-4 lg:grid-cols-5">
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                            <span className="text-xl">🦷</span>
                        </div>
                        <span className="text-xl font-bold text-gray-100">
                            AI Dental Receptionist
                        </span>
                    </div>
                    <p className="mb-4 max-w-sm">
                        Revolucionando la gestión de clínicas dentales con Inteligencia
                        Artificial. Atención 24/7, cero llamadas perdidas.
                    </p>
                </div>

                <div>
                    <h3 className="text-gray-100 font-semibold mb-3">Producto</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link
                                href="/product/reception"
                                className="hover:text-blue-400 transition-colors"
                            >
                                Recepción IA 24/7
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/product/scheduling"
                                className="hover:text-blue-400 transition-colors"
                            >
                                Agendado Automático
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/product/dashboard"
                                className="hover:text-blue-400 transition-colors"
                            >
                                Dashboard de Métricas
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/product/integration"
                                className="hover:text-blue-400 transition-colors"
                            >
                                Integración Calendar
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-gray-100 font-semibold mb-3">Empresa</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link
                                href="/about"
                                className="hover:text-blue-400 transition-colors"
                            >
                                Sobre Nosotros
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/pricing"
                                className="hover:text-blue-400 transition-colors"
                            >
                                Precios
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/blog"
                                className="hover:text-blue-400 transition-colors"
                            >
                                Blog
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/contact"
                                className="hover:text-blue-400 transition-colors"
                            >
                                Contacto
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-gray-100 font-semibold mb-3">Contacto</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <a
                                href="mailto:support@servicai.app"
                                className="hover:text-blue-400 transition-colors"
                            >
                                support@servicai.app
                            </a>
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <a
                                href="tel:+12518424239"
                                className="hover:text-blue-400 transition-colors"
                            >
                                +1 251-842-4239
                            </a>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span>Chat en vivo 24/7</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-4 md:px-6 mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                <p>
                    &copy; {new Date().getFullYear()} AI Dental Receptionist. Todos los
                    derechos reservados.
                </p>
                <div className="mt-2 space-x-4">
                    <Link href="/legal/terms" className="hover:text-gray-300">
                        Aviso Legal
                    </Link>
                    <Link href="/legal/privacy" className="hover:text-gray-300">
                        Privacidad
                    </Link>
                    <Link href="/legal/cookies" className="hover:text-gray-300">
                        Cookies
                    </Link>
                </div>
            </div>
        </footer>
    )
}
