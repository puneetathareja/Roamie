import { Camera } from 'lucide-react';

function WriteStoryCard() {
  return (
    <div className="relative bg-[#FBE4D8] rounded-3xl h-96 p-6 flex flex-col justify-between overflow-hidden">
      <div>
        <h3 className="font-serif text-2xl text-[#1B4332] leading-snug mb-2">
          Write your
          <br />
          travel story
        </h3>
        <p className="text-sm text-neutral-600">
          Share your journey, inspire others.
        </p>
      </div>

      <button className="w-fit flex items-center gap-2 bg-[#1B4332] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#163a2a] transition-colors">
        Create Post
        <span className="text-lg leading-none">+</span>
      </button>

      <div className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
        <Camera size={16} className="text-neutral-500" />
      </div>
    </div>
  );
}

export default WriteStoryCard;