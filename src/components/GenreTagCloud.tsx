import { useState } from 'react';
import { Music, X } from 'lucide-react';
import { Song } from '../../shared/types';

interface GenreTagCloudProps {
  songs: (Song & { teamName?: string; weeklyAddictScore?: number; weeklyAddictVotes?: number })[];
  selectedGenre: string | null;
  onGenreSelect: (genre: string | null) => void;
}

interface GenreStats {
  genre: string;
  count: number;
  percentage: number;
}

const genreColors: Record<string, string> = {
  '流行': 'from-pink-400 to-rose-500',
  '民族': 'from-emerald-400 to-teal-500',
  '古典': 'from-purple-400 to-violet-500',
  '健身操': 'from-orange-400 to-red-500',
  '爵士': 'from-blue-400 to-indigo-500',
  '拉丁': 'from-yellow-400 to-amber-500',
  'DJ版': 'from-fuchsia-400 to-purple-500',
  '摇滚': 'from-slate-500 to-gray-700',
  '民谣': 'from-green-400 to-emerald-500',
};

const getGenreColor = (genre: string): string => {
  return genreColors[genre] || 'from-gray-400 to-gray-600';
};

export default function GenreTagCloud({ songs, selectedGenre, onGenreSelect }: GenreTagCloudProps) {
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);

  const genreStats = ((): GenreStats[] => {
    const genreMap = new Map<string, number>();
    
    songs.forEach(song => {
      const genre = song.genre || '其他';
      genreMap.set(genre, (genreMap.get(genre) || 0) + 1);
    });

    const total = songs.length;
    const stats: GenreStats[] = [];
    
    genreMap.forEach((count, genre) => {
      stats.push({
        genre,
        count,
        percentage: Math.round((count / total) * 100),
      });
    });

    return stats.sort((a, b) => b.count - a.count);
  })();

  const getFontSize = (percentage: number): string => {
    const minSize = 0.875;
    const maxSize = 2;
    const size = minSize + (percentage / 100) * (maxSize - minSize);
    return `${size}rem`;
  };

  const getFontWeight = (percentage: number): string => {
    if (percentage >= 25) return 'font-bold';
    if (percentage >= 15) return 'font-semibold';
    return 'font-medium';
  };

  const handleTagClick = (genre: string) => {
    if (selectedGenre === genre) {
      onGenreSelect(null);
    } else {
      onGenreSelect(genre);
    }
  };

  if (genreStats.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 mb-10 animate-fadeInUp">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
              曲风标签云
            </h3>
            <p className="text-sm text-gray-500">
              共 {songs.length} 首歌曲，{genreStats.length} 种曲风
            </p>
          </div>
        </div>
        {selectedGenre && (
          <button
            onClick={() => onGenreSelect(null)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-sm font-medium transition-all hover:scale-105"
          >
            <X className="w-4 h-4" />
            <span>清除筛选</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 py-4">
        {genreStats.map(({ genre, count, percentage }) => {
          const isSelected = selectedGenre === genre;
          const isHovered = hoveredGenre === genre;
          const colorClass = getGenreColor(genre);
          
          return (
            <button
              key={genre}
              onClick={() => handleTagClick(genre)}
              onMouseEnter={() => setHoveredGenre(genre)}
              onMouseLeave={() => setHoveredGenre(null)}
              className={`relative px-5 py-2.5 rounded-full transition-all duration-300 transform ${
                isSelected
                  ? `bg-gradient-to-r ${colorClass} text-white shadow-xl scale-110`
                  : isHovered
                  ? `bg-gradient-to-r ${colorClass} text-white shadow-lg scale-105`
                  : 'bg-gray-50 text-gray-700 hover:shadow-md'
              } ${getFontWeight(percentage)}`}
              style={{ fontSize: getFontSize(percentage) }}
            >
              <span className="relative z-10">{genre}</span>
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                isSelected || isHovered
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {count}
              </span>
              {(isHovered || isSelected) && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20">
                  占 {percentage}%
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedGenre && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center space-x-2 text-center">
            <span className="text-gray-500">当前筛选：</span>
            <span className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${getGenreColor(selectedGenre)} text-white font-medium`}>
              {selectedGenre}
            </span>
            <span className="text-gray-500">
              · 共 {genreStats.find(g => g.genre === selectedGenre)?.count || 0} 首歌曲
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
