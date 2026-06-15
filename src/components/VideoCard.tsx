import { Play, MapPin, Users } from 'lucide-react';
import { TeamVideo, Team } from '../../shared/types';

interface VideoCardProps {
  video: TeamVideo;
  team?: Team;
  onPlay: (video: TeamVideo) => void;
  delay?: number;
  showTeamInfo?: boolean;
}

export default function VideoCard({ video, team, onPlay, delay = 0, showTeamInfo = true }: VideoCardProps) {
  const thumbnail = video.thumbnail || `https://picsum.photos/seed/video${video.id}/480/270`;

  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onPlay(video)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-100">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs rounded-lg backdrop-blur-sm">
          <Play className="w-3 h-3 inline mr-1" />
          点击播放
        </div>
      </div>
      
      <div className="p-4">
        <h4 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
          {video.title}
        </h4>
        
        {showTeamInfo && team && (
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <img
                src={team.avatar}
                alt={team.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="truncate max-w-[120px]">{team.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-red-500" />
                <span>{team.district}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Users className="w-3 h-3 text-orange-500" />
                <span>{team.memberCount}人</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
