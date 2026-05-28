import type { ReactNode } from "react"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/AppSidebar"

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-[#f7f7f8]">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main content area */}
          <div className="flex flex-1 flex-col min-w-0">
            {/* Top bar com botão de toggle (sanduíche) */}
            <header className="flex h-14 items-center border-b bg-white px-4 gap-3 shrink-0">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="h-4 w-px bg-border" />
              <span className="text-sm font-medium text-muted-foreground">
                Gestão de Demandas
              </span>
            </header>

            {/* Page content */}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </QueryProvider>
  )
}