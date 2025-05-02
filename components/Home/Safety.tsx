import React from 'react';

const Safety = () => {
  const safetyTips = {
    introduction: `At CROWNLIST, your safety is our priority. While we facilitate connections between buyers and sellers, we do not handle payments, shipping, or guarantee transactions. Please follow these safety tips to ensure a secure experience.`,
    generalSafetyTips: {
      title: "General Safety Tips",
      tips: [
        "- Trust Your Instincts: If you are uncomfortable with the terms of a transaction, do not proceed.",
        "- Protect Your Personal Information: Never share sensitive details such as bank account numbers, ATM card details, or copies of your ID.",
        "- Choose Safe Meeting Locations: Always meet in open, public places. Avoid secluded or risky areas.",
        "- Keep Records: Maintain copies of all correspondence (emails, ads, chats, letters, etc.) and contact details of the other party.",
      ],
    },
    buyersSafetyTips: {
      title: "Buyers’ Safety Tips",
      tips: [
        "- Be Cautious of Unrealistic Offers: Watch out for deals that seem too good to be true or items priced significantly lower than market value.",
        "- Avoid Pre-Payments: Do not send any payments until you have met the seller and signed a purchase agreement.",
        "- Inspect Before Paying: Meet in a safe, public location and check the item thoroughly before making payment.",
        "- Pay Upon Satisfaction: Only pay when you are satisfied with the item and collect it immediately.",
      ],
      sellersToAvoid: {
        title: "Sellers to Avoid",
        points: [
          "- Request advance payment or a deposit before delivering the item.",
          "- Insist on meeting in a non-public location for delivery.",
          "- Ask for personal information such as your ID, bank details, or debit/credit card numbers.",
        ],
      },
    },
    sellersSafetyTips: {
      title: "Sellers’ Safety Tips",
      tips: [
        "- Collect Full Payment: Ensure you receive full payment before delivering any goods.",
        "- Deliver What You Advertised: Make sure the item you deliver matches the description in your ad.",
        "- Limit Financial Information Sharing: Only provide the necessary financial information required for payment.",
      ],
    },
    buyersToAvoid: {
      title: "Buyers to Avoid",
      points: [
        "- Insist on using a cheque.",
        "- Demand that you send the item before payment is made.",
        "- Request personal information such as your ID, bank details, or debit/credit card numbers.",
        "- Are located in foreign countries without a clear reason.",
      ],
    },
    contactUs: {
      title: "Contact Us",
      content: "If you have any questions or need further assistance, please contact us at support@crownlist.com.",
    },
  };

  const renderList = (items: string[]) => (
    <ul className="ml-8 space-y-2 text-gray-600 list-disc">
      {items.map((item, idx) => (
        <li key={idx}>{item.replace(/^- /, '')}</li>
      ))}
    </ul>
  );

  return (
    <div className="flex flex-col w-full">
      <div className="bg-[#1F058F] text-white py-8 px-4">
        <div className="flex flex-col items-center justify-center text-center gap-3">
          <div className="text-sm text-white max-sm:text-[#52a9ff]">Stay Safe on Crownlist</div>
          <div className="font-semibold md:text-3xl">Safety Tips</div>
          <p className="font-light max-w-3xl">{safetyTips.introduction}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <section>
          <h2 className="text-[#1F058F] font-semibold mb-2">{safetyTips.generalSafetyTips.title}</h2>
          {renderList(safetyTips.generalSafetyTips.tips)}
        </section>

        <section>
          <h2 className="text-[#1F058F] font-semibold mb-2">{safetyTips.buyersSafetyTips.title}</h2>
          {renderList(safetyTips.buyersSafetyTips.tips)}
        </section>

        <section>
          <h2 className="text-[#1F058F] font-semibold mb-2">{safetyTips.buyersSafetyTips.sellersToAvoid.title}</h2>
          {renderList(safetyTips.buyersSafetyTips.sellersToAvoid.points)}
        </section>

        <section>
          <h2 className="text-[#1F058F] font-semibold mb-2">{safetyTips.sellersSafetyTips.title}</h2>
          {renderList(safetyTips.sellersSafetyTips.tips)}
        </section>

        <section>
          <h2 className="text-[#1F058F] font-semibold mb-2">{safetyTips.buyersToAvoid.title}</h2>
          {renderList(safetyTips.buyersToAvoid.points)}
        </section>

        <section>
          <h2 className="text-[#1F058F] font-semibold mb-2">{safetyTips.contactUs.title}</h2>
          <p className="text-gray-600">{safetyTips.contactUs.content}</p>
        </section>
      </div>
    </div>
  );
};

export default Safety;
