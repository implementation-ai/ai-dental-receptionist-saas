import { LeadsTable } from '@/components/dashboard/leads-table'
import { Button } from '@/components/ui/button'
import { Plus, Download } from 'lucide-react'

export default function LeadsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gestión de Leads</h2>
                    <p className="text-muted-foreground">
                        Pacientes capturados y cualificados automáticamente por tu recepcionista IA.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar CSV
                    </Button>
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Lead
                    </Button>
                </div>
            </div>

            <LeadsTable />
        </div>
    )
}
