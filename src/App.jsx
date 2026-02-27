import { useState, useEffect } from 'react';
import { Search, Gamepad2, X, Maximize2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setGames(gamesData);
  }, []);

  const categories = ['All', ...new Set(gamesData.map(g => g.category))];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setSelectedGame(null); setActiveCategory('All'); setSearchQuery(''); }}>
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Gamepad2 className="text-black w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">NEXUS<span className="text-emerald-500">GAMES</span></span>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Support
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className="group relative bg-zinc-900 rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-3 bg-gradient-to-t from-black/80 to-transparent absolute inset-x-0 bottom-0">
                  <h3 className="font-semibold text-sm truncate">{game.title}</h3>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">{game.category}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">No games found matching your search.</p>
          </div>
        )}
      </main>

      {/* Game Modal / Overlay */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-8 bg-black/95 backdrop-blur-sm"
          >
            <div className="relative w-full h-full max-w-6xl bg-zinc-900 sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/10">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <Gamepad2 className="text-emerald-500 w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold">{selectedGame.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => window.open(selectedGame.url, '_blank')}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Iframe Container */}
              <div className="flex-1 bg-black relative">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  allowFullScreen
                  title={selectedGame.title}
                />
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-zinc-900/50 flex items-center justify-between text-xs text-zinc-500">
                <div className="flex items-center gap-4">
                  <span>Category: <span className="text-zinc-300">{selectedGame.category}</span></span>
                  <span className="hidden sm:inline">Press ESC to close</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 hover:text-emerald-500 transition-colors">
                    <Maximize2 className="w-3 h-3" /> Fullscreen
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
              <Gamepad2 className="text-zinc-400 w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight">NEXUS<span className="text-emerald-500">GAMES</span></span>
          </div>
          <div className="flex gap-8 text-sm text-zinc-500">
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Contact</a>
          </div>
          <p className="text-sm text-zinc-600">© 2026 Nexus Games. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
