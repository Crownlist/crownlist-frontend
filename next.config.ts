/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // Or 'http' if needed, but 'https' is generally preferred
        hostname: "upload.wikimedia.org",
        // Optional: port: '', // If your images are served on a specific port
        // Optional: pathname: '/some-specific-path/**', // If you want to restrict to specific paths
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // port: '', // Leave empty if no specific port
        // pathname: '/duzrrmfci/image/upload/**', // This is the crucial part for Cloudinary
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
    ],
  },
};

module.exports = nextConfig;
