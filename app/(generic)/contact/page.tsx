"use client"

import { useState } from "react"
import Header from "@/components/Header1"
import Footer from "@/components/Footer"
import { Mail, MapPin, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Loader2 } from "lucide-react"


export default function ContactPage() {

 const [isSubmitting] = useState(false)
    
    

  return (
    <>
        <Header hidden={false} />
    
      <div className="max-w-7xl mx-auto px-4 py-12">

      <div className="grid md:grid-cols-2 gap-8 mb-20">
        <div className="space-y-6">
       
          <div className="inline-block bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-medium">
            Contact us
          </div>

          <h1 className="text-3xl font-bold">Contact us</h1>
          <p className="text-gray-600">Get in touched and let us know how we can help.</p>

          {/* Form */}
          <form className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4 ">
              <div>
                <label htmlFor="first-name" className="block text-sm mb-1">
                  First name
                </label>
                <input type="text" id="first-name" className="w-full border border-gray-300 rounded p-2" />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm mb-1">
                  Last name
                </label>
                <input type="text" id="last-name" className="w-full border border-gray-300 rounded p-2" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-1">
                Email address
              </label>
              <input type="email" id="email" className="w-full border border-gray-300 rounded p-2" />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm mb-1">
                Message
              </label>
              <textarea id="message" rows={4} className="w-full border border-gray-300 rounded p-2"></textarea>
            </div>

            <div className="text-sm text-gray-600">
              By clicking &quot;Submit&quot; you agree to Crownlist&apos;s{" "}
              <Link href="/terms-and-conditions" className="text-indigo-600 hover:underline">
                Terms of use
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-indigo-600 hover:underline">
                Privacy policy
              </Link>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-900 text-white py-3 rounded-3xl font-medium hover:bg-indigo-800 transition flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
          </form>
        </div>

        <div className="hidden md:block">
          <div className="rounded-lg overflow-hidden h-full">
            <Image
              src="/contact-user.svg"
              alt="Customer support representative with headphones"
              loading="lazy"
              width={716}
              height={604}
              className="w-full h-full object-cover w-[716px] h-[604px]"
            />
          </div>
        </div>
      </div>

   
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-12">We&apos;d like to hear from you</h2>

        <div className="grid md:grid-cols-3 gap-8 ">
       
          <div className="flex flex-col items-start border-b pb-8 md:border-b-0 md:border-r  pt-8">
            <div className="mb-4 text-gray-500">
            <Mail />
            </div>
            <h3 className="text-lg font-medium">Email</h3>
            <p className="text-gray-500 text-sm mb-2">Our friendly team is here to help.</p>
            <a href="mailto:info@crownlist.com" className="text-gray-900 hover:underline">
              info@crownlist.com
            </a>
          </div>

         
          <div className="flex flex-col items-start text-left border-b pb-8 md:border-b-0  md:border-r mb-4 md:mb-0">
            <div className="mb-4 text-gray-500">
            <MapPin />
            </div>
            <h3 className="text-lg font-medium">Office</h3>
            <p className="text-gray-500 text-sm mb-2 ">Come say hello at our office HQ.</p>
            <p className="text-gray-900">20 Eleko, Kwara Polytechnic, Kwara state, Ilorin Nigeria</p>
          </div>

        
          <div className="flex flex-col items-start">
            <div className="mb-4 text-gray-500">
            <Phone />
            </div>
            <h3 className="text-lg font-medium">Phone</h3>
            <p className="text-gray-500 text-sm mb-2">Mon-Fri from 8am to 5pm.</p>
            <a href="tel:+2348000000000" className="text-gray-900 hover:underline">
              +234 800 000 0000
            </a>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}
