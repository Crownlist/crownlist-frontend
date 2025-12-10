import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
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

export const ProductAccordion: React.FC<ProductAccordionProps> = ({
  product,
}) => {
  const facilities = product.facility?.facilities || [];
  const features = product.features || [];
  const description = product.description || "";

  return (
    <div className="space-y-0 divide-y divide-gray-200">
      <Accordion
        type="single"
        collapsible
        defaultValue="description"
        className="w-full px-2"
      >
        {/* Description Section */}
        {description && (
          <AccordionItem value="description" className="border-none">
            <AccordionTrigger className="hover:no-underline py-4 px-0 text-base font-semibold hover:text-blue-600">
              Description
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-gray-700 text-sm leading-relaxed">
              {description}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Specifications Section */}
        {(features.length > 0 || facilities.length > 0) && (
          <AccordionItem value="specs" className="border-none">
            <AccordionTrigger className="hover:no-underline py-4 px-0 text-base font-semibold hover:text-blue-600">
              Specifications
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              {features.length > 0 && (
                <div>
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
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Facilities</h4>
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
                              {item.value || item.detail || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Product Details Section */}
        <AccordionItem value="details" className="border-none">
          <AccordionTrigger className="hover:no-underline py-4 px-0 text-base font-semibold hover:text-blue-600">
            Product Details
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-3">
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
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
