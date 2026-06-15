import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Video, Link, Image } from 'lucide-react';
import { TeamVideo } from '../../shared/types';
import { teamApi } from '../services/api';

interface VideoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: number | null;
  videos: TeamVideo[];
  onVideosChange: (videos: TeamVideo[]) => void;
}

export default function VideoEditModal({ isOpen, onClose, teamId, videos, onVideosChange }: VideoEditModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localVideos, setLocalVideos] = useState<TeamVideo[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLocalVideos(videos || []);
      setTitle('');
      setUrl('');
      setThumbnail('');
      setEditingId(null);
      setSubmitMessage('');
    }
  }, [isOpen, videos]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setSubmitMessage('请输入视频标题');
      setTimeout(() => setSubmitMessage(''), 3000);
      return;
    }
    if (!url.trim()) {
      setSubmitMessage('请输入视频链接');
      setTimeout(() => setSubmitMessage(''), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      if (editingId !== null) {
        const result = await teamApi.updateVideo(teamId!, editingId, {
          title: title.trim(),
          url: url.trim(),
          thumbnail: thumbnail.trim() || undefined
        });
        if (result.success && result.video) {
          setLocalVideos(prev => prev.map(v => v.id === editingId ? result.video : v));
          setEditingId(null);
          setSubmitMessage('视频更新成功！');
        }
      } else {
        const result = await teamApi.addVideo(teamId!, {
          title: title.trim(),
          url: url.trim(),
          thumbnail: thumbnail.trim() || undefined
        });
        if (result.success && result.video) {
          setLocalVideos(prev => [...prev, result.video]);
          setSubmitMessage('视频添加成功！');
        }
      }
      setTitle('');
      setUrl('');
      setThumbnail('');
      setTimeout(() => setSubmitMessage(''), 3000);
    } catch (error) {
      setSubmitMessage(editingId !== null ? '更新视频失败' : '添加视频失败');
      setTimeout(() => setSubmitMessage(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (video: TeamVideo) => {
    setEditingId(video.id);
    setTitle(video.title);
    setUrl(video.url);
    setThumbnail(video.thumbnail || '');
  };

  const handleDelete = async (videoId: number) => {
    if (!confirm('确定要删除这个视频吗？')) return;
    
    try {
      const result = await teamApi.deleteVideo(teamId!, videoId);
      if (result.success) {
        setLocalVideos(prev => prev.filter(v => v.id !== videoId));
        if (editingId === videoId) {
          setEditingId(null);
          setTitle('');
          setUrl('');
          setThumbnail('');
        }
      }
    } catch (error) {
      console.error('删除视频失败');
    }
  };

  const handleClose = () => {
    onVideosChange(localVideos);
    onClose();
  };

  if (!isOpen || !teamId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={handleClose}>
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                  管理表演视频
                </h2>
                <p className="text-sm text-gray-500">添加或编辑舞队的表演视频</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Plus className="w-5 h-5 text-purple-500" />
              <span>{editingId !== null ? '编辑视频' : '添加新视频'}</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> 视频标题
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：春节联欢会表演《最炫民族风》"
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> 视频链接
                </label>
                <div className="relative">
                  <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="支持 YouTube、B站、抖音、快手等视频平台链接"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">支持 YouTube、Bilibili、抖音、快手等平台的视频链接</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image className="w-4 h-4 inline mr-1" />
                  视频封面图（选填）
                </label>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="输入封面图片链接，留空将自动生成"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>

              {submitMessage && (
                <p className={`text-sm ${submitMessage.includes('成功') ? 'text-green-500' : 'text-red-500'}`}>
                  {submitMessage}
                </p>
              )}

              <div className="flex space-x-3">
                {editingId !== null && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setTitle('');
                      setUrl('');
                      setThumbnail('');
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all"
                  >
                    取消编辑
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>{editingId !== null ? '保存修改' : '添加视频'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-4">
              已添加的视频 ({localVideos.length})
            </h3>
            
            {localVideos.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl text-gray-500">
                <Video className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>还没有添加视频</p>
                <p className="text-sm">快来添加第一个表演视频吧！</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {localVideos.map((video, index) => (
                  <div
                    key={video.id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="w-20 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {video.thumbnail ? (
                          <img src={video.thumbnail} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Video className="w-6 h-6 text-purple-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate">{video.title}</p>
                        <p className="text-xs text-gray-400 truncate">{video.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(video)}
                        className="p-2 text-purple-500 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={handleClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              完成
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
