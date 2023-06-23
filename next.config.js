/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["winda-guide.s3.amazonaws.com"],
  },
};

module.exports = nextConfig;
