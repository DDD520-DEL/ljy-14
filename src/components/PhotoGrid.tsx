import { TeamPhoto } from '../../shared/types';
import { Trash2, ZoomIn } from 'lucide-react';

interface PhotoGridProps {
  photos: TeamPhoto[];
  onPhotoClick: (index: number) => void;
  onDelete?: (photoId: number) => void;
  showDelete?: boolean;
}

export default function PhotoGrid({ photos, onPhotoClick, onDelete, showDelete = false }: PhotoGridProps) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          className="relative group aspect-square overflow-hidden rounded-xl shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 animate-fadeInUp"
          style={{ animationDelay: `${index * 50}ms` }}
          onClick={() => onPhotoClick(index)}
        >
          <img
            src={photo.url}
            alt={photo.title || '活动照片'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              {photo.title && (
                <p className="text-white text-sm font-medium truncate">{photo.title}</p>
              )}
            </div>
            <div className="absolute top-2 right-2 flex space-x-2">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
                <ZoomIn className="w-4 h-4" />
              </div>
              {showDelete && onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(photo.id);
                  }}
                  className="p-2 bg-red-500/80 backdrop-blur-sm rounded-full text-white hover:bg-red-600 transition-colors"
                  title="删除照片"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
