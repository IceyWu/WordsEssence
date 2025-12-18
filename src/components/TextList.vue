<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { to } from '@iceywu/utils'
import {
	A11y,
	Keyboard,
	Mousewheel,
	Navigation,
} from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { deleteWords, getWordsList } from '@/api/words'
import { Button } from '@/components/ui/button'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import 'swiper/css/mousewheel'
import 'swiper/css/keyboard'

const emit = defineEmits(['edit'])

// Import Swiper styles
// const onSwiper = (swiper) => {

// }
const chooseVal = ref({})
const dataList = ref<DataItem[]>([
	{
		content: `
		“这个爱情故事，好像是个悲剧？”<br />
		“你说的是婚姻，爱情没有悲剧。”<br />
		对爱者而言，爱情怎么会是悲剧？对春天而言，秋天是它的悲剧吗？<br />
		“结尾是什么？”<br />
		“等待。”<br />
		“之后呢？” <br />
		“没有之后” <br />
		“或者说，等待的结果呢？” <br />
		“等待就是结果。” <br />
		“那，不是悲剧吗？” <br />
		“不，是秋天” <br />
		`,
		author: '史铁生',
		book_name: '我与地坛',
	},
	{
		content: `
		我的心底锁着一封苍老的信等你来读时，<br />
		愿我仍年轻。
		`,
		author: '陈繁齐',
		book_name: '',
	},
	{
		content: `
		我想要偶尔想起你<br />
		偶尔疼痛<br />
		想起生命里曾经有一场相遇
		`,
		author: '陈繁齐',
		book_name: '',
	},
	{
		content: `
		如果你决定要来找我了<br />
		就请你带着足够爱我的容器<br />
		好让我把余生的温柔都盛给你
		`,
		author: '陈繁齐',
		book_name: '',
	},
])
// const chooseIndex = ref(0);
function onSlideChange(data) {
	// console.log('🌈-----data.activeIndex-----', data.activeIndex);
	const dataListVal = dataList.value[data.activeIndex]
	chooseVal.value = dataListVal
}
const swiperRef = ref()
const chooseIndex = computed(() => {
	return swiperRef.value?.activeIndex
})

// const modules = [Navigation, Scrollbar, A11y, Keyboard, Mousewheel]
const modules = [Navigation, A11y, Keyboard, Mousewheel]

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()
interface DataItem {
	author?: string
	title?: string
	content: string
	bookName?: string
}
function showName(data: DataItem) {
	const { author, book_name } = data
	const authorName = author || '佚名'
	const bookNameTemp = book_name ? `《${book_name}》` : ''
	return `${authorName} ${bookNameTemp}`
}
const navigation = {
	nextEl: '.swiper-button-next',
	prevEl: '.swiper-button-prev',
}
function nextEl() {}
function prevEl(item: DataItem, index: number) {}
function formatStringWithBr(str: string) {
	const punctuationRegex = /([，。！？；：“”‘’（）《》【】〈〉.!?;:"'()])/g
	return str.replace(punctuationRegex, (match) => {
		return `${match}<br />`
	})
}

// 🌈 接口数据请求
const getDataLoading = ref(false)
async function getWordsData() {
	if (getDataLoading.value)
return
	getDataLoading.value = true
	const params = {
		page: 1,
		size: 1000,
	}

	const [_, res] = await to(getWordsList(params))
	if (res) {
		const { code, data = {} } = res || {}
		console.log('🍧-----res-----', res);
		if (code === 200 && data) {
			const { list = [] } = data || {}
			const tempData = list.map((item) => {
				return {
					...item,
					// content: formatStringWithBr(item.content),
					book_name: item.bookName,
					content: item.content.replace(/\n/g, '<br>'),
				}
			})

			dataList.value = tempData || []
			chooseVal.value = dataList.value[0]
		}
	}

	getDataLoading.value = false
}
function handleEdit() {
	emit('edit', chooseVal.value)
}
async function handleDelete() {
	const id = chooseVal.value?.id
	const index = chooseIndex.value
	ElMessageBox.confirm('确定删除改摘抄吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const [_, res] = await to(deleteWords(id))
			if (res) {
				const { code, result = [] } = res || {}
				if (code === 200) {
					dataList.value.splice(index, 1)
					ElMessage({
						type: 'success',
						message: '删除成功',
					})
				}
			}
		})
		.catch(() => {})
}
onMounted(() => {
	getWordsData()
})
defineExpose({
	getWordsData,
})
// const swiperRef = ref();
// const swiperActiveIndex = computed(() => {

// 	return swiperRef.value?.activeIndex
// })
</script>

<template>
	<div class="h-full w-full">
		<DefineTemplate v-slot="{ data }">
			<div class="notebook-card">
				<div class="notebook-inner base-font">
					<div class="quote-content" v-html="data.content" />
					<p class="author-line">—— {{ showName(data) }}</p>
				</div>
			</div>
		</DefineTemplate>

		<!-- 列表 -->
		<Swiper
			ref="swiperRef"
			class="h-full"
			:modules="modules"
			:loop="true"
			:slides-per-view="1"
			:space-between="50"
			:autoplay="{ delay: 4000, disableOnInteraction: false }"
			:navigation="navigation"
			:pagination="{ clickable: true }"
			:scrollbar="{ draggable: false }"
			:keyboard="{ enabled: true }"
			:mousewheel="{ enabled: true }"
			direction="vertical"
			@slide-change="onSlideChange"
		>
			<SwiperSlide v-for="(item, index) in dataList" :key="index">
				<div class="box-border flex h-full w-full items-center justify-center px-6 md:px-24 lg:px-48">
					<ReuseTemplate :data="item" />
				</div>
			</SwiperSlide>
		</Swiper>

		<!-- 滚动提示 -->
		<div class="pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2">
			<div class="flex animate-bounce flex-col items-center gap-1 text-neutral-400">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 5v14" />
					<path d="m19 12-7 7-7-7" />
				</svg>
			</div>
		</div>

		<!-- 操作按钮 -->
		<div class="fixed bottom-8 right-8 z-[999] flex gap-3">
			<Button variant="outline" class="gap-2 rounded-full shadow-sm" @click="handleEdit">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
					<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
				</svg>
				<span class="base-font">编辑</span>
			</Button>
			<Button variant="outline" class="gap-2 rounded-full shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950 dark:hover:text-red-400" @click="handleDelete">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="3 6 5 6 21 6" />
					<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
				</svg>
				<span class="base-font">删除</span>
			</Button>
		</div>
	</div>
</template>

<style lang="less" scoped>
.base-font {
  font-family: '新叶念体', sans-serif;
  text-align: start;
}

.notebook-card {
  background-image: url('@/assets/img/light/2.png');
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: 20px 30px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  max-width: 750px;
}

.notebook-inner {
  background: #fef9e7;
  padding: 0 14px;
  background: linear-gradient(transparent 96%, #ccc 0);
  line-height: 2.5em;
  background-size: 100% 2.5em;
  background-attachment: local;
  font-size: 1.125rem;
  color: #333;
}

.quote-content {
  :deep(br) {
    content: '';
    display: block;
    margin-bottom: 0.5em;
  }
}

.author-line {
  text-align: end;
  color: #666;
  margin-top: 0.5em;
}

::-webkit-scrollbar {
  display: none;
}
</style>
