import { ArrowRight } from 'lucide-react';

function Hero() {
  return (
    <div className="relative rounded-3xl overflow-hidden h-96">
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80"
        alt="Traveler overlooking mountains"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-center px-10 max-w-lg">
        <h1 className="font-serif text-5xl leading-tight text-white mb-4">
          Small stories.
          <br />
          Big places.
        </h1>
        <p className="text-white/90 text-sm mb-6 max-w-sm">
          Discover, read and share travel stories from around the world.
        </p>
        <button className="w-fit flex items-center gap-2 bg-white text-[#1B4332] font-medium text-sm px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors">
          Explore Stories
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default Hero;