import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Hero from './components/Hero';
import WriteStoryCard from './components/WriteStoryCard';
import CategoryFilter from './components/CategoryFilter';

function App() {
  return (
    <div className="flex min-h-screen bg-[#FAF6EF]">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="px-8 pb-8">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <Hero />
            </div>
            <WriteStoryCard />
          </div>
          <CategoryFilter />
        </main>
      </div>
    </div>
  );
}

export default App;