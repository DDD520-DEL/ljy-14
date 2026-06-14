import { useEffect } from 'react';
import { useTeamStore, useFilterStore } from '../store/useStore';
import TeamCard from '../components/TeamCard';
import FilterBar from '../components/FilterBar';
import { Users } from 'lucide-react';

export default function TeamListPage() {
  const { teams, loading, error, fetchTeams } = useTeamStore();
  const { district, style, memberCount } = useFilterStore();

  useEffect(() => {
    fetchTeams({ district, style, memberCount });
  }, [district, style, memberCount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow-lg mb-4">
            <Users className="w-5 h-5 text-orange-500" />
            <span className="text-orange-600 font-medium">舞队风采</span>
          </div>
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent"
            style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
          >
            发现精彩舞队
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            这里汇集了全国各地优秀的广场舞团队，每一支都有自己独特的魅力！
          </p>
        </div>

        <FilterBar />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : teams.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                共找到 <span className="font-bold text-orange-600">{teams.length}</span> 支舞队
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team, index) => (
                <TeamCard key={team.id} team={team} delay={index * 100} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">暂无符合条件的舞队</h3>
            <p className="text-gray-500">试试调整筛选条件，发现更多精彩舞队！</p>
          </div>
        )}
      </div>
    </div>
  );
}
