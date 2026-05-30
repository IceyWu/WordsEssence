import { Suspense } from "react";
import { listEssaysLive } from "@/lib/api";
import { Board } from "./_components/board";

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
  // Live read (no-store): a full refresh always shows the latest entries.
  const { list, page, total_pages } = await listEssaysLive({
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
