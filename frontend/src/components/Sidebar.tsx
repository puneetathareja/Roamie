import { Home, Compass, BookOpen, Bookmark, Bell, MessageCircle, Send } from 'lucide-react';

const navItems = [
  { label: 'Home', icon: Home },
  { label: 'Explore', icon: Compass },
  { label: 'My Stories', icon: BookOpen },
  { label: 'Bookmarks', icon: Bookmark },
  { label: 'Notifications', icon: Bell, badge: 3 },
  { label: 'Messages', icon: MessageCircle },
];

function Sidebar() {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-[#FAF6EF] border-r border-black/5 px-6 py-8 flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-serif text-2xl text-[#1B4332]">Roamie</span>
        <Send size={18} className="text-[#1B4332] -rotate-45" />
      </div>
      <p className="text-xs text-neutral-500 mb-10">Real People. Real Journeys.</p>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ label, icon: Icon, badge }, i) => (
          <button
            key={label}
            className={`flex items-center justify-between px-4 py-2.5 rounded-full text-sm transition-colors ${
              i === 0
                ? 'bg-[#1B4332] text-white'
                : 'text-neutral-700 hover:bg-black/5'
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon size={18} />
              {label}
            </span>
            {badge && (
              <span className="text-xs bg-red-400 text-white rounded-full px-1.5 py-0.5">
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;