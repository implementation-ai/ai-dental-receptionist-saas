export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold mb-8">Política de Privacidad</h1>
                <p className="text-sm text-gray-500 mb-8">Última actualización: Diciembre 2024</p>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Datos que Recopilamos</h2>
                        <p>Recopilamos información necesaria para la prestación del servicio: datos de contacto de la clínica (nombre, email, teléfono), grabaciones de llamadas (con fines de transcripción y calidad), y datos de citas (nombres de pacientes, horarios).</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">2. Uso de la Información</h2>
                        <p>Utilizamos los datos para: gestionar las citas, mejorar nuestros modelos de IA, procesar pagos y enviar notificaciones relacionadas con el servicio.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">3. Protección de Datos (RGPD)</h2>
                        <p>Cumplimos con el Reglamento General de Protección de Datos (RGPD). Sus datos se almacenan en servidores seguros (Google Cloud Platform) ubicados en la Unión Europea o en zonas con nivel adecuado de protección.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">4. Derechos del Usuario</h2>
                        <p>Usted tiene derecho a acceder, rectificar, cancelar y oponerse al tratamiento de sus datos. Para ejercer estos derechos, contacte a: privacy@servicai.app</p>
                    </section>
                </div>
            </div>
        </div>
    )
}
