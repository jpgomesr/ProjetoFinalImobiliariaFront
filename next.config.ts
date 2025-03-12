import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "hav-bucket-c.s3.amazonaws.com",
         },
      ],
   },
   env: {
      NEXT_PUBLIC_BASE_URL: "http://localhost:8082",
   },
};

export default nextConfig;
