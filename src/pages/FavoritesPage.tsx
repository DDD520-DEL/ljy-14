import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Users } from 'lucide-react';
import { useTeamStore, useFavoriteStore } from '../store/useStore';
import TeamCard from '../components/TeamCard';

export default function FavoritesPage() {
  const { teams, fetchTeams, loading, error } = useTeamStore();
  const { favoriteIds, clearFavorites } = useFavoriteStore();

  useEffect(() => {
    if (favoriteIds.length > 0) {
      fetchTeams();
    }
  }, [favoriteIds.length]);

  const favoriteTeams = teams.filter((team) => favoriteIds.includes(team.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow-lg mb-4">
            <Heart className="w-5 h-5 text-red-500 fill-current" />
            <span className="text-red-500 font-medium">我的收藏</span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent"
            style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
          >
            我喜欢的舞队
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            这里是你收藏的所有精彩舞队，随时可以查看和取消收藏
          </p>
        </div>

        {favoriteIds.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              共收藏 <span className="font-bold text-red-500">{favoriteTeams.length}</span> 支舞队
            </p>
            <button
              onClick={clearFavorites}
              className="px-4 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              清空全部收藏
            </button>
          </div>
        )}

        {loading && favoriteTeams.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : favoriteTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteTeams.map((team, index) => (
              <TeamCard key={team.id} team={team} delay={index * 100} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg animate-fadeIn">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center">
              <Heart className="w-12 h-12 text-red-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">还没有收藏任何舞队</h3>
            <p className="text-gray-500 mb-6">去发现更多精彩的舞队，点击心形按钮收藏你喜欢的吧！</p>
            <Link
              to="/teams"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
            >
              <Users className="w-5 h-5" />
              <span>去发现舞队</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
