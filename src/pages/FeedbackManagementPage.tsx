import { useEffect, useState } from 'react';
import { MessageSquare, CheckCircle, Clock, Trash2, Filter, RefreshCw, Loader2, ChevronLeft, ChevronRight, Eye, User, Phone, X } from 'lucide-react';
import { feedbackApi, Feedback, FeedbackStatus } from '../services/api';

const PAGE_SIZE = 10;

function StatusBadge({ status }: { status: FeedbackStatus }) {
  if (status === 'processed') {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
        <CheckCircle className="w-4 h-4" />
        已处理
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
      <Clock className="w-4 h-4" />
      未处理
    </span>
  );
}

function FeedbackDetailModal({ feedback, onClose }: { feedback: Feedback; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-r from-red-500 to-orange-500 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="w-14 h-14 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white text-center" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
            反馈详情
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <StatusBadge status={feedback.status} />
            <span className="text-sm text-gray-500">
              #{feedback.id}
            </span>
          </div>

          {feedback.userNickname && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-xl">
              <User className="w-4 h-4 text-gray-400" />
              <span>提交用户：</span>
              <span className="font-medium text-gray-800">{feedback.userNickname}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-xl">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>联系方式：</span>
            <span className="font-medium text-gray-800">{feedback.contact}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">反馈内容</label>
            <div className="bg-gray-50 rounded-xl p-4 text-gray-800 whitespace-pre-wrap min-h-[120px]">
              {feedback.content}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-gray-500 mb-1">提交时间</div>
              <div className="text-gray-800 font-medium">
                {new Date(feedback.createdAt).toLocaleString('zh-CN')}
              </div>
            </div>
            {feedback.processedAt && (
              <div className="bg-green-50 rounded-xl p-3">
                <div className="text-green-600 mb-1">处理时间</div>
                <div className="text-green-800 font-medium">
                  {new Date(feedback.processedAt).toLocaleString('zh-CN')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeedbackManagementPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [total, setTotal] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchStats = async () => {
    try {
      const result = await feedbackApi.getFeedbacks({ pageSize: 1000 });
      const allFeedbacks = result.data;
      setPendingCount(allFeedbacks.filter(f => f.status === 'pending').length);
      setProcessedCount(allFeedbacks.filter(f => f.status === 'processed').length);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  const fetchFeedbacks = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    setLoading(true);
    try {
      const [listResult] = await Promise.all([
        feedbackApi.getFeedbacks({
          status: statusFilter === 'all' ? undefined : statusFilter,
          page,
          pageSize: PAGE_SIZE
        }),
        fetchStats()
      ]);
      setFeedbacks(listResult.data);
      setTotal(listResult.total);
    } catch (error) {
      console.error('获取反馈列表失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [page, statusFilter]);

  const handleRefresh = () => {
    fetchFeedbacks(true);
  };

  const handleStatusChange = async (id: number, newStatus: FeedbackStatus) => {
    setActionLoading(id);
    try {
      const result = await feedbackApi.updateFeedbackStatus(id, newStatus);
      if (result.success) {
        setFeedbacks(prev => prev.map(f => 
          f.id === id ? result.feedback! : f
        ));
        await fetchStats();
      }
    } catch (error) {
      console.error('更新状态失败:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条反馈吗？')) return;
    
    setActionLoading(id);
    try {
      const result = await feedbackApi.deleteFeedback(id);
      if (result.success) {
        setFeedbacks(prev => prev.filter(f => f.id !== id));
        setTotal(prev => prev - 1);
        await fetchStats();
      }
    } catch (error) {
      console.error('删除失败:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <span className="ml-3 text-gray-600 text-lg">加载反馈列表中...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 animate-fadeInDown">
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow-lg mb-4">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              <span className="text-orange-600 font-medium">后台管理</span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold text-gray-800"
              style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
            >
              📝 用户反馈管理
            </h1>
            <p className="text-gray-500 mt-2">管理和处理用户提交的意见反馈</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-5 py-2.5 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
          >
            <RefreshCw className={`w-5 h-5 text-orange-500 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-gray-700 font-medium">{refreshing ? '刷新中...' : '刷新'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg animate-fadeInUp">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">总反馈数</p>
                <p className="text-3xl font-bold text-gray-800 mt-1" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                  {total}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">待处理</p>
                <p className="text-3xl font-bold text-orange-500 mt-1" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                  {pendingCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">已处理</p>
                <p className="text-3xl font-bold text-green-500 mt-1" style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                  {processedCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fadeInUp" style={{ animationDelay: '300ms' }}>
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600 font-medium">状态筛选：</span>
              </div>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: '全部' },
                  { value: 'pending', label: '未处理' },
                  { value: 'processed', label: '已处理' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(option.value as FeedbackStatus | 'all');
                      setPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      statusFilter === option.value
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">用户</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">反馈内容</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">联系方式</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">提交时间</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="text-gray-400">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>暂无反馈数据</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  feedbacks.map((feedback) => (
                    <tr key={feedback.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{feedback.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{feedback.userNickname || '匿名用户'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={feedback.content}>
                          {feedback.content}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feedback.contact}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(feedback.createdAt).toLocaleString('zh-CN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={feedback.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedFeedback(feedback)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {feedback.status === 'pending' ? (
                            <button
                              onClick={() => handleStatusChange(feedback.id, 'processed')}
                              disabled={actionLoading === feedback.id}
                              className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="标记已处理"
                            >
                              {actionLoading === feedback.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(feedback.id, 'pending')}
                              disabled={actionLoading === feedback.id}
                              className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                              title="标记未处理"
                            >
                              {actionLoading === feedback.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Clock className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(feedback.id)}
                            disabled={actionLoading === feedback.id}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="删除"
                          >
                            {actionLoading === feedback.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                共 {total} 条，第 {page} / {totalPages} 页
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        page === pageNum
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
        />
      )}
    </div>
  );
}
