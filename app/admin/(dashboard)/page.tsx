import { getFilteredWaivers } from "@/app/actions/admin";
import FilterBar from "@/components/FilterBar";
import PaginationControls from "@/components/PaginationControls";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import WaiversAccordion from "@/components/WaiversAccordion";
import WaiverSkeleton from "@/components/WaiverSkeleton";
import { RotateCcw, SearchAlert } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{search?: string; from?: string; to?: string; page?: string}>; }) {
  const params = await searchParams;

  const listKey = JSON.stringify(params);
  const pageKey = JSON.stringify(params);
  return (
    
        <div className="py-10 px-4 sm:p-10 w-full h-full flex flex-col justify-between gap-20">

        <div className="flex flex-col gap-12 h-full">
          <div className="flex flex-col gap-8 sm:gap-6">
          <h1 className="text-3xl font-bold">Waivers</h1>
          <FilterBar />
          </div>
          
          <div className="overflow-hidden h-full relative">
          <div className="absolute right-0 top-0 flex flex-row justify-end gap-1 items-center text-sm">
            
            {(params.search || params.from || params.to) && <Button variant="secondary" size="dashboard" asChild><Link href="/admin" className=""><RotateCcw className="size-4" />Clear Filters</Link></Button>}
          </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 py-2 pr-12 text-sm">
              <p className="font-bold">Guardian</p>
              <p className="font-bold hidden sm:block ">Phone</p>
              <p className="font-bold hidden md:block ">No. of Children</p>
            </div>        
            <Separator />
            <Suspense key={listKey} fallback={<WaiverSkeleton />}>
            <WaiverList params={params} />
            </Suspense>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <Suspense key={pageKey}>
            <WaiverPages params={params} />
          </Suspense>
        </div>
        </div>
  );
}

async function WaiverList({ params }: { params: {search?: string; from?: string; to?: string; page?: string} }) {
  const { waivers } = await getFilteredWaivers({
    search: params.search,
    startDate: params.from ? new Date(params.from) : undefined,
    endDate: params.to ? new Date(params.to) : undefined,
    page: Number(params.page) || 1
  });

  if (waivers.length === 0) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center text-sm gap-2"><SearchAlert className="size-12 text-muted " strokeWidth={1.5} /><p className="text-muted">No waivers found</p><Button variant="secondary" size="dashboard" asChild><Link href="/admin" className=""><RotateCcw className="size-4" />Clear Filters</Link></Button></div>
    );
  }

  return (
    <WaiversAccordion waivers={waivers} />
  );
}

async function WaiverPages({ params }: { params: {search?: string; from?: string; to?: string; page?: string} }) {
  const { totalPages } = await getFilteredWaivers({
    search: params.search,
    startDate: params.from ? new Date(params.from) : undefined,
    endDate: params.to ? new Date(params.to) : undefined,
    page: Number(params.page) || 1
  });

  if (Number(params.page || 1) > totalPages) return

  return (
    <PaginationControls 
    currentPage={Number(params.page) || 1} 
    totalPages={totalPages} 
    />
  );
}