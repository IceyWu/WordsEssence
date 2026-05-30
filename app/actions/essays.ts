"use server";

import { updateTag } from "next/cache";
import {
  createEssay,
  deleteEssay,
  listEssays,
  updateEssay,
} from "@/lib/api";
import type { Essay } from "@/lib/types";

/**
 * Read one page of essays for the client's infinite-scroll board.
 * Returns the slice plus whether more pages remain.
 */
export async function fetchEssaysPage(
  page: number,
  pageSize: number,
): Promise<{ list: Essay[]; hasMore: boolean }> {
  const result = await listEssays({
    page,
    page_size: pageSize,
    sort: "id,desc",
  });
  return { list: result.list, hasMore: result.page < result.total_pages };
}

/**
 * Mutations for the commonplace book. This is a personal diary — every entry
 * is freely editable and deletable, so there is no auth gate by design.
 * Each action expires the `essays` cache tag (read-your-own-writes) so the
 * board immediately reflects the change.
 */

export type ActionResult =
  | { ok: true; essay?: Essay }
  | { ok: false; error: string };

function clean(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function addEntry(formData: FormData): Promise<ActionResult> {
  const content = clean(formData.get("content"));
  if (!content) return { ok: false, error: "写点什么吧。" };

  try {
    const essay = await createEssay({
      content,
      author: clean(formData.get("author")) || undefined,
      title: clean(formData.get("title")) || undefined,
      book_name: clean(formData.get("book_name")) || undefined,
    });
    updateTag("essays");
    return { ok: true, essay };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "保存失败" };
  }
}

export async function editEntry(
  id: number,
  formData: FormData,
): Promise<ActionResult> {
  const content = clean(formData.get("content"));
  if (!content) return { ok: false, error: "内容不能为空。" };

  try {
    const essay = await updateEssay(id, {
      content,
      author: clean(formData.get("author")),
      title: clean(formData.get("title")),
      book_name: clean(formData.get("book_name")),
    });
    updateTag("essays");
    return { ok: true, essay };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "保存失败" };
  }
}

export async function removeEntry(id: number): Promise<ActionResult> {
  try {
    await deleteEssay(id);
    updateTag("essays");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "删除失败" };
  }
}
