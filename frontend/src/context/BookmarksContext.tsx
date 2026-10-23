import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../lib/api';

interface BookmarksContextValue {
  bookmarkedIds: Set<string>;
  toggleBookmark: (postId: string) => Promise<void>;
}

const BookmarksContext = createContext<BookmarksContextValue>({
  bookmarkedIds: new Set(),
  toggleBookmark: async () => {},
});

function flip(ids: Set<string>, postId: string) {
  const next = new Set(ids);
  if (next.has(postId)) {
    next.delete(postId);
  } else {
    next.add(postId);
  }
  return next;
}

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const location = useLocation();

  // Reload the saved ids whenever the page changes (covers login/logout too)
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setBookmarkedIds(new Set());
      return;
    }
    api
      .get('/bookmarks/ids')
      .then((res) => setBookmarkedIds(new Set<string>(res.data)))
      .catch(() => setBookmarkedIds(new Set()));
  }, [location.pathname]);

  const toggleBookmark = async (postId: string) => {
    if (!localStorage.getItem('token')) {
      alert('Please log in to bookmark stories.');
      return;
    }

    setBookmarkedIds((prev) => flip(prev, postId));
    try {
      await api.post(`/bookmarks/${postId}`);
    } catch {
      setBookmarkedIds((prev) => flip(prev, postId));
    }
  };

  return (
    <BookmarksContext.Provider value={{ bookmarkedIds, toggleBookmark }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  return useContext(BookmarksContext);
}