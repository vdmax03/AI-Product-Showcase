
import React from 'react';
import { XIcon } from './icons';

interface ModalProps {
  src: string | null;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt="Zoomed view" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-slate-700 text-white rounded-full p-2 hover:bg-slate-600 transition-colors"
          aria-label="Close"
        >
          <XIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Modal;
