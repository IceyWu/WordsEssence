import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker 部署使用 standalone 输出：构建产物位于 .next/standalone，
  // 可脱离 node_modules 独立运行，便于生成最小镜像。
  output: "standalone",

  // 将后端 API / 文档路径反向代理到上游 Go 服务（wordsessence-server:5006），
  // 使 https://wd.levwu.me/api/v1/*、/docs、/swagger/* 可以直接访问。
  async rewrites() {
    const apiBase =
      process.env.API_BASE_URL?.replace(/\/$/, "") ?? "http://10.0.0.8:5006";
    return [
      { source: "/api/v1/:path*", destination: `${apiBase}/api/v1/:path*` },
      { source: "/docs/:path*", destination: `${apiBase}/docs/:path*` },
      { source: "/swagger/:path*", destination: `${apiBase}/swagger/:path*` },
    ];
  },

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
