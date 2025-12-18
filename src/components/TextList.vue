<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { to } from '@iceywu/utils'
import {
	A11y,
	Navigation,
	Keyboard,
	Mousewheel,
} from 'swiper/modules'

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'
import { deleteWords, getWordsList } from '@/api/words'

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
			<div class="base-bg">
					<div class="base-font note-book">
				<div class="note-book-cover" />
				<p class=" " v-html="data.content" />
				<p class="text-end">——{{ showName(data) }}</p>
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
				<div class="box-border h-full w-full fcc px-48">
					<ReuseTemplate :data="item" />
				</div>
			</SwiperSlide>

			<!-- <div
				class="swiper-button-prev btn-icon !text-[#374151]"
				@click.stop="prevEl(item, index)"
			/>

			<div
				class="btn-icon swiper-button-next !text-[#374151]"
				@click.stop="nextEl"
			/> -->
		</Swiper>
		<div class="fixed bottom-10 right-10 z-999 flex gap-5">
			<button
				class="flex select-none items-center gap-3 rounded-full bg-white p-3.5 text-center align-middle text-sm text-blue-gray-900 font-bold font-sans uppercase shadow-blue-gray-500/10 shadow-xl transition-all disabled:pointer-events-none active:opacity-[0.85] disabled:opacity-50 focus:opacity-[0.85] active:shadow-none disabled:shadow-none focus:shadow-none hover:shadow-blue-gray-500/20 hover:shadow-lg"
				type="button"
				@click="handleEdit"
			>
				编辑
			</button>
			<button
				class="flex select-none items-center gap-3 rounded-full bg-white p-3.5 text-center align-middle text-sm text-blue-gray-900 font-bold font-sans uppercase shadow-blue-gray-500/10 shadow-xl transition-all disabled:pointer-events-none active:opacity-[0.85] disabled:opacity-50 focus:opacity-[0.85] active:shadow-none disabled:shadow-none focus:shadow-none hover:shadow-blue-gray-500/20 hover:shadow-lg"
				type="button"
				@click="handleDelete"
			>
				删除
			</button>
		</div>
	</div>
</template>

<style lang="less" scoped>
.read-the-docs {
  color: #888;
  font-size: 1.2rem;
  animation: slide-up 0.5s ease-out;
}

@keyframes slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.base-font {
  // font-family: 'SmileySansOblique';
  font-family: '新叶念体';
  text-align: start;
}
.btn-icon {
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  /* background: rgba(255, 255, 255, 0.4); */
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.025),
    0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s;
  &:after {
    font-size: 25px !important;
  }
  &:hover {
    transform: scale(1.1);
  }
}
.note-book {
  height: 100%;
  width: 100%;
  background: #fef9e7;
  padding: 0px 14px;
  box-sizing: border-box;
  // border-radius: 4px;
  // box-shadow: 0 0 4px #b2babb;

  background: linear-gradient(transparent 96%, #999 0);
  line-height: 2.5em;
  background-size: 100% 2.5em;
  background-attachment: local;
  position: relative;
}
.note-book-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.base-bg {
  background-image: url('@/assets/img/light/2.png');
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: 20px 30px;
  box-shadow: 0 0 4px #b2babb;
  box-sizing: border-box;
  border-radius: 2px;
  font-size: large;
}
// 隐藏滚动条
::-webkit-scrollbar {
  display: none;
}
</style>
