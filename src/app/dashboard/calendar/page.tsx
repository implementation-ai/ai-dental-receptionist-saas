"use client"

import { useEffect, useState } from "react"
import { AppointmentsTable } from "@/components/dashboard/appointments-table"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, RefreshCcw } from "lucide-react"

export default function CalendarPage() {
    const [appointments, setAppointments] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchAppointments = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/appointments')
            if (response.ok) {
                const data = await response.json()
                if (data.appointments && Array.isArray(data.appointments)) {
                    setAppointments(data.appointments)
                } else {
                    setAppointments([])
                }
            }
        } catch (error) {
            console.error('Error loading appointments:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Agenda</h1>
                    <p className="text-gray-500">Citas programadas por la Recepcionista IA.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchAppointments}>
                        <RefreshCcw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Actualizar
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Ver Calendario
                    </Button>
                </div>
            </div>

            <AppointmentsTable appointments={appointments} />
        </div>
    )
}
