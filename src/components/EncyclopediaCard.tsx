import { Link } from 'react-router-dom';
import { Eye, User, Calendar } from 'lucide-react';
import { EncyclopediaArticle } from '../../shared/types';

interface EncyclopediaCardProps {
  article: EncyclopediaArticle;
  delay?: number;
}

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

export default function EncyclopediaCard({ article, delay = 0 }: EncyclopediaCardProps) {
  const config = categoryConfig[article.category] || categoryConfig.dance_skill;

  return (
    <Link
      to={`/encyclopedia/${article.id}`}
      className="group block bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 ${config.bgColor} ${config.color} text-xs font-bold rounded-full shadow-lg`}>
            {config.label}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3
            className="text-white font-bold text-lg line-clamp-2"
            style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
          >
            {article.title}
          </h3>
        </div>
      </div>

      <div className="p-5">
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
          {article.summary}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4 text-orange-500" />
            <span className="truncate max-w-[100px]">{article.author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>{formatDate(article.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4 text-purple-500" />
            <span>{article.viewCount}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-orange-600 text-sm font-medium">阅读全文</span>
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
            <span className="text-orange-500 group-hover:text-white transition-colors">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
