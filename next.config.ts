import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.GREYVOICE_DEPLOY_TARGET === "dev2" ? "export" : undefined,
};

export default nextConfig;
