import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swords, Trophy, Map, Users, Heart, ChevronRight, Sparkles } from 'lucide-react';
import { useTeamStore, useBattleStore, useRankingStore, useFilterStore } from '../store/useStore';
import TeamCard from '../components/TeamCard';
import FilterBar from '../components/FilterBar';
import SongCard from '../components/SongCard';

export default function HomePage() {
  const { teams, fetchTeams } = useTeamStore();
  const { battlePair, fetchBattlePair, voteAddict } = useBattleStore();
  const { comprehensiveRanking, fetchComprehensiveRanking } = useRankingStore();
  const { district, style, memberCount } = useFilterStore();
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    fetchTeams({ district, style, memberCount });
    fetchBattlePair();
    fetchComprehensiveRanking(6);
  }, [district, style, memberCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % (comprehensiveRanking.length || 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [comprehensiveRanking.length]);

  const handleBattleVote = async (songId: number, score: number) => {
    await voteAddict(songId, score);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <div className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center animate-fadeInUp">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow-lg mb-6">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="text-orange-600 font-medium">最火广场舞社区</span>
            </div>
            
            <h1 
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent"
              style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
            >
              广场舞金曲大PK
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              展示舞队风采，PK热门金曲，为你喜欢的舞蹈和服装投票！
              <br />
              发现身边的广场舞团队，一起舞动健康人生 💃
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link
                to="/battle"
                className="group inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Swords className="w-6 h-6" />
                <span>立即参与PK</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/teams"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-orange-600 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-orange-200"
              >
                <Users className="w-6 h-6" />
                <span>浏览舞队</span>
              </Link>
            </div>

            {comprehensiveRanking.length > 0 && (
              <div className="relative h-64 md:h-80 overflow-hidden rounded-3xl shadow-2xl animate-slideUp" style={{ animationDelay: '0.3s' }}>
                {comprehensiveRanking.map((team, index) => (
                  <div
                    key={team.id}
                    className={`absolute inset-0 transition-all duration-1000 ${
                      index === heroIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                  >
                    <img
                      src={team.groupPhoto}
                      alt={team.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-left">
                      <div className="flex items-center space-x-4">
                        <img
                          src={team.avatar}
                          alt={team.name}
                          className="w-16 h-16 rounded-full border-4 border-white shadow-xl"
                        />
                        <div>
                          <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                            {team.name}
                          </h3>
                          <p className="text-orange-300">{team.district} · {team.style} · {team.memberCount}人</p>
                        </div>
                        <div className="ml-auto px-4 py-2 bg-yellow-500 rounded-full">
                          <span className="text-white font-bold">🏆 TOP {index + 1}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  {comprehensiveRanking.slice(0, 6).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setHeroIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === heroIndex ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Users, label: '注册舞队', value: '10+', color: 'from-blue-500 to-cyan-500' },
            { icon: Heart, label: '累计投票', value: '1000+', color: 'from-red-500 to-pink-500' },
            { icon: Map, label: '覆盖公园', value: '50+', color: 'from-green-500 to-emerald-500' },
            { icon: Trophy, label: '金曲数量', value: '38+', color: 'from-yellow-500 to-orange-500' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                {stat.value}
              </div>
              <div className="text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <FilterBar />

        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
              🔥 热门舞队
            </h2>
            <Link
              to="/teams"
              className="flex items-center space-x-1 text-orange-600 font-medium hover:text-orange-700 transition-colors"
            >
              <span>查看全部</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          
          {teams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.slice(0, 6).map((team, index) => (
                <TeamCard key={team.id} team={team} delay={index * 100} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <p className="text-gray-500 text-lg">暂无符合条件的舞队</p>
            </div>
          )}
        </div>

        {battlePair && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                ⚔️ 今日歌单PK
              </h2>
              <Link
                to="/battle"
                className="flex items-center space-x-1 text-orange-600 font-medium hover:text-orange-700 transition-colors"
              >
                <span>更多PK</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative">
                <SongCard 
                  song={battlePair.song1} 
                  teamName={battlePair.team1.name}
                  showVote={true}
                />
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                    <span className="text-white font-bold text-xl">VS</span>
                  </div>
                </div>
              </div>
              <SongCard 
                song={battlePair.song2} 
                teamName={battlePair.team2.name}
                showVote={true}
              />
            </div>

            <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">💡 什么是"上头程度"？</h3>
              <p className="text-gray-600 leading-relaxed">
                "上头程度"是指歌曲的洗脑程度和感染力，旋律是否让人一听就想跟着摇摆！
                快来为你觉得最上头的广场舞金曲投票吧！
              </p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                <Map className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                  地图找舞队
                </h3>
                <p className="text-white/80">发现你身边的广场舞团队</p>
              </div>
            </div>
            <p className="text-white/90 mb-6 leading-relaxed">
              在地图上直观查看各公园的舞队分布，找到离你最近的舞蹈伙伴，一起加入广场舞大家庭！
            </p>
            <Link
              to="/map"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              <Map className="w-5 h-5" />
              <span>查看地图</span>
            </Link>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                  排行榜单
                </h3>
                <p className="text-white/80">看看谁是人气王</p>
              </div>
            </div>
            <p className="text-white/90 mb-6 leading-relaxed">
              综合排行榜、金曲上头榜、服装创意榜，三大榜单实时更新，快来为你支持的舞队打Call！
            </p>
            <Link
              to="/ranking"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              <Trophy className="w-5 h-5" />
              <span>查看排行</span>
            </Link>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-4xl mb-4">💃🕺</div>
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
            广场舞金曲大PK
          </h3>
          <p className="text-gray-400 mb-6">让广场舞更精彩，让生活更健康</p>
          <div className="flex justify-center space-x-6 text-gray-400 text-sm">
            <span>© 2024 广场舞社区</span>
            <span>·</span>
            <span>健康生活，快乐舞蹈</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
