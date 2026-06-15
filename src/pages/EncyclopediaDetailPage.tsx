import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, User, Calendar, Tag, Share2, Bookmark } from 'lucide-react';
import { EncyclopediaArticle } from '../../shared/types';
import { encyclopediaApi } from '../services/api';
import Empty from '../components/Empty';

const categoryConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  dance_skill: { label: '舞蹈技巧', color: 'text-red-600', bgColor: 'bg-red-100' },
  fitness_tip: { label: '健身常识', color: 'text-green-600', bgColor: 'bg-green-100' },
  safety_tip: { label: '安全须知', color: 'text-orange-600', bgColor: 'bg-orange-100' },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function renderContent(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  let inList = false;
  let listItems: string[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={key++} className="list-disc list-inside space-y-2 my-4 text-gray-700 pl-4">
          {listItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      flushList();
      elements.push(<div key={key++} className="h-4" />);
      continue;
    }

    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={key++} className="text-2xl font-bold text-gray-800 mt-8 mb-4 pb-2 border-b-2 border-orange-200">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={key++} className="text-xl font-bold text-gray-800 mt-6 mb-3">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('#### ')) {
      flushList();
      elements.push(
        <h4 key={key++} className="text-lg font-bold text-gray-800 mt-4 mb-2">
          {line.slice(5)}
        </h4>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      inList = true;
      listItems.push(line.slice(2));
    } else if (line.match(/^\d+\.\s/)) {
      inList = true;
      listItems.push(line.replace(/^\d+\.\s/, ''));
    } else if (line.startsWith('✅')) {
      flushList();
      elements.push(
        <div key={key++} className="flex items-start space-x-2 my-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
          <span className="text-green-500 font-bold">✅</span>
          <span className="text-gray-700">{line.slice(1).trim()}</span>
        </div>
      );
    } else if (line.startsWith('❌')) {
      flushList();
      elements.push(
        <div key={key++} className="flex items-start space-x-2 my-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
          <span className="text-red-500 font-bold">❌</span>
          <span className="text-gray-700">{line.slice(1).trim()}</span>
        </div>
      );
    } else if (line.startsWith('⚠️')) {
      flushList();
      elements.push(
        <div key={key++} className="flex items-start space-x-2 my-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
          <span className="text-yellow-500 font-bold">⚠️</span>
          <span className="text-gray-700">{line.slice(2).trim()}</span>
        </div>
      );
    } else if (line.startsWith('💡')) {
      flushList();
      elements.push(
        <div key={key++} className="flex items-start space-x-2 my-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <span className="text-blue-500 font-bold">💡</span>
          <span className="text-gray-700">{line.slice(2).trim()}</span>
        </div>
      );
    } else if (line.startsWith('🚨')) {
      flushList();
      elements.push(
        <div key={key++} className="flex items-start space-x-2 my-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
          <span className="text-red-500 font-bold">🚨</span>
          <span className="text-gray-700">{line.slice(2).trim()}</span>
        </div>
      );
    } else if (line.startsWith('❤️') || line.startsWith('🏃‍♂️') || line.startsWith('💃') || line.startsWith('🕺') || line.startsWith('💪') || line.startsWith('🌞') || line.startsWith('🦶') || line.startsWith('😴')) {
      flushList();
      elements.push(
        <p key={key++} className="text-gray-700 leading-relaxed my-3">
          {line}
        </p>
      );
    } else if (line.match(/^\|.*\|$/)) {
      flushList();
      const cells = line.slice(1, -1).split('|').map(cell => cell.trim());
      if (cells.length > 1) {
        elements.push(
          <div key={key++} className="my-4">
            <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <tbody>
                <tr className="bg-orange-50">
                  {cells.map((cell, ci) => (
                    <td key={ci} className="border border-gray-200 px-4 py-2 font-medium text-gray-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
    } else {
      flushList();
      let formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
      
      if (formattedLine.includes('❓')) {
        elements.push(
          <p key={key++} className="text-gray-700 leading-relaxed my-3 font-medium">
            {line}
          </p>
        );
      } else {
        elements.push(
          <p key={key++} className="text-gray-700 leading-relaxed my-3">
            {line}
          </p>
        );
      }
    }
  }

  flushList();
  return elements;
}

export default function EncyclopediaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<EncyclopediaArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await encyclopediaApi.getArticleById(parseInt(id));
        if (response.success && response.article) {
          setArticle(response.article);
        } else {
          setError('文章不存在');
        }
      } catch (err) {
        setError('获取文章失败');
        console.error('获取文章详情失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleBack = () => {
    navigate('/encyclopedia');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.summary,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-80 bg-gray-200" />
            <div className="p-8 space-y-6">
              <div className="h-10 bg-gray-200 rounded w-3/4" />
              <div className="flex space-x-4">
                <div className="h-6 bg-gray-200 rounded w-24" />
                <div className="h-6 bg-gray-200 rounded w-24" />
                <div className="h-6 bg-gray-200 rounded w-24" />
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-4/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Empty
            title={error || '文章不存在'}
            description="请返回百科列表查看其他文章"
          />
          <div className="text-center mt-8">
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回百科列表</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const config = categoryConfig[article.category] || categoryConfig.dance_skill;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>返回百科列表</span>
          </button>
        </div>

        <article className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fadeInUp">
          <div className="relative h-80 overflow-hidden">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://picsum.photos/seed/ency-placeholder/800/320`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-4 py-1.5 ${config.bgColor} ${config.color} text-sm font-bold rounded-full`}>
                  <Tag className="w-4 h-4 inline mr-1" />
                  {config.label}
                </span>
              </div>
              <h1
                className="text-3xl font-bold text-white leading-tight"
                style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
              >
                {article.title}
              </h1>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-gray-100">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="w-5 h-5 text-orange-500" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Eye className="w-5 h-5 text-purple-500" />
                <span>{article.viewCount} 次阅读</span>
              </div>
              <div className="flex items-center space-x-2 ml-auto">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2 rounded-full transition-all ${
                    isBookmarked
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-gray-100 text-gray-500 hover:bg-orange-100 hover:text-orange-600'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-l-4 border-orange-500">
                <h3 className="text-lg font-bold text-gray-800 mb-2">文章摘要</h3>
                <p className="text-gray-700 leading-relaxed">{article.summary}</p>
              </div>

              <div className="prose prose-lg max-w-none">
                {renderContent(article.content)}
              </div>

              {article.images && article.images.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">相关图片</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {article.images.map((img, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden shadow-md group">
                        {!imageError[idx] && (
                          <img
                            src={img}
                            alt={`图片${idx + 1}`}
                            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={() => setImageError((prev) => ({ ...prev, [idx]: true }))}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {article.updatedAt !== article.createdAt && (
                    <span>最后更新于 {formatDate(article.updatedAt)}</span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/encyclopedia"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-all"
                  >
                    <span>更多文章</span>
                  </Link>
                  <button
                    onClick={handleBack}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>返回列表</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
