import React, { useState, useEffect } from 'react';
import { TextExcerpt } from '@/types';

export const ListPage: React.FC = () => {
  const [excerpts, setExcerpts] = useState<TextExcerpt[]>([]);
  const [loading, setLoading] = useState(false);

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = Array.from({ length: 12 }, (_, index) => {
        const id = index + 1;
        const width = Math.floor(Math.random() * 200 + 200);
        const height = Math.floor(Math.random() * 300 + 300);
        
        return {
          id,
          title: `消息标题${id}`,
          content: `消息内容${id}`,
          author: `作者${id}`,
          bookName: `书名${id}`,
          create_time: '2021-08-01 12:00:00',
        };
      });
      
      setExcerpts(data);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleItemClick = (data: TextExcerpt) => {
    console.log('Item clicked:', data);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-5 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {excerpts.map((item) => (
          <div
            key={item.id}
            className="relative w-full flex flex-col rounded-xl bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleItemClick(item)}
          >
            <div className="relative m-0 h-48 w-full overflow-hidden rounded-xl rounded-b-none bg-white">
              <img
                src={`https://picsum.photos/300/200?random=${item.id}`}
                alt="card-image"
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <h6 className="mb-4 block text-base text-gray-700 font-semibold leading-relaxed tracking-normal uppercase">
                摘抄
              </h6>
              
              <h4 className="mb-2 block text-2xl text-blue-gray-900 font-semibold leading-snug tracking-normal">
                {item.title}
              </h4>
              
              <p className="mb-8 block text-base text-gray-700 font-normal leading-relaxed">
                {item.content}
              </p>
              
              <button
                className="flex select-none items-center gap-2 rounded-lg px-6 py-3 text-center align-middle text-xs text-gray-900 font-bold uppercase transition-all hover:bg-gray-900/10 active:bg-gray-900/20"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemClick(item);
                }}
              >
                Learn More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};