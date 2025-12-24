"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

import { ChevronDown } from "lucide-react"

export function Navbar() {
    const pathname = usePathname()
    const isLanding = pathname === "/"

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                        <span className="text-xl">🦷</span>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-blue-900">
                        AI Dental Receptionist
                    </span>
                </Link>
                <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600 items-center">
                    <Link href="/about" className="hover:text-blue-600 transition-colors">
                        Empresa
                    </Link>

                    {/* CSS-only Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 hover:text-blue-600 transition-colors outline-none cursor-pointer">
                            Producto <ChevronDown className="h-4 w-4" />
                        </button>
                        <div className="absolute left-0 top-full pt-2 hidden group-hover:block w-48 animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="bg-white border rounded-md shadow-lg py-1 flex flex-col">
                                <Link href="/product/reception" className="px-4 py-2 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                                    Recepción IA 24/7
                                </Link>
                                <Link href="/product/scheduling" className="px-4 py-2 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                                    Auto Agendamiento
                                </Link>
                                <Link href="/product/dashboard" className="px-4 py-2 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                                    Panel de Control
                                </Link>
                                <Link href="/product/integration" className="px-4 py-2 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                                    Integraciones
                                </Link>
                            </div>
                        </div>
                    </div>

                    <Link href="/pricing" className="hover:text-blue-600 transition-colors">
                        Precios
                    </Link>
                    <Link href="/blog" className="hover:text-blue-600 transition-colors">
                        Blog
                    </Link>
                    <Link href="/contact" className="hover:text-blue-600 transition-colors">
                        Contacto
                    </Link>
                </div>
                <div className="flex gap-4">
                    <Button asChild variant="ghost" className="text-gray-600 hover:text-blue-600">
                        <Link href="/dashboard">Login</Link>
                    </Button>
                    <Button
                        asChild
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                    >
                        <Link href={isLanding ? "#pricing" : "/#pricing"}>Solicitar Demo</Link>
                    </Button>
                </div>
            </div>
        </nav>
    )
}
