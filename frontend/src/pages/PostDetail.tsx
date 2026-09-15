import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import api from '../lib/api';

interface Post {
  _id: string;
  title: string;
  content: string;
  destination: string;
  author: string;
  category: string;
  coverImage?: string;
  tags: string[];
  likes: number;
  createdAt: string;
}

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch(() => setError('Could not load this story.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center text-neutral-400">Loading story...</div>;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-500">{error || 'Story not found.'}</p>
        <Link to="/" className="text-[#1B4332] text-sm font-medium">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] px-8 py-10">
      <Link to="/" className="flex items-center gap-2 text-sm text-neutral-500 mb-6 w-fit hover:text-neutral-700">
        <ArrowLeft size={16} />
        Back to home
      </Link>

      <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="relative h-72 rounded-3xl overflow-hidden mb-6">
            <img
              src={post.coverImage || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=80'}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-white/90 text-xs font-medium px-3 py-1 rounded-full">
              {post.category}
            </span>
          </div>

          <h1 className="font-serif text-3xl text-neutral-900 mb-3">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-neutral-500 mb-6">
            <span>{post.author}</span>
            <span>·</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-1 ml-auto">
              <Heart size={14} />
              {post.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={14} />0
            </span>
          </div>

          <p className="text-neutral-700 leading-relaxed whitespace-pre-line">{post.content}</p>
        </div>

        <aside className="bg-white rounded-2xl p-5 h-fit">
          <h3 className="text-sm font-medium text-neutral-800 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.length > 0 ? (
              post.tags.map((tag) => (
                <span key={tag} className="text-xs bg-neutral-100 px-3 py-1 rounded-full text-neutral-600">
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-400">No tags</span>
            )}
          </div>
          <h3 className="text-sm font-medium text-neutral-800 mb-2">Destination</h3>
          <p className="text-sm text-neutral-500">{post.destination}</p>
        </aside>
      </div>
    </div>
  );
}

export default PostDetail;