import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ListMusic, Plus, Trash2, Edit3, Check, X, GripVertical, Music, Clock, ArrowLeft, ChevronRight } from 'lucide-react';
import { usePlaylistStore } from '../store/useStore';
import { teamApi } from '../services/api';
import { Song } from '../../shared/types';

export default function PlaylistPage() {
  const { playlists, createPlaylist, renamePlaylist, deletePlaylist, removeSongFromPlaylist, reorderPlaylistSongs } = usePlaylistStore();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId) || null;

  useEffect(() => {
    if (playlists.length > 0 && !selectedPlaylistId) {
      setSelectedPlaylistId(playlists[0].id);
    }
    if (playlists.length === 0) {
      setSelectedPlaylistId(null);
    }
  }, [playlists.length]);

  const selectedPlaylistSongIds = selectedPlaylist?.songs.map(s => s.songId).join(',') || '';

  useEffect(() => {
    const fetchSongs = async () => {
      if (!selectedPlaylist || selectedPlaylist.songs.length === 0) {
        setSongs([]);
        return;
      }
      setLoading(true);
      try {
        const songIds = selectedPlaylist.songs.map(s => s.songId);
        const result = await teamApi.getSongsByIds(songIds);
        setSongs(result);
      } catch (error) {
        console.error('获取歌曲详情失败', error);
        setSongs([]);
      }
      setLoading(false);
    };
    fetchSongs();
  }, [selectedPlaylistId, selectedPlaylistSongIds]);

  const getSongById = useCallback((id: number) => songs.find(s => s.id === id), [songs]);

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const id = createPlaylist(trimmed);
    setNewName('');
    setShowCreateInput(false);
    setSelectedPlaylistId(id);
  };

  const handleRename = (id: string) => {
    const trimmed = editName.trim();
    if (!trimmed) return;
    renamePlaylist(id, trimmed);
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = (id: string) => {
    deletePlaylist(id);
    setDeleteConfirmId(null);
    if (selectedPlaylistId === id) {
      setSelectedPlaylistId(playlists.find(p => p.id !== id)?.id || null);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragNodeRef.current = e.currentTarget as HTMLDivElement;
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragIndex !== null && dragIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== toIndex && selectedPlaylistId) {
      reorderPlaylistSongs(selectedPlaylistId, dragIndex, toIndex);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 animate-fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow-lg mb-4">
            <ListMusic className="w-5 h-5 text-purple-500" />
            <span className="text-purple-500 font-medium">我的歌单</span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
            style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
          >
            舞曲播放清单
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            创建你的专属歌单，将喜欢的舞曲收藏起来，拖拽调整播放顺序
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">歌单列表</h2>
                <button
                  onClick={() => { setShowCreateInput(true); setNewName(''); }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {showCreateInput && (
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                    placeholder="歌单名称"
                    maxLength={20}
                    className="flex-1 px-3 py-2 text-sm border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    autoFocus
                  />
                  <button
                    onClick={handleCreate}
                    className="p-2 text-green-500 hover:bg-green-50 rounded-lg"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setShowCreateInput(false); setNewName(''); }}
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="space-y-1 max-h-96 overflow-y-auto">
                {playlists.length > 0 ? playlists.map((playlist) => (
                  <div key={playlist.id}>
                    {editingId === playlist.id ? (
                      <div className="flex items-center space-x-2 px-3 py-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRename(playlist.id)}
                          maxLength={20}
                          className="flex-1 px-2 py-1 text-sm border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                          autoFocus
                        />
                        <button onClick={() => handleRename(playlist.id)} className="p-1 text-green-500">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { setEditingId(null); setEditName(''); }} className="p-1 text-gray-400">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : deleteConfirmId === playlist.id ? (
                      <div className="px-3 py-2 bg-red-50 rounded-lg">
                        <p className="text-xs text-red-600 mb-2">确定删除「{playlist.name}」？</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(playlist.id)}
                            className="flex-1 text-xs py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            删除
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="flex-1 text-xs py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => setSelectedPlaylistId(playlist.id)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all group ${
                          selectedPlaylistId === playlist.id
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                            : 'hover:bg-purple-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          <ListMusic className="w-4 h-4 flex-shrink-0" />
                          <span className="font-medium text-sm truncate">{playlist.name}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            selectedPlaylistId === playlist.id
                              ? 'bg-white/20 text-white'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {playlist.songs.length}
                          </span>
                        </div>
                        <div className={`flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                          selectedPlaylistId === playlist.id ? 'opacity-100' : ''
                        }`}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingId(playlist.id); setEditName(playlist.name); }}
                            className={`p-1 rounded hover:bg-black/10 ${selectedPlaylistId === playlist.id ? 'text-white/80' : 'text-gray-400 hover:text-purple-500'}`}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(playlist.id); }}
                            className={`p-1 rounded hover:bg-black/10 ${selectedPlaylistId === playlist.id ? 'text-white/80' : 'text-gray-400 hover:text-red-500'}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <ListMusic className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-400">还没有歌单</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {selectedPlaylist ? (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                      {selectedPlaylist.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedPlaylist.songs.length} 首歌曲 · 创建于 {new Date(selectedPlaylist.createdAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent"></div>
                  </div>
                ) : selectedPlaylist.songs.length > 0 ? (
                  <div className="space-y-2">
                    {selectedPlaylist.songs.map((plSong, index) => {
                      const song = getSongById(plSong.songId);
                      const isDragging = dragIndex === index;
                      const isDragOver = dragOverIndex === index;
                      return (
                        <div
                          key={plSong.songId}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDrop={(e) => handleDrop(e, index)}
                          onDragEnd={handleDragEnd}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-xl border-2 transition-all group cursor-grab active:cursor-grabbing ${
                            isDragging
                              ? 'opacity-50 border-purple-300 bg-purple-50'
                              : isDragOver
                              ? 'border-purple-400 bg-purple-50'
                              : 'border-transparent hover:border-purple-100 hover:bg-purple-50/50'
                          }`}
                        >
                          <GripVertical className="w-5 h-5 text-gray-300 group-hover:text-purple-400 flex-shrink-0 transition-colors" />
                          <span className="w-6 text-center text-sm font-bold text-gray-400 flex-shrink-0">
                            {index + 1}
                          </span>

                          {song ? (
                            <>
                              {song.coverUrl ? (
                                <img
                                  src={song.coverUrl}
                                  alt={song.title}
                                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0 shadow-sm"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0">
                                  <Music className="w-6 h-6 text-white" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-800 truncate" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                                  {song.title}
                                </h4>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <span>{song.artist}</span>
                                  <span>·</span>
                                  <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded text-xs">{song.genre}</span>
                                  <span>·</span>
                                  <span className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{song.duration}</span>
                                  </span>
                                </div>
                              </div>
                              <Link
                                to={`/teams/${song.teamId}`}
                                className="text-xs text-purple-500 hover:text-purple-700 font-medium flex-shrink-0 hidden sm:block"
                              >
                                查看舞队
                              </Link>
                            </>
                          ) : (
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-400 italic">歌曲 ID:{plSong.songId}（可能已被删除）</h4>
                            </div>
                          )}

                          <button
                            onClick={() => removeSongFromPlaylist(selectedPlaylist.id, plSong.songId)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                            title="从歌单移除"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <Music className="w-10 h-10 text-purple-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-600 mb-2">歌单还是空的</h3>
                    <p className="text-gray-400 mb-6">浏览舞队歌单时，点击 ♪ 按钮将歌曲添加到这里</p>
                    <Link
                      to="/teams"
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all"
                    >
                      <span>去浏览舞队</span>
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <ListMusic className="w-12 h-12 text-purple-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">还没有歌单</h3>
                <p className="text-gray-400 mb-6">创建一个歌单，开始收藏你喜欢的舞曲吧！</p>
                <button
                  onClick={() => { setShowCreateInput(true); setNewName(''); }}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>创建歌单</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
