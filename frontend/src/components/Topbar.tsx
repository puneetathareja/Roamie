import { Search, Bell, Sun } from 'lucide-react';

function Topbar() {
  return (
    <header className="flex items-center justify-between px-8 py-6">
      <div className="relative w-full max-w-md">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search travel stories, people, places..."
          className="w-full bg-white border border-black/10 rounded-full pl-10 pr-4 py-2.5 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
        />
      </div>

      <div className="flex items-center gap-4 ml-6">
        <button className="p-2 rounded-full hover:bg-black/5">
          <Sun size={18} className="text-neutral-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-black/5">
          <Bell size={18} className="text-neutral-600" />
        </button>
        <div className="w-9 h-9 rounded-full bg-neutral-300 overflow-hidden">
          <img
            src="https://i.pravatar.cc/100"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}

export default Topbar;