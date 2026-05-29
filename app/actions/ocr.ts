"use server";

import { recognizeText } from "@/lib/ocr";

export type OcrResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

/**
 * Recognise the text in an uploaded/pasted image via the AI OCR service.
 * Runs on the server so the third-party API is never called from the browser.
 */
export async function recognizeImage(formData: FormData): Promise<OcrResult> {
  const file = formData.get("image");
  if (!(file instanceof File)) {
    return { ok: false, error: "没有收到图片" };
  }
  try {
    const text = await recognizeText(file);
    if (!text) return { ok: false, error: "没有识别到文字" };
    return { ok: true, text };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "识别失败" };
  }
}
