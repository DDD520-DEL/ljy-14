import { useEffect, useState } from 'react';
import { Trophy, Music, Shirt, Crown, Star, Heart, Users, Flame, Clock } from 'lucide-react';
import { useRankingStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { Team, Song } from '../../shared/types';

type TabType = 'comprehensive' | 'addict' | 'costume';
type AddictSubTabType = 'total' | 'weekly';

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('comprehensive');
  const [addictSubTab, setAddictSubTab] = useState<AddictSubTabType>('total');
  const { comprehensiveRanking, addictRanking, weeklyAddictRanking, costumeRanking, loading, error, fetchAllRankings } = useRankingStore();

  useEffect(() => {
    fetchAllRankings();
  }, []);

  const tabs = [
    { id: 'comprehensive' as TabType, label: '综合排行榜', icon: Crown, color: 'from-yellow-500 to-orange-500' },
    { id: 'addict' as TabType, label: '歌曲排行榜', icon: Music, color: 'from-red-500 to-pink-500' },
    { id: 'costume' as TabType, label: '服装排行榜', icon: Shirt, color: 'from-purple-500 to-indigo-500' },
  ];

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">🥇</div>;
    if (rank === 2) return <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">🥈</div>;
    if (rank === 3) return <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">🥉</div>;
    return <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">{rank}</div>;
  };

  const renderComprehensiveRanking = () => {
    if (loading.comprehensive) {
      return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div></div>;
    }
    if (error.comprehensive) {
      return <div className="text-center py-20 text-red-500">{error.comprehensive}</div>;
    }

    return (
      <div className="space-y-4">
        {comprehensiveRanking.map((team: Team, index: number) => (
          <div
            key={team.id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fadeInUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center space-x-6">
              {getRankBadge(index + 1)}
              <img
                src={team.avatar}
                alt={team.name}
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
              />
              <div className="flex-1">
                <Link to={`/teams/${team.id}`}>
                  <h3 
                    className="text-xl font-bold text-gray-800 hover:text-orange-600 transition-colors"
                    style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
                  >
                    {team.name}
                  </h3>
                </Link>
                <p className="text-gray-500">{team.district} · {team.parkName}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{team.memberCount}人</span>
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>{team.style}</span>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  {((team.costumeScore * 0.4 + (team.costumeVotes / 100) * 0.3 + (team.memberCount / 50) * 0.3) * 2).toFixed(1)}
                </div>
                <p className="text-sm text-gray-500">综合得分</p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                  <span className="text-sm text-gray-500">{team.costumeVotes} 票</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAddictEmptyState = () => (
    <div className="bg-white rounded-3xl shadow-xl p-12 text-center animate-fadeInUp">
      <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Flame className="w-12 h-12 text-orange-400" />
      </div>
      <h3 
        className="text-2xl font-bold text-gray-800 mb-3"
        style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
      >
        本周还没有热门歌曲哦～
      </h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        最近7天内还没有歌曲收到投票，快去PK页面为你喜欢的歌曲投票吧！
      </p>
      <Link
        to="/battle"
        className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        <Flame className="w-5 h-5" />
        <span>立即去投票</span>
      </Link>
    </div>
  );

  const renderAddictSubTabs = () => (
    <div className="flex justify-center mb-8">
      <div className="inline-flex bg-white rounded-full p-1.5 shadow-lg">
        <button
          onClick={() => setAddictSubTab('total')}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-full font-bold transition-all duration-300 ${
            addictSubTab === 'total'
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>总榜</span>
        </button>
        <button
          onClick={() => setAddictSubTab('weekly')}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-full font-bold transition-all duration-300 ${
            addictSubTab === 'weekly'
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>本周热门</span>
        </button>
      </div>
    </div>
  );

  const renderAddictRanking = () => {
    const isWeekly = addictSubTab === 'weekly';
    const currentLoading = isWeekly ? loading.weeklyAddict : loading.addict;
    const currentError = isWeekly ? error.weeklyAddict : error.addict;
    const currentData = isWeekly ? weeklyAddictRanking : addictRanking;

    if (currentLoading) {
      return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div></div>;
    }
    if (currentError) {
      return <div className="text-center py-20 text-red-500">{currentError}</div>;
    }
    if (isWeekly && currentData.length === 0) {
      return renderAddictEmptyState();
    }

    return (
      <div className="space-y-4">
        {currentData.map((song: (Song & { teamName: string; weeklyAddictScore?: number; weeklyAddictVotes?: number }), index: number) => {
          const score = isWeekly && song.weeklyAddictScore !== undefined ? song.weeklyAddictScore : song.addictScore;
          const votes = isWeekly && song.weeklyAddictVotes !== undefined ? song.weeklyAddictVotes : song.addictVotes;
          
          return (
            <div
              key={song.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-6">
                {getRankBadge(index + 1)}
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 
                    className="text-xl font-bold text-gray-800"
                    style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
                  >
                    {song.title}
                    {isWeekly && (
                      <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 align-middle">
                        <Flame className="w-3 h-3 mr-1" />
                        本周
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-500">{song.artist} · 来自 {song.teamName}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                      {song.genre}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      {song.duration}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                    {score.toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-500">{isWeekly ? '本周热度' : '上头程度'}</p>
                  <div className="flex items-center justify-end space-x-1 mt-1">
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                    <span className="text-sm text-gray-500">{votes} 票</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-400 to-pink-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(score / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCostumeRanking = () => {
    if (loading.costume) {
      return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div></div>;
    }
    if (error.costume) {
      return <div className="text-center py-20 text-red-500">{error.costume}</div>;
    }

    return (
      <div className="space-y-4">
        {costumeRanking.map((team: Team, index: number) => (
          <div
            key={team.id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fadeInUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center space-x-6">
              {getRankBadge(index + 1)}
              <div className="relative">
                <img
                  src={team.costumePhoto}
                  alt={`${team.name} 服装`}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                  <Shirt className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <Link to={`/teams/${team.id}`}>
                  <h3 
                    className="text-xl font-bold text-gray-800 hover:text-purple-600 transition-colors"
                    style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
                  >
                    {team.name}
                  </h3>
                </Link>
                <p className="text-gray-500">{team.district} · {team.parkName}</p>
                <p className="text-sm text-gray-400 mt-1 line-clamp-1">{team.description}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                  {team.costumeScore.toFixed(1)}
                </div>
                <p className="text-sm text-gray-500">服装创意度</p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                  <span className="text-sm text-gray-500">{team.costumeVotes} 票</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(team.costumeScore / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const bgGradients = {
    comprehensive: 'from-yellow-50 via-orange-50 to-red-50',
    addict: 'from-red-50 via-pink-50 to-purple-50',
    costume: 'from-purple-50 via-indigo-50 to-blue-50',
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradients[activeTab]} pt-24 pb-12 transition-all duration-500`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow-lg mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-yellow-600 font-medium">荣誉榜单</span>
          </div>
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent"
            style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
          >
            舞队风云榜
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            看看哪些舞队和歌曲最受欢迎，为你喜欢的团队加油助威！
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-xl scale-105`
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'comprehensive' && renderComprehensiveRanking()}
        {activeTab === 'addict' && (
          <>
            {renderAddictSubTabs()}
            {renderAddictRanking()}
          </>
        )}
        {activeTab === 'costume' && renderCostumeRanking()}

        <div className="mt-12 bg-white rounded-3xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
            <span className="text-3xl">📊</span>
            <span>排名说明</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6">
              <div className="text-4xl mb-3">👑</div>
              <h4 className="font-bold text-gray-800 mb-2">综合排行榜</h4>
              <p className="text-gray-600 text-sm">
                综合考虑服装评分（40%）、投票数（30%）和人数规模（30%），展示最具影响力的舞队
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6">
              <div className="text-4xl mb-3">🎵</div>
              <h4 className="font-bold text-gray-800 mb-2">歌曲排行榜</h4>
              <p className="text-gray-600 text-sm">
                分为"总榜"和"本周热门"两个子榜单。总榜统计全部历史投票数据，本周热门只统计最近7天内的投票，发现最新潮流金曲！
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6">
              <div className="text-4xl mb-3">👗</div>
              <h4 className="font-bold text-gray-800 mb-2">服装排行榜</h4>
              <p className="text-gray-600 text-sm">
                根据用户投票的"服装创意度"评分排名，展示最具创意和美感的舞队服装
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6">
              <div className="text-4xl mb-3">🔥</div>
              <h4 className="font-bold text-gray-800 mb-2">本周热门</h4>
              <p className="text-gray-600 text-sm">
                歌曲排行榜专属子榜单，实时追踪最近7天的投票趋势，带你发现当下最火的广场舞神曲，快来为你喜欢的歌曲投票助力吧！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
