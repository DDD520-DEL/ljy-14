import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Image as ImageIcon } from 'lucide-react';
import { TeamPostWithTeam } from '../../shared/types';
import { useState } from 'react';

interface PostCardProps {
  post: TeamPostWithTeam;
  delay?: number;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

export default function PostCard({ post, delay = 0 }: PostCardProps) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const handleMapClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/map?teamId=${post.teamId}&lat=${post.parkLat}&lng=${post.parkLng}`);
  };

  const renderImages = () => {
    if (!post.images || post.images.length === 0) return null;

    const validImages = post.images.filter((_, i) => !imageError[i]);
    if (validImages.length === 0) return null;

    const gridClass =
      post.images.length === 1
        ? 'grid-cols-1'
        : post.images.length === 2
        ? 'grid-cols-2'
        : post.images.length === 4
        ? 'grid-cols-2'
        : 'grid-cols-3';

    return (
      <div className={`grid ${gridClass} gap-2 mt-4`}>
        {post.images.map((img, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-xl bg-gray-100 ${
              post.images!.length === 1 ? 'aspect-video' : 'aspect-square'
            }`}
          >
            {!imageError[idx] && (
              <img
                src={img}
                alt={`动态图片${idx + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                onError={() => setImageError((prev) => ({ ...prev, [idx]: true }))}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-5">
        <div className="flex items-start space-x-3 mb-4">
          <Link to={`/teams/${post.teamId}`} className="flex-shrink-0">
            <img
              src={post.teamAvatar}
              alt={post.teamName}
              className="w-12 h-12 rounded-full border-2 border-orange-200 shadow object-cover hover:scale-105 transition-transform"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link to={`/teams/${post.teamId}`}>
              <h4
                className="font-bold text-gray-800 hover:text-orange-600 transition-colors"
                style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
              >
                {post.teamName}
              </h4>
            </Link>
            <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
              {post.teamDistrict && <span>{post.teamDistrict}</span>}
              <div className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(post.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {renderImages()}

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={handleMapClick}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 text-sm font-medium hover:from-blue-100 hover:to-cyan-100 hover:shadow-md transition-all duration-300 group"
          >
            <MapPin className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
            <span className="truncate max-w-[160px]">{post.parkName}</span>
            <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform">→</span>
          </button>

          {post.images && post.images.length > 0 && (
            <div className="flex items-center space-x-1 text-gray-400 text-sm">
              <ImageIcon className="w-4 h-4" />
              <span>{post.images.length}张图片</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
