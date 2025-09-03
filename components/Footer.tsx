import Image from "next/image";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  MapPin,
  Mail,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full z-10">
      {/* Newsletter Section */}
      {/* <div className="relative w-full bg-[#1F058F]">
       <div className='container mx-auto'>
        <div className="flex flex-row w-full justify-between sm:justify-evenly md:gap-18 p-5 text-white align-middle items-center  ">
           <div className="flex align-middle font-semibold">Have something to sell?</div>
            <Link href={'/seller/dashboard'}>       
           <Button className="flex align-middle rounded-full bg-transparent   hover:bg-[#2a0bc0] text-white border-2 border-white">Post ads..</Button>
           </Link>
        </div>
        </div>
      </div> */}

      <div className="mt-0 w-full px-6 pb-6 container">
        <div className="flex flex-col md:flex-row w-full justify-between  bg-white  shadow-xl rounded-md overflow-hidden  ">
          <div className="p-6 md:w-1/2 md:flex md:flex-col md:justify-center">
            <h2 className="text-2xl font-medium ">Got Something to Sell?</h2>
            <h2 className="text-2xl font-medium mb-2">Post It Here!</h2>
            <p className="text-gray-500 mb-6 max-w-lg">
              Reach thousands of potential buyers in your area and get your item
              seen today! posting an ad takes just a few seconds
            </p>
            <div className="flex w-full max-sm:justify-center align-middle">
              <Button className="flex justify-center bg-[#1F058F] rounded-full items-center px-12">
                Post Your ad now
              </Button>
            </div>
          </div>
          <div className="w-full h-auto relative md:w-1/2 hidden sm:block">
            <Image
              src="/hanger.png"
              alt="Clothing on hangers"
              width={600}
              height={600}
              className="object-contain h-full w-full rounded-r-md"
            />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-black text-white py-8 max-sm:px-2">
        <div className="container mx-auto max-md:px-3 ">
          <div className="flex flex-col justify-between gap-2 border-b border-[#FFFFFF40] pb-4 md:flex-row">
            <div>
              <h6 className="mb-0 font-semibold text-white">
                Join our newsletter
              </h6>
              <span className="text-sm text-white">
                We’ll send you a nice letter once per week. No spam.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Input
                placeholder="Enter your email"
                type="email"
                className=" bg-gray-800 border-gray-700 text-white sm:min-w-[300px]"
              />
              <Button className="rounded-r-full rounded-l-full  bg-[#1F058F] hover:bg-[#2a0bc0] text-white border-0">
                Subscribe
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-8 mt-3 ">
            {/* Logo and Tagline */}
            <div className="md:col-span-1">
              <Image
                src="/logofooter.jpg"
                width={120}
                height={120}
                alt="crownlist Logo"
                className="max-sm:hidden"
              />
              <Image
                src="/logofooter.jpg"
                width={100}
                height={100}
                alt="crownlist Logo"
                className="sm:hidden"
              />
              <p className="mt-4 text-sm text-gray-400">
                Crownlist your free trusted marketplace
              </p>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about-us"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/faq"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/safety"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Safety
                  </Link>
                </li>
                <li>
                  <Link
                    href="/share-feedback"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Share feedback
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/terms-and-conditions"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy and Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact and Social */}
            <div>
              <h3 className="font-medium mb-4">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin size={16} />
                  <span>Kwara, Nigeria</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail size={16} />
                  <span>info@joelist.com.ng</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium  mb-4">Socials</h3>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter size={20} />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin size={20} />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram size={20} />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Facebook size={20} />
                </Link>
              </div>
            </div>
          </div>

          {/* Large Watermark Text */}
          {/* <div className="relative py-12">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <span className="text-[120px] md:text-[180px] font-bold tracking-tighter">Crownlist</span>
            </div> */}
          <div className="bg-black text-white py-8 md:py-12 md:m-3  border-t border-gray-800 relative h-full w-full">
            <Image
              src={"/fottertext.png"}
              alt={"footer"}
              fill
              className="object-fill"
            />
          </div>

          {/* Copyright and Payment Methods */}
          <div className=" items-center pt-6 border-t border-gray-800">
            <p className="text-sm text-center text-gray-500 mb-4 md:mb-0">
              ©2025 Crownlist. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
{
  /* <div className="mt-5 bg-white shadow rounded-lg overflow-hidden w-full">
              <div className="flex flex-col md:flex-row w-full justify-between">
                <div className="p-6 md:w-1/2">
                  <h2 className="text-xl font-medium mb-2">Request product/services</h2>
                  <p className="text-gray-500 mb-6">
                    If you can‘t find the product you‘re looking for, please enter the product or service details below.
                  </p>

                  <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                    <div>
                      <label className="block mb-1 text-sm">Full name</label>
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Contact number</label>
                      <Input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        pattern="[0-9]+"
                        title="Contact number must be numeric"
                        className="w-full"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault()
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select a category</option>
                        {categoryList.map((cat) => (
                          <option key={cat.name} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Image(s)</label>
                      <div
                        className="border border-dashed rounded-md p-4 text-center"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                      >
                        <input
                          type="file"
                          accept="image/svg+xml,image/png,image/jpeg,image/gif"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Upload size={20} className="text-gray-400" />
                            <div className="text-sm">
                              <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                            </div>
                            <div className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 800×400px)</div>
                          </div>
                        </label>
                        {files.length > 0 && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p>Selected files:</p>
                            <ul className="list-disc list-inside">
                              {files.map((file, index) => (
                                <li key={index}>{file.name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Description</label>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full min-h-[100px]"
                      />
                    </div>
                    <div className="flex w-full justify-center">
                      <Button
                        type="submit"
                        className="flex w-full justify-center max-w-xl md:p-6 items-center bg-[#1F058F] hover:bg-[#2a0bc0] text-white mt-3"
                      >
                        Request product
                      </Button>
                    </div>
                  </form>
                </div>
                <div className="w-full h-auto relative md:w-1/2 p-6 max-sm:hidden">
                  <Image
                    src="/hanger.png"
                    alt="Clothing on hangers"
                    width={600}
                    height={600}
                    className="object-cover h-full w-full rounded-r-md"
                  />
                </div>
              </div>
            </div> */
}
