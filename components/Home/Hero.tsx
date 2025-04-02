"use client"
import Image from "next/image"
import { useState, useEffect, useCallback, useRef } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { countries } from "@/constants/countries"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { Input } from "@/components/ui/custom-input"
import { useRouter } from "next/navigation"

const Hero = () => {
  const [search, setSearch] = useState("")
  const [value, setValue] = useState("")
  const [open, setOpen] = useState(false)
  const [filteredCountries, setFilteredCountries] = useState(countries)
  const [heroImages, setHeroImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
 
  const router = useRouter();

  const handleSearch = () =>{
    if(search == '' || value == ""){
      router.push('/search')
    }
    else{
      router.push('/search/kwara')
    }
  }

  // Example: Fetch images dynamically or set them based on some condition
  useEffect(() => {
    setHeroImages([
      "/assets/images/london-united-kingdom.png",
      "/assets/images/fashion-clothing-hangers.png",
      "/assets/images/living-room.png",
    ])
  }, [])

  useEffect(() => {
    if (search) {
      setFilteredCountries(countries.filter((country) => country.name.toLowerCase().includes(search.toLowerCase())))
    } else {
      setFilteredCountries(countries)
    }
  }, [search])

  // Auto-slide functionality
  useEffect(() => {
    // Start the auto-slide interval
    startAutoSlide()

    // Clean up on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [heroImages])

  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1))
    }, 5000)
  }, [heroImages])

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentImageIndex(index)

      // Reset the interval when manually changing slides
      startAutoSlide()
    },
    [startAutoSlide],
  )

  const goToNextSlide = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1))
    startAutoSlide()
  }, [heroImages.length, startAutoSlide])

  const goToPrevSlide = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1))
    startAutoSlide()
  }, [heroImages.length, startAutoSlide])

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 w-full ">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover transition-opacity duration-1000 ${
              currentImageIndex === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20"></div>
      </div>

      {/* Static Content */}
      <div className="relative z-10 h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px]">
        <div className="w-full h-full flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-0 lg:max-w-[600px] lg:ml-52 text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-bold leading-tight lg:leading-[66px] text-shadow-sm">
            Discover top deals tailored for you
          </h1>

          <p className="text-base md:text-lg font-normal mt-2 md:mt-5 text-shadow-sm max-w-[90%]">
            The light you need to showcase you are made of black
          </p>

          <div className="w-full flex flex-col sm:flex-row items-center gap-2 sm:gap-0 relative mt-4 md:mt-7">
            <div className="relative w-full max-w-full sm:max-w-none sm:flex-1">
              <Input
                className="border border-[#D6D6D6] bg-white/90 backdrop-blur-sm text-black w-full h-12 sm:h-12 
                        rounded-[99px] sm:rounded-r-none sm:rounded-tl-[99px] sm:rounded-bl-[99px] 
                        py-3 px-5 ps-10 placeholder:text-[#141414] text-sm shadow-md transition-all focus:bg-white"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={16} color="#141414" className="absolute top-1/2 -translate-y-1/2 left-4" />
            </div>

            <div className="flex w-full sm:w-auto mt-2 sm:mt-0">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="flex-1 sm:flex-none sm:w-[120px] md:w-[150px] h-12
                              rounded-l-[99px] rounded-r-none sm:rounded-l-none sm:rounded-none
                              bg-white/90 backdrop-blur-sm text-black border-[#D6D6D6] border-r-0
                              justify-between truncate px-3 sm:px-4 shadow-md transition-all hover:bg-white"
                  >
                    {value ? countries.find((country) => country.name === value)?.name : "Select..."}
                    <ChevronsUpDown className="opacity-50 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-2 z-[9999]">
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
                              "flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-muted transition-colors",
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
                className="bg-[#1F058F] hover:bg-[#2a0bc0] text-white py-3 px-5 
                        rounded-l-none rounded-r-[99px] text-sm 
                        flex justify-between items-center h-12 shadow-md transition-colors"
              onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentImageIndex === index ? "bg-white w-6" : "bg-white/50"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button
        className="absolute left-2 sm:left-6 md:left-10 lg:left-14 top-1/2 -translate-y-1/2 w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] rounded-full bg-black/30 hover:bg-black/50 border-none text-white cursor-pointer transition-all z-20 flex items-center justify-center"
        onClick={goToPrevSlide}
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <button
        className="absolute right-2 sm:right-6 md:right-10 lg:right-14 top-1/2 -translate-y-1/2 w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] rounded-full bg-black/30 hover:bg-black/50 border-none text-white cursor-pointer transition-all z-20 flex items-center justify-center"
        onClick={goToNextSlide}
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
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