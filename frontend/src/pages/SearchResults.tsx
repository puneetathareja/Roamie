import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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

function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get('/posts', { params: { search: q } })
      .then((res) => setPosts(res.data))
      .catch(() => setError('Search failed. Is your backend running?'))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="flex min-h-screen bg-[#FAF6EF]">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="px-8 pb-8">
          <h1 className="font-serif text-2xl text-neutral-800 mb-6">
            Search results for “{q}”
          </h1>

          {loading && <p className="text-neutral-400 text-sm">Searching...</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {!loading && !error && posts.length === 0 && (
            <p className="text-neutral-400 text-sm">No stories matched your search.</p>
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

export default SearchResults;