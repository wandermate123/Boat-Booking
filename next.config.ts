import type { NextConfig } from "next";
import { SITE_BASE_PATH } from "./src/config/site";

const nextConfig: NextConfig = {
  basePath: SITE_BASE_PATH,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
