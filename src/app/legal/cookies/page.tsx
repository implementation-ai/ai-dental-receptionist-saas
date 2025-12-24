export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold mb-8">Política de Cookies</h1>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <p>Este sitio web utiliza cookies propias y de terceros para mejorar la experiencia de usuario y analizar el tráfico.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">¿Qué son las cookies?</h2>
                        <p>Una cookie es un pequeño archivo de texto que se almacena en su navegador cuando visita casi cualquier página web.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies que utilizamos</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Esenciales:</strong> Necesarias para el funcionamiento básico (ej. inicio de sesión).</li>
                            <li><strong>Analíticas:</strong> Nos ayudan a entender cómo usa el sitio (Google Analytics).</li>
                            <li><strong>Funcionales:</strong> Recuerdan sus preferencias (ej. idioma).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">Gestión de Cookies</h2>
                        <p>Puede desactivar las cookies cambiando la configuración de su navegador, pero esto podría afectar el funcionamiento de la web.</p>
                    </section>
                </div>
            </div>
        </div>
    )
}
