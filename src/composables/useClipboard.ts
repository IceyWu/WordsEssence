import { onMounted, onUnmounted } from 'vue'

export function useClipboard(onImagePaste: (file: File) => void) {
  const handlePaste = async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items
    if (!items)
return

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          onImagePaste(file)
          break
        }
      }
    }
  }

  onMounted(() => {
    document.addEventListener('paste', handlePaste)
  })

  onUnmounted(() => {
    document.removeEventListener('paste', handlePaste)
  })
}
