import { useState, useEffect, useRef, useCallback } from 'react';
import { TeamPhoto } from '../../shared/types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoViewerProps {
  photos: TeamPhoto[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function PhotoViewer({ photos, initialIndex, isOpen, onClose }: PhotoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPhotos = photos.length;

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          goToPrev();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? totalPhotos - 1 : prev - 1));
  }, [totalPhotos]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === totalPhotos - 1 ? 0 : prev + 1));
  }, [totalPhotos]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(null);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    setTouchEndX(currentX);
    setDragOffset(currentX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const diff = touchEndX - touchStartX;
      const threshold = 50;
      
      if (diff > threshold) {
        goToPrev();
      } else if (diff < -threshold) {
        goToNext();
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStartX(e.clientX);
    setTouchEndX(null);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || touchStartX === null) return;
    setTouchEndX(e.clientX);
    setDragOffset(e.clientX - touchStartX);
  };

  const handleMouseUp = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const diff = touchEndX - touchStartX;
      const threshold = 50;
      
      if (diff > threshold) {
        goToPrev();
      } else if (diff < -threshold) {
        goToNext();
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setTouchStartX(null);
      setTouchEndX(null);
      setIsDragging(false);
      setDragOffset(0);
    }
  };

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white transition-colors"
        title="关闭"
      >
        <X className="w-8 h-8" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); goToPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full"
        title="上一张"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); goToNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full"
        title="下一张"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      <div
        ref={containerRef}
        className="relative w-full max-w-5xl max-h-[85vh] mx-4 select-none cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: isDragging 
              ? `translateX(${dragOffset}px)` 
              : 'translateX(0)',
            transitionDuration: isDragging ? '0ms' : '300ms'
          }}
        >
          <div className="w-full flex-shrink-0 flex items-center justify-center">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.title || '活动照片'}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              draggable={false}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4 text-white">
        <span className="text-lg font-medium">
          {currentIndex + 1} / {totalPhotos}
        </span>
        {currentPhoto.title && (
          <span className="text-white/70 text-sm hidden sm:block">
            {currentPhoto.title}
          </span>
        )}
      </div>

      <div className="absolute bottom-6 right-4 flex space-x-1 sm:hidden">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-6'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/50 text-xs hidden sm:block">
        点击左右箭头或滑动切换照片 · 按 ESC 关闭
      </div>
    </div>
  );
}
