
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
        className="relative aspect-[3/4] bg-slate-900/60 backdrop-blur-xl border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 group ring-1 ring-white/10 hover:ring-blue-500/40 hover:border-blue-500/60"
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
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-opacity shadow"
              aria-label="Remove image"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="relative text-center text-gray-300">
            <div className="absolute inset-0 rounded-xl pointer-events-none [mask-image:radial-gradient(40%_50%_at_50%_50%,black,transparent)]">
              <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-blue-500/10 via-cyan-400/10 to-transparent animate-pulse" />
            </div>
            <UploadIcon className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-400 transition-colors" />
            <p className="text-sm font-medium">Click to upload</p>
            <p className="text-[11px] mt-1 text-gray-400">PNG, JPG, atau WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
