<script setup lang="ts">
import { to } from "@iceywu/utils";
import { ElMessage } from "element-plus";
import gsap from "gsap";
import { A11y, Keyboard, Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import { deleteWords, getWordsList } from "@/api/words";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/mousewheel";
import "swiper/css/keyboard";

const emit = defineEmits(["edit"]);

const chooseVal = ref({});
const dataList = ref<DataItem[]>([
  {
    content: `"这个爱情故事，好像是个悲剧？"<br />"你说的是婚姻，爱情没有悲剧。"`,
    author: "史铁生",
    book_name: "我与地坛",
  },
]);

const isAnimating = ref(false);

function onSlideChange(data) {
  const dataListVal = dataList.value[data.activeIndex];
  chooseVal.value = dataListVal;

  if (isAnimating.value) return;
  isAnimating.value = true;

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating.value = false;
    },
  });

  // 整体淡入淡出 + 轻微位移
  tl.fromTo(
    ".content-wrapper",
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
  );

  // 文字逐字显现效果
  tl.fromTo(
    ".quote-text",
    { opacity: 0, filter: "blur(8px)" },
    { opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power2.out" },
    "-=0.5"
  );

  // 分隔线展开
  tl.fromTo(
    ".divider-line",
    { scaleX: 0 },
    { scaleX: 1, duration: 0.5, ease: "power2.out" },
    "-=0.3"
  );

  // 作者信息淡入
  tl.fromTo(
    ".author-info",
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
    "-=0.2"
  );
}

const swiperRef = ref();
const chooseIndex = computed(() => swiperRef.value?.activeIndex);

const modules = [Navigation, A11y, Keyboard, Mousewheel];
const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

interface DataItem {
  author?: string;
  title?: string;
  content: string;
  bookName?: string;
  book_name?: string;
  id?: number;
}

function showName(data: DataItem) {
  const { author, book_name } = data;
  const authorName = author || "佚名";
  const bookNameTemp = book_name ? `《${book_name}》` : "";
  return `${authorName} ${bookNameTemp}`;
}

const navigation = {
  nextEl: ".swiper-button-next",
  prevEl: ".swiper-button-prev",
};

const getDataLoading = ref(false);
async function getWordsData() {
  if (getDataLoading.value) return;
  getDataLoading.value = true;
  const params = { page: 1, page_size: 1000 };

  const [_, res] = await to(getWordsList(params));
  if (res) {
    const { code, data = {} } = res || {};
    if (code === 200 && data) {
      const { list = [] } = data || {};
      const tempData = list.map((item) => ({
        ...item,
        book_name: item.bookName,
        content: item.content.replace(/\n/g, "<br>"),
      }));
      dataList.value = tempData || [];
      chooseVal.value = dataList.value[0];
    }
  }
  getDataLoading.value = false;
}

function handleEdit() {
  emit("edit", chooseVal.value);
}

const isDeleteDialogOpen = ref(false);

function handleDelete() {
  isDeleteDialogOpen.value = true;
}

async function confirmDelete() {
  const id = chooseVal.value?.id;
  const index = chooseIndex.value;
  const [_, res] = await to(deleteWords(id));
  console.log("🐠-----res-----", res);
  if (res?.code === 200 || 1) {
    dataList.value.splice(index, 1);
    ElMessage({ type: "success", message: "删除成功" });
  }
  isDeleteDialogOpen.value = false;
}

// 入场动画 - 更加惊艳
function initAnimations() {
  const tl = gsap.timeline({ delay: 0.2 });

  // 背景渐变显现
  tl.fromTo(".page-bg", { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.out" });

  // 内容区域从下方升起
  tl.fromTo(
    ".content-wrapper",
    { opacity: 0, y: 80, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power4.out" },
    "-=0.6"
  );

  // 文字模糊淡入 - 像墨水晕染
  tl.fromTo(
    ".quote-text",
    { opacity: 0, filter: "blur(12px)", y: 20 },
    { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.8, ease: "power2.out" },
    "-=0.5"
  );

  // 分隔线从中间展开
  tl.fromTo(
    ".divider-line",
    { scaleX: 0 },
    { scaleX: 1, duration: 0.6, ease: "power3.out" },
    "-=0.4"
  );

  // 作者信息淡入
  tl.fromTo(
    ".author-info",
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
    "-=0.3"
  );

  // 按钮依次弹入
  gsap.fromTo(
    ".action-btn",
    { opacity: 0, scale: 0.5, y: 20 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "back.out(1.7)",
      delay: 1.2,
    }
  );

  // 滚动提示
  gsap.fromTo(
    ".scroll-indicator",
    { opacity: 0, y: -15 },
    { opacity: 0.4, y: 0, duration: 0.5, delay: 1.5 }
  );

  // 持续浮动动画
  gsap.to(".scroll-indicator", {
    y: 10,
    duration: 1.2,
    ease: "power1.inOut",
    repeat: -1,
    yoyo: true,
    delay: 2,
  });
}

function onBtnHover(e: MouseEvent) {
  gsap.to(e.currentTarget, {
    scale: 1.1,
    duration: 0.25,
    ease: "power2.out",
  });
}

function onBtnLeave(e: MouseEvent) {
  gsap.to(e.currentTarget, {
    scale: 1,
    duration: 0.25,
    ease: "power2.out",
  });
}

onMounted(() => {
  getWordsData();
  nextTick(() => {
    initAnimations();
  });
});

defineExpose({ getWordsData });
</script>


<template>
	<div class="text-list-container">
		<!-- 背景层 -->
		<div class="page-bg" />

		<DefineTemplate v-slot="{ data }">
			<div class="content-wrapper">
				<!-- 主要内容 -->
				<div class="quote-text" v-html="data.content" />

				<!-- 分隔线 -->
				<div class="divider-line" />

				<!-- 作者信息 -->
				<div class="author-info">
					{{ showName(data) }}
				</div>
			</div>
		</DefineTemplate>

		<Swiper
			ref="swiperRef"
			class="h-full"
			:modules="modules"
			:loop="true"
			:slides-per-view="1"
			:space-between="50"
			:navigation="navigation"
			:keyboard="{ enabled: true }"
			:mousewheel="{ enabled: true }"
			direction="vertical"
			@slide-change="onSlideChange"
		>
			<SwiperSlide v-for="(item, index) in dataList" :key="index">
				<div class="slide-wrapper">
					<ReuseTemplate :data="item" />
				</div>
			</SwiperSlide>
		</Swiper>

		<!-- 滚动提示 -->
		<div class="scroll-hint">
			<div class="scroll-indicator">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 5v14" />
					<path d="m19 12-7 7-7-7" />
				</svg>
			</div>
		</div>

		<!-- 操作按钮 -->
		<div class="action-buttons">
			<button class="action-btn" @click="handleEdit" @mouseenter="onBtnHover" @mouseleave="onBtnLeave">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
					<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
				</svg>
			</button>
			<button class="action-btn" @click="handleDelete" @mouseenter="onBtnHover" @mouseleave="onBtnLeave">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="3 6 5 6 21 6" />
					<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
				</svg>
			</button>
		</div>

		<AlertDialog v-model:open="isDeleteDialogOpen">
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>提示</AlertDialogTitle>
					<AlertDialogDescription>
						确定删除该摘抄吗?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>取消</AlertDialogCancel>
					<AlertDialogAction @click="confirmDelete">确定</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	</div>
</template>


<style lang="less" scoped>
.text-list-container {
	height: 100%;
	width: 100%;
	position: relative;
	overflow: hidden;
	overflow-x: hidden;
}

.page-bg {
	position: absolute;
	inset: 0;
	background: #fafafa;

	// 细腻的纸张纹理
	&::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image:
			radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.02) 0%, transparent 60%);
	}
}

.slide-wrapper {
	box-sizing: border-box !important;
	display: flex !important;
	height: 100% !important;
	width: 100% !important;
	align-items: center !important;
	justify-content: center !important;
	padding: 60px 24px !important;
	overflow: hidden !important;

	@media (min-width: 768px) {
		padding: 80px 48px !important;
	}

	@media (min-width: 1024px) {
		padding: 80px 120px !important;
	}
}

.content-wrapper {
	max-width: 720px;
	width: 100%;
	box-sizing: border-box;
	overflow: hidden;
}

.quote-text {
	font-family: '新叶念体', 'Noto Serif SC', 'STSong', 'SimSun', serif;
	font-size: 1.1rem;
	line-height: 2.2;
	color: #1a1a1a;
	letter-spacing: 0.02em;
	text-align: left;

	@media (min-width: 768px) {
		font-size: 1.4rem;
		line-height: 2.5;
		letter-spacing: 0.05em;
		text-align: justify;
	}

	@media (min-width: 1024px) {
		font-size: 1.5rem;
		line-height: 2.6;
	}

	:deep(br) {
		content: '';
		display: block;
		margin-bottom: 0.1em;
	}
}

.divider-line {
	width: 50px;
	height: 1px;
	background: #1a1a1a;
	margin: 2rem auto;
	opacity: 0.15;
	transform-origin: center;

	@media (min-width: 768px) {
		width: 60px;
		margin: 2.5rem auto;
	}
}

.author-info {
	font-family: '新叶念体', 'Noto Serif SC', serif;
	text-align: center;
	color: #555;
	font-size: 1rem;
	letter-spacing: 0.1em;

	@media (min-width: 768px) {
		font-size: 1.1rem;
		letter-spacing: 0.12em;
	}

	@media (min-width: 768px) {
		font-size: 1rem;
		letter-spacing: 0.1em;
	}
}

.scroll-hint {
	position: fixed;
	bottom: 1.25rem;
	left: 50%;
	transform: translateX(-50%);
	z-index: 50;
	pointer-events: none;

	@media (min-width: 768px) {
		bottom: 2rem;
	}
}

.scroll-indicator {
	color: #999;
}

.action-buttons {
	position: fixed;
	bottom: 1.25rem;
	right: 1rem;
	z-index: 999;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	@media (min-width: 768px) {
		bottom: 2rem;
		right: 2rem;
		gap: 0.75rem;
	}
}

.action-btn {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	border: 1px solid rgba(0, 0, 0, 0.08);
	background: rgba(255, 255, 255, 0.95);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: #555;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
	transition: all 0.2s ease;

	@media (min-width: 768px) {
		width: 44px;
		height: 44px;
	}

	&:hover {
		color: #1a1a1a;
		border-color: rgba(0, 0, 0, 0.15);
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
	}
}

::-webkit-scrollbar {
	display: none;
}

:deep(.swiper) {
	height: 100%;
	width: 100%;
	overflow: hidden;
}

:deep(.swiper-slide) {
	height: 100%;
	width: 100%;
	overflow: hidden;
}

:deep(.swiper-wrapper) {
	width: 100%;
}
</style>
