import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, MapPin, Music, Trophy, Mic2, Loader2 } from 'lucide-react';
import { ActivityType } from '../../shared/types';
import { useActivityStore } from '../store/useStore';
import ActivityModal from './ActivityModal';

const districts = ['全部区域', '朝阳区', '海淀区', '东城区', '西城区', '丰台区', '石景山区', '通州区', '昌平区', '大兴区', '顺义区'];

const activityTypeConfig: Record<ActivityType, { label: string; color: string; bgColor: string; icon: typeof Music }> = {
  rehearsal: { label: '排练', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Music },
  performance: { label: '演出', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: Mic2 },
  competition: { label: '比赛', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: Trophy },
  other: { label: '其他', color: 'text-green-600', bgColor: 'bg-green-100', icon: MapPin },
};

export default function ActivityCalendar() {
  const { activities, loading, fetchActivities } = useActivityStore();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDistrict, setSelectedDistrict] = useState('全部区域');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const filteredActivities = useMemo(() => {
    if (selectedDistrict === '全部区域') return activities;
    return activities.filter(a => a.teamDistrict === selectedDistrict);
  }, [activities, selectedDistrict]);

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  const formatDateStr = (day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const getActivitiesForDate = (dateStr: string) => {
    return filteredActivities.filter(a => a.date === dateStr);
  };

  const getTypeCountForDate = (dateStr: string) => {
    const dayActivities = getActivitiesForDate(dateStr);
    const typeCount: Record<ActivityType, number> = { rehearsal: 0, performance: 0, competition: 0, other: 0 };
    dayActivities.forEach(a => { typeCount[a.type]++; });
    return typeCount;
  };

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const dateStr = formatDateStr(day);
    const dayActivities = getActivitiesForDate(dateStr);
    if (dayActivities.length > 0) {
      setSelectedDate(dateStr);
      setShowModal(true);
    }
  };

  const monthStats = useMemo(() => {
    const startDate = formatDateStr(1);
    const endDate = formatDateStr(daysInMonth);
    const monthActs = filteredActivities.filter(a => a.date >= startDate && a.date <= endDate);
    return {
      total: monthActs.length,
      rehearsal: monthActs.filter(a => a.type === 'rehearsal').length,
      performance: monthActs.filter(a => a.type === 'performance').length,
      competition: monthActs.filter(a => a.type === 'competition').length,
      other: monthActs.filter(a => a.type === 'other').length,
    };
  }, [filteredActivities, year, month, daysInMonth]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-12 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp">
      <div className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h3 className="text-2xl font-bold" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
              {year}年{month + 1}月
            </h3>
            <p className="text-sm text-white/80 mt-1">舞队活动日历</p>
          </div>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          <div className="bg-white/20 rounded-2xl p-3 backdrop-blur">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <CalendarDays className="w-4 h-4" />
              <span className="text-2xl font-bold">{monthStats.total}</span>
            </div>
            <div className="text-xs text-white/80">本月活动</div>
          </div>
          <div className="bg-white/20 rounded-2xl p-3 backdrop-blur">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Music className="w-4 h-4 text-blue-200" />
              <span className="text-2xl font-bold">{monthStats.rehearsal}</span>
            </div>
            <div className="text-xs text-white/80">排练</div>
          </div>
          <div className="bg-white/20 rounded-2xl p-3 backdrop-blur">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Mic2 className="w-4 h-4 text-purple-200" />
              <span className="text-2xl font-bold">{monthStats.performance}</span>
            </div>
            <div className="text-xs text-white/80">演出</div>
          </div>
          <div className="bg-white/20 rounded-2xl p-3 backdrop-blur">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Trophy className="w-4 h-4 text-yellow-200" />
              <span className="text-2xl font-bold">{monthStats.competition}</span>
            </div>
            <div className="text-xs text-white/80">比赛</div>
          </div>
          <div className="bg-white/20 rounded-2xl p-3 backdrop-blur col-span-2 md:col-span-1">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <MapPin className="w-4 h-4 text-green-200" />
              <span className="text-2xl font-bold">{monthStats.other}</span>
            </div>
            <div className="text-xs text-white/80">其他活动</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">📍 筛选区域</label>
          <div className="flex flex-wrap gap-2">
            {districts.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDistrict(d)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedDistrict === d
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={`text-center text-sm font-semibold py-2 ${
                index === 0 || index === 6 ? 'text-red-400' : 'text-gray-500'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateStr = formatDateStr(day);
            const dayActivities = getActivitiesForDate(dateStr);
            const hasActivities = dayActivities.length > 0;
            const typeCount = getTypeCountForDate(dateStr);
            const isToday = isCurrentMonth && day === todayDate;
            const dayOfWeek = index % 7;
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                disabled={!hasActivities}
                className={`
                  aspect-square flex flex-col items-center justify-center rounded-2xl text-sm font-medium
                  transition-all duration-300 relative p-1
                  ${hasActivities
                    ? 'cursor-pointer hover:shadow-xl hover:scale-105 hover:-translate-y-1'
                    : 'cursor-default'
                  }
                  ${isToday
                    ? 'ring-2 ring-red-400 ring-offset-2 bg-gradient-to-br from-red-50 to-orange-50'
                    : hasActivities
                      ? 'bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 shadow-sm'
                      : isWeekend
                        ? 'bg-red-50/30'
                        : ''
                  }
                `}
              >
                <span className={`
                  ${isToday ? 'text-red-500 font-bold' : 
                    hasActivities ? 'text-gray-800' :
                    isWeekend ? 'text-red-300' : 'text-gray-400'
                  }
                `}>
                  {day}
                </span>
                
                {hasActivities && (
                  <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                    {typeCount.rehearsal > 0 && (
                      <div className="w-2 h-2 rounded-full bg-blue-400" title={`排练 x${typeCount.rehearsal}`} />
                    )}
                    {typeCount.performance > 0 && (
                      <div className="w-2 h-2 rounded-full bg-purple-400" title={`演出 x${typeCount.performance}`} />
                    )}
                    {typeCount.competition > 0 && (
                      <div className="w-2 h-2 rounded-full bg-orange-400" title={`比赛 x${typeCount.competition}`} />
                    )}
                    {typeCount.other > 0 && (
                      <div className="w-2 h-2 rounded-full bg-green-400" title={`其他 x${typeCount.other}`} />
                    )}
                  </div>
                )}

                {hasActivities && dayActivities.length > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                    {dayActivities.length}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            <span className="text-gray-600">排练</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-400" />
            <span className="text-gray-600">演出</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-400" />
            <span className="text-gray-600">比赛</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-gray-600">其他</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-xl ring-2 ring-red-400 ring-offset-1 bg-red-50" />
            <span className="text-gray-600">今天</span>
          </div>
        </div>
      </div>

      {showModal && selectedDate && (
        <ActivityModal
          date={selectedDate}
          activities={getActivitiesForDate(selectedDate)}
          activityTypeConfig={activityTypeConfig}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
