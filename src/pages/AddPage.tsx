import React from 'react';
import { AddForm } from '@/components/AddForm';
import { TextExcerpt } from '@/types';

export const AddPage: React.FC = () => {
  const handleSubmit = async (data: TextExcerpt) => {
    // In a real app, this would call an API
    console.log('Submit excerpt:', data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('提交成功！');
  };

  const handleClose = () => {
    // Navigate back or close
    window.history.back();
  };

  return (
    <div className="h-screen w-full bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <AddForm
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      </div>
    </div>
  );
};