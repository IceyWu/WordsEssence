<script setup lang="ts">
defineProps<{
  text: string
  loading: boolean
}>()
</script>

<template>
  <div class="recognition-result">
    <div v-if="loading" class="loading">识别中...</div>
    <div v-else-if="text" class="result-text">
      <h3>识别结果：</h3>
      <pre>{{ text }}</pre>
    </div>
  </div>
</template>

<style scoped>
.recognition-result {
  margin: 20px 0;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  min-height: 100px;
}

.loading {
  color: #666;
  font-style: italic;
}

.result-text {
  text-align: left;
}

.result-text h3 {
  margin-bottom: 10px;
  color: #333;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: white;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
  color: #333;
}
</style>
