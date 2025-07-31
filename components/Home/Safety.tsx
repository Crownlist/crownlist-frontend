import React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
// import { PlusCircle, MinusCircle } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Safety = () => {
  // const safetyTips = {
  //   introduction: `At CROWNLIST, your safety is our priority. While we facilitate connections between buyers and sellers, we do not handle payments, shipping, or guarantee transactions. Please follow these safety tips to ensure a secure experience.`,
  //   generalSafetyTips: {
  //     title: "General Safety Tips",
  //     tips: [
  //       "- Trust Your Instincts: If you are uncomfortable with the terms of a transaction, do not proceed.",
  //       "- Protect Your Personal Information: Never share sensitive details such as bank account numbers, ATM card details, or copies of your ID.",
  //       "- Choose Safe Meeting Locations: Always meet in open, public places. Avoid secluded or risky areas.",
  //       "- Keep Records: Maintain copies of all correspondence (emails, ads, chats, letters, etc.) and contact details of the other party.",
  //     ],
  //   },
  //   buyersSafetyTips: {
  //     title: "Buyers’ Safety Tips",
  //     tips: [
  //       "- Be Cautious of Unrealistic Offers: Watch out for deals that seem too good to be true or items priced significantly lower than market value.",
  //       "- Avoid Pre-Payments: Do not send any payments until you have met the seller and signed a purchase agreement.",
  //       "- Inspect Before Paying: Meet in a safe, public location and check the item thoroughly before making payment.",
  //       "- Pay Upon Satisfaction: Only pay when you are satisfied with the item and collect it immediately.",
  //     ],
  //     sellersToAvoid: {
  //       title: "Sellers to Avoid",
  //       points: [
  //         "- Request advance payment or a deposit before delivering the item.",
  //         "- Insist on meeting in a non-public location for delivery.",
  //         "- Ask for personal information such as your ID, bank details, or debit/credit card numbers.",
  //       ],
  //     },
  //   },
  //   sellersSafetyTips: {
  //     title: "Sellers’ Safety Tips",
  //     tips: [
  //       "- Collect Full Payment: Ensure you receive full payment before delivering any goods.",
  //       "- Deliver What You Advertised: Make sure the item you deliver matches the description in your ad.",
  //       "- Limit Financial Information Sharing: Only provide the necessary financial information required for payment.",
  //     ],
  //   },
  //   buyersToAvoid: {
  //     title: "Buyers to Avoid",
  //     points: [
  //       "- Insist on using a cheque.",
  //       "- Demand that you send the item before payment is made.",
  //       "- Request personal information such as your ID, bank details, or debit/credit card numbers.",
  //       "- Are located in foreign countries without a clear reason.",
  //     ],
  //   },
  //   contactUs: {
  //     title: "Contact Us",
  //     content: "If you have any questions or need further assistance, please contact us at support@crownlist.com.",
  //   },
  // };

  // const renderList = (items: string[]) => (
  //   <ul className="ml-8 space-y-2 text-gray-600 list-disc">
  //     {items.map((item, idx) => (
  //       <li key={idx}>{item.replace(/^- /, '')}</li>
  //     ))}
  //   </ul>
  // );

  const faqs = [
    {
      question: "Is there a free trial available?",
      answer: "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
    },
      {
      question: "Can I change my plan later?",
      answer: "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
    },
      {
      question: "What is your cancellation policy?",
      answer: "Yes. It adheres to the WAI-ARIA design pattern.",
    },
      {
      question: "Can other info be added to an invoice?",
      answer: "Yes. It adheres to the WAI-ARIA design pattern.",
    },
      {
      question: "How does billing work?",
      answer: "Yes. It adheres to the WAI-ARIA design pattern.",
    },
      {
      question: "How do I change my account email?",
      answer: "Yes. It adheres to the WAI-ARIA design pattern.",
    },

  ]
  return (
    
      
     <div className=' mx-auto p-6 space-y-8 w-full max-w-screen-md overflow-x-hidden'>

     <div className="flex flex-col items-center text-center mb-10">
        <div className="bg-[#f2e9ff] text-[#6941c6] px-3 py-1 rounded-full text-sm font-medium mb-4">Safety</div>
        <h2 className="text-3xl font-bold mb-2">We care about your well-being</h2>
        <p className="text-gray-600 max-w-xl">
          Everything you need to know about the product and billing. Can&apos;t find the answer you&apos;re looking for?{" "}
          <Link href="#" className="text-[#6941c6] font-medium hover:underline">
            Please chat to our friendly team
          </Link>
        </p>
      </div>

      <div className="relative mb-10 max-w-md mx-auto">
        <Input type="text" placeholder="Search" className="pl-10 pr-4 py-2 rounded-full border border-gray-300" />
        <Button className="absolute right-0 top-0 bottom-0 rounded-r-full bg-[#3e0bac] hover:bg-[#2e0880] text-white px-5">
          Search
        </Button>
      </div>

      <Accordion type="single" collapsible className='rounded-lg  bg-gray-30 w-full max-w-4xl p-6 overflow-hidden' >
        {faqs.map((faq, idx) => (
        
        <AccordionItem value={`item-${idx}`} key={idx} >
          <AccordionTrigger >{faq.question}</AccordionTrigger>
          <AccordionContent className='text-gray-500 break-words max-w-full'>
           {faq.answer}
          </AccordionContent>
          
        </AccordionItem>
        ))}
      </Accordion>
    </div>
    
   


    // <div className="flex flex-col w-full">
    //   <div className="bg-[#1F058F] text-white py-8 px-4">
    //     <div className="flex flex-col items-center justify-center text-center gap-3">
    //       <div className="text-sm text-white max-sm:text-[#52a9ff]">Stay Safe on Crownlist</div>
    //       <div className="font-semibold md:text-3xl">Safety Tips</div>
    //       <p className="font-light max-w-3xl">{safetyTips.introduction}</p>
    //     </div>
    //   </div>

    //   <div className="max-w-4xl mx-auto p-6 space-y-8">
    //     <section>
    //       <h2 className="text-[#1F058F] font-semibold mb-2">{safetyTips.generalSafetyTips.title}</h2>
    //       {renderList(safetyTips.generalSafetyTips.tips)}
    //     </section>

    //     <section>
    //       <h2 className="text-[#1F058F] font-semibold mb-2">{safetyTips.buyersSafetyTips.title}</h2>
    //       {renderList(safetyTips.buyersSafetyTips.tips)}
    //     </section>

    //     <section>
    //       <h2 className="text-[#1F058F] font-semibold mb-2">{safetyTips.buyersSafetyTips.sellersToAvoid.title}</h2>
    //       {renderList(safetyTips.buyersSafetyTips.sellersToAvoid.points)}
    //     </section>

    //     <section>
    //       <h2 className="text-[#1F058F] font-semibold mb-2">{safetyTips.sellersSafetyTips.title}</h2>
    //       {renderList(safetyTips.sellersSafetyTips.tips)}
    //     </section>

    //     <section>
    //       <h2 className="text-[#1F058F] font-semibold mb-2">{safetyTips.buyersToAvoid.title}</h2>
    //       {renderList(safetyTips.buyersToAvoid.points)}
    //     </section>

    //     <section>
   
    //       <h2 className="text-[#1F058F] font-semibold mb-2">{safetyTips.contactUs.title}</h2>
    //       <p className="text-gray-600">{safetyTips.contactUs.content}</p>
    //     </section>
    //   </div>
    // </div>
  );
};

export default Safety;
