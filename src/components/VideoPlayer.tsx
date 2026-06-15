import { useState } from 'react';
import { Play, X, ExternalLink } from 'lucide-react';
import { TeamVideo } from '../../shared/types';

interface VideoPlayerProps {
  video: TeamVideo;
  onClose?: () => void;
}

export function getVideoEmbedUrl(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtube.com') 
      ? new URL(url).searchParams.get('v')
      : url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('bilibili.com')) {
    const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
    if (bvMatch) {
      return `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}`;
    }
  }
  return url;
}

export default function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const embedUrl = getVideoEmbedUrl(video.url);
  const isEmbedSupported = video.url.includes('youtube.com') || 
                           video.url.includes('youtu.be') || 
                           video.url.includes('bilibili.com');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 truncate" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
            {video.title}
          </h3>
          <div className="flex items-center space-x-3">
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-1.5 bg-orange-100 text-orange-600 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>原站观看</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="relative bg-black aspect-video">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            </div>
          )}
          
          {isEmbedSupported ? (
            <iframe
              src={embedUrl}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-8">
              <Play className="w-20 h-20 text-orange-500 mb-4" />
              <p className="text-white text-lg mb-2">该视频暂不支持内嵌播放</p>
              <p className="text-gray-400 text-sm mb-6">请点击下方按钮在原网站观看</p>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold hover:shadow-lg transition-all"
              >
                <ExternalLink className="w-5 h-5" />
                <span>打开视频</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
