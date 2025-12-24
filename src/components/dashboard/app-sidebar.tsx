"use client"

import {
    Calendar,
    Home,
    Inbox,
    Search,
    Settings,
    User2,
    Phone,
    BarChart3
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Leads",
        url: "/dashboard/leads",
        icon: Inbox,
    },
    {
        title: "Llamadas (IA)",
        url: "/dashboard/calls",
        icon: Phone,
    },
    {
        title: "Calendario",
        url: "/dashboard/calendar",
        icon: Calendar,
    },
    {
        title: "Métricas",
        url: "/dashboard/metrics",
        icon: BarChart3,
    },
    {
        title: "Configuración",
        url: "/dashboard/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar>
            <SidebarHeader className="p-4 border-b">
                <div className="flex items-center space-x-2">
                    <Phone className="h-6 w-6 text-blue-600" />
                    <span className="font-bold text-lg">AI Receptionist</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        className={pathname === item.url ? "bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold" : ""}
                                    >
                                        <a href={item.url}>
                                            <item.icon className={pathname === item.url ? "text-blue-700" : ""} />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t">
                <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User2 className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Dr. Usuario</span>
                        <span className="text-xs text-gray-500">Plan Pro</span>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
