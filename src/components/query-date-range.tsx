"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { parseAsIsoDateTime, useQueryState } from "nuqs";
import React from "react";
import { DateRange } from "react-day-picker";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useRouter } from "next/navigation";

type QueryDateRangeProps = React.HTMLAttributes<HTMLDivElement>;

const QueryDateRange = ({ className, ...props }: QueryDateRangeProps) => {
  const router = useRouter();
  const now = React.useMemo(() => new Date(), []);
  const [start, setStart] = useQueryState("startDate", parseAsIsoDateTime);
  const [end, setEnd] = useQueryState("endDate", parseAsIsoDateTime);

  const onSetDate = async (date: DateRange | undefined) => {
    await setStart(date?.from ?? null);
    await setEnd(date?.to ?? null);
    router.refresh()
  };

  const selected = () => {
    if (start && end) return { from: start, to: end };
    if (start) return { from: start };
    return undefined;
  };

  return (
    <div className={cn("grid gap-2", className)} {...props}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              (!start || !end) && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {start ? (
              end ? (
                <>
                  {format(start, "LLL dd, y")} - {format(end, "LLL dd, y")}
                </>
              ) : (
                format(start, "LLL dd, y")
              )
            ) : (
              <span>Date Range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={now}
            selected={selected()}
            onSelect={onSetDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { QueryDateRange };
