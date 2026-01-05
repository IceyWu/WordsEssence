<script setup lang="ts">
import Quill from "quill";
import "quill/dist/quill.core.css";
import { to } from "@iceywu/utils";
import { getWordsLDeById, saveWords, updateWords } from "@/api/words";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { recognizeText } from "@/services/tesseractService";

const props = defineProps<{ chooseId: string | number | null }>();
const emit = defineEmits(["dlgClose"]);

const addForm = reactive<any>({
  author: "",
  bookName: "",
  content: "",
});

const quillRef = ref<any>(null);
let quillTemp: Quill;

const getDataLoading = ref(false);
const imageUrl = ref("");
const isLoading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

async function handleSaveWords() {
  if (getDataLoading.value) return;
  getDataLoading.value = true;

  const params = toRaw(addForm);
  params.content = quillTemp.getText();
  let requestApi = saveWords;
  if (props.chooseId) {
    requestApi = updateWords;
    params.id = props.chooseId;
  }

  const [_, res] = await to(requestApi(params));
  if (res) {
    const { code, data = [] } = res || {};
    if ([200, 201].includes(code) && data) {
      emit("dlgClose", true);
    }
  }

  getDataLoading.value = false;
}

function submit() {
  handleSaveWords();
}

async function initEditor(content?: string) {
  await nextTick();
  const quill = new Quill("#editor", {
    modules: { toolbar: false },
    placeholder: "写下触动你的文字...",
  });
  quillRef.value = quill;
  quillTemp = quill;
  if (content) {
    quill.setText(content);
  }
}

onMounted(async () => {
  if (props.chooseId) {
    getWordsDe(props.chooseId);
  } else {
    initEditor();
  }
});

async function getWordsDe(id: any) {
  const [_, res] = await to(getWordsLDeById(id));
  if (res) {
    const { code, data = {} } = res || {};
    if (code === 200 && data) {
      addForm.author = data.author;
      addForm.bookName = data.bookName;
      addForm.content = data.content;
      initEditor(data.content);
    }
  }
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.[0]) {
    handleImageSelected(input.files[0]);
  }
}

async function handleImageSelected(file: File) {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
  }
  imageUrl.value = URL.createObjectURL(file);
  isLoading.value = true;

  try {
    const text = await recognizeText(file);
    quillTemp.setText(text);
  } catch {
    quillTemp.setText("识别失败，请重试");
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
	<div class="w-full space-y-6">
		<!-- 图片识别区域 -->
		<div class="relative">
			<input
				ref="fileInput"
				type="file"
				accept="image/*"
				class="hidden"
				@change="handleFileChange"
			>
			<div
				class="flex cursor-pointer flex-col items-center gap-3 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-6 transition-colors hover:border-neutral-400 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
				@click="fileInput?.click()"
			>
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-neutral-600 dark:text-neutral-400">
						<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
						<circle cx="9" cy="9" r="2" />
						<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
					</svg>
				</div>
				<div class="text-center">
					<p class="text-sm font-medium text-neutral-900 dark:text-neutral-100">点击上传图片识别文字</p>
					<p class="mt-1 text-xs text-neutral-500">或粘贴图片 (Ctrl+V)</p>
				</div>
			</div>

			<!-- 加载遮罩 -->
			<div
				v-if="isLoading"
				class="absolute inset-0 flex items-center justify-center rounded-lg bg-neutral-900/80"
			>
				<div class="flex flex-col items-center gap-2">
					<div class="h-6 w-6 animate-spin rounded-full border-2 border-neutral-400 border-t-white" />
					<span class="text-sm text-white">识别中...</span>
				</div>
			</div>
		</div>

		<!-- 分隔线 -->
		<div class="relative">
			<div class="absolute inset-0 flex items-center">
				<div class="w-full border-t border-neutral-200 dark:border-neutral-700" />
			</div>
			<div class="relative flex justify-center">
				<span class="bg-white px-3 text-xs text-neutral-500 dark:bg-neutral-950">或手动输入</span>
			</div>
		</div>

		<!-- 表单 -->
		<div class="space-y-4">
			<!-- 内容 -->
			<div class="space-y-2">
				<Label for="content" class="text-sm font-medium">
					内容 <span class="text-red-500">*</span>
				</Label>
				<div
					id="editor"
					class="min-h-[120px] rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white focus-within:ring-2 focus-within:ring-neutral-950 focus-within:ring-offset-2 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus-within:ring-neutral-300"
				/>
			</div>

			<!-- 作者 -->
			<div class="space-y-2">
				<Label for="author">作者</Label>
				<Input
					id="author"
					v-model="addForm.author"
					placeholder="作者姓名 (可选)"
				/>
			</div>

			<!-- 书名 -->
			<div class="space-y-2">
				<Label for="bookName">书名</Label>
				<Input
					id="bookName"
					v-model="addForm.bookName"
					placeholder="书名 (可选)"
				/>
			</div>

			<!-- 提交按钮 -->
			<Button
				class="w-full"
				:disabled="getDataLoading"
				@click="submit"
			>
				{{ getDataLoading ? '提交中...' : (props.chooseId ? '保存修改' : '发表') }}
			</Button>
		</div>
	</div>
</template>

<style scoped>
#editor {
  font-family: inherit;
}
#editor :deep(.ql-editor) {
  padding: 0;
  min-height: 100px;
}
#editor :deep(.ql-editor.ql-blank::before) {
  color: #a3a3a3;
  font-style: normal;
  left: 0;
}
</style>
