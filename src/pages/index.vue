<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { x, y, style } = useDraggable(el, {
	initialValue: { x: 40, y: 40 },
})
const dlgRef = ref<any>(null)
const chooseId = ref(null)
const isShowForm = ref(false)
function openDlg() {
	dlgRef.value.showModal()
	isShowForm.value = true
}
const textListRef = ref(null)
function closeDlg(flag) {
	dlgRef.value.close()
	if (flag) {
		textListRef.value?.getWordsData()
	}
	isShowForm.value = false
	chooseId.value = null
}

function handleEdit(data) {
	if (data.id) {
		chooseId.value = data.id
		openDlg()
	}
}
const fontLoading = ref(true)
// 添加字体加载是否成功的事件
document.fonts.ready.then(() => {
  // 使用该字体渲染文字（如：在 canvas 中绘制）
	fontLoading.value = false
})
</script>

<template>
	<div class="paper-bg h-[100vh] w-full">
		<div ref="el" class="z-9999" :style="style" style="position: fixed">
			<button
				class="flex select-none items-center gap-3 rounded-full bg-white p-3.5 text-center align-middle text-sm text-blue-gray-900 font-bold font-sans uppercase shadow-blue-gray-500/10 shadow-xl transition-all disabled:pointer-events-none active:opacity-[0.85] disabled:opacity-50 focus:opacity-[0.85] active:shadow-none disabled:shadow-none focus:shadow-none hover:shadow-blue-gray-500/20 hover:shadow-lg"
				type="button"
				@click="openDlg"
			>
				新增
			</button>
		</div>
		<dialog ref="dlgRef" class="overflow-hidden rounded-xl">
			<div v-if="isShowForm" class="relative p-3">
				<button
					class="absolute right-2 top-2 z-999999 flex cursor-pointer items-center gap-3 rounded-full bg-white p-3.5 text-center align-middle text-sm text-blue-gray-900 font-bold font-sans uppercase shadow-blue-gray-500/10 shadow-xl transition-all disabled:pointer-events-none active:opacity-[0.85] disabled:opacity-50 focus:opacity-[0.85] active:shadow-none disabled:shadow-none focus:shadow-none hover:shadow-blue-gray-500/20 hover:shadow-lg"
					type="button"
					@click="closeDlg"
				>
					X
				</button>
				<AddFrom :choose-id @dlg-close="closeDlg" />
			</div>
		</dialog>
		<template v-if="fontLoading">
			<div>
				loading...
			</div>
</template>
		<TextList v-else ref="textListRef" msg="minutes" @edit="handleEdit" />
	</div>
</template>

<style>
::-webkit-scrollbar {
  display: none;
}
/* 模拟纸张背景 */
.paper-bg {
  /* background: #c2c2c2; */
}
</style>
