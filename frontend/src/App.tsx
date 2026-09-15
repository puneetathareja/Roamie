import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import WriteStory from './pages/WriteStory';
import PostDetail from './pages/PostDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/write" element={<WriteStory />} />
      <Route path="/posts/:id" element={<PostDetail />} />
    </Routes>
  );
}

export default App;