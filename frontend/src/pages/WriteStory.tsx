import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import api from '../lib/api';

function WriteStory() {
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('Adventure');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePublish = async () => {
    setError('');

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      setError('You need to be logged in to publish a story.');
      return;
    }
    const user = JSON.parse(userStr);

    if (!title || !destination || !content) {
      setError('Please fill in the title, destination, and story.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/posts', {
        title,
        destination,
        content,
        category,
        coverImage: coverImage || undefined,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        author: user.name,
      });
      navigate('/');
    } catch {
      setError('Failed to publish. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF] flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-8">
        <h1 className="font-serif text-2xl text-[#1B4332] mb-6">Write a Travel Story</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-5">
          <label className="block text-xs font-medium text-neutral-500 mb-2">Cover photo URL</label>
          <div className="flex items-center gap-2 border border-dashed border-black/15 rounded-xl p-4">
            <Camera size={18} className="text-neutral-400" />
            <input
              type="text"
              placeholder="Paste an image URL (optional)"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="flex-1 text-sm bg-transparent focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-neutral-500 mb-2">Title</label>
          <input
            type="text"
            placeholder="Give your story a catchy title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
          />
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-neutral-500 mb-2">Destination</label>
          <input
            type="text"
            placeholder="Where did you go?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
          />
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-neutral-500 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
          >
            {['Mountains', 'Beaches', 'Cities', 'Food', 'Adventure', 'Culture', 'Nature', 'Backpacking'].map(
              (c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              )
            )}
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-neutral-500 mb-2">Story</label>
          <textarea
            placeholder="Share your experience..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
          />
        </div>

        <div className="mb-8">
          <label className="block text-xs font-medium text-neutral-500 mb-2">Tags (optional)</label>
          <input
            type="text"
            placeholder="e.g. beaches, food, adventure (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-5 py-2.5 rounded-full text-sm font-medium text-neutral-600 border border-black/10 hover:bg-black/5"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={loading}
            className="px-5 py-2.5 rounded-full text-sm font-medium text-white bg-[#1B4332] hover:bg-[#163a2a] disabled:opacity-60"
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WriteStory;