"use client"
import { useEffect, useState } from "react"
import { Input } from "./ui/input"
import { useDebounce } from "@/hooks/debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { CalendarCogIcon } from "lucide-react";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Calendar } from "./ui/calendar";
import { DateRange } from "react-day-picker";

const FilterBar = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [startDate, setStartDate] = useState<Date | undefined>(
        searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined
      );
      const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: searchParams.get("from") ? new Date(searchParams.get("from")!) : new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
        to: searchParams.get("to") ? new Date(searchParams.get("to")!) : new Date(),
      })
    

    const debouncedSearch = useDebounce(search, 300);

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
      
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }, [debouncedSearch, dateRange, pathname, router]);

      const shortcutDates = (shortcut: "lastHour" | "last3Hours" | "lastDay" | "lastWeek" | "lastMonth") => {
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
            break;
          case "last3Hours":
          setDateRange({ from: last3Hours, to: now });
            break;
          case "lastDay":
            setDateRange({ from: lastDay, to: now });
            break;
          case "lastWeek":
            setDateRange({ from: lastWeek, to: now });
            break;
          case "lastMonth":
            setDateRange({ from: lastMonth, to: now });
            break;
          default:
            setStartDate(undefined);
        }
    }

    
  return (
    <div className="w-full flex flex-col md:flex-row justify-between gap-8 md:gap-4">
      <div className="flex flex-col gap-4 w-full">
<Label>Search Waiver</Label>
      <Input placeholder="Search waivers" value={search} onChange={(e) => {setSearch(e.target.value)}} />
      </div>
      <div className="flex flex-col gap-4">
<Label>Filter by Date</Label>
<div className="flex flex-row gap-2">

      <Button variant="secondary" onClick={() => shortcutDates("lastHour")}>Last Hour</Button>
      <Button variant="secondary" onClick={() => shortcutDates("last3Hours")}>Last 3 Hours</Button>
      <Button variant="secondary" onClick={() => shortcutDates("lastDay")}>Last Day</Button>
      <Dialog>

      <DialogTrigger asChild>

      <Button variant="secondary" className="aspect-square"><CalendarCogIcon /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
        <DialogTitle>Filter by Date</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Label>Quick Filters</Label>
            <div className="flex flex-row gap-2 flex-wrap">

      <Button variant="secondary" onClick={() => shortcutDates("lastHour")}>Last Hour</Button>
      <Button variant="secondary" onClick={() => shortcutDates("last3Hours")}>Last 3 Hours</Button>
      <Button variant="secondary" onClick={() => shortcutDates("lastDay")}>Last Day</Button>
      <Button variant="secondary" onClick={() => shortcutDates("lastWeek")}>Last Week</Button>
      </div>
          </div>
          <div className="flex flex-col gap-4">
            <Label>Custom Date Range</Label>
            {dateRange?.from?.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " ~ " + dateRange?.to?.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          <Calendar
      mode="range"
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={setDateRange}
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
