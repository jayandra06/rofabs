"use client";

import UiButton from "@/components/button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RoomCategoryEnum, RoomTypeEnum } from "@/lib/consts";
import { cn } from "@/lib/utils";
import { Input, Select, SelectItem, Selection } from "@nextui-org/react";
import { format } from "date-fns";
import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [bookingType, setBookingType] = useState<Selection>(new Set([]));
  return (
    <>
      <Head>
        <title>Rofabs for users</title>
      </Head>
      <main className={`relative grid min-h-screen w-full grid-cols-2`}>
        <div className="flex h-full w-full items-center justify-center border-r bg-gradient-to-tr pl-12 pr-10 md:pl-24 ">
          <h2 className={`-mt-20 font-sora text-5xl font-bold md:text-7xl`}>
            Find the best hotels, resorts and more for your next stay.
          </h2>
        </div>
        <div className="relative -mt-20 flex h-full w-full items-center justify-center px-14 py-5">
          {/* <BackgroundSvg /> */}
          <form className="relative grid w-full grid-cols-2 gap-3 px-5 pb-12 pt-10">
            <div className="relative col-span-2 flex w-full flex-1 items-center gap-2.5">
              <Input
                label="Location"
                labelPlacement="outside"
                variant="bordered"
                radius="sm"
                placeholder="Enter your location"
                classNames={{
                  inputWrapper: "px-4 h-auto shadow-none border-1 rounded-md",
                  input: "py-3.5 text-black placeholder:text-black",
                  label: "font-medium text-sm -bottom-0.5",
                }}
              />
              <div className="flex w-auto flex-col items-start gap-2.5">
                <Label>No of guests</Label>
                <div className="flex w-full items-center gap-2">
                  <UiButton className="border bg-transparent py-3 text-black hover:bg-zinc-100">
                    +
                  </UiButton>
                  <UiButton className="bg-black py-3 hover:bg-zinc-950">
                    0
                  </UiButton>
                  <UiButton className="border bg-transparent py-3 text-black hover:bg-zinc-100">
                    -
                  </UiButton>
                </div>
              </div>
            </div>
            <div className="relative col-span-2 grid grid-cols-2 gap-3">
              <div className="flex w-auto flex-col items-start gap-2.5">
                <Label>Check in</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "h-auto w-full justify-start rounded-md border-1 px-4 py-3.5 text-left font-normal shadow-none",
                        !checkInDate && "text-muted-foreground",
                      )}
                    >
                      {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
                      {checkInDate ? (
                        format(checkInDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkInDate}
                      onSelect={setCheckInDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Badge className="absolute left-[calc(50%-2.5em)] top-[calc(50%-1px)] z-50 px-2 py-1">
                2 Days
              </Badge>
              <div className="flex w-auto flex-col items-start gap-2.5">
                <Label>Check out</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "h-auto w-full justify-start rounded-md border-1 px-4 py-3.5 pl-7 text-left font-normal shadow-none",
                        !checkOutDate && "text-muted-foreground",
                      )}
                    >
                      {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
                      {checkOutDate ? (
                        format(checkOutDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkOutDate}
                      onSelect={setCheckOutDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Select
              color="default"
              label="Room Type"
              labelPlacement="outside"
              placeholder="Select Booking Type"
              selectedKeys={bookingType}
              onSelectionChange={setBookingType}
              variant="bordered"
              classNames={{
                trigger: "px-4 h-auto shadow-none border-1 py-3.5 rounded-md",
                value: "text-black",
                label: "font-medium text-sm -bottom-0.5",
              }}
            >
              {RoomTypeEnum.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </Select>
            <Select
              color="default"
              label="Room Category"
              labelPlacement="outside"
              placeholder="Select Room Category"
              // selectedKeys={}
              // onSelectionChange={}
              variant="bordered"
              classNames={{
                trigger: "px-4 h-auto shadow-none border-1 py-3.5 rounded-md",
                value: "text-black",
                label: "font-medium text-sm -bottom-0.5",
              }}
            >
              {RoomCategoryEnum.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </Select>

            <div className="absolute -bottom-7 w-full px-4 py-2">
              <UiButton className="w-full transform-cpu transform-gpu bg-zinc-800 py-3 shadow-[0px_5px_0px_0px_rgb(9,9,11)] hover:bg-zinc-700 active:translate-y-1 active:bg-zinc-950">
                Submit
              </UiButton>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
