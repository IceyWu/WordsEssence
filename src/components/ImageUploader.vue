<script setup lang="ts">
import { ref } from 'vue'
import { useClipboard } from '../composables/useClipboard'

const emit = defineEmits<{
  (e: 'imageSelected', file: File): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    emit('imageSelected', input.files[0])
  }
}

function handleImagePaste(file: File) {
  emit('imageSelected', file)
}

useClipboard(handleImagePaste)
</script>

<template>
  <div class="image-uploader">
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="file-input"
      @change="handleFileChange"
    >
    <div class="upload-options">
      <button class="upload-button" @click="fileInput?.click()">
        选择需要识别的图片
      </button>
      <div class="paste-hint">
        或直接粘贴需要识别的图片 (Ctrl+V)
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-uploader {
  margin: 20px 0;
}

.file-input {
  display: none;
}

.upload-options {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.upload-button:hover {
  background-color: #45a049;
}

.paste-hint {
  color: #666;
  font-size: 0.9em;
  margin-top: 5px;
}
</style>
