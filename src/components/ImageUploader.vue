<script setup lang="ts">
import { ref } from "vue";
import { useClipboard } from "../composables/useClipboard";

const emit = defineEmits<(e: "imageSelected", file: File) => void>();

const fileInput = ref<HTMLInputElement | null>(null);

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    emit("imageSelected", input.files[0]);
  }
}

function handleImagePaste(file: File) {
  emit("imageSelected", file);
}

useClipboard(handleImagePaste);
</script>

<template>
  <div class="mb-4 w-full">
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    >
    <div class="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 transition-all hover:border-indigo-300 hover:bg-indigo-50/30">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </div>
      <button
        class="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
        type="button"
        @click="fileInput?.click()"
      >
        选择图片识别文字
      </button>
      <p class="text-xs text-gray-400">
        或直接粘贴图片 (Ctrl+V)
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>
