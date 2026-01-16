import * as React from "react";
import { format, parse, isValid, setYear, setMonth } from "date-fns";
import { CalendarIcon, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

type SelectionStep = "year" | "month" | "day";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  ariainvalid?: boolean;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function DatePicker({
  value,
  onChange,
  placeholder = "dd/mm/yyyy",
  className,
  id,
  ariainvalid,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [selectionStep, setSelectionStep] =
    React.useState<SelectionStep>("year");
  const [viewDate, setViewDate] = React.useState<Date>(value || new Date());
  const [selectedYear, setSelectedYear] = React.useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = React.useState<number | null>(null);

  // Sync input value with external value
  React.useEffect(() => {
    if (value && isValid(value)) {
      setInputValue(format(value, "dd/MM/yyyy"));
    }
  }, [value]);

  // Reset selection step when popover opens
  React.useEffect(() => {
    if (open) {
      setSelectionStep("year");
      setSelectedYear(null);
      setSelectedMonth(null);
      setViewDate(value || new Date());
    }
  }, [open, value]);

  const formatInputValue = (
    raw: string,
    previousValue: string
  ): { formatted: string; cursorAdjust: number } => {
    // Check if user typed a slash to finalize current segment
    const hasNewSlash =
      raw.includes("/") &&
      raw.split("/").length > previousValue.split("/").length;

    // Remove all non-digits
    let digits = raw.replace(/\D/g, "");
    const prevDigits = previousValue.replace(/\D/g, "");
    const isAdding = digits.length > prevDigits.length || hasNewSlash;

    let formatted = "";
    let cursorAdjust = 0;

    // Handle slash typed to finalize day segment (1 digit)
    if (hasNewSlash && digits.length === 1) {
      digits = "0" + digits;
      cursorAdjust = 1;
    }

    // Handle slash typed to finalize month segment (3 digits = 2 day + 1 month)
    if (hasNewSlash && digits.length === 3) {
      digits = digits.slice(0, 2) + "0" + digits[2];
      cursorAdjust = 1;
    }

    for (let i = 0; i < digits.length && i < 8; i++) {
      formatted += digits[i];

      // Day segment complete (2 digits) - add slash immediately
      if (i === 1 && digits.length >= 2) {
        formatted += "/";
        if (isAdding && digits.length === 2) cursorAdjust = 1;
      }

      // Month segment - smart formatting
      if (i === 2) {
        const monthFirstDigit = parseInt(digits[2], 10);
        // If first month digit is 2-9, it can only be 02-09, so auto-complete
        if (monthFirstDigit >= 2 && digits.length === 3) {
          formatted = formatted.slice(0, 3) + "0" + digits[2] + "/";
          cursorAdjust = 2; // Account for added "0" and "/"
          continue;
        }
      }

      // Month segment complete (4 digits total) - add slash immediately
      if (i === 3 && digits.length >= 4) {
        formatted += "/";
        if (isAdding && digits.length === 4) cursorAdjust = 1;
      }
    }

    return { formatted, cursorAdjust };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const input = e.target;
    const cursorPos = input.selectionStart || 0;

    const { formatted, cursorAdjust } = formatInputValue(rawValue, inputValue);
    setInputValue(formatted);

    // Adjust cursor position for auto-added characters
    if (cursorAdjust > 0) {
      setTimeout(() => {
        input.setSelectionRange(
          cursorPos + cursorAdjust,
          cursorPos + cursorAdjust
        );
      }, 0);
    }

    if (formatted.length === 10) {
      const parsed = parse(formatted, "dd/MM/yyyy", new Date());
      if (isValid(parsed)) {
        onChange?.(parsed);
        setViewDate(parsed);
      } else {
        // invalid date
        onChange?.(undefined);
      }
    } else {
      // incomplete or empty, clear state
      onChange?.(undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const input = e.target as HTMLInputElement;
      const cursorPos = input.selectionStart || 0;

      // If cursor is right after a slash, skip over it and delete the digit before
      if (cursorPos > 0 && inputValue[cursorPos - 1] === "/") {
        e.preventDefault();
        const newValue =
          inputValue.slice(0, cursorPos - 2) + inputValue.slice(cursorPos);
        const { formatted } = formatInputValue(newValue, inputValue);
        setInputValue(formatted);

        setTimeout(() => {
          input.setSelectionRange(cursorPos - 2, cursorPos - 2);
        }, 0);
      }
    }
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setViewDate(setYear(viewDate, year));
    setSelectionStep("month");
  };

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    let newDate = setYear(viewDate, selectedYear || viewDate.getFullYear());
    newDate = setMonth(newDate, month);
    setViewDate(newDate);
    setSelectionStep("day");
  };

  const handleDaySelect = (date: Date | undefined) => {
    if (date) {
      onChange?.(date);
      setInputValue(format(date, "dd/MM/yyyy"));
      setOpen(false);
    }
  };

  const handleBack = () => {
    if (selectionStep === "month") {
      setSelectionStep("year");
      setSelectedYear(null);
    } else if (selectionStep === "day") {
      setSelectionStep("month");
      setSelectedMonth(null);
    }
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const years = Array.from(
    { length: currentYear - 1900 },
    (_, i) => currentYear - i
  );

  // Check if a month should be disabled (future month in current year)
  const isMonthDisabled = (monthIndex: number) => {
    if (selectedYear === null) return false;
    if (selectedYear < currentYear) return false;
    if (selectedYear > currentYear) return true;
    return monthIndex > currentMonth;
  };

  const renderYearGrid = () => (
    <div className="p-3">
      <div className="text-center font-extrabold mb-3 text-foreground">
        Select Year
      </div>
      <div className="grid grid-cols-4 gap-2 max-h-[280px] overflow-y-auto p-1">
        {years.map((year) => (
          <Button
            key={year}
            variant={year === value?.getFullYear() ? "secondary" : "ghost"}
            className="h-9 font-normal p-2"
            onClick={() => handleYearSelect(year)}
          >
            {year}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderMonthGrid = () => (
    <div className="p-3">
      <div className="flex items-center mb-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleBack}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="flex-1 text-center font-extrabold text-foreground w-fit">
          Select Month
        </span>
        <div className="w-7" />
      </div>
      <div className="grid grid-cols-3 gap-2 p-1">
        {MONTHS.map((month, index) => (
          <Button
            key={month}
            variant={
              index === value?.getMonth() &&
              selectedYear === value?.getFullYear()
                ? "secondary"
                : "ghost"
            }
            className="h-9 font-normal p-2"
            disabled={isMonthDisabled(index)}
            onClick={() => handleMonthSelect(index)}
          >
            {month.slice(0, 3)}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderDayPicker = () => (
    <div className="p-1">
      <div className="flex items-center justify-between px-2 py-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleBack}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-extrabold">Select Day</span>
        <div className="w-7" />
      </div>
      <Calendar
        mode="single"
        selected={value}
        onSelect={handleDaySelect}
        month={viewDate}
        onMonthChange={setViewDate}
        disabled={(date) => date > new Date()}
        className="pointer-events-auto"
        classNames={{
          caption: "hidden",
          nav: "hidden",
        }}
        initialFocus
      />
    </div>
  );

  return (
    <div className={cn("relative", className)} id={id}>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="relative">
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="pr-10"
            maxLength={10}
            aria-invalid={ariainvalid}
          />
          <PopoverTrigger asChild className="cursor-pointer group">
            <div className="flex flex-row gap-2 items-center absolute right-0 top-0 h-full px-4 w-fit">
              <p className="font-normal text-muted-foreground cursor-pointer underline decoration-2 underline-offset-4 decoration-primary/20 group-hover:decoration-primary/50 outline-none focus-visible:decoration-primary/70 focus-visible:decoration-4 transition-all">
                Select
              </p>
              <CalendarIcon className="h-4 w-4 text-muted" />
            </div>
          </PopoverTrigger>
        </div>
        <PopoverContent className="w-auto p-0" align="start">
          {selectionStep === "year" && renderYearGrid()}
          {selectionStep === "month" && renderMonthGrid()}
          {selectionStep === "day" && renderDayPicker()}
        </PopoverContent>
      </Popover>
    </div>
  );
}
