export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold mb-8">Términos y Condiciones</h1>
                <p className="text-sm text-gray-500 mb-8">Última actualización: Diciembre 2024</p>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introducción</h2>
                        <p>Bienvenido a ServicAI. Al acceder a nuestro sitio web y utilizar nuestros servicios de recepción virtual con IA, usted acepta estar sujeto a estos términos y condiciones.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">2. Descripción del Servicio</h2>
                        <p>ServicAI proporciona un servicio de automatización de llamadas y gestión de citas mediante inteligencia artificial para clínicas dentales. El servicio incluye la recepción de llamadas, transcripción, y agendado en calendarios vinculados.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">3. Uso Aceptable</h2>
                        <p>Usted se compromete a utilizar el servicio únicamente con fines legales y comerciales legítimos relacionados con la gestión de su clínica. Está prohibido utilizar la plataforma para realizar spam, llamadas fraudulentas o cualquier actividad ilícita.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">4. Pagos y Suscripciones</h2>
                        <p>El servicio se ofrece bajo un modelo de suscripción (mensual o anual). Los pagos se procesan por adelantado. ServicAI no ofrece reembolsos por períodos de facturación ya iniciados, salvo en los casos garantizados por la ley.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">5. Responsabilidad</h2>
                        <p>ServicAI se esfuerza por mantener una disponibilidad del 99.9%, pero no garantiza que el servicio sea ininterrumpido o libre de errores. No nos hacemos responsables de pérdidas de negocio derivadas de fallos técnicos ajenos a nuestro control razonable.</p>
                    </section>
                </div>
            </div>
        </div>
    )
}
