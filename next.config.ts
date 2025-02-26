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
};

export default nextConfig;
