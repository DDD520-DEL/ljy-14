import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, Users, Map, Trophy, Swords, Menu, X, Heart, User } from 'lucide-react';
import { useFavoriteStore, useUserStore } from '../store/useStore';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { favoriteIds } = useFavoriteStore();
  const { user, setShowNicknameModal } = useUserStore();

  const navLinks = [
    { path: '/', label: '首页', icon: Music },
    { path: '/teams', label: '舞队风采', icon: Users },
    { path: '/favorites', label: '我的收藏', icon: Heart, badge: favoriteIds.length },
    { path: '/battle', label: '歌单PK', icon: Swords },
    { path: '/map', label: '地图分布', icon: Map },
    { path: '/ranking', label: '排行榜', icon: Trophy },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">💃</span>
            <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
              广场舞金曲大PK
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center space-x-1 px-4 py-2 rounded-full transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span className="font-medium">{link.label}</span>
                {link.badge && link.badge > 0 && (
                  <span className={`absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-xs font-bold rounded-full px-1 ${
                    isActive(link.path)
                      ? 'bg-white text-red-500'
                      : 'bg-red-500 text-white'
                  }`}>
                    {link.badge > 99 ? '99+' : link.badge}
                  </span>
                )}
              </Link>
            ))}
            <div className="ml-2">
              {user ? (
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive('/profile')
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-105'
                      : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.nickname.charAt(0)}
                  </div>
                  <span className="font-medium">{user.nickname}</span>
                </Link>
              ) : (
                <button
                  onClick={() => setShowNicknameModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <User className="w-4 h-4" />
                  <span>登录</span>
                </button>
              )}
            </div>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fadeIn">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                      : 'text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </div>
                  {link.badge && link.badge > 0 && (
                    <span className={`min-w-[24px] h-6 flex items-center justify-center text-xs font-bold rounded-full px-2 ${
                      isActive(link.path)
                        ? 'bg-white/20 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {link.badge > 99 ? '99+' : link.badge}
                    </span>
                  )}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-2 mt-2">
                {user ? (
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      isActive('/profile')
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                        : 'text-gray-700 hover:bg-orange-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-sm font-bold">
                        {user.nickname.charAt(0)}
                      </div>
                      <span className="font-medium">个人中心</span>
                    </div>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowNicknameModal(true);
                    }}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white"
                  >
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5" />
                      <span className="font-medium">登录</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
