import { getFilteredWaivers } from "@/app/actions/admin";
import { AppSidebar } from "@/components/AppSidebar";
import FilterBar from "@/components/FilterBar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import WaiversAccordion from "@/components/WaiversAccordion";
import { SearchAlert } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{search: string; from: string; to: string}>; }) {

  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin-session")?.value;

  if (adminSession !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login");
  }

  const params = await searchParams;

  const waivers = await getFilteredWaivers({
    search: params.search,
    startDate: params.from ? new Date(params.from) : undefined,
    endDate: params.to ? new Date(params.to) : undefined,
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full relative min-h-screen">
        <SidebarTrigger className="absolute top-2 left-2 sm:opacity-10 sm:hover:opacity-100 transition-all" />
        <div className="p-10 w-full flex flex-col gap-6 h-full">
          <h1 className="text-3xl font-bold">Waivers</h1>
          <FilterBar />
          
          <div className="overflow-hidden h-full relative">
          <div className="absolute right-0 top-[10px] flex flex-row justify-end gap-1 items-center text-sm">
            <p className="hidden lg:block">{waivers.length} waivers found.</p>
            
            {(params.search || params.from || params.to) && <a href="/admin" className="underline underline-offset-4 decoration-2 decoration-input z-10">Clear Filters</a>}
          </div>
            <div className="grid grid-cols-3 gap-4 px-4 py-2 pr-16">
              <p className="font-bold">Guardian</p>
              <p className="font-bold hidden sm:block ">Phone</p>
              <p className="font-bold hidden sm:block ">Children</p>
            </div>        
            <Separator />
            {waivers.length > 0 ? (
              <WaiversAccordion waivers={waivers} />

            ) : (
              <div className="text-muted w-full h-full flex flex-col justify-center items-center"><SearchAlert className="size-10" strokeWidth={1.5} /><p>No waivers found. <a href="/admin" className="underline underline-offset-4 decoration-2 decoration-input">Clear Filters</a></p></div>)}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}