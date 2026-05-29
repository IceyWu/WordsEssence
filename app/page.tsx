import { Suspense } from "react";
import { listEssays } from "@/lib/api";
import { SiteHeader } from "./_components/site-header";
import { Board } from "./_components/board";

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
  const { list } = await listEssays({ sort: "id,desc", page_size: 1000 });
  return (
    <div className="relative z-10">
      <SiteHeader count={list.length} />
      <Board essays={list} />
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
