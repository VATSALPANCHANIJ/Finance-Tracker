/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol:"https",
        hostname: "media-bom1-1.cdn.whatsapp.net",
      },
    ],
  },
};

export default nextConfig;
