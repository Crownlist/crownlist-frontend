/* eslint-disable */
"use client";

import * as React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { countries } from "@/constants/countries";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "../ui/button";
import { Check, ChevronsUpDownIcon, Search } from "lucide-react";
import { Input } from "../ui/input";

const Hero = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const heroImages: string[] = [
    "/assets/images/london-united-kingdom.png",
    "/assets/images/fashion-clothing-hangers.png",
    "/assets/images/living-room.png",
  ];

  return (
    <Carousel className="w-full">
      <CarouselContent className="h-[580px] ml-0">
        {heroImages.map((image, index) => (
          <CarouselItem key={index}>
            <div
              className="flex w-full h-full bg-center bg-no-repeat bg-cover pl-0"
              style={{ backgroundImage: `url(${image})` }}
            >
              <div className="w-full flex flex-col justify-center max-w-[564px] ml-52 text-white">
                <h1 className="text-[60px] leading-[66px]">
                  Discover top deals tailored for you
                </h1>

                <p className="text-lg font-normal mt-5">
                  The light you need to showcase you are made of black
                </p>

                <div className="w-full h-10 min-w-[560px] flex items-start relative mt-7">
                  <Input
                    className="border border-[#D6D6D6] bg-white text-black rounded w-full max-w-[470px] rounded-tl-[99px] rounded-bl-[99px] py-3 px-5 ps-10 h-full placeholder:text-[#141414]"
                    placeholder="Search"
                  />

                  <Search
                    size={16}
                    color="#141414"
                    className="absolute top-3 left-4"
                  />

                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[150px] h-full rounded-none bg-white text-black border-[#D6D6D6] border-l-0 justify-between"
                      >
                        {value
                          ? countries.find((country) => country.name === value)
                              ?.name
                          : "Select country..."}
                        <ChevronsUpDownIcon className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search country..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {countries.map((country, index) => (
                              <CommandItem
                                key={index}
                                value={country.name}
                                onSelect={(currentValue: any) => {
                                  setValue(
                                    currentValue === value ? "" : currentValue
                                  );
                                  setOpen(false);
                                }}
                              >
                                <Image
                                  src={country?.flag}
                                  alt={country.name}
                                  width={24}
                                  height={24}
                                  className="mr-1"
                                />
                                {country.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    value === country.name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <Button
                    size="sm"
                    className="bg-[#1F058F] text-white py-3 px-5 rounded-tr-[99px] rounded-br-[99px] rounded-tl-0 rounded-bl-0 text-sm flex justify-between items-center h-full"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-14 w-[60px] h-[60px] rounded-[60px] bg-[#00000080] border-none text-white cursor-pointer" />
      <CarouselNext className="right-14 w-[60px] h-[60px] rounded-[60px] bg-[#00000080] border-none text-white cursor-pointer" />
    </Carousel>
  );
};

export default Hero;
