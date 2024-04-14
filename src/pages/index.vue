<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { x, y, style } = useDraggable(el, {
	initialValue: { x: 40, y: 40 },
})
const dlgRef = ref<any>(null)
const openDlg = () => {
	dlgRef.value.showModal()
}
const closeDlg = (flag) => {
	dlgRef.value.close()
	if (flag) {
		textListRef.value?.getWordsData()
	}
}
const textListRef = ref(null)
</script>

<template>
	<div class="h-[100vh] w-full">
		<div ref="el" class="z-9999" :style="style" style="position: fixed">
			<button
				class="flex select-none items-center gap-3 rounded-full bg-white p-3.5 text-center align-middle text-sm text-blue-gray-900 font-bold font-sans uppercase shadow-blue-gray-500/10 shadow-xl transition-all disabled:pointer-events-none active:opacity-[0.85] disabled:opacity-50 focus:opacity-[0.85] active:shadow-none disabled:shadow-none focus:shadow-none hover:shadow-blue-gray-500/20 hover:shadow-lg"
				type="button"
				@click="openDlg"
			>
				Add
			</button>
		</div>
		<dialog ref="dlgRef" class="overflow-hidden rounded-xl">
			<div class="relative p-3">
				<button
					class="absolute right-2 top-2 z-999999 flex cursor-pointer items-center gap-3 rounded-full bg-white p-3.5 text-center align-middle text-sm text-blue-gray-900 font-bold font-sans uppercase shadow-blue-gray-500/10 shadow-xl transition-all disabled:pointer-events-none active:opacity-[0.85] disabled:opacity-50 focus:opacity-[0.85] active:shadow-none disabled:shadow-none focus:shadow-none hover:shadow-blue-gray-500/20 hover:shadow-lg"
					type="button"
					@click="closeDlg"
				>
					X
				</button>
				<AddFrom @dlg-close="closeDlg" />
			</div>
		</dialog>
		<TextList ref="textListRef" msg="minutes" />
	</div>
</template>
