import { useState } from 'react';
import { X, MessageSquare, Send, Phone, User } from 'lucide-react';
import { feedbackApi } from '../services/api';
import { useUserStore } from '../store/useStore';

export default function FeedbackButton() {
  const { user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('error');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      setMessage('请输入反馈内容');
      setMessageType('error');
      return;
    }
    if (!contact.trim()) {
      setMessage('请输入联系方式');
      setMessageType('error');
      return;
    }
    if (content.trim().length > 1000) {
      setMessage('反馈内容不能超过1000字');
      setMessageType('error');
      return;
    }
    if (contact.trim().length > 50) {
      setMessage('联系方式不能超过50字');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const result = await feedbackApi.createFeedback({
        content: content.trim(),
        contact: contact.trim(),
        userId: user?.id,
        userNickname: user?.nickname
      });

      if (result.success) {
        setMessage(result.message || '反馈提交成功');
        setMessageType('success');
        setContent('');
        setContact('');
        setTimeout(() => {
          setIsOpen(false);
          setMessage('');
        }, 2000);
      } else {
        setMessage(result.message || '提交失败，请重试');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('提交失败，请稍后重试');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setContent('');
    setContact('');
    setMessage('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-6 z-40 w-14 h-14 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      >
        <MessageSquare className="w-6 h-6 text-white group-hover:animate-bounce" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={handleClose}>
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeInUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-r from-red-500 to-orange-500 p-6">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="w-14 h-14 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white text-center" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                意见反馈
              </h2>
              <p className="text-white/80 text-center text-sm mt-1">您的意见对我们很重要</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {user && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                    <User className="w-4 h-4" />
                    <span>当前用户：{user.nickname}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    反馈内容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      setMessage('');
                    }}
                    placeholder="请详细描述您的问题或建议..."
                    rows={5}
                    maxLength={1000}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {content.length}/1000
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    联系方式 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => {
                        setContact(e.target.value);
                        setMessage('');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                      placeholder="手机号/微信号，方便我们联系您"
                      maxLength={50}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    />
                  </div>
                </div>

                {message && (
                  <p className={`text-sm text-center ${messageType === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                    {message}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading || !content.trim() || !contact.trim()}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold hover:from-red-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      提交反馈
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
