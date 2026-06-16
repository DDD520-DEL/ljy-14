import { useState } from 'react';
import { X, Upload, Image, Plus } from 'lucide-react';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: { url: string; title?: string; description?: string }) => Promise<{ success: boolean; message?: string }>;
}

export default function PhotoUploadModal({ isOpen, onClose, onUpload }: PhotoUploadModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('error');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    if (value.trim()) {
      setPreviewUrl(value.trim());
    } else {
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setMessage('请输入照片链接');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const result = await onUpload({
        url: url.trim(),
        title: title.trim() || undefined,
        description: description.trim() || undefined
      });

      if (result.success) {
        setMessage(result.message || '上传成功');
        setMessageType('success');
        setUrl('');
        setTitle('');
        setDescription('');
        setPreviewUrl('');
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setMessage(result.message || '上传失败');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('上传失败，请稍后重试');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUrl('');
    setTitle('');
    setDescription('');
    setPreviewUrl('');
    setMessage('');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeInUp">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <Upload className="w-6 h-6 text-orange-500" />
            <span>上传活动照片</span>
          </h3>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              照片链接 <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="请输入图片URL地址"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>

          {previewUrl && (
            <div className="relative">
              <p className="text-sm font-medium text-gray-700 mb-2">预览</p>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={previewUrl}
                  alt="照片预览"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              照片标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给照片起个名字（选填）"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              照片描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简单描述一下这张照片（选填）"
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
              maxLength={200}
            />
          </div>

          {message && (
            <p className={`text-sm text-center ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </p>
          )}

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>添加照片</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
