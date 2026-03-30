import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@takumi-rs/core", "@takumi-rs/wasm"],
};

export default nextConfig;
