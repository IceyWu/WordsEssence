const AI_API_BASE_URL = "https://api.lpalette.cn";
const OCR_TASK_URL = `${AI_API_BASE_URL}/ai/api/v1/task`;
const OCR_POLL_INTERVAL = 1500;
const OCR_TIMEOUT = 60_000;

type TaskStatus = "pending" | "processing" | "completed" | "failed";

interface AiApiResponse<T> {
	code: number;
	message: string;
	data: T | null;
}

interface SubmitTaskData {
	task_id: string;
	type: string;
	status: "pending";
}

interface TaskResultData {
	task_id: string;
	type: string;
	status: TaskStatus;
	text?: string | null;
	error?: string | null;
}

function wait(ms: number) {
	return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function parseResponse<T>(response: Response): Promise<AiApiResponse<T>> {
	const data = (await response.json()) as AiApiResponse<T>;

	if (!response.ok || data.code !== 200) {
		throw new Error(data.message || "OCR 接口请求失败");
	}

	return data;
}

async function submitOcrTask(imageFile: File) {
	const formData = new FormData();
	formData.append("type", "ocr");
	formData.append("file", imageFile);

	const response = await fetch(OCR_TASK_URL, {
		method: "POST",
		body: formData,
	});
	const result = await parseResponse<SubmitTaskData>(response);

	if (!result.data?.task_id) {
		throw new Error("OCR 接口未返回任务 ID");
	}

	return result.data.task_id;
}

async function getOcrTaskResult(taskId: string) {
	const response = await fetch(`${OCR_TASK_URL}/${taskId}`);
	const result = await parseResponse<TaskResultData>(response);

	if (!result.data) {
		throw new Error("OCR 接口未返回识别结果");
	}

	return result.data;
}

export async function recognizeText(imageFile: File): Promise<string> {
	const taskId = await submitOcrTask(imageFile);
	const startTime = Date.now();

	while (Date.now() - startTime < OCR_TIMEOUT) {
		const task = await getOcrTaskResult(taskId);

		if (task.status === "completed") {
			return task.text?.trim() ?? "";
		}

		if (task.status === "failed") {
			throw new Error(task.error || "OCR 识别失败");
		}

		await wait(OCR_POLL_INTERVAL);
	}

	throw new Error("OCR 识别超时，请稍后重试");
}
