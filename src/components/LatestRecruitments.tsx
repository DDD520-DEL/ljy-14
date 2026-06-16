import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, Phone, ChevronRight } from 'lucide-react';
import { useRecruitmentStore } from '../store/useStore';

interface LatestRecruitmentsProps {
  limit?: number;
}

export default function LatestRecruitments({ limit = 5 }: LatestRecruitmentsProps) {
  const { latestRecruitments, loading, fetchLatestRecruitments } = useRecruitmentStore();

  useEffect(() => {
    fetchLatestRecruitments(limit);
  }, [limit]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                最新招募
              </h3>
              <p className="text-white/80 text-sm">发现身边的舞队招新信息</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          </div>
        ) : latestRecruitments.length > 0 ? (
          <div className="space-y-3">
            {latestRecruitments.map((recruitment, index) => (
              <Link
                key={recruitment.id}
                to={`/teams/${recruitment.teamId}`}
                className="block p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 transition-all duration-300 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={recruitment.teamAvatar}
                    alt={recruitment.teamName}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-gray-800 truncate group-hover:text-pink-600 transition-colors">
                        {recruitment.title}
                      </h4>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {formatDate(recruitment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium mb-2 truncate">
                      {recruitment.teamName}
                    </p>
                    <div className="flex items-center flex-wrap gap-2 text-xs">
                      <span className="inline-flex items-center px-2 py-1 bg-white rounded-lg text-pink-600 font-medium">
                        招{recruitment.recruitCount}人
                      </span>
                      <span className="inline-flex items-center text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {recruitment.teamDistrict}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-pink-500 flex-shrink-0 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">暂无招募信息</p>
          </div>
        )}

        {latestRecruitments.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              to="/teams"
              className="flex items-center justify-center text-sm text-pink-600 hover:text-pink-700 font-medium"
            >
              <span>查看更多舞队</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
