import React from "react";

// Helper function to parse facility values that might be array strings
const parseFacilityValue = (value: string) => {
  try {
    // Check if it's a string representation of an array like "['Red']"
    if (value.startsWith("[") && value.endsWith("]")) {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.join(", ");
      }
    }
    return value;
  } catch {
    return value;
  }
};

interface Facility {
  label: string;
  value: string;
}

interface FacilitiesRendererProps {
  facilities: Facility[];
  maxDisplay?: number;
}

export const FacilitiesRenderer: React.FC<FacilitiesRendererProps> = ({
  facilities,
  maxDisplay,
}) => {
  return (
    <>
      {facilities
        .slice(0, maxDisplay || facilities.length)
        .map((facility, index) => {
          if (facility.label.toLowerCase().includes("color")) {
            try {
              // Parse the color values if it's an array string
              let colors: string[] = [];
              if (
                facility.value.startsWith("[") &&
                facility.value.endsWith("]")
              ) {
                const parsedValue = facility.value.replace(/'/g, '"');
                colors = JSON.parse(parsedValue);
                if (!Array.isArray(colors)) colors = [facility.value];
              } else {
                colors = facility.value.split(",").map((c: string) => c.trim());
              }

              const displayColors = colors.slice(0, 2);
              const remaining = colors.length - 2;

              return (
                <div key={index} className="flex gap-1 mb-2">
                  {displayColors.map((color: string, colorIndex: number) => (
                    <span
                      key={colorIndex}
                      className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 w-fit rounded-full"
                    >
                      {color}
                    </span>
                  ))}
                  {remaining > 0 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{remaining} more
                    </span>
                  )}
                </div>
              );
            } catch {
              // Fallback if parsing fails
              return (
                <div
                  key={index}
                  className="text-xs bg-gray-300 px-2 py-1 w-fit rounded-full"
                >
                  {facility.label}: {parseFacilityValue(facility.value)}
                </div>
              );
            }
          } else {
            return (
              <div
                key={index}
                className={`text-xs bg-gray-200 items-center flex mt-0.5 truncate w-fit px-2 py-1 rounded-full ${
                  facility.label.toLowerCase().includes("size")
                    ? "px-2.5 py-1 text-center"
                    : ""
                }`}
              >
                {facility.label}: {parseFacilityValue(facility.value)}
              </div>
            );
          }
        })}
      {maxDisplay && facilities.length > maxDisplay && (
        <span className="text-xs text-gray-500 px-2 py-1">
          +{facilities.length - maxDisplay} more
        </span>
      )}
    </>
  );
};
