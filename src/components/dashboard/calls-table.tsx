"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlayCircle, FileText, PhoneIncoming, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Call {
    id: string
    from: string
    to: string
    status: string
    timestamp: string
    transcription?: string
    recordingUrl?: string
}

export function CallsTable() {
    const [calls, setCalls] = useState<Call[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const response = await fetch('/api/calls')
                if (response.ok) {
                    const data = await response.json()
                    // Validation to prevent "map is not a function" error
                    if (data.calls && Array.isArray(data.calls)) {
                        setCalls(data.calls)
                    } else if (Array.isArray(data)) {
                        setCalls(data)
                    } else {
                        console.error("API returned invalid format for calls", data)
                        setCalls([])
                    }
                }
            } catch (error) {
                console.error('Error loading calls:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCalls()
    }, [])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48 border rounded-md bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Cargando registro de llamadas...</span>
            </div>
        )
    }

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Caller ID</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="hidden md:table-cell">Fecha y Hora</TableHead>
                        <TableHead className="hidden md:table-cell">Transcripción</TableHead>
                        <TableHead className="text-right">Audio</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {calls.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                                No hay llamadas registradas aún.
                            </TableCell>
                        </TableRow>
                    ) : (
                        calls.map((call) => (
                            <TableRow key={call.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <PhoneIncoming className="h-4 w-4 text-gray-400" />
                                        {call.from}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={`
                                        ${call.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                        ${call.status === 'busy' || call.status === 'no-answer' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                                        ${call.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse' : ''}
                                    `}
                                    >
                                        {call.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-gray-500 text-sm">
                                    {call.timestamp ? format(new Date(call.timestamp), "d MMM yyyy, HH:mm", { locale: es }) : '-'}
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-gray-600 max-w-xs truncate text-xs">
                                    {call.transcription || <span className="text-gray-300 italic">Sin transcripción</span>}
                                </TableCell>
                                <TableCell className="text-right">
                                    {call.recordingUrl ? (
                                        <Button variant="ghost" size="sm" onClick={() => window.open(call.recordingUrl, '_blank')}>
                                            <PlayCircle className="h-4 w-4 text-blue-600 mr-2" />
                                            Escuchar
                                        </Button>
                                    ) : (
                                        <span className="text-gray-300 text-xs">-</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
