/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: 'www.blissfulgal.com',
      },
      {
        protocol: 'https',
        hostname: 'img.staticdj.com',
      },
    ],
  },
};

module.exports = nextConfig;
