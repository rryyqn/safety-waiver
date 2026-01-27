import { FileText, Heart, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarClose,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Waivers",
    url: "/admin",
    icon: FileText,
  },
  {
    title: "Injury Reports",
    url: "/admin",
    icon: Heart,
  },
  {
    title: "Settings",
    url: "/admin",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
        <SidebarHeader>
          <h2 className="text-lg p-2">Dashboard</h2>
          <SidebarClose className="sm:hidden" />
        </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.title === "Waivers"}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}