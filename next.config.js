/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig

module.exports = {
  experimental: {
    images: { 
      allowFutureImage: true 
    } 
  },
  future: {
    webpack5: true,
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  }
  
};
