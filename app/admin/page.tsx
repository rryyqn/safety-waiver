import { getFilteredWaivers } from "@/app/actions/admin";
import { AppSidebar } from "@/components/AppSidebar";
import FilterBar from "@/components/FilterBar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import WaiversAccordion from "@/components/WaiversAccordion";
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
      <main className="flex-1 w-full relative">
        <SidebarTrigger className="absolute top-2 left-2 opacity-10 hover:opacity-100 transition-all" />
        <div className="p-10 w-full flex flex-col gap-8">
          <h1 className="text-3xl font-bold">Waivers</h1>
          <FilterBar />
          <div className="flex flex-row justify-end gap-4 items-center text-sm">
            <p>{waivers.length} waivers found</p>
            
            {(params.search || params.from || params.to) && <a href="/admin" className="underline underline-offset-4 decoration-2 decoration-input">Clear Filters</a>}
          </div>
          <div className="overflow-hidden">
            <div className="grid grid-cols-3 gap-4 px-4 py-2 pr-16">
              <p className="font-bold">Guardian</p>
              <p className="font-bold">Phone</p>
              <p className="font-bold">Children</p>
            </div>        
            <Separator />
            <WaiversAccordion waivers={waivers} />
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}