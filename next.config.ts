import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: (() => {
      try {
        const storageUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
        return [{ protocol: "https" as const, hostname: storageUrl.hostname, pathname: "/storage/v1/object/sign/profile-avatars/**" }];
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
