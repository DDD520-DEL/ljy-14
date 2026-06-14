import { useState } from 'react';
import { X, User, Sparkles } from 'lucide-react';
import { useUserStore } from '../store/useStore';

export default function NicknameModal() {
  const { showNicknameModal, setShowNicknameModal, loginOrRegister, loading } = useUserStore();
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      setMessage('请输入昵称');
      return;
    }
    if (nickname.trim().length > 20) {
      setMessage('昵称不能超过20个字符');
      return;
    }

    const result = await loginOrRegister(nickname.trim());
    if (!result.success) {
      setMessage(result.message || '');
    } else {
      setNickname('');
      setMessage('');
    }
  };

  const handleClose = () => {
    setShowNicknameModal(false);
    setNickname('');
    setMessage('');
  };

  if (!showNicknameModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={handleClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-r from-red-500 to-orange-500 p-8 text-center">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
            欢迎来到广场舞金曲大PK
          </h2>
          <p className="text-white/80 mt-2">请输入您的昵称开始使用</p>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                您的昵称
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setMessage('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="请输入昵称"
                  maxLength={20}
                  autoFocus
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-lg"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 text-right">
                {nickname.length}/20
              </p>
            </div>

            {message && (
              <p className="text-sm text-red-500 text-center">{message}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !nickname.trim()}
              className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:from-red-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : '进入平台'}
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-6">
            输入昵称即可登录，同一昵称会识别为同一用户
          </p>
        </div>
      </div>
    </div>
  );
}
