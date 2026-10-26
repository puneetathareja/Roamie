import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera } from 'lucide-react';
import api from '../lib/api';

function WriteStory() {
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('Adventure');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(isEditing);
  const navigate = useNavigate();

  // In edit mode, load the existing post into the form
  useEffect(() => {
    if (!id) return;
    api
      .get(`/posts/${id}`)
      .then((res) => {
        const p = res.data;
        setTitle(p.title);
        setDestination(p.destination);
        setContent(p.content);
        setCategory(p.category);
        setCoverImage(p.coverImage || '');
        setTags((p.tags || []).join(', '));
      })
      .catch(() => setError('Could not load this story.'))
      .finally(() => setLoadingPost(false));
  }, [id]);

  const handleSubmit = async () => {
    setError('');

    if (!title || !destination || !content) {
      setError('Please fill in the title, destination, and story.');
      return;
    }

    const payload = {
      title,
      destination,
      content,
      category,
      coverImage: coverImage || undefined,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    setLoading(true);
    try {
      if (isEditing) {
        await api.patch(`/posts/${id}`, payload);
        navigate(`/posts/${id}`);
      } else {
        await api.post('/posts', payload);
        navigate('/');
      }
    } catch (err) {
      const status = (err as { response?: { status?: number } }).response?.status;
      if (status === 403) {
        setError('You can only edit your own stories.');
      } else {
        setError(isEditing ? 'Failed to save changes. Please try again.' : 'Failed to publish. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingPost) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center text-neutral-400">
        Loading story...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-8">
        <h1 className="font-serif text-2xl text-[#1B4332] mb-6">
          {isEditing ? 'Edit Your Story' : 'Write a Travel Story'}
        </h1>

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
            onClick={() => navigate(isEditing ? `/posts/${id}` : '/')}
            className="px-5 py-2.5 rounded-full text-sm font-medium text-neutral-600 border border-black/10 hover:bg-black/5"
          >
            {isEditing ? 'Cancel' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 rounded-full text-sm font-medium text-white bg-[#1B4332] hover:bg-[#163a2a] disabled:opacity-60"
          >
            {loading
              ? isEditing
                ? 'Saving...'
                : 'Publishing...'
              : isEditing
                ? 'Save Changes'
                : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WriteStory;