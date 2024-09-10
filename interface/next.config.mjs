/** @type {import('next').NextConfig} */
const nextConfig = {  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol:'https',
        hostname: '**.supabase.co',
        port: '443',
        pathname: '**',
      },
    ],
  },

};




export default nextConfig;
 