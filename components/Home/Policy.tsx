
"use client"


import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";

const privacyPolicy = {
  lastUpdated: '20 Jan 2025',
  introduction: `At CROWNLIST, accessible from [yourwebsite.com], we prioritize the privacy of our users. This Privacy Policy outlines the types of information we collect, how we use and share that information, and your rights regarding your personal data.`,
  consent: {
    title: 'Consent',
    content: 'By using our platform, you consent to our Privacy Policy and agree to its terms.',
  },
  informationWeCollect: {
    title: 'What information do we collect?',
    content: 'We collect several types of information from and about users of our platform, including:',
    types: [
      {
        id: 1,
        title: 'Personal Information',
        details: [
          '- Information that can identify you, such as your name, email address, phone number, and postal address.',
          '- Information you provide when creating an account or posting ads.',
        ],
      },
      {
        id: 2,
        title: 'Automatically Collected Information',
        details: [
          '- Usage details, IP addresses, browser type, and operating system.',
          '- Information collected through cookies and similar technologies.',
        ],
      },
      {
        id: 3,
        title: 'User Contribution',
        details: [
          '- Information you provide in public areas of the platform, including advertisements and messages.',
        ],
      },
    ],
  },
  howWeUseYourInformation: {
    title: 'How do we use your information?',
    content: 'We may use the information we collect for various purposes, including to:',
    uses: [
      '- Provide, operate, and maintain our platform.',
      '- Improve, personalize, and expand our services.',
      '- Communicate with you about your account and provide customer support.',
      '- Send you marketing communications and updates.',
      '- Analyze usage and trends to enhance user experience.',
    ],
  },
  disclosureOfYourInformation: {
    title: 'How long do we keep your information?',
    content: 'We may share your information with:',
    recipients: [
      '- Service providers and partners who assist in our operations.',
      '- Law enforcement agencies if required by law.',
      '- Third parties in the event of a merger, acquisition, or sale of assets.',
    ],
  },
  cookiesAndTrackingTechnologies: {
    title: 'Do we use cookies and other tracking technologies?',
    content:
      'CROWNLIST uses cookies and similar tracking technologies to enhance user experience. You can manage cookie preferences through your browser settings.',
  },
  dataSecurity: {
    title: 'How do we keep your information safe?',
    content:
      'We implement security measures to protect your personal information from unauthorized access, use, alteration, and disclosure. However, no method of transmission over the internet is completely secure.',
  },
  yourRights: {
    title: 'What are your privacy rights?',
    content: 'You have the following rights regarding your personal data:',
    rights: [
      { name: 'Access', description: 'Request copies of your personal data.' },
      { name: 'Rectification', description: 'Request correction of inaccurate information.' },
      { name: 'Erasure', description: 'Request deletion of your personal data under certain conditions.' },
      { name: 'Restriction', description: 'Request restriction of processing your personal data.' },
      { name: 'Objection', description: 'Object to the processing of your personal data.' },
      { name: 'Data Portability', description: 'Request transfer of your personal data to another organization.' },
    ],
    contactToExerciseRights: 'To exercise these rights, please contact us at [support@crownlist.com].',
  },
  childrensInformation: {
    title: "Children's Information",
    content:
      'CROWNLIST does not knowingly collect personal information from children under the age of 13. If you believe we have collected such information, please contact us immediately.',
  },
  changesToThisPrivacyPolicy: {
    title: 'Changes to This Privacy Policy',
    content:
      'We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we encourage you to review it periodically.',
  },
  contactUs: {
    title: 'How can you contact us about this policy?',
    content: 'For questions or concerns regarding this Privacy Policy, please contact us at [support@crownlist.com].',
  },
};

const Policy = () => {

  const pathname = usePathname();
  return (
    <div className='flex flex-col w-full mt-10'>

       <div className="flex flex-col items-center text-center mb-10">
        <div className="bg-[#f2e9ff] text-[#6941c6] px-3 py-1 rounded-full text-sm font-medium mb-4">Legal</div>
        <h2 className="text-4xl font-bold mb-2">We care about your well-being</h2>
        <p className="text-gray-600 max-w-xl">
          Your privacy is important to us at Untitled. We respect your privacy regarding any information we may collect from you across our website.{" "}
      
        </p>
      </div>

      <div className="flex justify-center mb-10">
        <div className="flex bg-gray-100   rounded-md py-1 px-2 shadow-sm border">
          <Link
            href="/privacy"
            className={`px-6 py-2 border rounded-md text-sm font-medium transition-colors ${
              pathname === "/privacy-policy"
                ? "bg-white  text-[#6941c6]"
                : "text-gray-800 hover:text-gray-900"
            }`}
          >
            Privacy
          </Link>
          <Link
            href="/terms-and-conditions"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              pathname === "/terms-and-conditions"
                ? "bg-white text-[#6941c6]"
                : "text-gray-800 hover:text-gray-900"
            }`}
          >
            Terms
          </Link>
        </div>
      </div>



      {/* <div className='bg-[#1F058F]'>
        <div className='flex items-center justify-center p-4 text-white py-8 text-center'>
          <div className='flex flex-col items-center gap-3'>
            <div className='text-sm max-sm:text-[#52a9ff]'>Current as of {privacyPolicy.lastUpdated}</div>
            <div className='font-semibold md:text-3xl'>Privacy Policy</div>
            <p className='font-light lg:px-45 px-1 md:max-w-[70vw]'>{privacyPolicy.introduction}</p>
          </div>
        </div>
      </div> */}

      <div className='max-w-4xl mx-auto p-6 space-y-8'>
        {/* Consent */}
        <Section index={1} title={privacyPolicy.consent.title} content={<p>{privacyPolicy.consent.content}</p>} />

        {/* Information We Collect */}
        <Section 
          index={2}
          title={privacyPolicy.informationWeCollect.title}
          content={
           
            <>
              <p className='ml-6 text-gray-600 '>{privacyPolicy.informationWeCollect.content}</p>
              <ul className='ml-12 space-y-2 text-gray-600 list-disc'>
                {privacyPolicy.informationWeCollect.types.map((type) => (
                  <li key={type.id}>
                    <strong >{type.title}</strong>
                    <ul className='ml-6 list-disc'>
                      {type.details.map((detail, i) => (
                        <li key={i}>{detail.replace(/^-\s*/, '')}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </>
          }
        />

        {/* How We Use */}
        <Section
          index={3}
          title={privacyPolicy.howWeUseYourInformation.title}
          content={
            <>
              <p className='ml-6 text-gray-600'>{privacyPolicy.howWeUseYourInformation.content}</p>
              <ul className='ml-12 list-disc text-gray-600'>
                {privacyPolicy.howWeUseYourInformation.uses.map((use, i) => (
                  <li key={i}>{use.replace(/^-\s*/, '')}</li>
                ))}
              </ul>
            </>
          }
        />

        {/* Disclosure */}
        <Section
          index={4}
          title={privacyPolicy.disclosureOfYourInformation.title}
          content={
            <>
              <p className='ml-6 text-gray-600'>{privacyPolicy.disclosureOfYourInformation.content}</p>
              <ul className='ml-12 list-disc text-gray-600'>
                {privacyPolicy.disclosureOfYourInformation.recipients.map((item, i) => (
                  <li key={i}>{item.replace(/^-\s*/, '')}</li>
                ))}
              </ul>
            </>
          }
        />

        {/* Other Sections */}
        {[
          privacyPolicy.cookiesAndTrackingTechnologies,
          privacyPolicy.dataSecurity,
          {
            ...privacyPolicy.yourRights,
            content: (
              <>
                <p className='ml-6 text-gray-600'>{privacyPolicy.yourRights.content}</p>
                <ul className='ml-12 list-disc text-gray-600'>
                  {privacyPolicy.yourRights.rights.map((right, i) => (
                    <li key={i}>
                      <strong>{right.name}:</strong> {right.description}
                    </li>
                  ))}
                </ul>
                <p className='ml-6 text-gray-600 mt-2'>{privacyPolicy.yourRights.contactToExerciseRights}</p>
              </>
            ),
          },
          // privacyPolicy.childrensInformation,
          // privacyPolicy.changesToThisPrivacyPolicy,
          privacyPolicy.contactUs,
        ].map((section, idx) => (
          <Section key={idx} index={5 + idx} title={section.title} content={<p>{section.content}</p>} />
        ))}
      </div>
    </div>
  );
};

const Section = ({
 
  title,
  content,
}: {
  index: number;
  title: string;
  content: React.ReactNode;
}) => (
  <section className='space-y-4'>
    <div className='flex gap-2'>
      {/* <span className='text-[#52a9ff]'>{index}.</span> */}
      <h2 className='font-bold text-xl md:3xl'>{title}</h2>
    </div>
    <div>{content}</div>
  </section>
);

export default Policy;
