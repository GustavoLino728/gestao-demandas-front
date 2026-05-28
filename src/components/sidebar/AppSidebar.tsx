"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Star,
  BarChart2,
  Target,
  Settings,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  {
    label: "Dashboard",
    href: "/boards",
    icon: LayoutDashboard,
  },
  {
    label: "Funcionários",
    href: "/funcionarios",
    icon: Users,
  },
  {
    label: "Avaliações",
    href: "/avaliacoes",
    icon: Star,
  },
  {
    label: "Relatórios",
    href: "/relatorios",
    icon: BarChart2,
  },
  {
    label: "Metas",
    href: "/metas",
    icon: Target,
  },
]

const bottomItems = [
  {
    label: "Configurações",
    href: "/configuracoes",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      {/* Header / Branding */}
      <SidebarHeader className="flex flex-col items-center gap-2 py-6 px-4">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shrink-0">
            AX
          </div>
          <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-sm text-foreground">ARPE</span>
            <span className="text-xs text-muted-foreground">Gestão de Demandas</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Main Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-4">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/")

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={
                        isActive
                          ? "bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 hover:text-blue-700"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: Configurações + Avatar */}
      <SidebarFooter className="mt-auto">
        <SidebarSeparator />
        <SidebarMenu>
          {bottomItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  className={
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        {/* User avatar row */}
        <div className="flex items-center gap-3 px-3 py-3 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
              GL
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium text-foreground">Gustavo Lino</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}