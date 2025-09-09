import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from '@/components/ImageUploader';
import { ImagePreview } from '@/components/ImagePreview';
import { recognizeText } from '@/services/tesseractService';
import { TextExcerpt } from '@/types';

interface AddFormProps {
  chooseId?: string | number | null;
  onSubmit: (data: TextExcerpt) => void;
  onClose: () => void;
  initialData?: TextExcerpt;
}

export const AddForm: React.FC<AddFormProps> = ({ 
  chooseId, 
  onSubmit, 
  onClose,
  initialData 
}) => {
  const [formData, setFormData] = useState<TextExcerpt>({
    content: initialData?.content || '',
    author: initialData?.author || '',
    bookName: initialData?.bookName || '',
  });
  
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof TextExcerpt, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageSelected = async (file: File) => {
    // Revoke the previous object URL to prevent memory leaks
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    setImageUrl(URL.createObjectURL(file));
    setIsLoading(true);

    try {
      const recognizedText = await recognizeText(file);
      setFormData(prev => ({ ...prev, content: recognizedText }));
    } catch (error) {
      console.error('OCR Error:', error);
      alert('识别失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      alert('请输入内容');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const dataToSubmit: TextExcerpt = {
        ...formData,
        id: typeof chooseId === 'number' ? chooseId : undefined,
      };
      
      await onSubmit(dataToSubmit);
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative z-50 max-h-[80vh] flex flex-col items-center overflow-auto rounded-xl bg-white p-6 text-gray-700 shadow-none">
      <div className="relative w-full">
        {!isLoading && (
          <ImageUploader onImageSelected={handleImageSelected} />
        )}
        <ImagePreview imageUrl={imageUrl} />
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 text-white rounded-lg">
            识别中...
          </div>
        )}
      </div>

      <h4 className="block text-2xl text-blue-gray-900 font-semibold leading-snug tracking-normal mt-6 mb-2">
        {chooseId ? '编辑' : '发表'}
      </h4>
      
      <p className="mt-1 block text-base text-gray-700 font-normal leading-relaxed mb-8">
        记录美好的文字片段.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div>
          <label className="block text-base text-blue-gray-900 font-semibold leading-relaxed tracking-normal mb-3">
            内容
          </label>
          <Textarea
            placeholder="内容(必填)"
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            className="min-h-[120px]"
            required
          />
        </div>

        <div>
          <label className="block text-base text-blue-gray-900 font-semibold leading-relaxed tracking-normal mb-3">
            作者
          </label>
          <Input
            placeholder="作者姓名(可选)"
            value={formData.author}
            onChange={(e) => handleInputChange('author', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-base text-blue-gray-900 font-semibold leading-relaxed tracking-normal mb-3">
            书名
          </label>
          <Input
            placeholder="书名(可选)"
            value={formData.bookName}
            onChange={(e) => handleInputChange('bookName', e.target.value)}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? '提交中...' : (chooseId ? '提交编辑' : '提交')}
        </Button>
      </form>
    </div>
  );
};