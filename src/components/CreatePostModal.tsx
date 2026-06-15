import { useState } from 'react';
import { X, ImagePlus, Send, MapPin, AlertCircle } from 'lucide-react';
import { Team } from '../../shared/types';
import { usePostStore, useTeamStore } from '../store/useStore';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTeamId?: number;
}

export default function CreatePostModal({ isOpen, onClose, selectedTeamId }: CreatePostModalProps) {
  const { teams, fetchTeams } = useTeamStore();
  const { createPost } = usePostStore();
  const [teamId, setTeamId] = useState<number>(selectedTeamId || 0);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddImage = () => {
    const url = imageUrl.trim();
    if (!url) return;
    if (images.length >= 9) {
      setError('最多只能添加9张图片');
      return;
    }
    setImages([...images, url]);
    setImageUrl('');
    setError('');
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!teamId) {
      setError('请选择发布舞队');
      return;
    }
    if (!content.trim()) {
      setError('请输入动态内容');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await createPost({
        teamId,
        content: content.trim(),
        images: images.length > 0 ? images : undefined,
      });
      if (result.success) {
        setContent('');
        setImages([]);
        setTeamId(0);
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

  const selectedTeam = teams.find((t) => t.id === teamId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
          <h3
            className="text-xl font-bold text-gray-800"
            style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
          >
            📢 发布舞队动态
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
              选择舞队 <span className="text-red-500">*</span>
            </label>
            <select
              value={teamId}
              onChange={(e) => {
                setTeamId(Number(e.target.value));
                setError('');
              }}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-0 outline-none transition-colors bg-white"
            >
              <option value={0}>-- 请选择舞队 --</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            {selectedTeam && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                <MapPin className="w-4 h-4" />
                <span>将自动关联位置：{selectedTeam.parkName}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              动态内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              placeholder="分享舞队的活动日常、排练花絮、精彩瞬间..."
              rows={5}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-0 outline-none transition-colors resize-none"
            />
            <div className="mt-1 text-right text-sm text-gray-400">{content.length}/500</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              添加图片（可选，最多9张）
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                placeholder="输入图片URL，按回车添加"
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-0 outline-none transition-colors text-sm"
              />
              <button
                onClick={handleAddImage}
                className="px-4 py-2.5 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors flex items-center space-x-1 text-sm font-medium"
              >
                <ImagePlus className="w-4 h-4" />
                <span>添加</span>
              </button>
            </div>

            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={img} alt={`图片${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>发布动态</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
