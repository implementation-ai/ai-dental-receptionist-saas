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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Calendar, Mail, Phone, FileText, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface Lead {
    id: string
    name: string
    email: string
    clinic: string
    date: string
    status: string
    method: string
}

export function LeadsTable() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const response = await fetch('/api/leads')
                if (response.ok) {
                    const data = await response.json()
                    if (Array.isArray(data)) {
                        setLeads(data)
                    } else {
                        console.error("API did not return an array", data)
                        setLeads([])
                    }
                }
            } catch (error) {
                console.error('Error loading leads:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchLeads()
    }, [])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48 border rounded-md bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Cargando leads...</span>
            </div>
        )
    }

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="hidden md:table-cell">Origen</TableHead>
                        <TableHead className="hidden md:table-cell">Fecha</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leads.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                                No se encontraron leads recientes.
                            </TableCell>
                        </TableRow>
                    ) : (
                        (Array.isArray(leads) ? leads : []).map((lead) => (
                            <TableRow key={lead.id}>
                                <TableCell className="font-medium">
                                    <div>{lead.name}</div>
                                    <div className="text-xs text-gray-500 md:hidden">{lead.date}</div>
                                    <div className="text-xs text-gray-400">{lead.clinic}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={`
                                        ${lead.status === 'Cualificado' ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100' : ''}
                                        ${lead.status === 'Agendado' ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100' : ''}
                                        ${lead.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100' : ''}
                                        ${lead.status === 'No Interesado' ? 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100' : ''}
                                    `}
                                    >
                                        {lead.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-gray-500">{lead.method}</TableCell>
                                <TableCell className="hidden md:table-cell text-gray-500">{lead.date}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                            <DropdownMenuItem>
                                                <FileText className="mr-2 h-4 w-4" /> Ver detalles
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Phone className="mr-2 h-4 w-4" /> Llamar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Mail className="mr-2 h-4 w-4" /> Enviar Email
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600">
                                                Eliminar Lead
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )))}
                </TableBody>
            </Table>
        </div>
    )
}
