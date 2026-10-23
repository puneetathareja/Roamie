import { Routes, Route } from 'react-router-dom';
import { BookmarksProvider } from './context/BookmarksContext';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import WriteStory from './pages/WriteStory';
import PostDetail from './pages/PostDetail';
import SearchResults from './pages/SearchResults';
import BookmarksPage from './pages/BookmarksPage';

function App() {
  return (
    <BookmarksProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/write" element={<WriteStory />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
      </Routes>
    </BookmarksProvider>
  );
}

export default App;