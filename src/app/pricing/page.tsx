import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const tiers = [
    {
        name: "Starter",
        id: "tier-starter",
        href: "/contact",
        priceMonthly: "99€",
        description: "Ideal para clínicas pequeñas que están empezando a digitalizarse.",
        features: [
            "Recepción IA 12h (Horario Comercial)",
            "Hasta 300 llamadas/mes",
            "Agendado básico en Google Calendar",
            "Transcipción de llamadas",
            "Soporte por Email",
        ],
        featured: false,
    },
    {
        name: "Pro",
        id: "tier-pro",
        href: "/contact",
        priceMonthly: "199€",
        description: "Para clínicas establecidas que quieren máxima eficiencia.",
        features: [
            "Recepción IA 24/7",
            "Llamadas ilimitadas",
            "Agendado avanzado (Multi-doctor)",
            "Dashboard de métricas completo",
            "Soporte Prioritario (WhatsApp)",
            "Personalización de voz avanzada",
        ],
        featured: true,
    },
    {
        name: "Enterprise",
        id: "tier-enterprise",
        href: "/contact",
        priceMonthly: "Custom",
        description: "Soluciones a medida para cadenas de clínicas y franquicias.",
        features: [
            "Todo lo incluido en Pro",
            "Integración con CRM dental (Gesden, etc.)",
            "Gestor de cuenta dedicado",
            "Entrenamiento de IA a medida",
            "SLA Garantizado",
            "API Access",
        ],
        featured: false,
    },
]

export default function PricingPage() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600">Precios Transparentes</h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Planes adaptados a cada etapa de crecimiento
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
                    Sin costes ocultos. Sin compromisos de permanencia. Prueba 14 días gratis en cualquier plan.
                </p>

                <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {tiers.map((tier, tierIdx) => (
                        <div
                            key={tier.id}
                            className={`
                flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10
                ${tier.featured ? 'ring-2 ring-blue-600 shadow-xl scale-105 z-10' : ''}
              `}
                        >
                            <div>
                                <div className="flex items-center justify-between gap-x-4">
                                    <h3
                                        id={tier.id}
                                        className={`text-lg font-semibold leading-8 ${tier.featured ? 'text-blue-600' : 'text-gray-900'}`}
                                    >
                                        {tier.name}
                                    </h3>
                                    {tier.featured && (
                                        <span className="rounded-full bg-blue-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-blue-600">
                                            Más Popular
                                        </span>
                                    )}
                                </div>
                                <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                                <p className="mt-6 flex items-baseline gap-x-1">
                                    <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.priceMonthly}</span>
                                    <span className="text-sm font-semibold leading-6 text-gray-600">/mes</span>
                                </p>
                                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex gap-x-3">
                                            <Check className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Button
                                asChild
                                className={`mt-8 w-full ${tier.featured
                                    ? 'bg-blue-600 hover:bg-blue-500 shadow-sm text-white'
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100 ring-1 ring-inset ring-blue-200'
                                    }`}
                                variant={tier.featured ? "default" : "outline"}
                            >
                                <Link href={tier.href}>
                                    {tier.name === "Enterprise" ? "Contactar Ventas" : "Empezar Prueba Gratis"}
                                </Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
