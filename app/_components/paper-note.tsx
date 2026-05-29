"use client";

import { Fragment, useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Essay } from "@/lib/types";
import { authorOf, bookOf, formatDate, isAnonymous, toLines } from "@/lib/format";
import { paperStyleFor } from "@/lib/paper-style";
import { removeEntry } from "@/app/actions/essays";
import { PaperClip } from "./paper-clip";

export function PaperNote({
  essay,
  onEdit,
}: {
  essay: Essay;
  onEdit: (essay: Essay) => void;
}) {
  const style = paperStyleFor(essay);
  const lines = toLines(essay.content);
  const [removing, setRemoving] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("撕掉这一页？")) return;
    setRemoving(true);
    // let the tear animation play, then commit
    setTimeout(() => {
      startTransition(async () => {
        const res = await removeEntry(essay.id);
        if (!res.ok) {
          setRemoving(false);
          alert(res.error);
        }
      });
    }, 280);
  }

  const longText = essay.content.length > 90;
  const author = authorOf(essay);
  const book = bookOf(essay);
  const date = formatDate(essay.created_at);
  const anon = isAnonymous(essay);
  const onSticky = style.variant === "sticky";

  return (
    <div
      className={[
        "group relative mb-7 break-inside-avoid",
        removing ? "is-removing" : "settle-in",
      ].join(" ")}
      style={{ ["--tilt" as string]: `${style.tilt}deg` }}
    >
      <div
        className={`paper paper--${style.variant} group-hover:-translate-y-1`}
        style={{
          transform: `rotate(${style.tilt}deg)`,
          padding: style.variant === "sticky" ? "1.75rem 1.5rem" : "2.5rem 2rem 2rem",
        }}
      >
        {style.variant === "ruled" && <span className="paper-margin" />}

        {/* Fastener */}
        {style.tape === "clip" ? (
          <PaperClip className="absolute -top-3 right-6 z-10 drop-shadow-sm" />
        ) : style.tape !== "none" ? (
          <span className={`tape ${style.tape}`} />
        ) : null}

        {/* Title (kept rare — only when present) */}
        {essay.title?.trim() ? (
          <h3 className="handwriting mb-2 text-lg tracking-wide text-ink-faint">
            {essay.title}
          </h3>
        ) : null}

        {/* The writing */}
        <div
          className={[
            "handwriting",
            style.ink,
            longText
              ? "text-[1.35rem] leading-[1.95]"
              : "text-[1.7rem] leading-[1.85]",
            style.variant === "ruled" ? "pl-6" : "",
          ].join(" ")}
        >
          {lines.map((line, i) => (
            <Fragment key={i}>
              {line.length === 0 ? (
                <span className="block h-5" aria-hidden />
              ) : (
                <p>{line}</p>
              )}
            </Fragment>
          ))}
        </div>

        {/* Footer: date + attribution (author / source shown separately) */}
        <div
          className={[
            "handwriting mt-6 flex items-end justify-between gap-3",
            onSticky ? "text-ink-soft/80" : "text-ink-faint",
          ].join(" ")}
        >
          {/* date — like a diary stamp */}
          <time
            className="shrink-0 text-base tracking-wide"
            dateTime={essay.created_at}
          >
            {date}
          </time>

          {/* author + source */}
          <div className="min-w-0 text-right leading-snug">
            {anon ? (
              <span className="text-lg">佚名</span>
            ) : (
              <>
                {author ? (
                  <div className="truncate text-lg text-ink-soft">
                    {author}
                  </div>
                ) : null}
                {book ? (
                  <div className="truncate text-base text-ink-faint">
                    《{book}》
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>

        {/* Hover actions */}
        <div className="absolute right-2 bottom-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(essay)}
            aria-label="修改"
            className="rounded-full bg-white/70 p-1.5 text-ink-soft backdrop-blur-sm hover:bg-white hover:text-ink"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            aria-label="撕掉"
            className="rounded-full bg-white/70 p-1.5 text-ink-soft backdrop-blur-sm hover:bg-white hover:text-seal disabled:opacity-50"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
