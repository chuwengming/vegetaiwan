import type { NextConfig } from "next";

const wordpressHost = process.env.WORDPRESS_HOST || "vege-taiwan.local";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/query": ["./knowledges/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: wordpressHost,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: wordpressHost,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.wordpress.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.w3.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
