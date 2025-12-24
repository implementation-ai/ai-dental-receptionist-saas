import { CallsTable } from "@/components/dashboard/calls-table"
import { Phone, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CallsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Registro de Llamadas</h1>
                    <p className="text-gray-500">Historial de interacciones de la recepcionista IA.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Actualizar
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Phone className="mr-2 h-4 w-4" />
                        Simular Llamada
                    </Button>
                </div>
            </div>

            <CallsTable />
        </div>
    )
}
