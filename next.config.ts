import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker 部署使用 standalone 输出：构建产物位于 .next/standalone，
  // 可脱离 node_modules 独立运行，便于生成最小镜像。
  output: "standalone",

  // Enables `use cache`, cacheLife/cacheTag and Partial Prerendering so the
  // reading view streams from a cached static shell. See lib/api.ts.
  cacheComponents: true,
  experimental: {
    serverActions: {
      // OCR images are sent through a Server Action; allow up to the API's
      // 20MB image limit (plus a little overhead).
      bodySizeLimit: "24mb",
    },
  },
};

export default nextConfig;
