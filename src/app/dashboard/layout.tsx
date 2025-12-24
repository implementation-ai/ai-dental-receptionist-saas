import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <div className="p-4 border-b flex items-center bg-white sticky top-0 z-10">
                    <SidebarTrigger />
                    <div className="ml-4 font-medium text-gray-500"> / Dashboard</div>
                </div>
                <div className="p-6 bg-gray-50 min-h-[calc(100vh-65px)]">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}
