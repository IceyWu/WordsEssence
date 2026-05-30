"use client";

import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type ClipboardEvent,
} from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import type { Essay } from "@/lib/types";
import { addEntry, editEntry } from "@/app/actions/essays";
import { recognizeImage } from "@/app/actions/ocr";

/**
 * A writing slip. Slides up from the bottom. The textarea uses the same
 * handwriting font so composing feels like writing on the page itself.
 *
 * Supports image-to-text: upload or paste an image and the AI OCR service
 * extracts the words straight into the page.
 */
export function NoteEditor({
  open,
  editing,
  onClose,
  onSaved,
}: {
  open: boolean;
  editing: Essay | null;
  onClose: () => void;
  onSaved?: (essay: Essay, isNew: boolean) => void;
}) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [ocrBusy, setOcrBusy] = useState(false);
  const [pending, startTransition] = useTransition();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Reset fields whenever the editor opens (new vs. editing).
  useEffect(() => {
    if (open) {
      setContent(editing?.content ?? "");
      setError("");
      setOcrBusy(false);
      const t = setTimeout(() => contentRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [open, editing]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function appendText(text: string) {
    setContent((prev) => {
      const trimmed = prev.replace(/\s+$/, "");
      return trimmed ? `${trimmed}\n${text}` : text;
    });
  }

  function runOcr(file: File) {
    setError("");
    setOcrBusy(true);
    const form = new FormData();
    form.append("image", file);
    startTransition(async () => {
      const res = await recognizeImage(form);
      setOcrBusy(false);
      if (res.ok) {
        appendText(res.text);
        // focus + move caret to end after injecting
        requestAnimationFrame(() => {
          const el = contentRef.current;
          if (el) {
            el.focus();
            el.selectionStart = el.selectionEnd = el.value.length;
          }
        });
      } else {
        setError(res.error);
      }
    });
  }

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) runOcr(file);
    e.target.value = ""; // allow re-picking the same file
  }

  function handlePaste(e: ClipboardEvent<HTMLTextAreaElement>) {
    const item = Array.from(e.clipboardData.items).find((i) =>
      i.type.startsWith("image/"),
    );
    if (item) {
      const file = item.getAsFile();
      if (file) {
        e.preventDefault();
        runOcr(file);
      }
    }
  }

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const res = editing
        ? await editEntry(editing.id, formData)
        : await addEntry(formData);
      if (res.ok) {
        if (res.essay) onSaved?.(res.essay, !editing);
        onClose();
      } else {
        setError(res.error);
      }
    });
  }

  const busy = pending || ocrBusy;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* dim the desk */}
      <button
        type="button"
        aria-label="关闭"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />

      <div
        className="paper paper--cream settle-in relative z-10 m-4 w-full max-w-lg p-7 sm:p-8"
        style={{ ["--tilt" as string]: "-0.6deg" }}
      >
        <span className="tape tape--amber" />

        <div className="mb-4 flex items-center justify-between">
          <h2 className="handwriting text-3xl text-ink">
            {editing ? "修改这一页" : "写下一段"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="rounded-full p-1 text-ink-faint hover:text-ink"
          >
            <X className="size-5" />
          </button>
        </div>

        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              ref={contentRef}
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={handlePaste}
              rows={6}
              placeholder="此刻想留下的句子…（可粘贴图片识别文字）"
              className="handwriting ink-blueblack min-h-40 w-full resize-none border-0 bg-transparent text-2xl leading-[1.9] text-ink outline-none placeholder:text-ink-faint/60"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(120,140,160,0.14) 1px, transparent 1px)",
                backgroundSize: "100% 2.375rem",
                backgroundPosition: "0 2.05rem",
              }}
            />

            {/* OCR overlay while recognising */}
            {ocrBusy ? (
              <div className="absolute inset-0 flex items-center justify-center gap-2 rounded bg-paper/70 backdrop-blur-[1px]">
                <Loader2 className="size-5 animate-spin text-celadon" />
                <span className="handwriting text-xl text-ink-soft">
                  正在认字…
                </span>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              name="author"
              defaultValue={editing?.author ?? ""}
              placeholder="作者（可留空）"
              className="handwriting flex-1 border-b border-ink-faint/30 bg-transparent py-1.5 text-xl text-ink-soft outline-none placeholder:text-ink-faint/60 focus:border-ink-soft"
            />
            <input
              name="book_name"
              defaultValue={editing?.book_name ?? ""}
              placeholder="出处 / 书名（可留空）"
              className="handwriting flex-1 border-b border-ink-faint/30 bg-transparent py-1.5 text-xl text-ink-soft outline-none placeholder:text-ink-faint/60 focus:border-ink-soft"
            />
          </div>

          {error ? (
            <p className="handwriting text-lg text-seal">{error}</p>
          ) : null}

          <div className="mt-1 flex items-center justify-between gap-4">
            {/* Image → text */}
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp,image/bmp"
              className="hidden"
              onChange={handleFilePick}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="handwriting flex items-center gap-1.5 text-xl text-celadon hover:text-ink-soft disabled:opacity-50"
            >
              <ImagePlus className="size-5" />
              识别图片
            </button>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className="handwriting text-xl text-ink-faint hover:text-ink-soft"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={busy}
                className="handwriting rounded-md bg-ink px-6 py-1.5 text-xl text-paper shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {pending && !ocrBusy
                  ? "收好…"
                  : editing
                    ? "保存"
                    : "贴上去"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
