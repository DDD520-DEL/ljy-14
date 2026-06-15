import { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotificationStore, useUserStore } from '../store/useStore';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useUserStore();
  const { notifications, unreadCount, fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  useEffect(() => {
    if (user) {
      fetchUnreadCount(user.id);
    }
  }, [user, fetchUnreadCount]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      fetchUnreadCount(user.id);
    }, 30000);
    return () => clearInterval(interval);
  }, [user, fetchUnreadCount]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = async () => {
    if (!user) return;
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      await fetchNotifications(user.id);
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!user) return;
    await markAsRead(id, user.id);
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    await markAllAsRead(user.id);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full bg-red-500 text-white px-1 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-fadeIn overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-red-500" />
              <span className="font-bold text-gray-800">通知中心</span>
              {unreadCount > 0 && (
                <span className="text-xs px-2 py-0.5 bg-red-500 text-white rounded-full">
                  {unreadCount}条未读
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center space-x-1 text-xs text-orange-600 hover:text-orange-700 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>全部已读</span>
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-50 flex items-center justify-center">
                  <Bell className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-400 text-sm">暂无通知</p>
                <p className="text-gray-300 text-xs mt-1">收藏舞队后，当有新歌曲发布时会收到通知</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-red-50/30' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {notification.teamAvatar ? (
                        <img
                          src={notification.teamAvatar}
                          alt={notification.teamName}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold">
                          {notification.teamName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className={`text-sm ${!notification.read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                          <span className="text-red-500 font-semibold">{notification.teamName}</span>
                          {' 发布了新歌曲 '}
                          <span className="text-orange-600 font-semibold">{notification.songTitle}</span>
                        </p>
                        {!notification.read && (
                          <button
                            onClick={(e) => handleMarkAsRead(e, notification.id)}
                            className="flex-shrink-0 ml-2 p-1 text-gray-400 hover:text-green-500 transition-colors"
                            title="标记已读"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-400">{formatTime(notification.createdAt)}</span>
                        {!notification.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-center">
              <Link
                to="/favorites"
                onClick={() => setIsOpen(false)}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                查看我的收藏 →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
