import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, MessageSquare, Star, Music, Shirt, LogOut, Calendar, Flame, Award } from 'lucide-react';
import { useUserStore, useTeamStore, useFavoriteStore, useCheckInStore } from '../store/useStore';
import TeamCard from '../components/TeamCard';
import CheckInCalendar from '../components/CheckInCalendar';
import { VoteRecordWithDetails, TeamCommentWithTeam, CheckInRecord } from '../../shared/types';

type TabType = 'votes' | 'favorites' | 'comments' | 'checkins';

export default function ProfilePage() {
  const { user, userVotes, userComments, fetchUserVotes, fetchUserComments, logout, setShowNicknameModal } = useUserStore();
  const { teams, fetchTeams } = useTeamStore();
  const { favoriteIds } = useFavoriteStore();
  const { records: checkInRecords, status: checkInStatus, fetchRecords: fetchCheckInRecords, fetchStatus: fetchCheckInStatus } = useCheckInStore();
  const [activeTab, setActiveTab] = useState<TabType>('votes');
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (user) {
      Promise.all([fetchUserVotes(), fetchUserComments(), fetchCheckInRecords(user.id), fetchCheckInStatus(user.id)]).then(() => {
        if (mounted) setDataLoaded(true);
      });
    } else {
      setDataLoaded(true);
    }
    if (teams.length === 0) {
      fetchTeams();
    }
    return () => { mounted = false; };
  }, [user]);

  const favoriteTeams = teams.filter((team) => favoriteIds.includes(team.id));
  const addictVotes = userVotes.filter((v) => v.type === 'addict');
  const costumeVotes = userVotes.filter((v) => v.type === 'costume');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center animate-fadeInUp">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
              <User className="w-12 h-12 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
              您还未登录
            </h2>
            <p className="text-gray-500 mb-8">
              登录后可以查看您的投票记录、收藏的舞队和发表的留言
            </p>
            <button
              onClick={() => setShowNicknameModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
            >
              立即登录
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 animate-fadeInUp">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {user.nickname.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                    {user.nickname}
                  </h1>
                  <p className="text-white/80 flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>加入于 {formatDate(user.createdAt)}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>退出登录</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 divide-x divide-gray-100">
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-500 mb-1 tabular-nums">
                {dataLoaded ? String(userVotes.length || 0) : '—'}
              </div>
              <p className="text-gray-500 text-sm">次投票</p>
            </div>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-red-500 mb-1 tabular-nums">
                {String(favoriteIds.length || 0)}
              </div>
              <p className="text-gray-500 text-sm">个收藏</p>
            </div>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-500 mb-1 tabular-nums">
                {dataLoaded ? String(userComments.length || 0) : '—'}
              </div>
              <p className="text-gray-500 text-sm">条留言</p>
            </div>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-1 tabular-nums">
                {dataLoaded && checkInStatus ? String(checkInStatus.totalDays || 0) : '—'}
              </div>
              <p className="text-gray-500 text-sm">天签到</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setActiveTab('votes')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'votes'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
            }`}
          >
            <span className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>我的投票</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'favorites'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
            }`}
          >
            <span className="flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>我的收藏</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'comments'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
            }`}
          >
            <span className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>我的留言</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('checkins')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'checkins'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
            }`}
          >
            <span className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>签到记录</span>
            </span>
          </button>
        </div>

        {activeTab === 'votes' && (
          <div className="space-y-6">
            {addictVotes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeInUp">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <Music className="w-6 h-6 text-red-500" />
                  <span>歌单上头度投票 ({addictVotes.length})</span>
                </h3>
                <div className="space-y-3">
                  {addictVotes.map((vote: VoteRecordWithDetails, index: number) => (
                    <div
                      key={vote.id}
                      className="flex items-center justify-between p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center space-x-4">
                        {vote.targetPhoto ? (
                          <img
                            src={vote.targetPhoto}
                            alt=""
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                            <Music className="w-7 h-7 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-800">{vote.targetName}</p>
                          <p className="text-sm text-gray-500">{vote.teamName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-yellow-500">
                          {Array.from({ length: vote.score }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(vote.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {costumeVotes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeInUp">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <Shirt className="w-6 h-6 text-pink-500" />
                  <span>服装创意度投票 ({costumeVotes.length})</span>
                </h3>
                <div className="space-y-3">
                  {costumeVotes.map((vote: VoteRecordWithDetails, index: number) => (
                    <div
                      key={vote.id}
                      className="flex items-center justify-between p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center space-x-4">
                        {vote.targetPhoto ? (
                          <img
                            src={vote.targetPhoto}
                            alt=""
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                            <Shirt className="w-7 h-7 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-800">{vote.targetName}</p>
                          <p className="text-sm text-gray-500">{vote.teamName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-yellow-500">
                          {Array.from({ length: vote.score }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(vote.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {userVotes.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-fadeIn">
                <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">还没有投票记录</h3>
                <p className="text-gray-500 mb-6">去发现更多精彩的歌单和舞队，投出你宝贵的一票吧！</p>
                <Link
                  to="/battle"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
                >
                  <Music className="w-5 h-5" />
                  <span>去投票</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-6">
            {favoriteTeams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteTeams.map((team, index) => (
                  <TeamCard key={team.id} team={team} delay={index * 100} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-fadeIn">
                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">还没有收藏任何舞队</h3>
                <p className="text-gray-500 mb-6">去发现更多精彩的舞队，点击心形按钮收藏你喜欢的吧！</p>
                <Link
                  to="/teams"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
                >
                  <Heart className="w-5 h-5" />
                  <span>去发现舞队</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-4">
            {userComments.length > 0 ? (
              userComments.map((comment: TeamCommentWithTeam, index: number) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Link
                      to={`/teams/${comment.teamId}`}
                      className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                    >
                      {comment.teamAvatar ? (
                        <img
                          src={comment.teamAvatar}
                          alt=""
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-800">{comment.teamName}</p>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= comment.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </Link>
                    <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-fadeIn">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">还没有发表过留言</h3>
                <p className="text-gray-500 mb-6">去舞队详情页，分享你对舞队的看法吧！</p>
                <Link
                  to="/teams"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-bold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>去逛舞队</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'checkins' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <CheckInCalendar showCheckInButton={true} />
              </div>

              <div className="md:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeInUp">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                    <Award className="w-6 h-6 text-orange-500" />
                    <span>签到成就</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                          <Flame className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">连续签到</p>
                          <p className="text-sm text-gray-500">坚持就是胜利</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-500">
                          {checkInStatus?.consecutiveDays || 0}
                        </div>
                        <div className="text-xs text-gray-400">天</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">累计签到</p>
                          <p className="text-sm text-gray-500">总签到天数</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-500">
                          {checkInStatus?.totalDays || 0}
                        </div>
                        <div className="text-xs text-gray-400">天</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                    <Calendar className="w-6 h-6 text-green-500" />
                    <span>最近签到</span>
                  </h3>
                  
                  {checkInRecords.length > 0 ? (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {checkInRecords.slice(0, 20).map((record: CheckInRecord, index: number) => (
                        <div
                          key={record.id}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                          style={{ animationDelay: `${index * 30}ms` }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{record.date}</p>
                              <p className="text-xs text-gray-500">第 {record.consecutiveDays} 天连续签到</p>
                            </div>
                          </div>
                          {index === 0 && checkInStatus?.todayCheckedIn && (
                            <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                              今天
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-bold text-gray-700 mb-2">还没有签到记录</h3>
                      <p className="text-gray-500">开始你的第一次签到吧！</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
