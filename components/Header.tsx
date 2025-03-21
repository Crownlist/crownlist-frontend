/* eslint-disable */
"use client";

import Image from "next/image";
import Link from "next/link";
// import React, { useState } from "react";
import { Input } from "./ui/custom-input";
import { Button } from "./ui/button";
import { Check, ChevronsUpDownIcon, Search } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { countries } from "@/constants/countries";
import { cn } from "@/lib/utils";
import { useState } from "react";

const Header = () => {
  const isLoggedIn = false;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <header>
      <div className="max-w-[85%] mx-auto py-3 w-full">
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-7">
            <div className="flex items-center gap-1.5">
              <Image
                src="/assets/icons/gmail.svg"
                width={24}
                height={24}
                alt="Gmail"
              />
              <small className="text-[#131416] text-sm">
                Info@joelist.com.ng
              </small>
            </div>

            <div className="flex items-center gap-1.5">
              <Image
                src="/assets/icons/google-maps.svg"
                width={24}
                height={24}
                alt="Google Maps"
              />
              <small className="text-[#131416] text-sm">Kwara, Nigeria</small>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <Link href="#">
              <Image
                src="/assets/icons/twitter.svg"
                width={24}
                height={24}
                alt="Twitter"
              />
            </Link>

            <Link href="#">
              <Image
                src="/assets/icons/linkedin.svg"
                width={24}
                height={24}
                alt="LinkedIn"
              />
            </Link>

            <Link href="#">
              <Image
                src="/assets/icons/instagram.svg"
                width={24}
                height={24}
                alt="Instagram"
              />
            </Link>

            <Link href="#">
              <Image
                src="/assets/icons/facebook.svg"
                width={24}
                height={24}
                alt="Facebook"
              />
            </Link>
          </div>
        </div>

        <div className="flex justify-between items-center w-full gap-10">
          <div className="pt-6 pb-3 flex items-center gap-8">
            <Link href="/">
              <Image
                src="/assets/icons/Logo.svg"
                width={48}
                height={48}
                alt="Facebook"
              />
            </Link>

            <div className="w-full h-10 min-w-[560px] flex items-start relative">
              <Input
                className="border border-[#D6D6D6] rounded w-full max-w-[470px] rounded-tl-[99px] rounded-bl-[99px] py-3 px-5 ps-10 h-full placeholder:text-[#141414]"
                placeholder="Search"
              />

              <Search size={16} color="#141414"  className="absolute top-3 left-4"/>

              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[150px] h-full rounded-none border-[#D6D6D6] border-l-0 justify-between"
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
                              setSelectedCountry(
                                value
                                  ? countries.find(
                                      (country) => country.name === value
                                    )?.flag
                                  : countries[0].flag
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
                className="bg-[#141414] text-white py-3 px-5 rounded-tr-[99px] rounded-br-[99px] rounded-tl-0 rounded-bl-0 text-sm flex justify-between items-center h-full"
              >
                Search
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <small className="text-[#141414] font-medium text-sm">
              Category
            </small>

            <small className="text-[#141414] font-medium text-sm">
              Post Product
            </small>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger>Category</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-5">
                <Button
                  size="sm"
                  className="border-none px-2 py-3 rounded-[99px] text-[#141414] font-medium"
                  variant="outline"
                >
                  Login
                </Button>

                <Button
                  size="sm"
                  className="px-2 py-3 rounded-[99px] text-[#141414] font-medium"
                  variant="outline"
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
