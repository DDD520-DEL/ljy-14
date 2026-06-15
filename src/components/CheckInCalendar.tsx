import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame, Check } from 'lucide-react';
import { useCheckInStore, useUserStore } from '../store/useStore';

interface CheckInCalendarProps {
  showCheckInButton?: boolean;
}

export default function CheckInCalendar({ showCheckInButton = true }: CheckInCalendarProps) {
  const { user } = useUserStore();
  const { status, monthRecords, fetchStatus, fetchMonthRecords, doCheckIn } = useCheckInStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    if (user) {
      fetchStatus(user.id);
      fetchMonthRecords(user.id, year, month + 1);
    }
  }, [user, year, month]);

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const checkedInDates = new Set(monthRecords.map(r => {
    const day = parseInt(r.date.split('-')[2]);
    return day;
  }));

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleCheckIn = async () => {
    if (!user || !status || status.todayCheckedIn || isCheckingIn) return;
    setIsCheckingIn(true);
    const result = await doCheckIn(user.id);
    setIsCheckingIn(false);
    if (!result.success) {
      alert(result.message);
    }
  };

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const isFutureDate = (day: number) => {
    if (!isCurrentMonth) return month > today.getMonth();
    return day > todayDate;
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
            {year}年{month + 1}月
          </h3>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {status && (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/20 rounded-2xl p-3 backdrop-blur">
              <div className="text-2xl font-bold">{status.consecutiveDays}</div>
              <div className="text-sm text-white/80">连续签到</div>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 backdrop-blur">
              <div className="text-2xl font-bold">{status.totalDays}</div>
              <div className="text-sm text-white/80">累计签到</div>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 backdrop-blur">
              <div className="flex items-center justify-center space-x-1">
                <Flame className={`w-5 h-5 ${status.todayCheckedIn ? 'text-yellow-300' : 'text-white/50'}`} />
                <span className="text-2xl font-bold">
                  {status.todayCheckedIn ? '已签' : '未签'}
                </span>
              </div>
              <div className="text-sm text-white/80">今日状态</div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={`text-center text-sm font-medium py-2 ${
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

            const isChecked = checkedInDates.has(day);
            const isToday = isCurrentMonth && day === todayDate;
            const isFuture = isFutureDate(day);
            const dayOfWeek = index % 7;
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            return (
              <div
                key={day}
                className={`
                  aspect-square flex items-center justify-center rounded-xl text-sm font-medium
                  transition-all duration-300
                  ${isChecked
                    ? 'bg-gradient-to-br from-red-400 to-orange-500 text-white shadow-lg scale-95'
                    : isToday
                      ? 'bg-orange-100 text-orange-600 ring-2 ring-orange-400 ring-offset-2'
                      : isFuture
                        ? 'text-gray-300'
                        : isWeekend
                          ? 'text-red-300 bg-red-50/50'
                          : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {isChecked ? (
                  <Check className="w-5 h-5" />
                ) : (
                  day
                )}
              </div>
            );
          })}
        </div>

        {showCheckInButton && user && status && (
          <div className="mt-6">
            {status.todayCheckedIn ? (
              <div className="flex items-center justify-center space-x-2 py-4 bg-green-50 rounded-2xl text-green-600">
                <Check className="w-5 h-5" />
                <span className="font-medium">今日已签到，明天继续保持哦！</span>
              </div>
            ) : (
              <button
                onClick={handleCheckIn}
                disabled={isCheckingIn}
                className={`
                  w-full py-4 rounded-2xl font-bold text-lg text-white
                  bg-gradient-to-r from-red-500 to-orange-500
                  hover:from-red-600 hover:to-orange-600
                  shadow-lg hover:shadow-xl
                  transform hover:scale-[1.02] active:scale-[0.98]
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {isCheckingIn ? '签到中...' : '立即签到'}
              </button>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-red-400 to-orange-500" />
            <span>已签到</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-orange-100 ring-2 ring-orange-400 ring-offset-1" />
            <span>今天</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gray-100" />
            <span>未签到</span>
          </div>
        </div>
      </div>
    </div>
  );
}
