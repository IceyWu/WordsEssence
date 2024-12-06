<script setup lang="ts">
defineProps<{
  imageUrl: string
}>()
</script>

<template>
  <div class="image-preview">
    <img v-if="imageUrl" :src="imageUrl" alt="预览图片">
  </div>
</template>

<style scoped>
.image-preview {
  margin: 20px 0;
  max-width: 100%;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
