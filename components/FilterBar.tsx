"use client"
import { useEffect, useState } from "react"
import { Input } from "./ui/input"
import { useDebounce } from "@/hooks/debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { CalendarCogIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Calendar } from "./ui/calendar";
import { DateRange } from "react-day-picker";
import { endOfDay } from "date-fns"

const FilterBar = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined,
      to: searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined,
    })
    const [page, setPage] = useState(Number(searchParams.get("page")));
    const [preview, setPreview] = useState("");
    
    const debouncedSearch = useDebounce(search, 400);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
      
        if (debouncedSearch) {
          params.set("search", debouncedSearch);
        } else {
          params.delete("search");
        }
      
        if (dateRange?.from) {
          params.set("from", dateRange.from.toISOString());
        } else {
          params.delete("from");
        }
      
        if (dateRange?.to) {
          params.set("to", dateRange.to.toISOString());
        } else {
          params.delete("to");
        }

        if (page && page > 1) {
          params.set("page", page.toString());
        } else {
          params.delete("page");
        }
      
        // Prevent push if params identical
        const queryString = params.toString();
        if (queryString !== searchParams.toString()) {
          router.push(`${pathname}?${queryString}`, { scroll: false });
        }

      }, [debouncedSearch, dateRange, pathname, router, page]);

      const shortcutDates = (shortcut: "lastHour" | "last3Hours" | "lastDay" | "lastWeek" | "lastMonth") => {
        setPage(1);

        const now = new Date();
        const oneHour = 60 * 60 * 1000;
        const oneDay = 24 * oneHour;
        
        const lastHour = new Date(now.getTime() - oneHour);
        const last3Hours = new Date(now.getTime() - 3 * oneHour);
        const lastDay = new Date(now.getTime() - oneDay);
        const lastWeek = new Date(now.getTime() - 7 * oneDay);
        const lastMonth = new Date(now.getTime() - 30 * oneDay);

        switch (shortcut) {
          case "lastHour": 
          setDateRange({ from: lastHour, to: now });
          setPreview("Last Hour")
            break;
          case "last3Hours":
          setDateRange({ from: last3Hours, to: now });
          setPreview("Last 3 Hours")
            break;
          case "lastDay":
            setDateRange({ from: lastDay, to: now });
            setPreview("Last Day")
            break;
          case "lastWeek":
            setDateRange({ from: lastWeek, to: now });
            setPreview("Last Week")
            break;
            default:
            setDateRange(undefined);
            setPreview("")
        }
    }

    //helper function to set end date time at 11:59pm instead of 0:00 default. 
    const handleDateSelect = (range: DateRange | undefined) => {
      setPage(1);

      if (range?.to) {
        range.to = endOfDay(range.to);
      }
      setDateRange(range);
      setPreview(`${range?.from?.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${range?.to?.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`);
    };
    
  return (
    <div className="w-full flex flex-col md:flex-row justify-between gap-8 md:gap-4 text-sm">
      <div className="flex flex-col gap-2 w-full min-w-66">
<label>Search Waiver</label>
      <Input placeholder="Search guardian name or phone" className="focus-visible:ring-muted/20 text-sm focus-visible:border-muted/50" value={search} onChange={(e) => {setSearch(e.target.value); setPage(1);}} />
      </div>
      <div className="flex flex-col gap-2">
<label>Filter by Time</label>
<div className="flex flex-row gap-2">
      {preview === "" && (
        <>
        <Button variant="secondary" className="font-normal" onClick={() => shortcutDates("lastHour")}>Last Hour</Button>
        <Button variant="secondary" className="font-normal" onClick={() => shortcutDates("lastDay")}>Last Day</Button>
        </>
      )}
      <Dialog>

      <DialogTrigger asChild>

      <Button variant="secondary" className="aspect-square font-normal"><CalendarCogIcon /> {preview}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
        <DialogTitle>Filter by Time</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <label>Quick Filters</label>
            <div className="flex flex-row gap-2 flex-wrap">
              
            <DialogClose asChild>
      <Button variant="secondary" className="font-normal" onClick={() => shortcutDates("lastHour")}>Last Hour</Button>
      </DialogClose>

      <DialogClose asChild>
      <Button variant="secondary" className="font-normal" onClick={() => shortcutDates("last3Hours")}>Last 3 Hours</Button>
      </DialogClose>

      <DialogClose asChild>
      <Button variant="secondary" className="font-normal" onClick={() => shortcutDates("lastDay")}>Last Day</Button>
      </DialogClose>

      <DialogClose asChild>
      <Button variant="secondary" className="font-normal" onClick={() => shortcutDates("lastWeek")}>Last Week</Button>
      </DialogClose>
      </div>
          </div>
          <div className="flex flex-col gap-4">
            <label>Custom Date Range</label>
          <Calendar
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

export default FilterBar
