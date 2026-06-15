import { Link } from 'react-router-dom';
import { MapPin, Users, Star, Music, Heart, Video } from 'lucide-react';
import { Team } from '../../shared/types';
import { useFavoriteStore, useUserStore } from '../store/useStore';

interface TeamCardProps {
  team: Team;
  delay?: number;
}

export default function TeamCard({ team, delay = 0 }: TeamCardProps) {
  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const { user } = useUserStore();
  const favorited = isFavorite(team.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(team.id, user?.id);
  };

  return (
    <Link
      to={`/teams/${team.id}`}
      className="group block bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={team.groupPhoto}
          alt={team.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center space-x-3">
            <img
              src={team.avatar}
              alt={team.name}
              className="w-12 h-12 rounded-full border-3 border-white shadow-lg object-cover"
            />
            <div>
              <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                {team.name}
              </h3>
              <div className="flex items-center text-orange-300 text-sm">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1">{team.costumeScore.toFixed(1)}</span>
                <span className="text-white/60 ml-2">({team.costumeVotes}票)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <button
            onClick={handleFavoriteClick}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
              favorited
                ? 'bg-red-500 text-white scale-110'
                : 'bg-white/90 text-gray-500 hover:bg-white hover:text-red-500 hover:scale-110'
            }`}
          >
            <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
          </button>
          {team.videos && team.videos.length > 0 && (
            <span className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
              <Video className="w-3 h-3" />
              <span>{team.videos.length}</span>
            </span>
          )}
          <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
            {team.style}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center space-x-4 text-gray-600 text-sm mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span className="truncate max-w-[120px]">{team.district}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-orange-500" />
            <span>{team.memberCount}人</span>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-gray-500 text-sm">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span className="truncate">{team.parkName}</span>
        </div>

        <p className="mt-3 text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {team.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-1 text-orange-600">
            <Music className="w-4 h-4" />
            <span className="text-sm font-medium">查看详情</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
            <span className="text-orange-500 group-hover:text-white transition-colors">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
