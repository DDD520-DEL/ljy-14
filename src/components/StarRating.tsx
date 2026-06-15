import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  totalVotes?: number;
  onVote?: (score: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  hasVoted?: boolean;
}

export default function StarRating({ rating, totalVotes, onVote, interactive = false, size = 'md', color = 'orange', hasVoted = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [voted, setVoted] = useState(hasVoted);

  useEffect(() => {
    setVoted(hasVoted);
  }, [hasVoted]);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const colorClasses = {
    orange: 'text-orange-400',
    red: 'text-red-500',
    yellow: 'text-yellow-400',
  };

  const handleClick = (score: number) => {
    if (interactive && onVote && !voted) {
      onVote(score);
      setVoted(true);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => interactive && !voted && setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          disabled={!interactive || voted}
          className={`${interactive && !voted ? 'cursor-pointer transition-transform hover:scale-125' : 'cursor-default'}
            ${interactive && voted ? 'opacity-75' : ''}
          `}
        >
          <Star
            className={`${sizeClasses[size]} transition-all duration-200 ${
              star <= displayRating
                ? `${colorClasses[color as keyof typeof colorClasses]} fill-current`
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
      {totalVotes !== undefined && (
        <span className="ml-2 text-sm text-gray-500">({totalVotes}票)</span>
      )}
      {voted && (
        <span className="ml-2 text-sm text-green-500 animate-pulse">✓ 已投票</span>
      )}
    </div>
  );
}
