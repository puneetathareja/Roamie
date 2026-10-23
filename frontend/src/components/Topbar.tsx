import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, LogOut } from 'lucide-react';

function getStoredUser(): { name: string } | null {
  try {
    const raw = localStorage.getItem('user');
    if (!raw || !localStorage.getItem('token')) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function Topbar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-8 py-6">
      <form onSubmit={handleSearch} className="relative w-full max-w-md">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search travel stories, people, places..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-white border border-black/10 rounded-full pl-10 pr-4 py-2.5 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
        />
      </form>

      <div className="flex items-center gap-3 ml-6">
        <button className="p-2 rounded-full hover:bg-black/5">
          <Sun size={18} className="text-neutral-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-black/5">
          <Bell size={18} className="text-neutral-600" />
        </button>

        {user ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-sm font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-neutral-700 hidden sm:block">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="p-2 rounded-full hover:bg-black/5"
            >
              <LogOut size={18} className="text-neutral-600" />
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-medium text-neutral-700 px-3 py-2 rounded-full hover:bg-black/5"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium text-white bg-[#1B4332] px-4 py-2 rounded-full hover:bg-[#163a2a]"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Topbar;