<script setup lang="ts">
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import { to } from '@iceywu/utils'
import { getWordsLDeById, saveWords, updateWords } from '@/api/words'

const props = defineProps<{ chooseId: string | number | null }>()
const emit = defineEmits(['dlgClose'])
const addForm = reactive<any>({
	author: '',
	bookName: '',
	content: '',
})
const quillRef = ref<any>(null)
// 🌈 接口数据请求
const getDataLoading = ref(false)
async function handleSaveWords() {
	if (getDataLoading.value)
return
	getDataLoading.value = true

	const params = toRaw(addForm)
	params.content = quillRef.value.getText()
	let requestApi = saveWords
	if (props.chooseId) {
		requestApi = updateWords
		params.id = props.chooseId
	}

	// return

	const [_, res] = await to(requestApi(params))
	if (res) {
		const { code, result = [] } = res || {}
		if (code === 200 && result) {
			emit('dlgClose', true)
		}
	}

	getDataLoading.value = false
}
function subumit() {
	handleSaveWords()
}

async function initEditor() {
	await nextTick()
	const quill = new Quill('#editor', {
		// theme: 'snow',
		modules: {
			toolbar: false,
		},
		placeholder: '内容(必填)',
	})
	quillRef.value = quill
}
onMounted(async () => {
	await initEditor()

	props.chooseId && getWordsDe(props.chooseId)
})
async function getWordsDe(id: any) {
	const [_, res] = await to(getWordsLDeById(id))
	if (res) {
		const { code, result = [] } = res || {}
		if (code === 200 && result) {
			addForm.author = result.author
			addForm.bookName = result.bookName
			addForm.content = result.content

			// quillRef.value.setText(result.content)
			// await nextTick()
			// // quillRef.value.setText('Hello')
			// setTimeout(() => {

			// 	quillRef.value.insertText(0, 'DevUI 是一款面向企业中后台产品的开源前端解决方案');
			// }, 1000);
		}
	}
}
</script>

<template>
	<div
		class="relative z-9999 flex flex-col items-center rounded-xl bg-transparent bg-clip-border text-gray-700 shadow-none"
	>
		<h4
			class="block text-2xl text-blue-gray-900 font-semibold leading-snug tracking-normal font-sans antialiased"
		>
			发表
		</h4>
		<p
			class="mt-1 block text-base text-gray-700 font-normal leading-relaxed font-sans antialiased"
		>
			记录美好的文字片段.
		</p>
		<form class="mb-2 mt-8 w-80 max-w-screen-lg sm:w-96">
			<div class="mb-1 flex flex-col gap-6">
				<h6
					class="block text-base text-blue-gray-900 font-semibold leading-relaxed tracking-normal font-sans antialiased -mb-3"
				>
					内容
				</h6>
				<div class="relative h-auto min-w-[200px] w-full">
					<div
						id="editor"
						class="peer h-full w-full border border-blue-gray-200 border-t-transparent rounded-md bg-transparent py-3 text-sm text-blue-gray-700 font-normal font-sans outline-0 outline transition-all disabled:border-0 focus:border-2 placeholder-shown:border focus:border-gray-900 placeholder-shown:border-blue-gray-200 !border-t-blue-gray-200 focus:border-t-transparent placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 focus:outline-0 focus:!border-t-gray-900"
					/>
				</div>
				<h6
					class="block text-base text-blue-gray-900 font-semibold leading-relaxed tracking-normal font-sans antialiased -mb-3"
				>
					作者
				</h6>
				<div class="relative h-11 min-w-[200px] w-full">
					<input
						v-model="addForm.author"
						placeholder="作者姓名(可选)"
						class="peer h-full w-full border border-blue-gray-200 border-t-transparent rounded-md bg-transparent px-3 py-3 text-sm text-blue-gray-700 font-normal font-sans outline-0 outline transition-all disabled:border-0 focus:border-2 placeholder-shown:border focus:border-gray-900 placeholder-shown:border-blue-gray-200 !border-t-blue-gray-200 focus:border-t-transparent placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 focus:outline-0 focus:!border-t-gray-900"
					>
					<label
						class="'] '] before:content[' after:content[' pointer-events-none absolute left-0 h-full w-full flex select-none truncate text-[11px] text-gray-500 font-normal leading-tight transition-all after:pointer-events-none before:pointer-events-none -top-1.5 after:ml-1 after:mt-[6.5px] before:mr-1 before:mt-[6.5px] after:box-border before:box-border after:block before:block after:h-1.5 after:w-2.5 before:h-1.5 before:w-2.5 after:flex-grow !overflow-visible after:border-r after:border-t before:border-l before:border-t after:border-blue-gray-200 before:border-blue-gray-200 after:rounded-tr-md before:rounded-tl-md peer-focus:text-[11px] peer-placeholder-shown:text-sm peer-disabled:text-transparent peer-focus:text-gray-900 peer-placeholder-shown:text-blue-gray-500 peer-focus:leading-tight peer-placeholder-shown:leading-[4.1] after:transition-all before:transition-all after:content-none before:content-none peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-disabled:after:border-transparent peer-disabled:before:border-transparent peer-placeholder-shown:after:border-transparent peer-placeholder-shown:before:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 peer-focus:after:!border-gray-900 peer-focus:before:!border-gray-900"
					/>
				</div>
				<h6
					class="block text-base text-blue-gray-900 font-semibold leading-relaxed tracking-normal font-sans antialiased -mb-3"
				>
					书名
				</h6>
				<div class="relative h-11 min-w-[200px] w-full">
					<input
						v-model="addForm.bookName"
						placeholder="书名(可选)"
						class="peer h-full w-full border border-blue-gray-200 border-t-transparent rounded-md bg-transparent px-3 py-3 text-sm text-blue-gray-700 font-normal font-sans outline-0 outline transition-all disabled:border-0 focus:border-2 placeholder-shown:border focus:border-gray-900 placeholder-shown:border-blue-gray-200 !border-t-blue-gray-200 focus:border-t-transparent placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 focus:outline-0 focus:!border-t-gray-900"
					>
					<label
						class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 h-full w-full flex select-none truncate text-[11px] text-gray-500 font-normal leading-tight transition-all after:pointer-events-none before:pointer-events-none -top-1.5 after:ml-1 after:mt-[6.5px] before:mr-1 before:mt-[6.5px] after:box-border before:box-border after:block before:block after:h-1.5 after:w-2.5 before:h-1.5 before:w-2.5 after:flex-grow !overflow-visible after:border-r after:border-t before:border-l before:border-t after:border-blue-gray-200 before:border-blue-gray-200 after:rounded-tr-md before:rounded-tl-md peer-focus:text-[11px] peer-placeholder-shown:text-sm peer-disabled:text-transparent peer-focus:text-gray-900 peer-placeholder-shown:text-blue-gray-500 peer-focus:leading-tight peer-placeholder-shown:leading-[4.1] after:transition-all before:transition-all after:content-none before:content-none peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-disabled:after:border-transparent peer-disabled:before:border-transparent peer-placeholder-shown:after:border-transparent peer-placeholder-shown:before:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 peer-focus:after:!border-gray-900 peer-focus:before:!border-gray-900"
					/>
				</div>
			</div>

			<button
				class="mt-6 block w-full select-none rounded-lg bg-gray-900 px-6 py-3 text-center align-middle text-xs text-white font-bold font-sans uppercase shadow-gray-900/10 shadow-md transition-all disabled:pointer-events-none active:opacity-[0.85] disabled:opacity-50 focus:opacity-[0.85] active:shadow-none disabled:shadow-none focus:shadow-none hover:shadow-gray-900/20 hover:shadow-lg"
				type="button"
				@click="subumit"
			>
				{{ props.chooseId ? '提交编辑' : '提交' }}
			</button>
		</form>
	</div>
</template>

<style scoped></style>
