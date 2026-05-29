"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Essay } from "@/lib/types";
import { PaperNote } from "./paper-note";
import { NoteEditor } from "./note-editor";

export function Board({ essays }: { essays: Essay[] }) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Essay | null>(null);

  function openNew() {
    setEditing(null);
    setEditorOpen(true);
  }
  function openEdit(essay: Essay) {
    setEditing(essay);
    setEditorOpen(true);
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
            <PaperNote key={essay.id} essay={essay} onEdit={openEdit} />
          ))}
        </div>
      )}

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
      />
    </>
  );
}
