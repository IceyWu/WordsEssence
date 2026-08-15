# ---------------------------------------------------------------------------
# 言摘（WordsEssence）Docker 镜像
# 应用直接监听 5005，容器内外端口一致，无需再做宿主机端口映射。
# 配合 next.config.ts 中的 output: "standalone" 生成最小运行镜像。
# ---------------------------------------------------------------------------

# ---------- 1. 依赖层：安装依赖，利用 Docker 层缓存 ----------
# 基础镜像走 DaoCloud 加速（宿主机直连 Docker Hub 会超时）
FROM docker.m.daocloud.io/library/node:24-alpine AS deps
# 使用国内 npm 镜像：corepack 下载 pnpm 与 pnpm 安装依赖均走该源
ENV COREPACK_NPM_REGISTRY=https://registry.npmmirror.com
RUN corepack enable && corepack prepare pnpm@11.0.9 --activate
WORKDIR /app

# 先只复制依赖清单，保证依赖变化前该层可复用
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm config set registry https://registry.npmmirror.com \
    && pnpm install --frozen-lockfile

# ---------- 2. 构建层：编译 Next.js 应用 ----------
FROM docker.m.daocloud.io/library/node:24-alpine AS builder
ENV COREPACK_NPM_REGISTRY=https://registry.npmmirror.com
RUN corepack enable && corepack prepare pnpm@11.0.9 --activate
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# ---------- 3. 运行层：最小化产物 ----------
FROM docker.m.daocloud.io/library/node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# 直接监听 5005（Cloudflare Tunnel 路由 wd.levwu.me -> http://localhost:5005）
ENV PORT=5005
ENV HOSTNAME=0.0.0.0

# 使用非 root 用户运行
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# standalone 产物 + 静态资源 + 公共目录
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 5005

CMD ["node", "server.js"]
