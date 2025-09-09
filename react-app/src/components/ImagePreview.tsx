import React from 'react';

interface ImagePreviewProps {
  imageUrl: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl }) => {
  if (!imageUrl) return null;

  return (
    <div className="mt-4">
      <div className="relative max-w-md mx-auto">
        <img
          src={imageUrl}
          alt="Preview"
          className="w-full h-auto rounded-lg shadow-md"
          style={{ maxHeight: '300px', objectFit: 'contain' }}
        />
      </div>
    </div>
  );
};