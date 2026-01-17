import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/**/*": ["./prisma/generated/**/*"],
  },
};

export default nextConfig;
