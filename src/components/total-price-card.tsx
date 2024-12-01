"use client";

import { totalPriceSale } from "@/lib/server/actions/dashboard";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { addMonths, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { DateRange } from "react-day-picker";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";

const TotalPriceCard = () => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addMonths(new Date(), 1),
  });

  const { data } = useQuery({
    queryKey: ["total-price", date],
    queryFn: async () => {
      const resp = await totalPriceSale({
        startDate: date?.from?.toISOString() ?? new Date().toISOString(),
        endDate:
          date?.to?.toISOString() ?? addMonths(new Date(), 1).toISOString(),
      });
      return resp;
    },
    initialData: BigInt(0),
  });

  function formatPrice(price: bigint): string {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatter.format(price);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle >Total Price</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-3">
        <p className="text-2xl font-bold">{formatPrice(data as bigint)}</p>
        <div className={cn("grid gap-2")}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
};

export { TotalPriceCard };
