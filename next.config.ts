import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.GITHUB_PAGES === "true" ? {
    output: "export",
    basePath: "/BearToys",
    trailingSlash: true,
    images: { unoptimized: true },
  } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: process.env.GITHUB_PAGES === "true" ? "/BearToys" : "" },
};

export default nextConfig;
