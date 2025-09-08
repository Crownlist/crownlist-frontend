import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import { PlusCircle, MinusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
      id: 1,
      question: "General Safety Tips",
      answer: `
      <ul>
        <li><strong>Trust Your Instincts:</strong> If you are uncomfortable with the terms of a transaction, do not proceed.</li>
        <li><strong>Protect Your Personal Information:</strong> Never share sensitive details such as bank account numbers, ATM card details, or copies of your ID.</li>
        <li><strong>Choose Safe Meeting Locations:</strong> Always meet in open, public places. Avoid secluded or risky areas.</li>
        <li><strong>Keep Records:</strong> Maintain copies of all correspondence (emails, ads, chats, letters, etc.) and contact details of the other party.</li>
      </ul>
    `,
    },
    {
       id: 2,
      question: "Buyers’ Safety Tips",
      answer: `
      <ul>
        <li><strong>Be Cautious of Unrealistic Offers:</strong> Watch out for deals that seem too good to be true or items priced significantly lower than market value.</li>
        <li><strong>Avoid Pre-Payments:</strong> Do not send any payments until you have met the seller and signed a purchase agreement.</li>
        <li><strong>Inspect Before Paying:</strong> Meet in a safe, public location and check the item thoroughly before making payment.</li>
        <li><strong>Pay Upon Satisfaction:</strong> Only pay when you are satisfied with the item and collect it immediately.</li>
      </ul>
    `,
    },
    {
       id: 3,
      question: "Sellers to Avoid",
      answer: `
      <ul>
        <li>Request advance payment or a deposit before delivering the item.</li>
        <li>Insist on meeting in a non-public location for delivery.</li>
        <li>Ask for personal information such as your ID, bank details, or debit/credit card numbers.</li>
      </ul>
    `,
    },
    {
       id: 4,
      question: "Sellers’ Safety Tips",
      answer: `
      <ul>
        <li><strong>Collect Full Payment:</strong> Ensure you receive full payment before delivering any goods.</li>
        <li><strong>Deliver What You Advertised:</strong> Make sure the item you deliver matches the description in your ad.</li>
        <li><strong>Limit Financial Information Sharing:</strong> Only provide the necessary financial information required for payment.</li>
      </ul>
    `,
    },
    {
       id: 5,
      question: "Buyers to Avoid",
      answer: `
      <ul>
        <li>Insist on using a cheque.</li>
        <li>Demand that you send the item before payment is made.</li>
        <li>Request personal information such as your ID, bank details, or debit/credit card numbers.</li>
        <li>Are located in foreign countries without a clear reason.</li>
      </ul>
    `,
    },
    {
       id: 6,
      question: "Need Further Assistance?",
      answer: `
      <p>If you have any questions or need further assistance, please contact us at <a href="mailto:support@crownlist.com">support@crownlist.com</a>.</p>
    `,
    },
  ];

  return (
    <div className="mx-auto p-6 space-y-8 w-full max-w-screen-md">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="bg-[#f2e9ff] text-[#6941c6] px-3 py-1 rounded-full text-sm font-medium mb-4">
          Safety Tips for CROWNLIST Users
        </div>
        <h2 className="text-3xl font-bold mb-2">
          We care about your well-being
        </h2>
        <p className="text-gray-600 max-w-xl">
        At CROWNLIST, your safety is our priority. While we facilitate connections between buyers and
        sellers, we do not handle payments, shipping, or guarantee transactions. Please follow these
        safety tips to ensure a secure experience. Need help?{" "}
          <Link
            href="/contact"
            className="text-[#6941c6] font-medium hover:underline"
          >
            Please chat to our friendly team
          </Link>
        </p>
      </div>

      <div className="relative mb-10 max-w-md mx-auto">
        <Input
          type="text"
          placeholder="Search"
          className="pl-10 pr-4 py-2 rounded-full border border-gray-300"
        />
        <Button className="absolute right-0 top-0 bottom-0 rounded-r-full bg-[#3e0bac] hover:bg-[#2e0880] text-white px-5">
          Search
        </Button>
      </div>

      <Accordion
        type="single"
        collapsible
        className="rounded-lg  w-full max-w-4xl p-6"
      >
        {faqs.map((faq) => (
          <AccordionItem value={`item-${faq.id}`} key={faq.id}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent className="text-gray-500 break-words max-w-full">
              <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Safety;
