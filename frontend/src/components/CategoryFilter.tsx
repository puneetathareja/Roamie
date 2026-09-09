import { useState } from 'react';
import { Grid2x2, Mountain, Waves, Building2, Utensils, Compass, Landmark, Leaf, Backpack } from 'lucide-react';

const categories = [
  { label: 'All', icon: Grid2x2 },
  { label: 'Mountains', icon: Mountain },
  { label: 'Beaches', icon: Waves },
  { label: 'Cities', icon: Building2 },
  { label: 'Food', icon: Utensils },
  { label: 'Adventure', icon: Compass },
  { label: 'Culture', icon: Landmark },
  { label: 'Nature', icon: Leaf },
  { label: 'Backpacking', icon: Backpack },
];

function CategoryFilter() {
  const [active, setActive] = useState('All');

  return (
    <div className="flex flex-wrap gap-2 mt-6">
      {categories.map(({ label, icon: Icon }) => (
        <button
          key={label}
          onClick={() => setActive(label)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors ${
            active === label
              ? 'bg-[#1B4332] text-white border-[#1B4332]'
              : 'bg-white text-neutral-600 border-black/10 hover:border-black/20'
          }`}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;