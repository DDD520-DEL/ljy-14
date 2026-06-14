import { useEffect, useState } from 'react';
import { Swords, RefreshCw, Heart, Music, Zap, User } from 'lucide-react';
import { useBattleStore, useUserStore } from '../store/useStore';
import { Link } from 'react-router-dom';

export default function BattlePage() {
  const { battlePair, fetchBattlePair, voteAddict } = useBattleStore();
  const { user, setShowNicknameModal } = useUserStore();
  const [votedSong1, setVotedSong1] = useState(false);
  const [votedSong2, setVotedSong2] = useState(false);
  const [message, setMessage] = useState('');
  const [showAnimation, setShowAnimation] = useState<number | null>(null);

  useEffect(() => {
    fetchBattlePair();
  }, []);

  const handleVote = async (songId: number, isSong1: boolean) => {
    if ((isSong1 && votedSong1) || (!isSong1 && votedSong2)) return;
    
    if (!user) {
      setShowNicknameModal(true);
      return;
    }
    
    setShowAnimation(songId);
    setTimeout(() => setShowAnimation(null), 1000);

    const score = 5;
    const result = await voteAddict(songId, score, user.id);
    
    if (result.success) {
      if (isSong1) setVotedSong1(true);
      else setVotedSong2(true);
      setMessage('投票成功！感谢参与！');
    } else {
      setMessage(result.message || '投票失败');
    }
    
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRefresh = () => {
    fetchBattlePair();
    setVotedSong1(false);
    setVotedSong2(false);
    setMessage('');
  };

  if (!battlePair) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  const totalVotes1 = battlePair.song1.addictVotes;
  const totalVotes2 = battlePair.song2.addictVotes;
  const totalVotes = totalVotes1 + totalVotes2;
  const percentage1 = totalVotes > 0 ? (totalVotes1 / totalVotes) * 100 : 50;
  const percentage2 = totalVotes > 0 ? (totalVotes2 / totalVotes) * 100 : 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow-lg mb-4">
            <Swords className="w-5 h-5 text-red-500" />
            <span className="text-red-600 font-medium">金曲对决</span>
          </div>
          <h1 
            className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent"
            style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
          >
            歌单大PK
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            选出你觉得最上头的广场舞金曲！哪首歌让你一听就想跟着摇摆？
          </p>
        </div>

        {message && (
          <div className="mb-8 text-center animate-fadeIn">
            <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full font-bold ${
              message.includes('成功') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {message.includes('成功') ? '🎉' : '😅'}
              <span>{message}</span>
            </div>
          </div>
        )}

        <div className="relative mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div 
              className={`relative bg-white rounded-3xl shadow-2xl p-8 transition-all duration-500 ${
                votedSong1 ? 'ring-4 ring-green-400' : ''
              } ${showAnimation === battlePair.song1.id ? 'animate-pulse scale-105' : ''}`}
            >
              <Link to={`/teams/${battlePair.team1.id}`} className="block mb-6">
                <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors">
                  <img
                    src={battlePair.team1.avatar}
                    alt={battlePair.team1.name}
                    className="w-14 h-14 rounded-full border-2 border-white shadow-lg"
                  />
                  <div>
                    <p className="font-bold text-gray-800">{battlePair.team1.name}</p>
                    <p className="text-sm text-orange-600">🎤 {battlePair.team1.district}</p>
                  </div>
                </div>
              </Link>

              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <Music className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                  {battlePair.song1.title}
                </h3>
                <p className="text-gray-500">{battlePair.song1.artist}</p>
                <p className="mt-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
                    {battlePair.song1.genre}
                  </span>
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                    <span>上头程度</span>
                  </span>
                  <span className="font-bold text-red-500 text-xl">{battlePair.song1.addictScore.toFixed(1)}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-1000 rounded-full"
                    style={{ width: `${percentage1}%` }}
                  />
                </div>
                <p className="text-right text-sm text-gray-500 mt-1">{totalVotes1} 票</p>
              </div>

              <button
                onClick={() => handleVote(battlePair.song1.id, true)}
                disabled={votedSong1}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  votedSong1
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-xl hover:scale-105 active:scale-95'
                }`}
              >
                <span className="flex items-center justify-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>{votedSong1 ? '✓ 已投票' : '我觉得这首更上头！'}</span>
                </span>
              </button>
            </div>

            <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <span className="text-white font-black text-2xl">VS</span>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-full animate-ping" />
              </div>
            </div>

            <div className="md:hidden text-center my-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full shadow-xl">
                <span className="text-white font-black text-xl">VS</span>
              </div>
            </div>

            <div 
              className={`relative bg-white rounded-3xl shadow-2xl p-8 transition-all duration-500 ${
                votedSong2 ? 'ring-4 ring-green-400' : ''
              } ${showAnimation === battlePair.song2.id ? 'animate-pulse scale-105' : ''}`}
            >
              <Link to={`/teams/${battlePair.team2.id}`} className="block mb-6">
                <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors">
                  <img
                    src={battlePair.team2.avatar}
                    alt={battlePair.team2.name}
                    className="w-14 h-14 rounded-full border-2 border-white shadow-lg"
                  />
                  <div>
                    <p className="font-bold text-gray-800">{battlePair.team2.name}</p>
                    <p className="text-sm text-red-600">🎤 {battlePair.team2.district}</p>
                  </div>
                </div>
              </Link>

              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <Music className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                  {battlePair.song2.title}
                </h3>
                <p className="text-gray-500">{battlePair.song2.artist}</p>
                <p className="mt-2">
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                    {battlePair.song2.genre}
                  </span>
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                    <span>上头程度</span>
                  </span>
                  <span className="font-bold text-red-500 text-xl">{battlePair.song2.addictScore.toFixed(1)}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-400 to-pink-500 transition-all duration-1000 rounded-full"
                    style={{ width: `${percentage2}%` }}
                  />
                </div>
                <p className="text-right text-sm text-gray-500 mt-1">{totalVotes2} 票</p>
              </div>

              <button
                onClick={() => handleVote(battlePair.song2.id, false)}
                disabled={votedSong2}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  votedSong2
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-xl hover:scale-105 active:scale-95'
                }`}
              >
                <span className="flex items-center justify-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>{votedSong2 ? '✓ 已投票' : '我觉得这首更上头！'}</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-gray-700 font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-gray-200"
          >
            <RefreshCw className="w-5 h-5" />
            <span>换一组PK</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
            <span className="text-3xl">💡</span>
            <span>PK规则</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-orange-50 rounded-2xl p-6">
              <div className="text-4xl mb-3">1️⃣</div>
              <h4 className="font-bold text-gray-800 mb-2">听旋律</h4>
              <p className="text-gray-600 text-sm">感受两首歌的旋律和节奏，想象自己跟着跳舞的感觉</p>
            </div>
            <div className="bg-red-50 rounded-2xl p-6">
              <div className="text-4xl mb-3">2️⃣</div>
              <h4 className="font-bold text-gray-800 mb-2">比上头</h4>
              <p className="text-gray-600 text-sm">哪首歌更洗脑？哪首让你一听就想跟着摇摆？</p>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-6">
              <div className="text-4xl mb-3">3️⃣</div>
              <h4 className="font-bold text-gray-800 mb-2">投一票</h4>
              <p className="text-gray-600 text-sm">为你觉得更上头的歌投票，每首歌只能投一票哦！</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
