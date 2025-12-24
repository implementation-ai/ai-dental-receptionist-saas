import { StatsGrid } from '@/components/dashboard/stats-grid'
import { LeadsTable } from '@/components/dashboard/leads-table'
import { Button } from '@/components/ui/button'
import { Download, RefreshCw } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Visión General</h2>
          <p className="text-muted-foreground">
            Monitorea el rendimiento de tu recepción virtual y el ROI de tu clínica en tiempo real.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Descargar Reporte</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Refrescar Datos</Button>
        </div>
      </div>

      {/* KPI Stats */}
      <StatsGrid />

      {/* Leads Visualization */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Leads Recientes</h2>
        <LeadsTable />
      </div>
    </div>
  )
}

