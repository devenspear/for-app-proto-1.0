import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className={`
          relative bg-white rounded-t-3xl sm:rounded-2xl shadow-large
          w-full ${sizeStyles[size]}
          max-h-[85vh] overflow-hidden
          animate-slide-up
        `}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
            <button
              onClick={onClose}
              className="
                p-2 -mr-2 rounded-xl text-neutral-400
                hover:text-neutral-600 hover:bg-neutral-100
                transition-colors duration-150
              "
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Close button if no title */}
        {!title && (
          <button
            onClick={onClose}
            className="
              absolute top-4 right-4 p-2 rounded-xl
              text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100
              transition-colors duration-150 z-10
            "
          >
            <X size={20} />
          </button>
        )}

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto max-h-[calc(85vh-80px)] scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
};
