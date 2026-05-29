import "server-only";

import { AI_BASE_URL } from "./env";

/**
 * Server-side wrapper for the AI OCR task service (api.lpalette.cn).
 *
 * Flow: submit an image (multipart, type=ocr) -> receive a task_id ->
 * poll until the task completes -> return the recognised text. Kept on the
 * server so the browser never calls the third-party API directly (no CORS,
 * and image bytes pass through our own origin).
 */

const SUBMIT = `${AI_BASE_URL}/ai/api/v1/task`;
const TASK = (id: string) => `${AI_BASE_URL}/ai/api/v1/task/${id}`;

interface Envelope<T> {
  code: number;
  message: string;
  data: T;
}

interface SubmitData {
  task_id: string;
  type: string;
  status: string;
}

interface TaskData {
  task_id: string;
  type: string;
  status: "pending" | "processing" | "completed" | "failed";
  text?: string | null;
  error?: string | null;
}

const MAX_BYTES = 20 * 1024 * 1024; // 20MB, per the API limit
const ACCEPTED = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
  "image/bmp",
]);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function recognizeText(file: File): Promise<string> {
  if (!file || file.size === 0) throw new Error("没有收到图片");
  if (file.size > MAX_BYTES) throw new Error("图片太大了（上限 20MB）");
  if (file.type && !ACCEPTED.has(file.type)) {
    throw new Error("不支持的图片格式");
  }

  // 1. Submit the OCR task.
  const form = new FormData();
  form.append("type", "ocr");
  form.append("file", file, file.name || "image.png");

  const submitRes = await fetch(SUBMIT, { method: "POST", body: form });
  if (!submitRes.ok) {
    throw new Error(`提交识别任务失败 (${submitRes.status})`);
  }
  const submit = (await submitRes.json()) as Envelope<SubmitData>;
  const taskId = submit.data?.task_id;
  if (!taskId) throw new Error("未能创建识别任务");

  // 2. Poll for the result (OCR is usually a few seconds).
  const maxAttempts = 30; // ~45s ceiling
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await sleep(attempt === 0 ? 800 : 1500);

    const res = await fetch(TASK(taskId), {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) continue;

    const body = (await res.json()) as Envelope<TaskData>;
    const data = body.data;
    if (data?.status === "completed") {
      return (data.text ?? "").trim();
    }
    if (data?.status === "failed") {
      throw new Error(data.error || "识别失败");
    }
  }

  throw new Error("识别超时，请重试");
}
