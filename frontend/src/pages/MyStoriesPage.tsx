import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import PostCard from '../components/PostCard';
import api from '../lib/api';

interface Post {
  _id: string;
  title: string;
  author: string;
  category: string;
  coverImage?: string;
  likes: number;
}

function MyStoriesPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/posts/mine')
      .then((res) => setPosts(res.data))
      .catch(() => setError('Could not load your stories.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FAF6EF]">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="px-8 pb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-serif text-2xl text-neutral-800">My Stories</h1>
            <Link
              to="/write"
              className="text-sm font-medium text-white bg-[#1B4332] px-5 py-2 rounded-full hover:bg-[#163a2a]"
            >
              Write a story
            </Link>
          </div>

          {loading && <p className="text-neutral-400 text-sm">Loading your stories...</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {!loading && !error && posts.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center max-w-md">
              <p className="text-neutral-600 mb-4">You haven't written any stories yet.</p>
              <Link to="/write" className="text-[#1B4332] text-sm font-medium">
                Write your first story
              </Link>
            </div>
          )}

          <div className="grid grid-cols-4 gap-4">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                id={post._id}
                title={post.title}
                author={post.author}
                category={post.category}
                coverImage={post.coverImage}
                likes={post.likes}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MyStoriesPage;