import { AppSidebar } from '@/components/AppSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'

const layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin-session")?.value;

  if (adminSession !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login");
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full relative min-h-screen">
        <SidebarTrigger className="absolute top-2 left-2 sm:opacity-10 sm:hover:opacity-100 transition-all focus-visible:ring-3 focus-visible:ring-muted/30 focus-visible:opacity-100" />
        {children}
    </main>
    </SidebarProvider>
  )
}

export default layout
