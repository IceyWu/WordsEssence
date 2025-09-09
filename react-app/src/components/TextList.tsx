import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard, Mousewheel } from 'swiper/modules';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { TextExcerpt } from '@/types';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface TextListProps {
  onEdit: (data: TextExcerpt) => void;
  onDelete: (id: number) => void;
}

export const TextList: React.FC<TextListProps> = ({ onEdit, onDelete }) => {
  const [excerpts, setExcerpts] = useState<TextExcerpt[]>([
    {
      id: 1,
      content: `"这个爱情故事，好像是个悲剧？"<br />
"你说的是婚姻，爱情没有悲剧。"<br />
对爱者而言，爱情怎么会是悲剧？对春天而言，秋天是它的悲剧吗？<br />
"结尾是什么？"<br />
"等待。"<br />
"之后呢？" <br />
"没有之后" <br />
"或者说，等待的结果呢？" <br />
"等待就是结果。" <br />
"那，不是悲剧吗？" <br />
"不，是秋天"`,
      author: '史铁生',
      bookName: '我与地坛',
    },
    {
      id: 2,
      content: `我的心底锁着一封苍老的信等你来读时，<br />
愿我仍年轻。`,
      author: '陈繁齐',
      bookName: '',
    },
    {
      id: 3,
      content: `我想要偶尔想起你<br />
偶尔疼痛<br />
想起生命里曾经有一场相遇`,
      author: '陈繁齐',
      bookName: '',
    },
    {
      id: 4,
      content: `如果你决定要来找我了<br />
就请你带着足够爱我的容器<br />
好让我把余生的温柔都盛给你`,
      author: '陈繁齐',
      bookName: '',
    },
  ]);

  const [currentExcerpt, setCurrentExcerpt] = useState<TextExcerpt>(excerpts[0]);

  const showName = (data: TextExcerpt) => {
    const authorName = data.author || '佚名';
    const bookName = data.bookName ? `《${data.bookName}》` : '';
    return `${authorName} ${bookName}`;
  };

  const handleSlideChange = (swiper: any) => {
    const currentIndex = swiper.realIndex;
    setCurrentExcerpt(excerpts[currentIndex]);
  };

  const handleEdit = () => {
    onEdit(currentExcerpt);
  };

  const handleDelete = () => {
    if (currentExcerpt.id && window.confirm('确定删除该摘抄吗？')) {
      onDelete(currentExcerpt.id);
      // Remove from local state
      setExcerpts(prev => prev.filter(item => item.id !== currentExcerpt.id));
    }
  };

  const modules = [Navigation, Keyboard, Mousewheel];

  const ExcerptCard: React.FC<{ data: TextExcerpt }> = ({ data }) => (
    <div className="base-bg">
      <div className="base-font note-book">
        <div className="note-book-cover" />
        <p dangerouslySetInnerHTML={{ __html: data.content }} />
        <p className="text-right mt-4">——{showName(data)}</p>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full">
      <Swiper
        className="h-full"
        modules={modules}
        loop={true}
        slidesPerView={1}
        spaceBetween={50}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        keyboard={{ enabled: true }}
        mousewheel={{ enabled: true }}
        direction="vertical"
        onSlideChange={handleSlideChange}
      >
        {excerpts.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="box-border h-full w-full flex items-center justify-center px-12 md:px-48">
              <ExcerptCard data={item} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Action buttons */}
      <div className="fixed bottom-10 right-10 z-50 flex gap-5">
        <Button
          onClick={handleEdit}
          className="flex items-center gap-3 rounded-full bg-white p-3.5 text-blue-gray-900 shadow-xl hover:shadow-lg"
          variant="outline"
        >
          <Edit className="h-4 w-4" />
          编辑
        </Button>
        <Button
          onClick={handleDelete}
          className="flex items-center gap-3 rounded-full bg-white p-3.5 text-blue-gray-900 shadow-xl hover:shadow-lg"
          variant="outline"
        >
          <Trash2 className="h-4 w-4" />
          删除
        </Button>
      </div>
    </div>
  );
};