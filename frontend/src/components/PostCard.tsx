import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import api from '../lib/api';

interface PostCardProps {
  id: string;
  title: string;
  author: string;
  category: string;
  coverImage?: string;
  likes: number;
  comments?: number;
}

function PostCard({ id, title, author, category, coverImage, likes, comments = 0 }: PostCardProps) {
  const [likeCount, setLikeCount] = useState(likes);
  const [liked, setLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked) return;

    setLikeCount((prev) => prev + 1);
    setLiked(true);

    api.patch(`/posts/${id}/like`).catch(() => {
      setLikeCount((prev) => prev - 1);
      setLiked(false);
    });
  };

  return (
    <Link
      to={`/posts/${id}`}
      className="block bg-white rounded-2xl overflow-hidden border border-black/5 hover:shadow-md transition-shadow"
    >
      <div className="relative h-40">
        <img
          src={coverImage || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80'}
          alt={title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 left-3 bg-white/90 text-xs font-medium px-3 py-1 rounded-full text-neutral-700">
          {category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-sm text-neutral-900 mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-neutral-500 mb-3">{author}</p>

        <div className="flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-3">
            <button onClick={handleLike} className="flex items-center gap-1 hover:text-red-400">
              <Heart size={13} className={liked ? 'fill-red-400 text-red-400' : ''} />
              {likeCount}
            </button>
            <span className="flex items-center gap-1">
              <MessageCircle size={13} />
              {comments}
            </span>
          </div>
          <Bookmark size={14} className="hover:text-neutral-600 cursor-pointer" />
        </div>
      </div>
    </Link>
  );
}

export default PostCard;