<script setup lang="ts">
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
		““等待就是结果。” <br />
		“那，不是悲剧吗？” <br />
		“不，是秋天” <br />
		`,
		author: '史铁生',
		bookName: '我与地坛',
	},
	{
		content: `
		我的心底锁着一封苍老的信等你来读时，<br />
		愿我仍年轻。
		`,
		author: '陈繁齐',
		bookName: '',
	},
	{
		content: `
		我想要偶尔想起你<br />
		偶尔疼痛<br />
		想起生命里曾经有一场相遇
		`,
		author: '陈繁齐',
		bookName: '',
	},
	{
		content: `
		如果你决定要来找我了<br />
		就请你带着足够爱我的容器<br />
		好让我把余生的温柔都盛给你
		`,
		author: '陈繁齐',
		bookName: '',
	},
])
const showName = (data: DataItem) => {
	const { author, bookName } = data
	const authorName = author ? author : '佚名'
	const bookNameTemp = bookName ? `《${bookName}》` : ''
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
</script>

<template>
	<div class="h-full w-full">
		<DefineTemplate v-slot="{ data }">
			<div class="base-font">
				<p class="text-xl" v-html="data.content"></p>
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
				class="swiper-button-next btn-icon !text-[#374151]"
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
