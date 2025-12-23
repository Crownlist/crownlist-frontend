/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { ServerProductData } from "@/lib/server/product-service";

interface FacilityItem {
  label?: string;
  value?: string;
  facility?: string;
  detail?: string;
}

interface ProductAccordionProps {
  product: ServerProductData;
}

interface ExpandedSections {
  description: boolean;
  features: boolean;
  facilities: boolean;
}

export const ProductAccordion: React.FC<ProductAccordionProps> = ({
  product,
}) => {
  const facilities = product.facility?.facilities || [];
  const features = product.features || [];
  const description = product.description || "";

  const [expanded, setExpanded] = useState<ExpandedSections>({
    description: false,
    features: false,
    facilities: false,
  });

  const toggleExpand = (section: keyof ExpandedSections) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const MAX_LINES = 3;

  const isLongText = (text: string): boolean => {
    const lineCount = text.split("\n").length;
    return lineCount > MAX_LINES || text.length > 200;
  };

  const parseValue = (value: any): string[] => {
    if (!value) return [];

    // Handle boolean values
    if (typeof value === "boolean") {
      return [value ? "Yes" : "No"];
    }

    // If it's already an array, use it
    if (Array.isArray(value))
      return value.map((item) => {
        // Handle boolean items in arrays
        if (typeof item === "boolean") return item ? "Yes" : "No";
        // Handle string 'true'/'false'
        if (item === "true" || item === "false")
          return item === "true" ? "Yes" : "No";
        return String(item);
      });

    // If it's a string that looks like an array (e.g., "['value']" or "['val1', 'val2']")
    const str = String(value).trim();
    if (
      (str.startsWith("[") && str.endsWith("]")) ||
      (str.startsWith("['") && str.endsWith("']"))
    ) {
      try {
        // Remove the brackets and single quotes, then split by comma
        const cleaned = str.replace(/^\[|\]$/g, "").replace(/'/g, '"');
        const parsed = JSON.parse(`[${cleaned}]`);
        return parsed
          .map((item: any) => {
            // Handle boolean items in parsed arrays
            if (typeof item === "boolean") return item ? "Yes" : "No";
            if (item === "true" || item === "false")
              return item === "true" ? "Yes" : "No";
            return String(item);
          })
          .filter(Boolean);
      } catch {
        // If parsing fails, try simple regex approach
        const matches = str.match(/'([^']*)'/g) || str.match(/"([^"]*)"/g);
        if (matches) {
          return matches.map((m) => {
            const cleaned = m.replace(/['\"]/g, "");
            if (cleaned === "true" || cleaned === "false")
              return cleaned === "true" ? "Yes" : "No";
            return cleaned;
          });
        }
      }
    }

    // Handle string 'true'/'false'
    if (str === "true" || str === "false") {
      return [str === "true" ? "Yes" : "No"];
    }

    return [str];
  };

  const renderFacilityValue = (value: any) => {
    const values = parseValue(value);

    if (values.length === 0) return "—";
    if (values.length === 1) return values[0];

    return (
      <div className="flex flex-wrap gap-2">
        {values.map((val, idx) => (
          <span
            key={idx}
            className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
          >
            {val}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-2">
      {/* Description Section */}
      {description && (
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            Description
          </h3>
          <div
            className={`text-gray-700 text-sm leading-relaxed transition-all ${
              expanded.description ? "" : "line-clamp-3"
            }`}
          >
            {description}
          </div>
          {isLongText(description) && (
            <button
              onClick={() => toggleExpand("description")}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold mt-2"
            >
              {expanded.description ? "Read Less" : "Read More"}
            </button>
          )}
        </div>
      )}

      {/* Specifications Section */}
      {(features.length > 0 || facilities.length > 0) && (
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            Specifications
          </h3>

          {features.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Features</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span className="text-blue-500 font-bold">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {facilities.length > 0 && (
            <div
              className={`transition-all ${
                expanded.facilities ? "" : "max-h-96 overflow-hidden"
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 border border-gray-200">
                      <th className="px-4 py-2 text-left font-medium text-gray-900">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-900">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {facilities.map((item: FacilityItem, index: number) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-2 text-gray-700 font-medium">
                          {item.label || item.facility || "—"}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {renderFacilityValue(item.value || item.detail)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {facilities.length > 5 && (
                <button
                  onClick={() => toggleExpand("facilities")}
                  className="text-blue-600 hover:text-blue-700 text-sm font-semibold mt-2"
                >
                  {expanded.facilities ? "See Less" : "See More"}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Product Details Section */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Product Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {product.condition && (
            <div>
              <p className="text-xs uppercase text-gray-600 font-semibold mb-1">
                Condition
              </p>
              <p className="text-sm text-gray-900 font-medium">
                {product.condition}
              </p>
            </div>
          )}
          {product.listingLocation?.city && (
            <div>
              <p className="text-xs uppercase text-gray-600 font-semibold mb-1">
                Location
              </p>
              <p className="text-sm text-gray-900 font-medium">
                {product.listingLocation.city}
                {product.listingLocation.country &&
                  `, ${product.listingLocation.country}`}
              </p>
            </div>
          )}
          {product.createdAt && (
            <div>
              <p className="text-xs uppercase text-gray-600 font-semibold mb-1">
                Posted
              </p>
              <p className="text-sm text-gray-900 font-medium">
                {format(new Date(product.createdAt), "do MMM. yyyy")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
