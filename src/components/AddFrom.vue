<script setup lang="ts">
import { saveWords } from '@/api/words'
import { to } from '@iceywu/utils'
const addForm = reactive<any>({
	author: '',
	bookName: '',
	content: '',
})
// 🌈 接口数据请求
const getDataLoading = ref(false)
const handleSaveWords = async () => {
	if (getDataLoading.value) return
	getDataLoading.value = true
	const params = toRaw(addForm)
	console.log('🦄-----params-----', params)
	// eslint-disable-next-line no-unused-vars
	const [_, res] = await to(saveWords(params))
	if (res) {
		const { code, result = [] } = res || {}
		if (code === 200 && result) {
			console.log('😊-----保存成功-----', result)
		}
	}

	getDataLoading.value = false
}
const subumit = () => {
	console.log('💗subumit---------->', addForm)
	handleSaveWords()
}
</script>

<template>
	<div
		class="relative z-9999 flex flex-col items-center rounded-xl bg-transparent bg-clip-border text-gray-700 shadow-none"
	>
		<h4
			class="block text-2xl text-blue-gray-900 font-semibold leading-snug tracking-normal font-sans antialiased"
		>
			Sign Up
		</h4>
		<p
			class="mt-1 block text-base text-gray-700 font-normal leading-relaxed font-sans antialiased"
		>
			Nice to meet you! Enter your details to register.
		</p>
		<form class="mb-2 mt-8 w-80 max-w-screen-lg sm:w-96">
			<div class="mb-1 flex flex-col gap-6">
				<h6
					class="block text-base text-blue-gray-900 font-semibold leading-relaxed tracking-normal font-sans antialiased -mb-3"
				>
					Author
				</h6>
				<div class="relative h-11 min-w-[200px] w-full">
					<input
						v-model="addForm.author"
						placeholder="[email protected]"
						class="peer h-full w-full border border-blue-gray-200 border-t-transparent rounded-md bg-transparent px-3 py-3 text-sm text-blue-gray-700 font-normal font-sans outline-0 outline transition-all disabled:border-0 focus:border-2 placeholder-shown:border focus:border-gray-900 placeholder-shown:border-blue-gray-200 !border-t-blue-gray-200 focus:border-t-transparent placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 focus:outline-0 focus:!border-t-gray-900"
					/>
					<label
						class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 h-full w-full flex select-none truncate text-[11px] text-gray-500 font-normal leading-tight transition-all after:pointer-events-none before:pointer-events-none -top-1.5 after:ml-1 after:mt-[6.5px] before:mr-1 before:mt-[6.5px] after:box-border before:box-border after:block before:block after:h-1.5 after:w-2.5 before:h-1.5 before:w-2.5 after:flex-grow !overflow-visible after:border-r after:border-t before:border-l before:border-t after:border-blue-gray-200 before:border-blue-gray-200 after:rounded-tr-md before:rounded-tl-md peer-focus:text-[11px] peer-placeholder-shown:text-sm peer-disabled:text-transparent peer-focus:text-gray-900 peer-placeholder-shown:text-blue-gray-500 peer-focus:leading-tight peer-placeholder-shown:leading-[4.1] after:transition-all before:transition-all after:content-none before:content-none peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-disabled:after:border-transparent peer-disabled:before:border-transparent peer-placeholder-shown:after:border-transparent peer-placeholder-shown:before:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 peer-focus:after:!border-gray-900 peer-focus:before:!border-gray-900"
					></label>
				</div>
				<h6
					class="block text-base text-blue-gray-900 font-semibold leading-relaxed tracking-normal font-sans antialiased -mb-3"
				>
					BookName
				</h6>
				<div class="relative h-11 min-w-[200px] w-full">
					<input
						v-model="addForm.bookName"
						placeholder="bookName"
						class="peer h-full w-full border border-blue-gray-200 border-t-transparent rounded-md bg-transparent px-3 py-3 text-sm text-blue-gray-700 font-normal font-sans outline-0 outline transition-all disabled:border-0 focus:border-2 placeholder-shown:border focus:border-gray-900 placeholder-shown:border-blue-gray-200 !border-t-blue-gray-200 focus:border-t-transparent placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 focus:outline-0 focus:!border-t-gray-900"
					/>
					<label
						class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 h-full w-full flex select-none truncate text-[11px] text-gray-500 font-normal leading-tight transition-all after:pointer-events-none before:pointer-events-none -top-1.5 after:ml-1 after:mt-[6.5px] before:mr-1 before:mt-[6.5px] after:box-border before:box-border after:block before:block after:h-1.5 after:w-2.5 before:h-1.5 before:w-2.5 after:flex-grow !overflow-visible after:border-r after:border-t before:border-l before:border-t after:border-blue-gray-200 before:border-blue-gray-200 after:rounded-tr-md before:rounded-tl-md peer-focus:text-[11px] peer-placeholder-shown:text-sm peer-disabled:text-transparent peer-focus:text-gray-900 peer-placeholder-shown:text-blue-gray-500 peer-focus:leading-tight peer-placeholder-shown:leading-[4.1] after:transition-all before:transition-all after:content-none before:content-none peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-disabled:after:border-transparent peer-disabled:before:border-transparent peer-placeholder-shown:after:border-transparent peer-placeholder-shown:before:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 peer-focus:after:!border-gray-900 peer-focus:before:!border-gray-900"
					></label>
				</div>
				<h6
					class="block text-base text-blue-gray-900 font-semibold leading-relaxed tracking-normal font-sans antialiased -mb-3"
				>
					Content
				</h6>
				<div class="relative h-11 min-w-[200px] w-full">
					<input
						v-model="addForm.content"
						type="text-area"
						placeholder="content"
						class="peer h-full w-full border border-blue-gray-200 border-t-transparent rounded-md bg-transparent px-3 py-3 text-sm text-blue-gray-700 font-normal font-sans outline-0 outline transition-all disabled:border-0 focus:border-2 placeholder-shown:border focus:border-gray-900 placeholder-shown:border-blue-gray-200 !border-t-blue-gray-200 focus:border-t-transparent placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 focus:outline-0 focus:!border-t-gray-900"
					/>
					<label
						class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 h-full w-full flex select-none truncate text-[11px] text-gray-500 font-normal leading-tight transition-all after:pointer-events-none before:pointer-events-none -top-1.5 after:ml-1 after:mt-[6.5px] before:mr-1 before:mt-[6.5px] after:box-border before:box-border after:block before:block after:h-1.5 after:w-2.5 before:h-1.5 before:w-2.5 after:flex-grow !overflow-visible after:border-r after:border-t before:border-l before:border-t after:border-blue-gray-200 before:border-blue-gray-200 after:rounded-tr-md before:rounded-tl-md peer-focus:text-[11px] peer-placeholder-shown:text-sm peer-disabled:text-transparent peer-focus:text-gray-900 peer-placeholder-shown:text-blue-gray-500 peer-focus:leading-tight peer-placeholder-shown:leading-[4.1] after:transition-all before:transition-all after:content-none before:content-none peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-disabled:after:border-transparent peer-disabled:before:border-transparent peer-placeholder-shown:after:border-transparent peer-placeholder-shown:before:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 peer-focus:after:!border-gray-900 peer-focus:before:!border-gray-900"
					></label>
				</div>
			</div>
			<div class="inline-flex items-center">
				<label
					class="relative flex cursor-pointer items-center rounded-full p-3 -ml-2.5"
					htmlFor="remember"
				>
					<input
						id="remember"
						type="checkbox"
						class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none border border-blue-gray-200 rounded-md transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 checked:border-gray-900 before:rounded-full before:bg-blue-gray-500 checked:bg-gray-900 before:opacity-0 before:transition-opacity before:-translate-x-2/4 before:-translate-y-2/4 checked:before:bg-gray-900 hover:before:opacity-10"
					/>
					<span
						class="pointer-events-none absolute left-2/4 top-2/4 text-white opacity-0 transition-opacity -translate-x-2/4 -translate-y-2/4 peer-checked:opacity-100"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-3.5 w-3.5"
							viewBox="0 0 20 20"
							fill="currentColor"
							stroke="currentColor"
							stroke-width="1"
						>
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							></path>
						</svg>
					</span>
				</label>
				<label
					class="mt-px cursor-pointer select-none text-gray-700 font-light"
					htmlFor="remember"
				>
					<p
						class="flex items-center text-sm text-gray-700 font-normal leading-normal font-sans antialiased"
					>
						I agree the
						<a
							href="#"
							class="font-medium transition-colors hover:text-gray-900"
						>
							&nbsp;Terms and Conditions
						</a>
					</p>
				</label>
			</div>
			<button
				class="mt-6 block w-full select-none rounded-lg bg-gray-900 px-6 py-3 text-center align-middle text-xs text-white font-bold font-sans uppercase shadow-gray-900/10 shadow-md transition-all disabled:pointer-events-none active:opacity-[0.85] disabled:opacity-50 focus:opacity-[0.85] active:shadow-none disabled:shadow-none focus:shadow-none hover:shadow-gray-900/20 hover:shadow-lg"
				type="button"
				@click="subumit"
			>
				提交
			</button>
			<p
				class="mt-4 block text-center text-base text-gray-700 font-normal leading-relaxed font-sans antialiased"
			>
				Already have an account?
				<a href="#" class="text-gray-900 font-medium"> 提交 </a>
			</p>
		</form>
	</div>
</template>

<style scoped></style>
