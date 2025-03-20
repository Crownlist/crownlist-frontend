/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["upload.wikimedia.org", "flagcdn.com"], // Add external image domain
  },
};

module.exports = nextConfig;
