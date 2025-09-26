import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { CopyIcon, ZoomIcon, DownloadIcon, PromptIcon, XIcon } from './icons';

interface ImageCardProps {
  image: GeneratedImage;
  onZoom: (src: string) => void;
  onGeneratePrompt: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

const ActionButton: React.FC<{ onClick?: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-all duration-200 shadow-sm hover:shadow"
  >
    {children}
  </button>
);

const ImageCard: React.FC<ImageCardProps> = ({ image, onZoom, onGeneratePrompt, onDelete, onToggleFavorite }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.videoSrc || image.src; // Download video if it exists, else image
    link.download = `ai-showcase-${image.id}.${image.videoSrc ? 'mp4' : 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative aspect-[9/16] group overflow-hidden rounded-xl shadow-xl bg-slate-900 ring-1 ring-white/10">
      {/* Top-right quick actions */}
      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onToggleFavorite && (
          <button
            title="Favorit"
            onClick={() => onToggleFavorite(image.id)}
            className={`px-2 py-1 text-[10px] rounded-md ${image.isFavorite ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            {image.isFavorite ? '★' : '☆'}
          </button>
        )}
        {onDelete && (
          <button
            title="Hapus"
            onClick={() => onDelete(image.id)}
            className="px-2 py-1 text-[10px] rounded-md bg-red-600 text-white hover:bg-red-500"
          >
            Hapus
          </button>
        )}
      </div>
      {image.videoSrc ? (
        <video
          src={image.videoSrc}
          poster={image.src}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          controls
        />
      ) : (
        <img src={image.src} alt="Generated product shot" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
      )}

      {/* Error Overlay */}
      {image.videoError && (
          <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center text-white p-4 text-center">
            <XIcon className="w-8 h-8 mb-2"/>
            <p className="font-semibold text-sm">Video Failed</p>
            <p className="text-xs text-gray-200 mt-1">{image.videoError}</p>
          </div>
      )}

      {/* Actions Overlay (only show if not loading) */}
      {!image.isVideoGenerating && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <p className="text-white text-xs mb-3 leading-snug">{image.prompt}</p>
          <div className="space-y-2">
            <ActionButton onClick={handleCopyPrompt}>
              <CopyIcon className="w-4 h-4 mr-2" />
              {copied ? 'Copied!' : 'Copy Prompt'}
            </ActionButton>

            {image.videoSrc ? (
              <ActionButton onClick={handleDownload}>
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Download Video
              </ActionButton>
            ) : (
              <>
        <ActionButton onClick={() => onGeneratePrompt(image.id)}>
          <PromptIcon className="w-4 h-4 mr-2" />
          Generate Veo 3 Prompt
        </ActionButton>
                <ActionButton onClick={() => onZoom(image.src)}>
                  <ZoomIcon className="w-4 h-4 mr-2" />
                  Zoom Image
                </ActionButton>
                <ActionButton onClick={handleDownload}>
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Download Image
                </ActionButton>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCard;
