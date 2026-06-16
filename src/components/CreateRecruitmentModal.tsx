import { useState, useEffect } from 'react';
import { X, Users, Phone, MessageCircle, Send, AlertCircle } from 'lucide-react';
import { useRecruitmentStore } from '../store/useStore';

interface CreateRecruitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: number;
}

export default function CreateRecruitmentModal({ isOpen, onClose, teamId }: CreateRecruitmentModalProps) {
  const { createRecruitment } = useRecruitmentStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recruitCount, setRecruitCount] = useState<string>('');
  const [minAge, setMinAge] = useState<string>('');
  const [maxAge, setMaxAge] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female' | 'any'>('any');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactWechat, setContactWechat] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setRecruitCount('');
      setMinAge('');
      setMaxAge('');
      setGender('any');
      setContactName('');
      setContactPhone('');
      setContactWechat('');
      setRequirements('');
      setBenefits('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('请输入招募标题');
      return;
    }
    if (!description.trim()) {
      setError('请输入招募描述');
      return;
    }
    if (!recruitCount || parseInt(recruitCount) <= 0) {
      setError('请输入有效的招募人数');
      return;
    }
    if (!contactName.trim()) {
      setError('请输入联系人姓名');
      return;
    }
    if (!contactPhone.trim()) {
      setError('请输入联系电话');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await createRecruitment({
        teamId,
        title: title.trim(),
        description: description.trim(),
        recruitCount: parseInt(recruitCount),
        minAge: minAge ? parseInt(minAge) : undefined,
        maxAge: maxAge ? parseInt(maxAge) : undefined,
        gender,
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        contactWechat: contactWechat.trim() || undefined,
        requirements: requirements.trim() || undefined,
        benefits: benefits.trim() || undefined,
      });
      if (result.success) {
        onClose();
      } else {
        setError(result.message || '发布失败');
      }
    } catch (err) {
      setError('发布失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-rose-50">
          <h3
            className="text-xl font-bold text-gray-800"
            style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
          >
            📣 发布招募公告
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              招募标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              placeholder="例如：春季招新、新人招募等"
              maxLength={50}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-0 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              招募描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              placeholder="详细介绍本次招募的目的、要求等信息"
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-0 outline-none transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                招募人数 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={recruitCount}
                  onChange={(e) => setRecruitCount(e.target.value)}
                  min="1"
                  placeholder="人数"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-0 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                性别要求
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'any')}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-0 outline-none transition-colors bg-white"
              >
                <option value="any">不限</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最小年龄
              </label>
              <input
                type="number"
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
                min="1"
                placeholder="岁"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-0 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最大年龄
              </label>
              <input
                type="number"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                min="1"
                placeholder="岁"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-0 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                联系人 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => {
                  setContactName(e.target.value);
                  if (e.target.value.trim()) setError('');
                }}
                placeholder="联系人姓名"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-0 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                联系电话 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => {
                    setContactPhone(e.target.value);
                    if (e.target.value.trim()) setError('');
                  }}
                  placeholder="手机号码"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-0 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              微信号（可选）
            </label>
            <div className="relative">
              <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={contactWechat}
                onChange={(e) => setContactWechat(e.target.value)}
                placeholder="微信号"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-0 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              招募要求（可选）
            </label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="具体的报名条件、技能要求等"
              rows={3}
              maxLength={300}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-0 outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              福利待遇（可选）
            </label>
            <textarea
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              placeholder="加入舞队的福利、待遇等"
              rows={3}
              maxLength={300}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-0 outline-none transition-colors resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-white transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>发布招募</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
