import { Facility } from "../types";

/**
 * Stable key for facilities: prefer _id, fallback to label
 */
export const getFacilityKey = (f: Facility): string => {
  const id = (f._id || "").toString().trim();
  return id || f.label;
};

/**
 * Format facility value to string as per API sample
 */
export const formatFacilityValueForApi = (val: unknown): string => {
  if (Array.isArray(val)) {
    // Render like ['a', 'b'] using single quotes to match sample
    const inner = val.map((v) => `'${String(v)}'`).join(", ");
    return `[${inner}]`;
  }
  if (typeof val === "object" && val !== null) {
    return JSON.stringify(val);
  }
  return String(val);
};

/**
 * Get array options from facility value
 */
export const getArrayOptions = (facility: Facility): string[] => {
  const raw = facility.value as string | undefined;
  if (raw == null) return [];
  // Try JSON array first
  try {
    const parsed = JSON.parse(String(raw));
    if (Array.isArray(parsed))
      return parsed.map((x) => String(x)).filter(Boolean);
  } catch {}
  // Fallback: comma-separated string
  return String(raw)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

/**
 * Format number input with commas
 */
export const formatNumberInput = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString();
};

/**
 * Parse formatted number string back to number
 */
export const parseFormattedNumber = (val: string) => {
  const n = Number(String(val || "").replace(/,/g, ""));
  return isFinite(n) ? n : 0;
};

/**
 * Coerce facility value based on data type
 */
export const coerceFacilityValue = (
  v: unknown,
  type: string,
  selectType?: string
) => {
  if (v == null) return v;
  if (type === "boolean")
    return Boolean(
      v === true || v === "true" || v === 1 || v === "1" || v === "yes"
    );
  if (type === "number") {
    const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
    return Number.isNaN(n) ? undefined : n;
  }
  if (type === "array") {
    if (Array.isArray(v)) return v;
    if (typeof v === "string") {
      const s = v.trim();
      if (s.startsWith("[") && s.endsWith("]")) {
        try {
          const jsonish = s.replace(/'/g, '"');
          const arr = JSON.parse(jsonish);
          if (Array.isArray(arr)) return arr;
        } catch {}
      }
      // For single selectType, keep string as-is; for multiple, wrap in array
      return selectType === "multiple" ? [v] : v;
    }
  }
  return v;
};
