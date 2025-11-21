/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { 
            key: 'Cache-Control', 
            value: 'public, s-maxage=60, stale-while-revalidate=120' 
          },
        ],
      },
    ];
  },
}

export default nextConfig
