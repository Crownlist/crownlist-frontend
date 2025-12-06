import React from "react";

interface SafetyTipsSectionProps {
  className?: string;
}

export const SafetyTipsSection: React.FC<SafetyTipsSectionProps> = ({
  className = "",
}) => {
  const safetyTips = [
    "Do not send money or personal information until you've seen the product.",
    "Meet the seller in a safe and public location.",
    "Inspect the product thoroughly before payment.",
    "Avoid deals that seem too good to be true.",
    "Use secure payment methods; avoid cash for high-value items.",
  ];

  return (
    <div className={`mt-8 bg-[#1f058f] text-white p-6 rounded-lg ${className}`}>
      <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
        🛡️ Safety Tips
      </h3>
      <ul className="space-y-3">
        {safetyTips.map((tip, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <span className="text-lg">
              {index === 0 && "🚫💸"}
              {index === 1 && "📍"}
              {index === 2 && "🔍"}
              {index === 3 && "⚠️"}
              {index === 4 && "💳"}
            </span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
