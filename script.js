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
            class="category-btn px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                currentCategory === cat
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
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
                class="group relative bg-zinc-900 rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/10"
            >
                <div class="aspect-[4/3] overflow-hidden">
                    <img
                        src="${game.thumbnail}"
                        alt="${game.title}"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerpolicy="no-referrer"
                    />
                </div>
                <div class="p-3 bg-gradient-to-t from-black/80 to-transparent absolute inset-x-0 bottom-0">
                    <h3 class="font-semibold text-sm truncate">${game.title}</h3>
                    <p class="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">${game.category}</p>
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
