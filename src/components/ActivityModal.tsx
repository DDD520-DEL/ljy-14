import { X, Clock, MapPin, Users, Music, Mic2, Trophy, Map, ChevronRight } from 'lucide-react';
import { ActivityWithTeam, ActivityType } from '../../shared/types';
import { Link } from 'react-router-dom';

interface ActivityModalProps {
  date: string;
  activities: ActivityWithTeam[];
  activityTypeConfig: Record<ActivityType, { label: string; color: string; bgColor: string; icon: typeof Music }>;
  onClose: () => void;
}

export default function ActivityModal({ date, activities, activityTypeConfig, onClose }: ActivityModalProps) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return `${d.getMonth() + 1}月${d.getDate()}日 ${weekDays[d.getDay()]}`;
  };

  const sortedActivities = [...activities].sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:scale-110 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-t-3xl p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
              <span className="text-3xl">📅</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                {formatDate(date)}
              </h2>
              <p className="text-white/80 text-sm">共 {activities.length} 个活动安排</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-b-3xl p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {sortedActivities.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-gray-500 text-lg">今天暂无活动安排</p>
              <p className="text-gray-400 text-sm mt-2">好好休息一下吧~</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedActivities.map((activity, index) => {
                const typeConfig = activityTypeConfig[activity.type];
                const TypeIcon = typeConfig.icon;

                return (
                  <div
                    key={activity.id}
                    className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border-2 border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b from-pink-500 to-orange-500" />

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={activity.teamAvatar}
                          alt={activity.teamName}
                          className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold ${typeConfig.bgColor} ${typeConfig.color}`}>
                              <TypeIcon className="w-3 h-3" />
                              <span>{typeConfig.label}</span>
                            </span>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                              {activity.teamDistrict}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            <span>{activity.startTime} - {activity.endTime}</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                          {activity.title}
                        </h3>

                        <Link
                          to={`/teams/${activity.teamId}`}
                          className="inline-flex items-center space-x-1 text-sm text-gray-600 mb-3 hover:text-orange-600 transition-colors"
                        >
                          <span className="font-medium">{activity.teamName}</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>

                        <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                          {activity.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center space-x-1.5 text-gray-500">
                            <MapPin className="w-4 h-4 text-red-400" />
                            <span>{activity.location}</span>
                          </div>
                          {activity.participants !== undefined && (
                            <div className="flex items-center space-x-1.5 text-gray-500">
                              <Users className="w-4 h-4 text-blue-400" />
                              <span>{activity.participants}人参与</span>
                            </div>
                          )}
                        </div>

                        {activity.coverImage && (
                          <div className="mt-4 rounded-xl overflow-hidden shadow-md">
                            <img
                              src={activity.coverImage}
                              alt={activity.title}
                              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center space-x-8 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <Music className="w-3.5 h-3.5 text-blue-400" />
                <span>排练</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mic2 className="w-3.5 h-3.5 text-purple-400" />
                <span>演出</span>
              </div>
              <div className="flex items-center space-x-1">
                <Trophy className="w-3.5 h-3.5 text-orange-400" />
                <span>比赛</span>
              </div>
              <div className="flex items-center space-x-1">
                <Map className="w-3.5 h-3.5 text-green-400" />
                <span>其他</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
