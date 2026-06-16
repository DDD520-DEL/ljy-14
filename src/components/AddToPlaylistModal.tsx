import { useState } from 'react';
import { X, Plus, ListMusic, Check } from 'lucide-react';
import { usePlaylistStore } from '../store/useStore';

interface AddToPlaylistModalProps {
  songId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddToPlaylistModal({ songId, isOpen, onClose }: AddToPlaylistModalProps) {
  const { playlists, createPlaylist, addSongToPlaylist, isSongInPlaylist } = usePlaylistStore();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleAddToPlaylist = (playlistId: string) => {
    if (isSongInPlaylist(playlistId, songId)) return;
    addSongToPlaylist(playlistId, songId);
    setMessage('已添加到歌单！');
    setTimeout(() => {
      setMessage('');
    }, 1500);
  };

  const handleCreateAndAdd = () => {
    const trimmed = newPlaylistName.trim();
    if (!trimmed) {
      setMessage('请输入歌单名称');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    const id = createPlaylist(trimmed);
    addSongToPlaylist(id, songId);
    setNewPlaylistName('');
    setShowCreate(false);
    setMessage('已创建歌单并添加！');
    setTimeout(() => setMessage(''), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-slideUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <ListMusic className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">添加到歌单</h3>
              <p className="text-sm text-gray-500">选择一个歌单，或创建新歌单</p>
            </div>
          </div>

          {message && (
            <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${
              message.includes('已') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
            {playlists.length > 0 ? (
              playlists.map((playlist) => {
                const alreadyAdded = isSongInPlaylist(playlist.id, songId);
                return (
                  <button
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    disabled={alreadyAdded}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      alreadyAdded
                        ? 'bg-gray-50 text-gray-400 cursor-default'
                        : 'hover:bg-purple-50 text-gray-700 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        alreadyAdded
                          ? 'bg-gray-200'
                          : 'bg-gradient-to-br from-purple-400 to-pink-400'
                      }`}>
                        <ListMusic className={`w-4 h-4 ${alreadyAdded ? 'text-gray-400' : 'text-white'}`} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{playlist.name}</p>
                        <p className="text-xs text-gray-400">{playlist.songs.length} 首歌曲</p>
                      </div>
                    </div>
                    {alreadyAdded && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="text-center py-6 text-gray-400">
                <ListMusic className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">还没有歌单，创建一个吧</p>
              </div>
            )}
          </div>

          {showCreate ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateAndAdd()}
                placeholder="输入歌单名称"
                maxLength={20}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                autoFocus
              />
              <button
                onClick={handleCreateAndAdd}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all"
              >
                创建
              </button>
              <button
                onClick={() => { setShowCreate(false); setNewPlaylistName(''); }}
                className="px-3 py-2.5 text-gray-400 hover:text-gray-600 text-sm"
              >
                取消
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCreate(true)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-purple-300 text-purple-500 rounded-xl font-medium hover:bg-purple-50 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>创建新歌单</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
