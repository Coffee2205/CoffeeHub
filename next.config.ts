import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: (() => {
      try {
        const storageUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
        return [
          {
            protocol: "https" as const,
            hostname: storageUrl.hostname,
            pathname: "/storage/v1/object/sign/profile-avatars/**",
          },
        ];
      } catch {
        return [];
      }
    })(),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
