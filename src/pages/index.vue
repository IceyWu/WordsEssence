<script setup lang="ts">
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const el = ref<HTMLElement | null>(null)
const { style } = useDraggable(el, {
	initialValue: { x: 40, y: 40 },
})
const chooseId = ref<string | number | null>(null)
const isDialogOpen = ref(false)

function openDlg() {
	isDialogOpen.value = true
}

const textListRef = ref<InstanceType<typeof TextList> | null>(null)

function closeDlg(flag?: boolean) {
	isDialogOpen.value = false
	if (flag) {
		textListRef.value?.getWordsData()
	}
	chooseId.value = null
}

function handleEdit(data: { id?: string | number }) {
	if (data.id) {
		chooseId.value = data.id
		openDlg()
	}
}

const fontLoading = ref(true)
// 添加字体加载是否成功的事件
document.fonts.ready.then(() => {
	fontLoading.value = false
})
</script>

<template>
	<div class="relative h-screen w-full overflow-hidden bg-neutral-50 dark:bg-neutral-950">
		<!-- 装饰性背景 -->
		<div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
			<div class="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-neutral-200/50 blur-3xl dark:bg-neutral-800/30" />
			<div class="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-neutral-200/50 blur-3xl dark:bg-neutral-800/30" />
		</div>

		<!-- 新增按钮 -->
		<div ref="el" class="z-[9999]" :style="style" style="position: fixed">
			<Button class="gap-2 rounded-full px-5 shadow-lg" @click="openDlg">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<line x1="12" y1="5" x2="12" y2="19" />
					<line x1="5" y1="12" x2="19" y2="12" />
				</svg>
				<span class="base-font">新增</span>
			</Button>
		</div>

		<!-- 弹窗 -->
		<Dialog v-model:open="isDialogOpen">
			<DialogContent class="max-h-[90vh] max-w-lg overflow-auto sm:max-w-xl">
				<DialogHeader class="sr-only">
					<DialogTitle>{{ chooseId ? '编辑摘抄' : '新增摘抄' }}</DialogTitle>
					<DialogDescription>记录美好的文字片段</DialogDescription>
				</DialogHeader>
				<AddFrom :choose-id="chooseId" @dlg-close="closeDlg" />
			</DialogContent>
		</Dialog>

		<!-- 加载状态 -->
		<template v-if="fontLoading">
			<div class="flex h-screen flex-col items-center justify-center gap-4">
				<div class="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
				<p class="base-font text-sm text-neutral-500">正在加载...</p>
			</div>
		</template>

		<!-- 文字列表 -->
		<TextList v-else ref="textListRef" msg="minutes" @edit="handleEdit" />
	</div>
</template>

<style scoped>
::-webkit-scrollbar {
  display: none;
}

.base-font {
  font-family: '新叶念体', sans-serif;
}
</style>
