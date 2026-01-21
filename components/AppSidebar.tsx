import { Calendar, FileText, Heart, HeartPulse, Home,  Search, Settings, X } from "lucide-react"

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
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Bookings",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Waivers",
    url: "#",
    icon: FileText,
  },
  {
    title: "Injury Reports",
    url: "#",
    icon: Heart,
  },
  {
    title: "Settings",
    url: "#",
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