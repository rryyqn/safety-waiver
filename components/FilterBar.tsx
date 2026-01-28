"use client"
import { useState, useMemo, useEffect } from "react" 
import { Input } from "./ui/input"
import { useDebounce } from "@/hooks/debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { CalendarCogIcon, CalendarIcon, Search } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Calendar } from "./ui/calendar";
import { DateRange } from "react-day-picker";
import { endOfDay } from "date-fns"

const FilterBar = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // 1. Local States
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    
    // 2. SYNC DOWN: Update state when URL changes (e.g. clicking /admin)
    // We do this by tracking the "last seen" URL param to avoid loops
    const urlSearch = searchParams.get("search") || "";
    const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);

    if (urlSearch !== prevUrlSearch) {
      setPrevUrlSearch(urlSearch);
      setSearch(urlSearch); // This is safe in the render body for "syncing from props"
    }

    const debouncedSearch = useDebounce(search, 400);

    const activeRange = searchParams.get("range");
    const dateRange = useMemo(() => ({
      from: searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined,
      to: searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined,
    }), [searchParams]);

    // 3. SINGLE SYNC EFFECT (Like your original code)
    useEffect(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      // Handle Search
      if (debouncedSearch) params.set("search", debouncedSearch);
      else params.delete("search");

      // Handle Page
      if (page > 1) params.set("page", page.toString());
      else params.delete("page");

      // Handle Range logic: If a shortcut is clicked, it manages its own params,
      // but this effect ensures the rest of the URL stays in sync.
      
      const queryString = params.toString();
      if (queryString !== searchParams.toString()) {
        router.push(`${pathname}?${queryString}`, { scroll: false });
      }
    }, [debouncedSearch, page, pathname, router]); // Keep searchParams OUT of here to avoid loops

    const preview = useMemo(() => {
        const labels: Record<string, string> = {
            lastHour: "Last Hour", last3Hours: "Last 3 Hours", lastDay: "Last Day", lastWeek: "Last Week",
        };
        if (activeRange && labels[activeRange]) return labels[activeRange];
        if (dateRange?.from) {
            const fromStr = dateRange.from.toLocaleDateString(undefined, { month: "short", day: "numeric" });
            const toStr = dateRange.to ? dateRange.to.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "Now";
            return `${fromStr} - ${toStr}`;
        }
        return "";
    }, [activeRange, dateRange]);

    const shortcutDates = (shortcut: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("range", shortcut);
        params.delete("from"); params.delete("to");
        setPage(1); 
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleDateSelect = (date: DateRange | undefined) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("range");
        if (date?.from) params.set("from", date.from.toISOString());
        else params.delete("from");
        if (date?.to) params.set("to", endOfDay(date.to).toISOString());
        else params.delete("to");
        setPage(1);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="w-full flex flex-col md:flex-row justify-between gap-8 md:gap-4 text-sm">
            <div className="flex flex-col gap-2 w-full min-w-66">
                <label className="flex flex-row gap-1 items-center"><Search className="size-4 text-muted" />Search Waiver</label>
                <Input 
                    placeholder="Search name, phone, or ID" 
                    className="focus-visible:ring-muted/30 focus-visible:ring-3 text-sm focus-visible:border-muted/50 h-10" 
                    value={search} 
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
                />
            </div>

            <div className="flex flex-col gap-2 shrink-0">
                <label className="flex flex-row gap-1 items-center"><CalendarIcon className="size-4 text-muted text-nowrap" />Filter by Time</label>
                <div className="flex flex-row gap-2">
                    {preview === "" && (
                        <>
                            <Button variant="secondary" size="dashboard" className="font-normal" onClick={() => shortcutDates("lastHour")}>Last Hour</Button>
                            <Button variant="secondary" size="dashboard" className="font-normal" onClick={() => shortcutDates("lastDay")}>Last Day</Button>
                        </>
                    )}
                    <Dialog>
                        <DialogTrigger asChild>
                          {preview ? (

                            <Button variant="secondary" size="dashboard" className="font-normal h-fit">
                                <CalendarCogIcon /> {preview}
                            </Button>
                          ): (
                            <Button variant="secondary" size="custom" className="aspect-square font-normal h-10">
                                <CalendarCogIcon /> {preview}
                            </Button>
                          )}
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Filter by Time</DialogTitle></DialogHeader>
                            <div className="flex flex-col gap-8 text-sm">
                                <div className="flex flex-col gap-4">
                                    <label>Quick Filters</label>
                                    <div className="flex flex-row gap-2 flex-wrap">
                                        {["lastHour", "last3Hours", "lastDay", "lastWeek"].map((key) => (
                                            <DialogClose key={key} asChild>
                                                <Button variant="secondary" size="dashboard" className="font-normal capitalize" onClick={() => shortcutDates(key)}>
                                                    {key.replace(/([A-Z0-9])/g, ' $1').trim()}
                                                </Button>
                                            </DialogClose>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <label>Custom Date Range</label>
                                    <Calendar
                                        key={JSON.stringify(dateRange)}
                                        mode="range"
                                        defaultMonth={dateRange?.from}
                                        selected={dateRange}
                                        onSelect={handleDateSelect}
                                        numberOfMonths={1}
                                        className="rounded-sm w-full"
                                    />
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}

export default FilterBar;