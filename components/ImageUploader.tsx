
import React, { useRef, useState, useCallback, ChangeEvent } from 'react';
import { UploadIcon, XIcon } from './icons';

interface ImageUploaderProps {
  id: string;
  title: string;
  description: string;
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, description, onImageUpload, onImageRemove }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        onImageUpload(file);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleRemoveImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onImageRemove]);

  const handleUploaderClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
      <p className="text-xs text-gray-400 mb-2">{description}</p>
      <div
        onClick={handleUploaderClick}
        className="relative aspect-[3/4] bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors duration-200 group"
      >
        <input
          type="file"
          id={id}
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        {imagePreview ? (
          <>
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75 transition-opacity"
              aria-label="Remove image"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="text-center text-gray-400">
            <UploadIcon className="w-8 h-8 mx-auto mb-2 group-hover:text-blue-500" />
            <p className="text-sm font-medium">Click to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
