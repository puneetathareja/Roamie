import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Hero from '../components/Hero';
import WriteStoryCard from '../components/WriteStoryCard';
import CategoryFilter from '../components/CategoryFilter';
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

function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/posts')
      .then((res) => setPosts(res.data))
      .catch(() => setError('Could not load posts. Is your backend running?'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FAF6EF]">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="px-8 pb-8">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <Hero />
            </div>
            <WriteStoryCard />
          </div>

          <CategoryFilter />

          <div className="mt-8">
            <h2 className="font-serif text-xl text-neutral-800 mb-4">Featured Stories</h2>

            {loading && <p className="text-neutral-400 text-sm">Loading stories...</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {!loading && !error && posts.length === 0 && (
              <p className="text-neutral-400 text-sm">
                No posts yet. Create one from Thunder Client or your Write Story page.
              </p>
            )}

            <div className="grid grid-cols-4 gap-4">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  title={post.title}
                  author={post.author}
                  category={post.category}
                  coverImage={post.coverImage}
                  likes={post.likes}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomePage;