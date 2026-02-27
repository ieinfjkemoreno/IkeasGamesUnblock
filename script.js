let allGames = [];
let currentCategory = 'All';
let searchQuery = '';

// Initialize Lucide icons
function initIcons() {
    lucide.createIcons();
}

// Fetch games from JSON
async function loadGames() {
    try {
        const response = await fetch('./games.json');
        allGames = await response.json();
        renderCategories();
        renderGames();
    } catch (error) {
        console.error('Error loading games:', error);
    }
}

// Render Category Buttons
function renderCategories() {
    const container = document.getElementById('categories-container');
    const categories = ['All', ...new Set(allGames.map(g => g.category))];
    
    container.innerHTML = categories.map(cat => `
        <button
            onclick="setCategory('${cat}')"
            class="category-btn px-4 py-1.5 rounded-none text-xs font-bold whitespace-nowrap transition-all border ${
                currentCategory === cat
                    ? 'bg-[#00f0ff] text-black border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                    : 'bg-black text-[#00f0ff] border-[#00f0ff]/30 hover:bg-[#00f0ff]/10 hover:border-[#00f0ff]'
            }"
            data-category="${cat}"
        >
            ${cat}
        </button>
    `).join('');
}

// Filter and Render Games
function renderGames() {
    const grid = document.getElementById('game-grid');
    const noResults = document.getElementById('no-results');
    
    const filtered = allGames.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = currentCategory === 'All' || game.category === currentCategory;
        return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '';
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        grid.innerHTML = filtered.map(game => `
            <div
                onclick="openGame('${game.id}')"
                class="game-card group relative bg-black overflow-hidden cursor-pointer"
            >
                <div class="aspect-[4/3] overflow-hidden border-b border-[#00f0ff]/20">
                    <img
                        src="${game.thumbnail}"
                        alt="${game.title}"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        referrerpolicy="no-referrer"
                    />
                </div>
                <div class="p-3 bg-gradient-to-t from-black via-black/80 to-transparent absolute inset-x-0 bottom-0">
                    <h3 class="font-bold text-xs truncate text-[#00f0ff] uppercase tracking-wider">${game.title}</h3>
                    <p class="text-[9px] text-[#ff00ff] uppercase tracking-[0.2em] font-black">${game.category}</p>
                </div>
            </div>
        `).join('');
    }
}

// Logic for Category Selection
window.setCategory = (cat) => {
    currentCategory = cat;
    renderCategories();
    renderGames();
};

// Search Logic
document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderGames();
});

// Modal Logic
window.openGame = (id) => {
    const game = allGames.find(g => g.id === id);
    if (!game) return;

    document.getElementById('modal-title').innerText = game.title;
    document.getElementById('modal-category').innerHTML = `Category: <span class="text-zinc-300">${game.category}</span>`;
    document.getElementById('game-iframe').src = game.url;
    document.getElementById('open-new-tab').onclick = () => window.open(game.url, '_blank');
    
    const modal = document.getElementById('game-modal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

document.getElementById('close-modal').onclick = () => {
    const modal = document.getElementById('game-modal');
    modal.classList.add('hidden');
    document.getElementById('game-iframe').src = '';
    document.body.style.overflow = 'auto';
};

// Fullscreen Logic
window.toggleFullscreen = () => {
    const iframe = document.getElementById('game-iframe');
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
    }
};

// Close on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('close-modal').click();
    }
});

// Sound Playback Logic
window.play = (audioUrl, loaderId, soundId) => {
    console.log(`Playing sound: ${soundId} from ${audioUrl}`);
    const audio = new Audio(audioUrl);
    audio.play().catch(err => {
        console.warn("Audio playback failed. This is expected if the file doesn't exist in the preview environment.", err);
    });
};

// Start
document.addEventListener('DOMContentLoaded', () => {
    initIcons();
    loadGames();
});
