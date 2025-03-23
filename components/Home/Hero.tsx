/* eslint-disable */
"use client"
import { useState, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { countries } from "@/constants/countries"
import { cn } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"
import { Button } from "../ui/button"
import { Check, ChevronsUpDownIcon, Search } from "lucide-react"
import { Input } from "../ui/input"

const Hero = () => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [search, setSearch] = useState("")
  const [filteredCountries, setFilteredCountries] = useState(countries)

  const heroImages: string[] = [
    "/assets/images/london-united-kingdom.png",
    "/assets/images/fashion-clothing-hangers.png",
    "/assets/images/living-room.png",
  ]

  // Filter countries based on search input
  useEffect(() => {
    if (search) {
      setFilteredCountries(countries.filter((country) => country.name.toLowerCase().includes(search.toLowerCase())))
    } else {
      setFilteredCountries(countries)
    }
  }, [search])

  return (
    <Carousel className="w-full">
      <CarouselContent className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[580px] ml-0">
        {heroImages.map((image, index) => (
          <CarouselItem key={index}>
            <div
              className="flex w-full h-full bg-center bg-no-repeat bg-cover pl-0 relative"
              style={{ backgroundImage: `url(${image})` }}
            >
              {/* Overlay for better text readability on mobile */}
              <div className="absolute inset-0 bg-black/30 md:bg-transparent"></div>

              <div className="w-full flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-0 lg:max-w-[564px] lg:ml-52 text-white relative z-10">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] leading-tight lg:leading-[66px]">
                  Discover top deals tailored for you
                </h1>

                <p className="text-base md:text-lg font-normal mt-2 md:mt-5">
                  The light you need to showcase you are made of black
                </p>

                {/* Improved Search Section */}
                <div className="w-full flex flex-col sm:flex-row items-center gap-2 sm:gap-0 relative mt-4 md:mt-7">
                  {/* Search Input - Full width on all screens, with responsive adjustments */}
                  <div className="relative w-full max-w-full sm:max-w-none sm:flex-1">
                    <Input
                      className="border border-[#D6D6D6] bg-white text-black w-full h-12 sm:h-10 
                              rounded-[99px] sm:rounded-r-none sm:rounded-tl-[99px] sm:rounded-bl-[99px] 
                              py-3 px-5 ps-10 placeholder:text-[#141414] text-sm"
                      placeholder="Search"
                    />
                    <Search size={16} color="#141414" className="absolute top-1/2 -translate-y-1/2 left-4" />
                  </div>

                  {/* Country Selector and Search Button - Side by side on all screens */}
                  <div className="flex w-full sm:w-auto mt-2 sm:mt-0">
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="flex-1 sm:flex-none sm:w-[120px] md:w-[150px] h-12 sm:h-10
                                  rounded-l-[99px] rounded-r-none sm:rounded-l-none sm:rounded-none
                                  bg-white text-black border-[#D6D6D6] border-r-0
                                  justify-between truncate px-3 sm:px-4"
                        >
                          <span className="truncate">
                            {value ? countries.find((country) => country.name === value)?.name : "Select..."}
                          </span>
                          <ChevronsUpDownIcon className="opacity-50 flex-shrink-0 ml-1" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-2">
                        <div className="mb-2">
                          <Input
                            placeholder="Search country..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9"
                          />
                        </div>

                        <div className="max-h-[300px] overflow-y-auto">
                          {filteredCountries.length === 0 ? (
                            <div className="py-2 text-center text-sm text-muted-foreground">No country found.</div>
                          ) : (
                            <div className="space-y-1">
                              {filteredCountries.map((country, index) => (
                                <div
                                  key={index}
                                  className={cn(
                                    "flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-muted",
                                    value === country.name && "bg-muted",
                                  )}
                                  onClick={() => {
                                    const newValue = country.name === value ? "" : country.name
                                    setValue(newValue)
                                    setOpen(false)
                                    setSearch("")
                                  }}
                                >
                                  <Image
                                    src={country.flag || "/placeholder.svg"}
                                    alt={country.name}
                                    width={24}
                                    height={24}
                                    className="mr-2"
                                  />
                                  <span>{country.name}</span>
                                  {value === country.name && <Check className="ml-auto h-4 w-4" />}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Button
                      size="sm"
                      className="bg-[#1F058F] text-white py-3 px-5 
                              rounded-l-none rounded-r-[99px] text-sm 
                              flex justify-between items-center h-12 sm:h-10"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-2 sm:left-6 md:left-10 lg:left-14 w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] rounded-full bg-[#00000080] border-none text-white cursor-pointer" />
      <CarouselNext className="right-2 sm:right-6 md:right-10 lg:right-14 w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] rounded-full bg-[#00000080] border-none text-white cursor-pointer" />
    </Carousel>
  )
}

export default Hero


// "use client"
// import { useState, useEffect } from "react"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { countries } from "@/constants/countries"
// import { cn } from "@/lib/utils"
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
// import Image from "next/image"
// import { Button } from "../ui/button"
// import { Check, ChevronsUpDownIcon, Search } from "lucide-react"
// import { Input } from "../ui/input"

// const Hero = () => {
//   const [open, setOpen] = useState(false)
//   const [value, setValue] = useState("")
//   const [search, setSearch] = useState("")
//   const [filteredCountries, setFilteredCountries] = useState(countries)

//   const heroImages: string[] = [
//     "/assets/images/london-united-kingdom.png",
//     "/assets/images/fashion-clothing-hangers.png",
//     "/assets/images/living-room.png",
//   ]

//   // Filter countries based on search input
//   useEffect(() => {
//     if (search) {
//       setFilteredCountries(countries.filter((country) => country.name.toLowerCase().includes(search.toLowerCase())))
//     } else {
//       setFilteredCountries(countries)
//     }
//   }, [search])

//   return (
//     <Carousel className="w-full">
//       <CarouselContent className="h-[580px] ml-0">
//         {heroImages.map((image, index) => (
//           <CarouselItem key={index}>
//             <div
//               className="flex w-full h-full bg-center bg-no-repeat bg-cover pl-0"
//               style={{ backgroundImage: `url(${image})` }}
//             >
//               <div className="w-full flex flex-col justify-center max-w-[564px] ml-52 text-white">
//                 <h1 className="text-[60px] leading-[66px]">Discover top deals tailored for you</h1>

//                 <p className="text-lg font-normal mt-5">The light you need to showcase you are made of black</p>

//                 <div className="w-full h-10 min-w-[560px] flex items-start relative mt-7">
//                   <Input
//                     className="border border-[#D6D6D6] bg-white text-black rounded w-full max-w-[470px] rounded-tl-[99px] rounded-bl-[99px] py-3 px-5 ps-10 h-full placeholder:text-[#141414]"
//                     placeholder="Search"
//                   />

//                   <Search size={16} color="#141414" className="absolute top-3 left-4" />

//                   <Popover open={open} onOpenChange={setOpen}>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         role="combobox"
//                         aria-expanded={open}
//                         className="w-[150px] h-full rounded-none bg-white text-black border-[#D6D6D6] border-l-0 justify-between"
//                       >
//                         {value ? countries.find((country) => country.name === value)?.name : "Select country..."}
//                         <ChevronsUpDownIcon className="opacity-50" />
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-[200px] p-2">
//                       <div className="mb-2">
//                         <Input
//                           placeholder="Search country..."
//                           value={search}
//                           onChange={(e) => setSearch(e.target.value)}
//                           className="h-9"
//                         />
//                       </div>

//                       <div className="max-h-[300px] overflow-y-auto">
//                         {filteredCountries.length === 0 ? (
//                           <div className="py-2 text-center text-sm text-muted-foreground">No country found.</div>
//                         ) : (
//                           <div className="space-y-1">
//                             {filteredCountries.map((country, index) => (
//                               <div
//                                 key={index}
//                                 className={cn(
//                                   "flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-muted",
//                                   value === country.name && "bg-muted",
//                                 )}
//                                 onClick={() => {
//                                   const newValue = country.name === value ? "" : country.name
//                                   setValue(newValue)
//                                   setOpen(false)
//                                   setSearch("")
//                                 }}
//                               >
//                                 <Image
//                                   src={country.flag || "/placeholder.svg"}
//                                   alt={country.name}
//                                   width={24}
//                                   height={24}
//                                   className="mr-2"
//                                 />
//                                 <span>{country.name}</span>
//                                 {value === country.name && <Check className="ml-auto h-4 w-4" />}
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </PopoverContent>
//                   </Popover>

//                   <Button
//                     size="sm"
//                     className="bg-[#1F058F] text-white py-3 px-5 rounded-tr-[99px] rounded-br-[99px] rounded-tl-0 rounded-bl-0 text-sm flex justify-between items-center h-full"
//                   >
//                     Search
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </CarouselItem>
//         ))}
//       </CarouselContent>

//       <CarouselPrevious className="left-14 w-[60px] h-[60px] rounded-[60px] bg-[#00000080] border-none text-white cursor-pointer" />
//       <CarouselNext className="right-14 w-[60px] h-[60px] rounded-[60px] bg-[#00000080] border-none text-white cursor-pointer" />
//     </Carousel>
//   )
// }

// export default Hero


{/* <Command>
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
                      </Command> */}