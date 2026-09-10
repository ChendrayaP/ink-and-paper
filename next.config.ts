import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Book covers and testimonial photos are served from Supabase Storage.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Studio cover / testimonial-photo uploads are validated at up to 5 MB
      // and travel in the Server Action body; the 1 MB default is too low.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
