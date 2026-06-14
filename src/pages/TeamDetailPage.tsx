import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, Calendar, Clock, Star, Heart, ArrowLeft, Camera, Music } from 'lucide-react';
import { useTeamStore } from '../store/useStore';
import { Song } from '../../shared/types';
import StarRating from '../components/StarRating';
import { voteApi } from '../services/api';

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { selectedTeam, teamSongs, loading, error, fetchTeamById, fetchTeamSongs, clearSelectedTeam } = useTeamStore();
  const [activeTab, setActiveTab] = useState<'songs' | 'photos'>('songs');
  const [costumeMessage, setCostumeMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchTeamById(parseInt(id));
      fetchTeamSongs(parseInt(id));
    }
    return () => clearSelectedTeam();
  }, [id]);

  const handleCostumeVote = async (score: number) => {
    if (!selectedTeam) return;
    try {
      const result = await voteApi.voteCostume(selectedTeam.id, score);
      setCostumeMessage(result.message || '');
      setTimeout(() => setCostumeMessage(''), 3000);
    } catch (error) {
      setCostumeMessage('投票失败，请稍后重试');
      setTimeout(() => setCostumeMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !selectedTeam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-24">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">舞队不存在</h2>
          <Link to="/teams" className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700">
            <ArrowLeft className="w-4 h-4" />
            <span>返回舞队列表</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/teams"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors animate-fadeIn"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回舞队列表</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp">
          <div className="relative h-64 md:h-80">
            <img
              src={selectedTeam.groupPhoto}
              alt={selectedTeam.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <div className="flex items-center space-x-6">
                  <img
                    src={selectedTeam.avatar}
                    alt={selectedTeam.name}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-2xl object-cover"
                  />
                  <div>
                    <h1 
                      className="text-3xl md:text-4xl font-bold text-white mb-2"
                      style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
                    >
                      {selectedTeam.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-white/80">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedTeam.district}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{selectedTeam.memberCount}名队员</span>
                      </span>
                      <span className="px-3 py-1 bg-orange-500 rounded-full text-white text-sm font-medium">
                        {selectedTeam.style}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <span className="text-2xl">📝</span>
                  <span>舞队简介</span>
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {selectedTeam.description}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">👤 队长</p>
                    <p className="font-bold text-gray-800">{selectedTeam.leader}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">📅 成立时间</p>
                    <p className="font-bold text-gray-800">{selectedTeam.establishedAt}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <span className="text-2xl">📍</span>
                  <span>活动信息</span>
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">活动公园</p>
                    <p className="font-bold text-gray-800">{selectedTeam.parkName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">固定时段</p>
                    <p className="font-bold text-gray-800">{selectedTeam.activityTime}</p>
                  </div>
                  <Link
                    to={`/map?highlight=${selectedTeam.id}`}
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>在地图上查看</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <span className="text-2xl">👗</span>
                <span>服装创意度评分</span>
              </h2>
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={selectedTeam.costumePhoto}
                        alt="服装展示"
                        className="w-32 h-32 rounded-2xl object-cover shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-6 h-6 text-yellow-400 fill-current" />
                        <span className="text-3xl font-bold text-gray-800">{selectedTeam.costumeScore.toFixed(1)}</span>
                      </div>
                      <p className="text-gray-500">已有 {selectedTeam.costumeVotes} 人参与评分</p>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-gray-600 mb-3">觉得他们的服装有创意吗？来评个分吧！</p>
                    <StarRating
                      rating={selectedTeam.costumeScore}
                      interactive={true}
                      onVote={handleCostumeVote}
                      size="lg"
                      color="yellow"
                    />
                    {costumeMessage && (
                      <p className={`text-sm mt-2 ${costumeMessage.includes('成功') ? 'text-green-500' : 'text-red-500'} animate-pulse`}>
                        {costumeMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setActiveTab('songs')}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    activeTab === 'songs'
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Music className="w-5 h-5" />
                    <span>歌单 ({teamSongs.length})</span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    activeTab === 'photos'
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Camera className="w-5 h-5" />
                    <span>风采展示</span>
                  </span>
                </button>
              </div>

              {activeTab === 'songs' && (
                <div className="space-y-4">
                  {teamSongs.length > 0 ? (
                    teamSongs.map((song: Song, index: number) => (
                      <div
                        key={song.id}
                        className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-all animate-fadeInUp"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {song.coverUrl ? (
                              <img
                                src={song.coverUrl}
                                alt={song.title}
                                className="w-14 h-14 rounded-xl object-cover shadow-md"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white">
                                <Music className="w-7 h-7" />
                              </div>
                            )}
                            <div>
                              <h4 className="font-bold text-gray-800 text-lg" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                                {song.title}
                              </h4>
                              <p className="text-gray-500">{song.artist} · {song.genre} · {song.duration}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 text-red-500 mb-1">
                              <Heart className="w-4 h-4 fill-current" />
                              <span className="font-bold">上头程度</span>
                            </div>
                            <StarRating rating={song.addictScore} totalVotes={song.addictVotes} size="sm" color="red" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Music className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>该舞队暂无歌单</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'photos' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src={selectedTeam.groupPhoto}
                      alt="舞队合影"
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="font-bold text-lg">📸 舞队合影</p>
                    </div>
                  </div>
                  <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src={selectedTeam.costumePhoto}
                      alt="服装展示"
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="font-bold text-lg">👗 服装展示</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
