"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import type { Essay } from "@/lib/types";
import { fetchEssaysPage } from "@/app/actions/essays";
import { PaperNote } from "./paper-note";
import { NoteEditor } from "./note-editor";

export function Board({
  initialEssays,
  initialHasMore,
  pageSize,
}: {
  initialEssays: Essay[];
  initialHasMore: boolean;
  pageSize: number;
}) {
  const [essays, setEssays] = useState<Essay[]>(initialEssays);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Essay | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  // Guards against overlapping loads triggered by the observer.
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const next = page + 1;
      const { list, hasMore: more } = await fetchEssaysPage(next, pageSize);
      setEssays((prev) => {
        // Dedupe in case a mutation shifted items between pages.
        const seen = new Set(prev.map((e) => e.id));
        return [...prev, ...list.filter((e) => !seen.has(e.id))];
      });
      setPage(next);
      setHasMore(more);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [hasMore, page, pageSize]);

  // Observe the sentinel near the bottom of the list.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore, hasMore]);

  function openNew() {
    setEditing(null);
    setEditorOpen(true);
  }
  function openEdit(essay: Essay) {
    setEditing(essay);
    setEditorOpen(true);
  }

  function handleSaved(saved: Essay, isNew: boolean) {
    setEssays((prev) =>
      isNew
        ? [saved, ...prev]
        : prev.map((e) => (e.id === saved.id ? saved : e)),
    );
  }

  function handleDeleted(id: number) {
    setEssays((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <>
      {essays.length === 0 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
          <p className="handwriting text-4xl text-ink">本子还是空的</p>
          <p className="handwriting text-xl text-ink-soft/80">
            写下第一段值得留住的话。
          </p>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl gap-7 px-4 py-10 [column-fill:_balance] sm:columns-2 sm:px-8 lg:columns-3">
          {essays.map((essay) => (
            <PaperNote
              key={essay.id}
              essay={essay}
              onEdit={openEdit}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}

      {/* Infinite-scroll sentinel + loading hint */}
      {hasMore ? (
        <div
          ref={sentinelRef}
          className="flex items-center justify-center py-10"
        >
          {loading ? (
            <span className="handwriting flex items-center gap-2 text-xl text-ink-faint">
              <Loader2 className="size-5 animate-spin" />
              翻到下一页…
            </span>
          ) : null}
        </div>
      ) : essays.length > 0 ? (
        <p className="handwriting py-10 text-center text-lg text-ink-faint/70">
          到这里就翻完了
        </p>
      ) : null}

      {/* Write button — an ink pen waiting on the desk */}
      <button
        type="button"
        onClick={openNew}
        className="handwriting fixed right-6 bottom-6 z-40 flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xl text-paper shadow-[0_8px_24px_-6px_rgba(60,60,80,0.45)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
      >
        <Plus className="size-4" />
        写一段
      </button>

      <NoteEditor
        open={editorOpen}
        editing={editing}
        onClose={() => setEditorOpen(false)}
        onSaved={handleSaved}
      />
    </>
  );
}
