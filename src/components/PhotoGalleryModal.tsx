import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Play, Image as ImageIcon } from 'lucide-react';

interface PhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  title: string;
  initialIndex?: number;
  videoUrl?: string;
}

export const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({
  isOpen,
  onClose,
  images = [],
  title,
  initialIndex = 0,
  videoUrl,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [activeTab, setActiveTab] = useState<'photos' | 'video'>('photos');

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen) return null;

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      id="photo-gallery-modal"
      className="fixed inset-0 z-50 flex flex-col bg-stone-950/95 backdrop-blur-xl text-white animate-in fade-in duration-200"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-stone-800 bg-stone-900/60">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-stone-100 truncate max-w-md sm:max-w-xl">
            {title}
          </h3>
          <p className="text-xs text-stone-400">
            {activeTab === 'photos'
              ? `High-Definition Photo ${currentIndex + 1} of ${images.length}`
              : 'HD Guided Video Walkthrough'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Photos vs Video Tab Toggle */}
          {videoUrl && (
            <div className="flex items-center bg-stone-800 rounded-lg p-1 text-xs">
              <button
                id="gallery-tab-photos"
                type="button"
                onClick={() => setActiveTab('photos')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  activeTab === 'photos' ? 'bg-amber-600 text-white font-medium' : 'text-stone-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photos ({images.length})</span>
              </button>
              <button
                id="gallery-tab-video"
                type="button"
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  activeTab === 'video' ? 'bg-amber-600 text-white font-medium' : 'text-stone-400 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Video Tour</span>
              </button>
            </div>
          )}

          <button
            id="close-gallery-modal-btn"
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-stone-800/80 hover:bg-stone-700 flex items-center justify-center transition-colors text-stone-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        {activeTab === 'photos' ? (
          <>
            {/* Current Image */}
            <div className="relative max-w-6xl max-h-[75vh] flex items-center justify-center select-none">
              <img
                src={images[currentIndex]}
                alt={`${title} - image ${currentIndex + 1}`}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  id="gallery-prev-btn"
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-stone-900/80 hover:bg-amber-600 border border-stone-700 hover:border-amber-500 text-white flex items-center justify-center transition-all shadow-xl hover:scale-105"
                  title="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  id="gallery-next-btn"
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-stone-900/80 hover:bg-amber-600 border border-stone-700 hover:border-amber-500 text-white flex items-center justify-center transition-all shadow-xl hover:scale-105"
                  title="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </>
        ) : (
          /* Video Tour Player */
          <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl border border-stone-800 bg-black">
            <iframe
              src={videoUrl}
              title={`${title} - Video Tour`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {activeTab === 'photos' && images.length > 1 && (
        <div className="px-4 py-3 bg-stone-900/90 border-t border-stone-800 overflow-x-auto scrollbar-none flex items-center justify-center gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              id={`thumbnail-${idx}`}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-md overflow-hidden border-2 transition-all ${
                currentIndex === idx
                  ? 'border-amber-500 ring-2 ring-amber-500/40 scale-105 opacity-100'
                  : 'border-transparent opacity-50 hover:opacity-90'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
