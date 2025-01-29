/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '**',
      },
    ],
  },
  // Enable ISR for automatic content updates
  revalidate: 60, // Revalidate pages every 60 seconds
}

module.exports = nextConfig
