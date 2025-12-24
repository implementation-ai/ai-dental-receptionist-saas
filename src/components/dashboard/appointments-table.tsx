"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Phone } from "lucide-react"

interface Appointment {
    id: string
    name: string
    phone: string
    date: string
    time: string
    reason: string
    status: string
}

interface AppointmentsTableProps {
    appointments: Appointment[]
}

export function AppointmentsTable({ appointments }: AppointmentsTableProps) {
    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead>Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appointments.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                                No hay citas agendadas aún.
                            </TableCell>
                        </TableRow>
                    ) : (
                        appointments.map((apt) => (
                            <TableRow key={apt.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium flex items-center gap-2">
                                            <User className="w-3 h-3 text-gray-400" /> {apt.name}
                                        </span>
                                        <span className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                            <Phone className="w-3 h-3 text-gray-400" /> {apt.phone}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        {apt.date}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-green-500" />
                                        {apt.time}
                                    </div>
                                </TableCell>
                                <TableCell>{apt.reason}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        {apt.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
