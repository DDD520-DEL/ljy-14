import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, Calendar, Clock, Star, Heart, ArrowLeft, Camera, Music, MessageSquare, Send, Handshake, CheckCircle, XCircle, Plus, X, ChevronDown, User, Video, Settings, UserPlus, Link2, Trash2, ListPlus } from 'lucide-react';
import { useTeamStore, useFavoriteStore, useUserStore, useFriendshipStore } from '../store/useStore';
import { Song, TeamComment, InvitationWithTeamNames, Team, TeamVideo, TeamFriendshipWithDetails } from '../../shared/types';
import StarRating from '../components/StarRating';
import VideoPlayer from '../components/VideoPlayer';
import VideoCard from '../components/VideoCard';
import VideoEditModal from '../components/VideoEditModal';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import { voteApi, teamApi } from '../services/api';

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { 
    selectedTeam, 
    teamSongs, 
    teamComments, 
    commentsLoading, 
    loading, 
    error, 
    fetchTeamById, 
    fetchTeamSongs, 
    fetchTeamComments,
    addTeamComment,
    clearSelectedTeam,
    teams,
    fetchTeams,
    pendingInvitations,
    completedInvitations,
    invitationsLoading,
    fetchPendingInvitations,
    fetchCompletedInvitations,
    createInvitation,
    acceptInvitation,
    rejectInvitation,
    teamBattleStats,
    fetchTeamBattleStats
  } = useTeamStore();
  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const { user, setShowNicknameModal, userVotes, fetchUserVotes } = useUserStore();
  const { teamFriendships, fetchTeamFriendships, createFriendship, deleteFriendship } = useFriendshipStore();
  const [activeTab, setActiveTab] = useState<'songs' | 'photos' | 'videos' | 'invitations' | 'friendships'>('songs');
  const [invitationTab, setInvitationTab] = useState<'pending' | 'completed'>('pending');
  const [playingVideo, setPlayingVideo] = useState<TeamVideo | null>(null);
  const [showVideoEdit, setShowVideoEdit] = useState(false);
  const [costumeMessage, setCostumeMessage] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentRating, setCommentRating] = useState(0);
  const [commentSubmitMessage, setCommentSubmitMessage] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteFromTeamId, setInviteFromTeamId] = useState<number | ''>('');
  const [inviteDanceTime, setInviteDanceTime] = useState('');
  const [inviteLocation, setInviteLocation] = useState('');
  const [inviteRemark, setInviteRemark] = useState('');
  const [inviteSubmitMessage, setInviteSubmitMessage] = useState('');
  const [showFromTeamDropdown, setShowFromTeamDropdown] = useState(false);

  const [showFriendModal, setShowFriendModal] = useState(false);
  const [friendTargetTeamId, setFriendTargetTeamId] = useState<number | ''>('');
  const [friendSubmitMessage, setFriendSubmitMessage] = useState('');
  const [showFriendTeamDropdown, setShowFriendTeamDropdown] = useState(false);
  const [playlistModalSongId, setPlaylistModalSongId] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchTeamById(parseInt(id));
      fetchTeamSongs(parseInt(id));
      fetchTeamComments(parseInt(id));
      fetchPendingInvitations(parseInt(id));
      fetchCompletedInvitations(parseInt(id));
      fetchTeamBattleStats(parseInt(id));
      fetchTeamFriendships(parseInt(id));
      setCommentContent('');
      setCommentRating(0);
      setCommentSubmitted(false);
      setCommentSubmitMessage('');
    }
    if (teams.length === 0) {
      fetchTeams();
    }
    if (user) {
      fetchUserVotes();
    }
    return () => clearSelectedTeam();
  }, [id, user]);

  const hasVotedCostume = selectedTeam && user 
    ? userVotes.some(v => v.type === 'costume' && v.targetId === selectedTeam.id)
    : false;
  
  const hasVotedSong = (songId: number) => 
    user ? userVotes.some(v => v.type === 'addict' && v.targetId === songId) : false;

  const handleCostumeVote = async (score: number) => {
    if (!selectedTeam) return;
    if (!user) {
      setShowNicknameModal(true);
      return;
    }
    try {
      const result = await voteApi.voteCostume(selectedTeam.id, score, user.id);
      setCostumeMessage(result.message || '');
      setTimeout(() => setCostumeMessage(''), 3000);
    } catch (error) {
      setCostumeMessage('投票失败，请稍后重试');
      setTimeout(() => setCostumeMessage(''), 3000);
    }
  };

  const handleCommentRating = (score: number) => {
    if (commentSubmitted || !user) return;
    setCommentRating(score);
  };

  const handleCommentRatingHover = (score: number) => {
    if (commentSubmitted || !user) return;
    setHoverRating(score);
  };

  const handleCommentRatingLeave = () => {
    setHoverRating(0);
  };

  const handleSubmitComment = async () => {
    if (!selectedTeam) return;
    if (!user) {
      setShowNicknameModal(true);
      return;
    }
    if (!commentContent.trim()) {
      setCommentSubmitMessage('请输入留言内容');
      setTimeout(() => setCommentSubmitMessage(''), 3000);
      return;
    }
    if (commentRating === 0) {
      setCommentSubmitMessage('请选择评分星级');
      setTimeout(() => setCommentSubmitMessage(''), 3000);
      return;
    }

    const result = await addTeamComment({
      teamId: selectedTeam.id,
      userId: user.id,
      nickname: user.nickname,
      content: commentContent.trim(),
      rating: commentRating
    });

    setCommentSubmitMessage(result.message || '');
    setTimeout(() => setCommentSubmitMessage(''), 3000);

    if (result.success) {
      setCommentContent('');
      setCommentRating(0);
      setCommentSubmitted(true);
    }
  };

  const handleOpenInviteModal = () => {
    setShowInviteModal(true);
    setInviteFromTeamId('');
    setInviteDanceTime('');
    setInviteLocation(selectedTeam?.parkName || '');
    setInviteRemark('');
    setInviteSubmitMessage('');
  };

  const handleCloseInviteModal = () => {
    setShowInviteModal(false);
    setShowFromTeamDropdown(false);
  };

  const handleSubmitInvitation = async () => {
    if (!selectedTeam) return;
    if (inviteFromTeamId === '') {
      setInviteSubmitMessage('请选择发起约舞的舞队');
      setTimeout(() => setInviteSubmitMessage(''), 3000);
      return;
    }
    if (!inviteDanceTime) {
      setInviteSubmitMessage('请选择约舞时间');
      setTimeout(() => setInviteSubmitMessage(''), 3000);
      return;
    }
    if (!inviteLocation.trim()) {
      setInviteSubmitMessage('请填写约舞地点');
      setTimeout(() => setInviteSubmitMessage(''), 3000);
      return;
    }

    const result = await createInvitation({
      fromTeamId: inviteFromTeamId as number,
      toTeamId: selectedTeam.id,
      danceTime: inviteDanceTime,
      location: inviteLocation.trim(),
      remark: inviteRemark.trim()
    });

    setInviteSubmitMessage(result.message || '');
    setTimeout(() => setInviteSubmitMessage(''), 3000);

    if (result.success) {
      setTimeout(() => handleCloseInviteModal(), 1000);
    }
  };

  const handleAcceptInvitation = async (invitationId: number) => {
    if (!selectedTeam) return;
    await acceptInvitation(invitationId, selectedTeam.id);
  };

  const handleRejectInvitation = async (invitationId: number) => {
    if (!selectedTeam) return;
    await rejectInvitation(invitationId, selectedTeam.id);
  };

  const handleOpenFriendModal = () => {
    setShowFriendModal(true);
    setFriendTargetTeamId('');
    setFriendSubmitMessage('');
    setShowFriendTeamDropdown(false);
  };

  const handleCloseFriendModal = () => {
    setShowFriendModal(false);
    setShowFriendTeamDropdown(false);
  };

  const handleSubmitFriendship = async () => {
    if (!selectedTeam) return;
    if (friendTargetTeamId === '') {
      setFriendSubmitMessage('请选择要建立友好关系的舞队');
      setTimeout(() => setFriendSubmitMessage(''), 3000);
      return;
    }
    const result = await createFriendship({
      teamId1: selectedTeam.id,
      teamId2: friendTargetTeamId as number
    });
    setFriendSubmitMessage(result.message || '');
    setTimeout(() => setFriendSubmitMessage(''), 3000);
    if (result.success) {
      setTimeout(() => handleCloseFriendModal(), 1000);
    }
  };

  const handleDeleteFriendship = async (friendshipId: number) => {
    if (!selectedTeam) return;
    await deleteFriendship(friendshipId);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 30) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const getAverageRating = () => {
    if (teamComments.length === 0) return 0;
    const total = teamComments.reduce((sum, c) => sum + c.rating, 0);
    return total / teamComments.length;
  };

  const getWinRate = (battleCount: number, battleWins: number) => {
    if (battleCount === 0) return '0%';
    return `${Math.round((battleWins / battleCount) * 100)}%`;
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
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
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
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleOpenInviteModal}
                    className="flex items-center space-x-2 px-6 py-3 rounded-full font-bold shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 hover:scale-105"
                  >
                    <Handshake className="w-5 h-5" />
                    <span>发起约舞</span>
                  </button>
                  <button
                    onClick={() => toggleFavorite(selectedTeam.id, user?.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold shadow-lg transition-all duration-300 ${
                      isFavorite(selectedTeam.id)
                        ? 'bg-red-500 text-white hover:bg-red-600 scale-105'
                        : 'bg-white text-red-500 hover:bg-red-50 hover:scale-105'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(selectedTeam.id) ? 'fill-current' : ''}`} />
                    <span>{isFavorite(selectedTeam.id) ? '已收藏' : '收藏'}</span>
                  </button>
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
                      interactive={!!user && !hasVotedCostume}
                      onVote={handleCostumeVote}
                      size="lg"
                      color="yellow"
                      hasVoted={hasVotedCostume}
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
              <div className="flex flex-wrap gap-4 mb-6">
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
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    activeTab === 'videos'
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Video className="w-5 h-5" />
                    <span>表演视频 ({selectedTeam?.videos?.length || 0})</span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('invitations')}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    activeTab === 'invitations'
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Handshake className="w-5 h-5" />
                    <span>约舞记录 ({pendingInvitations.length + completedInvitations.length})</span>
                    {pendingInvitations.length > 0 && (
                      <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                        {pendingInvitations.length}
                      </span>
                    )}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('friendships')}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    activeTab === 'friendships'
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Link2 className="w-5 h-5" />
                    <span>友好舞队 ({teamFriendships.length})</span>
                  </span>
                </button>
              </div>

              {activeTab === 'songs' && (
                <div className="space-y-4">
                  {teamBattleStats && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                        <span className="text-2xl">🏆</span>
                        <span>PK 总战绩</span>
                      </h3>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-800">{teamBattleStats.totalBattles}</div>
                          <p className="text-sm text-gray-500">总场次</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">{teamBattleStats.totalWins}</div>
                          <p className="text-sm text-gray-500">胜场</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-500">{teamBattleStats.totalLosses}</div>
                          <p className="text-sm text-gray-500">负场</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                            {getWinRate(teamBattleStats.totalBattles, teamBattleStats.totalWins)}
                          </div>
                          <p className="text-sm text-gray-500">胜率</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
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
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                  胜率 {getWinRate(song.battleCount, song.battleWins)}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {song.battleCount} 场 PK
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 text-red-500 mb-1">
                              <Heart className="w-4 h-4 fill-current" />
                              <span className="font-bold">上头程度</span>
                            </div>
                            <StarRating rating={song.addictScore} totalVotes={song.addictVotes} size="sm" color="red" />
                            <button
                              onClick={() => setPlaylistModalSongId(song.id)}
                              className="mt-2 inline-flex items-center space-x-1 text-xs text-purple-500 hover:text-purple-700 font-medium"
                            >
                              <ListPlus className="w-3.5 h-3.5" />
                              <span>加入歌单</span>
                            </button>
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

              {activeTab === 'videos' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600">
                      {selectedTeam?.videos?.length || 0} 个表演视频
                    </p>
                    <button
                      onClick={() => setShowVideoEdit(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      <Settings className="w-4 h-4" />
                      <span>管理视频</span>
                    </button>
                  </div>
                  
                  {selectedTeam?.videos && selectedTeam.videos.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedTeam.videos.map((video: TeamVideo, index: number) => (
                        <VideoCard
                          key={video.id}
                          video={video}
                          team={selectedTeam}
                          onPlay={setPlayingVideo}
                          delay={index * 100}
                          showTeamInfo={false}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                      <Video className="w-20 h-20 mx-auto mb-4 text-purple-300" />
                      <h3 className="text-xl font-bold text-gray-700 mb-2">暂无表演视频</h3>
                      <p className="text-gray-500 mb-6">该舞队还没有上传表演视频</p>
                      <button
                        onClick={() => setShowVideoEdit(true)}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:shadow-lg transition-all"
                      >
                        <Plus className="w-5 h-5" />
                        <span>添加第一个视频</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'invitations' && (
                <div className="space-y-6">
                  <div className="flex space-x-4 mb-4">
                    <button
                      onClick={() => setInvitationTab('pending')}
                      className={`px-5 py-2 rounded-lg font-medium transition-all ${
                        invitationTab === 'pending'
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>待处理 ({pendingInvitations.filter(inv => inv.toTeamId === selectedTeam?.id || inv.fromTeamId === selectedTeam?.id).length})</span>
                        {pendingInvitations.length > 0 && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                            {pendingInvitations.length}
                          </span>
                        )}
                      </span>
                    </button>
                    <button
                      onClick={() => setInvitationTab('completed')}
                      className={`px-5 py-2 rounded-lg font-medium transition-all ${
                        invitationTab === 'completed'
                          ? 'bg-green-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>已完成 ({completedInvitations.length})</span>
                      </span>
                    </button>
                  </div>

                  {(() => {
                    if (invitationsLoading) {
                      return (
                        <div className="text-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mx-auto"></div>
                          <p className="text-gray-500 mt-4">加载约舞记录中...</p>
                        </div>
                      );
                    }
                    if (invitationTab === 'pending') {
                      if (pendingInvitations.length > 0) {
                        return (
                          <div className="space-y-4">
                            {pendingInvitations.map((inv: InvitationWithTeamNames, index: number) => {
                              const isReceived = inv.toTeamId === selectedTeam?.id;
                              return (
                                <div
                                  key={inv.id}
                                  className={`rounded-xl p-5 border-2 transition-all animate-fadeInUp ${
                                    isReceived
                                      ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
                                      : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
                                  }`}
                                  style={{ animationDelay: `${index * 50}ms` }}
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        isReceived ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                                      }`}>
                                        {isReceived ? '收到邀请' : '发出邀请'}
                                      </span>
                                      <span className="px-3 py-1 bg-yellow-400 rounded-full text-xs font-bold text-yellow-900">
                                        待处理
                                      </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      发起时间: {formatDateTime(inv.createdAt)}
                                    </span>
                                  </div>
                                  <div className="mb-4">
                                    <div className="flex items-center space-x-2 text-lg font-bold text-gray-800 mb-2">
                                      <span>{inv.fromTeamName}</span>
                                      <span className="text-2xl">🤝</span>
                                      <span>{inv.toTeamName}</span>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                                      <div className="flex items-center space-x-2 text-gray-600">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        <span><span className="font-medium">约舞时间:</span> {formatDateTime(inv.danceTime)}</span>
                                      </div>
                                      <div className="flex items-center space-x-2 text-gray-600">
                                        <MapPin className="w-4 h-4 text-red-500" />
                                        <span><span className="font-medium">约舞地点:</span> {inv.location}</span>
                                      </div>
                                    </div>
                                    {inv.remark && (
                                      <div className="mt-3 p-3 bg-white rounded-lg text-sm text-gray-600">
                                        <span className="font-medium">备注:</span> {inv.remark}
                                      </div>
                                    )}
                                  </div>
                                  {isReceived && (
                                    <div className="flex justify-end space-x-3">
                                      <button
                                        onClick={() => handleRejectInvitation(inv.id)}
                                        className="flex items-center space-x-1 px-5 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all"
                                      >
                                        <XCircle className="w-4 h-4" />
                                        <span>拒绝</span>
                                      </button>
                                      <button
                                        onClick={() => handleAcceptInvitation(inv.id)}
                                        className="flex items-center space-x-1 px-5 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                        <span>接受</span>
                                      </button>
                                    </div>
                                  )}
                                  {!isReceived && (
                                    <div className="flex justify-end">
                                      <span className="text-sm text-gray-500 italic">等待对方舞队回应...</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      } else {
                        return (
                          <div className="text-center py-12 text-gray-500">
                            <Handshake className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p>暂无待处理的约舞邀请</p>
                          </div>
                        );
                      }
                    } else {
                      if (completedInvitations.length > 0) {
                        return (
                          <div className="space-y-4">
                            {completedInvitations.map((inv: InvitationWithTeamNames, index: number) => {
                              const isReceived = inv.toTeamId === selectedTeam?.id;
                              return (
                                <div
                                  key={inv.id}
                                  className={`rounded-xl p-5 border transition-all animate-fadeInUp ${
                                    inv.status === 'accepted'
                                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                                      : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
                                  }`}
                                  style={{ animationDelay: `${index * 50}ms` }}
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        isReceived ? 'bg-blue-400 text-white' : 'bg-purple-400 text-white'
                                      }`}>
                                        {isReceived ? '收到邀请' : '发出邀请'}
                                      </span>
                                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        inv.status === 'accepted' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                                      }`}>
                                        {inv.status === 'accepted' ? '已接受' : '已拒绝'}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {inv.respondedAt && (
                                        <span>处理时间: {formatDateTime(inv.respondedAt)}</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="mb-2">
                                    <div className="flex items-center space-x-2 text-lg font-bold text-gray-800 mb-2">
                                      <span>{inv.fromTeamName}</span>
                                      <span className="text-2xl">🤝</span>
                                      <span>{inv.toTeamName}</span>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                                      <div className="flex items-center space-x-2 text-gray-600">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        <span><span className="font-medium">约舞时间:</span> {formatDateTime(inv.danceTime)}</span>
                                      </div>
                                      <div className="flex items-center space-x-2 text-gray-600">
                                        <MapPin className="w-4 h-4 text-red-500" />
                                        <span><span className="font-medium">约舞地点:</span> {inv.location}</span>
                                      </div>
                                    </div>
                                  </div>
                                  {inv.remark && (
                                    <div className="mt-3 p-3 bg-white rounded-lg text-sm text-gray-600">
                                      <span className="font-medium">备注:</span> {inv.remark}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      } else {
                        return (
                          <div className="text-center py-12 text-gray-500">
                            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p>暂无已完成的约舞记录</p>
                          </div>
                        );
                      }
                    }
                  })()}
                </div>
              )}

              {activeTab === 'friendships' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                      <span className="text-2xl">🤝</span>
                      <span>友好舞队关系</span>
                    </h3>
                    <button
                      onClick={handleOpenFriendModal}
                      className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>标记友好舞队</span>
                    </button>
                  </div>

                  {teamFriendships.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {teamFriendships.map((friendship: TeamFriendshipWithDetails, index: number) => {
                        const isTeam1 = friendship.teamId1 === selectedTeam?.id;
                        const friendTeamId = isTeam1 ? friendship.teamId2 : friendship.teamId1;
                        const friendTeamName = isTeam1 ? friendship.team2Name : friendship.team1Name;
                        const friendTeamAvatar = isTeam1 ? friendship.team2Avatar : friendship.team1Avatar;
                        return (
                          <div
                            key={friendship.id}
                            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 transition-all hover:shadow-md animate-fadeInUp"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="flex items-center justify-between">
                              <Link
                                to={`/teams/${friendTeamId}`}
                                className="flex items-center space-x-3 hover:bg-green-100 rounded-lg p-2 -m-2 transition-colors"
                              >
                                <img
                                  src={friendTeamAvatar}
                                  alt={friendTeamName}
                                  className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
                                />
                                <div>
                                  <p className="font-bold text-gray-800">{friendTeamName}</p>
                                  <div className="flex items-center space-x-1 text-green-600 text-sm">
                                    <Link2 className="w-3 h-3" />
                                    <span>友好舞队</span>
                                  </div>
                                </div>
                              </Link>
                              <button
                                onClick={() => handleDeleteFriendship(friendship.id)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="解除友好关系"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Link2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>暂无友好舞队关系</p>
                      <p className="text-sm text-gray-400 mt-1">点击右上角按钮标记友好舞队</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-8 mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <MessageSquare className="w-6 h-6 text-orange-500" />
                <span>舞队留言板</span>
                {teamComments.length > 0 && (
                  <span className="text-sm font-normal text-gray-500">
                    （{teamComments.length}条评价，平均分 {getAverageRating().toFixed(1)}）
                  </span>
                )}
              </h2>

              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-gray-800 mb-4">发表留言</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                        {user ? user.nickname.charAt(0) : '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {user ? user.nickname : '未登录'}
                        </p>
                        {!user && (
                          <button
                            onClick={() => setShowNicknameModal(true)}
                            className="text-sm text-orange-600 hover:text-orange-700"
                          >
                            点击登录
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-500 mr-2">打分:</span>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isActive = star <= (hoverRating || commentRating);
                          const isClickable = !commentSubmitted && !!user;
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleCommentRating(star)}
                              onMouseEnter={() => handleCommentRatingHover(star)}
                              onMouseLeave={handleCommentRatingLeave}
                              disabled={!isClickable}
                              className={`p-1 rounded-lg transition-all duration-200 ${
                                isClickable
                                  ? 'cursor-pointer hover:bg-yellow-50 hover:scale-110 active:scale-95'
                                  : 'cursor-default opacity-60'
                              }`}
                            >
                              <Star
                                className={`w-7 h-7 transition-all duration-200 ${
                                  isActive
                                    ? 'text-yellow-400 fill-current drop-shadow-sm'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                      {(commentRating > 0 || hoverRating > 0) && (
                        <span className="ml-2 text-sm font-medium text-gray-600 min-w-[3rem]">
                          {hoverRating || commentRating} 星
                        </span>
                      )}
                      {!user && (
                        <span className="ml-2 text-xs text-orange-500 font-medium">
                          (请先登录)
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder={user ? "分享您对这个舞队的看法..." : "请先登录后发表留言"}
                      rows={3}
                      maxLength={500}
                      disabled={commentSubmitted || !user}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right">
                      {commentContent.length}/500
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    {commentSubmitMessage && (
                      <p className={`text-sm ${commentSubmitMessage.includes('成功') ? 'text-green-500' : 'text-red-500'}`}>
                        {commentSubmitMessage}
                      </p>
                    )}
                    {commentSubmitted && (
                      <p className="text-sm text-green-500 flex items-center">
                        <span className="mr-1">✓</span> 感谢您的评价！
                      </p>
                    )}
                    <button
                      onClick={handleSubmitComment}
                      disabled={commentSubmitted || !user}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ml-auto"
                    >
                      <Send className="w-4 h-4" />
                      <span>发布留言</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {commentsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mx-auto"></div>
                    <p className="text-gray-500 mt-4">加载留言中...</p>
                  </div>
                ) : teamComments.length > 0 ? (
                  teamComments.map((comment: TeamComment, index: number) => (
                    <div
                      key={comment.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all animate-fadeInUp"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                            {comment.nickname.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{comment.nickname}</p>
                            <p className="text-xs text-gray-400">{formatDate(comment.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= comment.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>暂无留言，快来发表第一条评价吧！</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {playingVideo && (
        <VideoPlayer
          video={playingVideo}
          onClose={() => setPlayingVideo(null)}
        />
      )}

      {showVideoEdit && selectedTeam && (
        <VideoEditModal
          isOpen={showVideoEdit}
          onClose={() => setShowVideoEdit(false)}
          teamId={selectedTeam.id}
          videos={selectedTeam.videos || []}
          onVideosChange={(videos) => {
            if (selectedTeam) {
              selectedTeam.videos = videos;
            }
          }}
        />
      )}

      {showInviteModal && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={handleCloseInviteModal}>
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeInUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Handshake className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                      发起约舞邀请
                    </h2>
                    <p className="text-sm text-gray-500">向 {selectedTeam.name}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseInviteModal}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500">*</span> 选择发起约舞的舞队
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowFromTeamDropdown(!showFromTeamDropdown)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-left flex items-center justify-between bg-white"
                    >
                      <span className={inviteFromTeamId === '' ? 'text-gray-400' : 'text-gray-800'}>
                        {inviteFromTeamId === ''
                          ? '请选择您的舞队'
                          : teams.find(t => t.id === inviteFromTeamId)?.name}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showFromTeamDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showFromTeamDropdown && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {teams
                          .filter(t => t.id !== selectedTeam.id)
                          .map(t => (
                            <button
                              key={t.id}
                              onClick={() => {
                                setInviteFromTeamId(t.id);
                                setShowFromTeamDropdown(false);
                              }}
                              className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                                inviteFromTeamId === t.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                              }`}
                            >
                              {t.name}
                            </button>
                          ))}
                        {teams.filter(t => t.id !== selectedTeam.id).length === 0 && (
                            <div className="px-4 py-3 text-gray-400">暂无其他舞队</div>
                          )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500">*</span> 约舞时间
                  </label>
                  <input
                    type="datetime-local"
                    value={inviteDanceTime}
                    onChange={(e) => setInviteDanceTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500">*</span> 约舞地点
                  </label>
                  <input
                    type="text"
                    value={inviteLocation}
                    onChange={(e) => setInviteLocation(e.target.value)}
                    placeholder="请输入约舞地点"
                    maxLength={100}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">备注（选填）</label>
                  <textarea
                    value={inviteRemark}
                    onChange={(e) => setInviteRemark(e.target.value)}
                    placeholder="可以输入想跳舞的类型、注意事项等"
                    rows={3}
                    maxLength={300}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {inviteRemark.length}/300
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                {inviteSubmitMessage && (
                  <p className={`text-sm ${inviteSubmitMessage.includes('成功') ? 'text-green-500' : 'text-red-500'}`}>
                    {inviteSubmitMessage}
                  </p>
                )}
                <div className="flex space-x-3 ml-auto">
                  <button
                    onClick={handleCloseInviteModal}
                    className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSubmitInvitation}
                    className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Send className="w-4 h-4" />
                    <span>发送邀请</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFriendModal && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={handleCloseFriendModal}>
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeInUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                      标记友好舞队
                    </h2>
                    <p className="text-sm text-gray-500">与 {selectedTeam.name} 建立友好关系</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseFriendModal}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500">*</span> 选择友好舞队
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowFriendTeamDropdown(!showFriendTeamDropdown)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-left flex items-center justify-between bg-white"
                    >
                      <span className={friendTargetTeamId === '' ? 'text-gray-400' : 'text-gray-800'}>
                        {friendTargetTeamId === ''
                          ? '请选择要标记的舞队'
                          : teams.find(t => t.id === friendTargetTeamId)?.name}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showFriendTeamDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showFriendTeamDropdown && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {teams
                          .filter(t => t.id !== selectedTeam.id && !teamFriendships.some(f => 
                            (f.teamId1 === t.id || f.teamId2 === t.id)
                          ))
                          .map(t => (
                            <button
                              key={t.id}
                              onClick={() => {
                                setFriendTargetTeamId(t.id);
                                setShowFriendTeamDropdown(false);
                              }}
                              className={`w-full px-4 py-3 text-left hover:bg-green-50 transition-colors ${
                                friendTargetTeamId === t.id ? 'bg-green-50 text-green-600' : 'text-gray-700'
                              }`}
                            >
                              {t.name}
                            </button>
                          ))}
                        {teams.filter(t => t.id !== selectedTeam.id && !teamFriendships.some(f => 
                          (f.teamId1 === t.id || f.teamId2 === t.id)
                        )).length === 0 && (
                          <div className="px-4 py-3 text-gray-400">暂无可标记的舞队</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                {friendSubmitMessage && (
                  <p className={`text-sm ${friendSubmitMessage.includes('成功') || friendSubmitMessage.includes('友好') ? 'text-green-500' : 'text-red-500'}`}>
                    {friendSubmitMessage}
                  </p>
                )}
                <div className="flex space-x-3 ml-auto">
                  <button
                    onClick={handleCloseFriendModal}
                    className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSubmitFriendship}
                    className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Link2 className="w-4 h-4" />
                    <span>确认标记</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {playlistModalSongId !== null && (
        <AddToPlaylistModal
          songId={playlistModalSongId}
          isOpen={true}
          onClose={() => setPlaylistModalSongId(null)}
        />
      )}
    </div>
  );
}
