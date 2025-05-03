"use client"

import { termsAndConditions } from "@/lib/mockData"


export default function TermsAndConditions() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <div className="bg-[#1F058F] text-white py-10 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="text-sm text-[#52a9ff]">Current as of 20 May 2025</div>
          <h1 className="text-3xl font-bold">Terms and Conditions</h1>
          <p className="text-sm md:text-base font-light">
            By accessing our website, you are agreeing to be bound by these terms of service,
            all applicable laws and regulations, and agree that you are responsible for
            compliance with any applicable local laws.
          </p>
        </div>
      </div>

      {/* Terms Section */}
      <div className="max-w-4xl mx-auto w-full px-4 py-10 space-y-8">
        <h2 className="text-2xl font-semibold text-gray-800">Terms and Conditions of Use</h2>

        {termsAndConditions.map((section) => (
          <div
            key={section.id}
            className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 space-y-4"
          >
            <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
            <p className="text-gray-700 leading-relaxed">{section.content}</p>

            {/* Subsections */}
            {section.subSections && section.subSections.length > 0 && (
              <div className="space-y-2">
                {section.subSections.map((sub) => (
                  <div key={sub.id}>
                    <h4 className="font-medium text-gray-800">{sub.title}</h4>
                    <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                      {sub.content
                        .split("- ")
                        .filter((item) => item.trim() !== "")
                        .map((item, index) => (
                          <li key={index}>{item.trim()}</li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
