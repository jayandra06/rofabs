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
import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Select,
  SelectItem,
  Selection,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { format } from "date-fns";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { SearchIcon } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Key, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type AutocompleteData = {
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  description: string;
  matched_substrings: {
    length: number;
    offset: number;
  }[];
  terms: {
    offset: number;
    value: string;
  }[];
  types: string[];
  reference: string;
};

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [bookingType, setBookingType] = useState<Selection>(new Set([]));
  const [roomCategory, setRoomCategory] = useState<Selection>(new Set([]));
  const [roomType, setRoomType] = useState<Selection>(new Set([]));
  const [location, setLocation] = useState<Key>("");
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);

  const createQueryString = (
    paramsToUpdate: Record<string, string>,
    paramToRemove?: string,
  ) => {
    const params = new URLSearchParams(searchParams?.toString());
    Object.entries(paramsToUpdate).forEach(([name, value]) => {
      params.set(name, value);
    });
    if (paramToRemove) {
      params.delete(paramToRemove);
    }
    return params.toString();
  };

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!checkInDate || !checkOutDate)
      return toast.error("Please select check-in and check-out dates");
    if (!location) return toast.error("Please select a location");
    router.push(
      "/search" +
        "?" +
        createQueryString({
          "check-in": dayjs(checkInDate).format("YYYY-MM-DD"),
          "check-out": dayjs(checkOutDate).format("YYYY-MM-DD"),
          bookingType: Array.from(bookingType).join(""),
          "room-category": Array.from(roomCategory).join(""),
          "room-type": Array.from(roomType).join(""),
          location: location.toString().split("&&")[0],
          "place-id": location.toString().split("&&")[1],
          "no-of-guests": numberOfGuests.toString(),
        }),
    );
  };
  console.log(location, "selected location");

  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState<AutocompleteData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchItems = debounce(async (value) => {
    setIsLoading(true);
    // Replace this with your actual fetch function
    const newItems = await fetchLocation(value);
    setItems(newItems);
    setIsLoading(false);
  }, 500); // 500ms delay

  useEffect(() => {
    if (inputValue.length > 0) {
      fetchItems(inputValue);
    } else {
      setItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const fetchLocation = async (input: string) => {
    let res = await fetch(`/api/maps/autocomplete?input=${input}`);
    let json = await res.json();
    return json;
  };

  return (
    <>
      <Head>
        <title>Rofabs for users</title>
      </Head>
      <main
        className={`relative grid h-screen w-full grid-cols-1 md:grid-cols-2`}
      >
        <div className="relative h-full w-full">
          <div className="relative flex h-full w-full items-stretch justify-center border-r bg-gradient-to-tr">
            <Swiper
              modules={[Pagination, Autoplay]}
              autoplay={{ delay: 2000, disableOnInteraction: true }}
              spaceBetween={50}
              slidesPerView={1}
              navigation
              // pagination={{ clickable: true }}
            >
              <SwiperSlide>
                <Image
                  src="/bg-1.jpg"
                  alt="bg-one"
                  className="h-full w-full object-cover"
                  width={1000}
                  height={1000}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Image
                  src="/bg-2.jpg"
                  alt="bg-two"
                  className="h-full w-full object-cover"
                  width={1000}
                  height={1000}
                />
              </SwiperSlide>
              <SwiperSlide>
                <Image
                  src="/bg-3.jpg"
                  alt="bg-three"
                  className="h-full w-full object-cover"
                  width={1000}
                  height={1000}
                />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
        <div className="relative -mt-20 flex h-full w-full items-center justify-center px-14 py-5">
          {/* <BackgroundSvg /> */}
          <form className="relative grid w-full grid-cols-2 gap-3 px-5 pb-12 pt-10">
            <div className="relative col-span-2 flex w-full flex-1 items-center gap-2.5">
              <Autocomplete
                inputValue={inputValue}
                isLoading={isLoading}
                items={items}
                label="Select a character"
                labelPlacement="outside"
                placeholder="Type to search..."
                selectedKey={`${location && location}`}
                onSelectionChange={(key) => {
                  setLocation(key);
                  if (key) {
                    setInputValue(key.toString().split("&&")[0]);
                  }
                }}
                variant="bordered"
                onInputChange={setInputValue}
                startContent={
                  <SearchIcon
                    className="mr-1 text-default-400"
                    strokeWidth={2.5}
                    size={20}
                  />
                }
                clearButtonProps={{
                  onClick: () => {
                    setInputValue("");
                    setLocation("");
                    setItems([]);
                  },
                }}
                inputProps={{
                  classNames: {
                    inputWrapper: "px-4 h-auto shadow-none border-1 rounded-md",
                    input: "py-3.5 text-black placeholder:text-black",
                    label: "font-medium text-sm -bottom-0.5",
                  },
                }}
              >
                {(item) => (
                  <AutocompleteItem
                    key={`${item.structured_formatting.main_text},${item.structured_formatting.secondary_text}&&${item.place_id}`}
                    className="capitalize"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {item.structured_formatting.main_text}
                      </span>
                      <span className="text-sm text-default-500">
                        {item.structured_formatting.secondary_text}
                      </span>
                    </div>
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <div className="flex w-auto flex-col items-start gap-2.5">
                <Label>No of guests</Label>
                <div className="flex w-full items-center gap-2">
                  <UiButton
                    onClick={(e) => {
                      e.preventDefault();
                      setNumberOfGuests(numberOfGuests + 1);
                    }}
                    className="border bg-transparent py-3 text-black hover:bg-zinc-100"
                  >
                    +
                  </UiButton>
                  <UiButton className="bg-black py-3 hover:bg-zinc-950">
                    {numberOfGuests}
                  </UiButton>
                  <UiButton
                    onClick={(e) => {
                      e.preventDefault();
                      if (numberOfGuests > 1) {
                        setNumberOfGuests(numberOfGuests - 1);
                      }
                    }}
                    className="border bg-transparent py-3 text-black hover:bg-zinc-100"
                  >
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
              selectedKeys={roomType}
              onSelectionChange={setRoomType}
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
              selectedKeys={roomCategory}
              onSelectionChange={setRoomCategory}
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
              <button
                onClick={handleSubmit}
                className="w-full rounded-lg bg-zinc-800 py-3 text-white shadow-[0px_5px_0px_0px_rgb(9,9,11)] hover:bg-zinc-700 active:translate-y-1 active:bg-zinc-950"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
