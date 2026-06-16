import { Music, Clock, Heart, ListPlus } from 'lucide-react';
import { Song } from '../../shared/types';
import StarRating from './StarRating';
import { voteApi } from '../services/api';
import { useState } from 'react';
import { useUserStore } from '../store/useStore';
import AddToPlaylistModal from './AddToPlaylistModal';

interface SongCardProps {
  song: Song;
  showVote?: boolean;
  teamName?: string;
  delay?: number;
}

export default function SongCard({ song, showVote = true, teamName, delay = 0 }: SongCardProps) {
  const { user, setShowNicknameModal, userVotes, fetchUserVotes } = useUserStore();
  const [localScore, setLocalScore] = useState(song.addictScore);
  const [localVotes, setLocalVotes] = useState(song.addictVotes);
  const [message, setMessage] = useState('');
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const hasVoted = user 
    ? userVotes.some(v => v.type === 'addict' && v.targetId === song.id)
    : false;

  const getWinRate = (battleCount: number, battleWins: number) => {
    if (battleCount === 0) return '0%';
    return `${Math.round((battleWins / battleCount) * 100)}%`;
  };

  const handleVote = async (score: number) => {
    if (!user) {
      setShowNicknameModal(true);
      return;
    }
    try {
      const result = await voteApi.voteAddict(song.id, score, user.id);
      if (result.success) {
        setLocalScore(result.newScore);
        setLocalVotes(result.totalVotes);
        setMessage(result.message || '');
        fetchUserVotes();
      } else {
        setMessage(result.message || '');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('投票失败，请稍后重试');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start space-x-4">
        {song.coverUrl ? (
          <img
            src={song.coverUrl}
            alt={song.title}
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-lg"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Music className="w-8 h-8 text-white" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-gray-800 truncate" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                {song.title}
              </h4>
              <p className="text-gray-500 text-sm">{song.artist}</p>
              {teamName && (
                <p className="text-orange-600 text-xs mt-1">🎤 {teamName}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                {song.genre}
              </span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                胜率 {getWinRate(song.battleCount, song.battleWins)}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); setShowPlaylistModal(true); }}
                className="p-1.5 rounded-full hover:bg-purple-100 text-gray-400 hover:text-purple-500 transition-all"
                title="添加到歌单"
              >
                <ListPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-3">
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {song.duration}
            </div>
            <div className="flex items-center text-red-500">
              <Heart className="w-4 h-4 mr-1 fill-current" />
              <span className="text-sm font-medium">上头程度</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <StarRating
                rating={localScore}
                totalVotes={localVotes}
                interactive={showVote && !!user && !hasVoted}
                onVote={handleVote}
                size="sm"
                color="red"
                hasVoted={hasVoted}
              />
              <span className="text-lg font-bold text-red-500">
                {localScore.toFixed(1)}
              </span>
            </div>
            {message && (
              <p className={`text-sm mt-2 ${message.includes('成功') ? 'text-green-500' : 'text-red-500'} animate-pulse`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
      <AddToPlaylistModal songId={song.id} isOpen={showPlaylistModal} onClose={() => setShowPlaylistModal(false)} />
    </div>
  );
}
