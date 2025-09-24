import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { CopyIcon, ZoomIcon, DownloadIcon, VideoIcon, XIcon } from './icons';

interface ImageCardProps {
  image: GeneratedImage;
  onZoom: (src: string) => void;
  onGenerateVideo: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

const ActionButton: React.FC<{ onClick?: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-md hover:bg-white/20 transition-all duration-200"
  >
    {children}
  </button>
);

const ImageCard: React.FC<ImageCardProps> = ({ image, onZoom, onGenerateVideo, onDelete, onToggleFavorite }) => {
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
    <div className="relative aspect-[9/16] group overflow-hidden rounded-lg shadow-lg bg-slate-900">
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
        <img src={image.src} alt="Generated product shot" className="w-full h-full object-cover" />
      )}

      {/* Loading Overlay */}
      {image.isVideoGenerating && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white p-4 text-center">
            <svg className="animate-spin h-8 w-8 text-white mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          <p className="font-semibold text-sm">Generating Video</p>
          <p className="text-xs text-gray-300">This may take a few minutes...</p>
        </div>
      )}

      {/* Error Overlay */}
      {image.videoError && !image.isVideoGenerating && (
          <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center text-white p-4 text-center">
            <XIcon className="w-8 h-8 mb-2"/>
            <p className="font-semibold text-sm">Video Failed</p>
            <p className="text-xs text-gray-200 mt-1">{image.videoError}</p>
          </div>
      )}

      {/* Actions Overlay (only show if not loading) */}
      {!image.isVideoGenerating && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
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
                <ActionButton onClick={() => onGenerateVideo(image.id)}>
                  <VideoIcon className="w-4 h-4 mr-2" />
                  Generate Video
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
