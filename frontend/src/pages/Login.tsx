import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import api from '../lib/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF6EF] px-4">
      <div className="bg-white rounded-3xl shadow-sm w-full max-w-sm p-8">
        <h1 className="font-serif text-3xl text-[#1B4332] text-center mb-1">Roamie</h1>
        <h2 className="text-lg font-medium text-center mb-1">Welcome Back</h2>
        <p className="text-sm text-neutral-500 text-center mb-6">
          Log in to continue your travel journey
        </p>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="email"
              placeholder="Email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-neutral-50 border border-black/10 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-neutral-50 border border-black/10 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B4332] text-white text-sm font-medium py-2.5 rounded-full hover:bg-[#163a2a] transition-colors disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-sm text-center text-neutral-500 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#1B4332] font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;