import React, { useRef, useState, useCallback, ChangeEvent } from 'react';
import { UploadIcon, XIcon } from './icons';

interface MultiImageUploaderProps {
  onImageChange: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  className?: string;
  maxFiles?: number;
}

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({ 
  onImageChange, 
  multiple = false, 
  accept = "image/*", 
  className = "",
  maxFiles = 10
}) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    if (selectedFiles.length === 0) return;

    // Limit number of files
    const limitedFiles = selectedFiles.slice(0, maxFiles);
    
    // Read files and create previews
    const newFiles = [...files, ...limitedFiles];
    const newPreviews: string[] = [];
    
    limitedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === limitedFiles.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
          setFiles(newFiles);
          onImageChange(newFiles);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [files, onImageChange, maxFiles]);

  const handleRemoveImage = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setFiles(newFiles);
    setImagePreviews(newPreviews);
    onImageChange(newFiles);
  }, [files, imagePreviews, onImageChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      const limitedFiles = imageFiles.slice(0, maxFiles - files.length);
      const newFiles = [...files, ...limitedFiles];
      const newPreviews: string[] = [];
      
      limitedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === limitedFiles.length) {
            setImagePreviews(prev => [...prev, ...newPreviews]);
            setFiles(newFiles);
            onImageChange(newFiles);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }, [files, onImageChange, maxFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <div
        className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center cursor-pointer hover:border-white/50 transition-colors duration-200 bg-white/5 hover:bg-white/10"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <UploadIcon className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <p className="text-white font-medium text-lg mb-2">
              {multiple ? 'Upload Multiple Images' : 'Upload Image'}
            </p>
            <p className="text-purple-200 text-sm">
              {multiple 
                ? `Drag & drop images here or click to browse (max ${maxFiles})`
                : 'Drag & drop image here or click to browse'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <XIcon className="w-4 h-4 text-white" />
                </button>
                <div className="absolute bottom-1 left-1 right-1 bg-black/50 rounded px-1 py-0.5">
                  <p className="text-white text-xs truncate">
                    {files[index]?.name || `Image ${index + 1}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-purple-200 text-sm">
              {files.length} of {maxFiles} images uploaded
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiImageUploader;
