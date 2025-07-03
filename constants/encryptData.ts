export const obfuscateToken = (mode: boolean, value: string) => {
  if (value) {
    if (mode) {
      // Using Base64 encoding algorithm
      const obfuscatedValue = btoa(value);
      return obfuscatedValue;
    } else {
      try {
        // Using Base64 decoding algorithm
        const decodingValue = atob(value);
        return decodingValue;
      } catch (error) {
        // Handle the decoding error gracefully
        console.error("Failed to decode the value:", error);
        return value;
      }
    }
  } else {
    return value;
  }
};
