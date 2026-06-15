import { useState, useEffect } from 'react';
import { Search, BookOpen, Filter } from 'lucide-react';
import { EncyclopediaArticle, EncyclopediaCategory } from '../../shared/types';
import { encyclopediaApi } from '../services/api';
import EncyclopediaCard from '../components/EncyclopediaCard';
import Empty from '../components/Empty';

const categories: { value: EncyclopediaCategory | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'dance_skill', label: '舞蹈技巧' },
  { value: 'fitness_tip', label: '健身常识' },
  { value: 'safety_tip', label: '安全须知' },
];

export default function EncyclopediaPage() {
  const [articles, setArticles] = useState<EncyclopediaArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<EncyclopediaCategory | 'all'>('all');
  const [keyword, setKeyword] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const filters: {
        page: number;
        pageSize: number;
        category?: EncyclopediaCategory;
        keyword?: string;
      } = {
        page,
        pageSize,
      };
      
      if (category !== 'all') {
        filters.category = category;
      }
      if (keyword.trim()) {
        filters.keyword = keyword.trim();
      }

      const response = await encyclopediaApi.getArticles(filters);
      setArticles(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('获取文章列表失败:', error);
      setArticles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [category, keyword]);

  useEffect(() => {
    fetchArticles();
  }, [category, keyword, page]);

  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchArticles();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent"
            style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
          >
            广场舞知识百科
          </h1>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            学习舞蹈技巧，了解健身常识，掌握安全须知，让广场舞更健康、更快乐、更安全！
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-fadeInUp">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="flex-1 w-full">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索文章标题或摘要..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                />
              </form>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
              <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div className="flex items-center space-x-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      category === cat.value
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="mb-6 text-gray-600 animate-fadeIn">
              共找到 <span className="font-bold text-orange-600">{total}</span> 篇文章
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <EncyclopediaCard
                  key={article.id}
                  article={article}
                  delay={index * 100}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-6 py-2 rounded-full bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 transition-all"
                >
                  上一页
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-full font-medium transition-all ${
                      page === i + 1
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-orange-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-6 py-2 rounded-full bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 transition-all"
                >
                  下一页
                </button>
              </div>
            )}
          </>
        ) : (
          <Empty
            icon={<BookOpen className="w-16 h-16" />}
            title="暂无相关文章"
            description="试试其他搜索关键词或分类"
          />
        )}
      </div>
    </div>
  );
}
