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

function BookmarksPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const loggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    if (!loggedIn) {
      setLoading(false);
      return;
    }
    api
      .get('/bookmarks')
      .then((res) => setPosts(res.data))
      .catch(() => setError('Could not load your bookmarks. Try logging in again.'))
      .finally(() => setLoading(false));
  }, [loggedIn]);

  return (
    <div className="flex min-h-screen bg-[#FAF6EF]">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="px-8 pb-8">
          <h1 className="font-serif text-2xl text-neutral-800 mb-6">Saved Stories</h1>

          {!loggedIn && (
            <p className="text-neutral-500 text-sm">
              <Link to="/login" className="text-[#1B4332] font-medium">
                Log in
              </Link>{' '}
              to see the stories you've saved.
            </p>
          )}

          {loggedIn && loading && <p className="text-neutral-400 text-sm">Loading...</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {loggedIn && !loading && !error && posts.length === 0 && (
            <p className="text-neutral-400 text-sm">
              Nothing saved yet. Tap the bookmark icon on any story to keep it here.
            </p>
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

export default BookmarksPage;