import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "hav-bucket-c.s3.amazonaws.com",
         },
         {
            protocol: "https",
            hostname: "images.pexels.com", 
          },
          {
            protocol: "https",
            hostname: "lh3.googleusercontent.com",
          },
      ],
   },

   env: {
      NEXT_PUBLIC_BASE_URL: "http://localhost:8082",
   },
   
   async rewrites() {
      return [
         {
            source: "/info",
            destination: "/404",
         },
      ];
   },
};

export default nextConfig;
