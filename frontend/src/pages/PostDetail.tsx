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

interface Comment {
  _id: string;
  author: string;
  text: string;
  createdAt: string;
}

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch(() => setError('Could not load this story.'))
      .finally(() => setLoading(false));

    api
      .get(`/posts/${id}/comments`)
      .then((res) => setComments(res.data))
      .catch(() => {});
  }, [id]);

  const handleLike = () => {
    if (liked || !post) return;
    setPost({ ...post, likes: post.likes + 1 });
    setLiked(true);
    api.patch(`/posts/${id}/like`).catch(() => {
      setPost((prev) => (prev ? { ...prev, likes: prev.likes - 1 } : prev));
      setLiked(false);
    });
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Please log in to comment.');
      return;
    }
    if (!newComment.trim()) return;

    const user = JSON.parse(userStr);
    setPosting(true);
    try {
      const res = await api.post(`/posts/${id}/comments`, {
        author: user.name,
        text: newComment,
      });
      setComments((prev) => [res.data, ...prev]);
      setNewComment('');
    } catch {
      alert('Failed to post comment.');
    } finally {
      setPosting(false);
    }
  };

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
            <button onClick={handleLike} className="flex items-center gap-1 ml-auto hover:text-red-400">
              <Heart size={14} className={liked ? 'fill-red-400 text-red-400' : ''} />
              {post.likes}
            </button>
            <span className="flex items-center gap-1">
              <MessageCircle size={14} />
              {comments.length}
            </span>
          </div>

          <p className="text-neutral-700 leading-relaxed whitespace-pre-line mb-10">{post.content}</p>

          <div className="border-t border-black/5 pt-6">
            <h2 className="font-serif text-xl text-neutral-800 mb-4">
              Comments ({comments.length})
            </h2>

            <form onSubmit={handleAddComment} className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 border border-black/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
              />
              <button
                type="submit"
                disabled={posting}
                className="px-5 py-2 rounded-full text-sm font-medium text-white bg-[#1B4332] hover:bg-[#163a2a] disabled:opacity-60"
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
            </form>

            <div className="flex flex-col gap-4">
              {comments.length === 0 && (
                <p className="text-sm text-neutral-400">No comments yet. Be the first!</p>
              )}
              {comments.map((c) => (
                <div key={c._id} className="bg-white rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-800">{c.author}</span>
                    <span className="text-xs text-neutral-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
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