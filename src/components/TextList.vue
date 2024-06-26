<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { getWordsList, deleteWords } from '@/api/words'
import { to } from '@iceywu/utils'
import {
	Navigation,
	// Pagination,
	Scrollbar,
	A11y,
	Keyboard,
	Mousewheel,
} from 'swiper/modules'

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import 'swiper/css/mousewheel'
import 'swiper/css/keyboard'
import 'swiper/css/mousewheel'
// Import Swiper styles
// const onSwiper = (swiper) => {
// 	console.log('🐳-----swiper-----', swiper)
// }
const onSlideChange = () => {
	console.log('slide change')
}

const modules = [Navigation, Scrollbar, A11y, Keyboard, Mousewheel]

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()
interface DataItem {
	author?: string
	title?: string
	content: string
	bookName?: string
}
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
const showName = (data: DataItem) => {
	const { author, book_name } = data
	const authorName = author ? author : '佚名'
	const bookNameTemp = book_name ? `《${book_name}》` : ''
	return `${authorName} ${bookNameTemp}`
}
const navigation = {
	nextEl: '.swiper-button-next',
	prevEl: '.swiper-button-prev',
}
const nextEl = () => {
	console.log('nextEl')
}
const prevEl = (item: DataItem, index: number) => {
	console.log('prevEl', item, index)
}
function formatStringWithBr(str: string) {
	let punctuationRegex =
		/([，。！？；：“”‘’（）《》【】〈〉，.。!?;:"''()《》【】〈〉])/g
	return str.replace(punctuationRegex, function (match) {
		return match + '<br />'
	})
}

// 🌈 接口数据请求
const getDataLoading = ref(false)
const getWordsData = async () => {
	if (getDataLoading.value) return
	getDataLoading.value = true
	const params = {}
	// eslint-disable-next-line no-unused-vars
	const [_, res] = await to(getWordsList(params))
	if (res) {
		const { code, result = {} } = res || {}
		if (code === 200 && result) {
			// console.log('😊-----数据获取成功-----', result)
			const { data = [] } = result || {}
			const tempData = data.map((item) => {
				return {
					...item,
					// content: formatStringWithBr(item.content),
					book_name: item.bookName,
					content: item.content.replace(/\n/g, '<br>'),
				}
			})
			console.log('🌈-----tempData-----', tempData)
			dataList.value = tempData || []
		}
	}

	getDataLoading.value = false
}
const emit = defineEmits(['edit'])
const handleEdit = (item, index) => {
	emit('edit', item)
}
const handleDelete = async (id: any, index) => {
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
// 	console.log('🍪-----swiperRef.value-----', swiperRef.value);
// 	return swiperRef.value?.activeIndex
// })
</script>

<template>
	<div class="h-full w-full">
		<DefineTemplate v-slot="{ data }">
			<div class="base-font">
				<p class="text-xl line-height-10" v-html="data.content"></p>
				<p class="mt-5 text-end text-lg">——{{ showName(data) }}</p>
			</div>
		</DefineTemplate>
		<!-- 列表 -->
		<swiper
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
			<swiper-slide v-for="(item, index) in dataList" :key="index">
				<div class="fixed bottom-10 right-10 flex gap-5">
					<button
						class="flex select-none items-center gap-3 rounded-full bg-white p-3.5 text-center align-middle text-sm text-blue-gray-900 font-bold font-sans uppercase shadow-blue-gray-500/10 shadow-xl transition-all disabled:pointer-events-none active:opacity-[0.85] disabled:opacity-50 focus:opacity-[0.85] active:shadow-none disabled:shadow-none focus:shadow-none hover:shadow-blue-gray-500/20 hover:shadow-lg"
						type="button"
						@click="handleEdit(item, index)"
					>
						编辑
					</button>
					<button
						class="flex select-none items-center gap-3 rounded-full bg-white p-3.5 text-center align-middle text-sm text-blue-gray-900 font-bold font-sans uppercase shadow-blue-gray-500/10 shadow-xl transition-all disabled:pointer-events-none active:opacity-[0.85] disabled:opacity-50 focus:opacity-[0.85] active:shadow-none disabled:shadow-none focus:shadow-none hover:shadow-blue-gray-500/20 hover:shadow-lg"
						type="button"
						@click="handleDelete(item.id, index)"
					>
						删除
					</button>
				</div>

				<div class="box-border h-full w-full fcc px-13">
					<ReuseTemplate :data="item" />
				</div>
			</swiper-slide>

			<div
				class="swiper-button-prev btn-icon !text-[#374151]"
				@click.stop="prevEl(item, index)"
			/>

			<!--左箭头。如果放置在swiper外面，需要自定义样式。-->
			<div
				class="btn-icon swiper-button-next !text-[#374151]"
				@click.stop="nextEl"
			/>
		</swiper>
		<div></div>
	</div>
</template>

<style scoped>
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
	font-family: 'SmileySansOblique';
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
</style>
