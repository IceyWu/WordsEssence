import { Suspense } from "react";
import { listEssays } from "@/lib/api";
import { Board } from "./_components/board";

// 首页数据来自上游 Essays API，构建容器内无法访问（127.0.0.1:6002）。
// 强制动态渲染，避免 next build 预渲染首页时因上游 404 而失败。
export const dynamic = "force-dynamic";

export const PAGE_SIZE = 30;

export default function Home() {
  return (
    <div className="desk min-h-dvh">
      <Suspense fallback={<DeskSkeleton />}>
        <Scene />
      </Suspense>
    </div>
  );
}

async function Scene() {
  const { list, page, total_pages } = await listEssays({
    sort: "id,desc",
    page: 1,
    page_size: PAGE_SIZE,
  });
  return (
    <div className="relative z-10">
      <Board
        initialEssays={list}
        initialHasMore={page < total_pages}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}

function DeskSkeleton() {
  return (
    <div className="relative z-10 px-4 py-16">
      <div className="mx-auto h-12 w-48 animate-pulse rounded-md bg-paper/40" />
      <div className="mx-auto mt-10 grid max-w-6xl gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-sm bg-paper/50 shadow-lg"
            style={{ transform: `rotate(${(i % 3) - 1}deg)` }}
          />
        ))}
      </div>
    </div>
  );
}
