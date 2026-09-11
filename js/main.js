/* ============================================
   SIMO_TOOL — Main JavaScript
   ============================================ */

// ---- Tool Data (preserved from original) ----
const toolsData = [
    { title: "Convert Files to PDF", name: "I Love PDF", category: "Tool", url: "https://www.ilovepdf.com/", description: "Quickly convert Word, Excel, Images and more into PDF files." },
    { title: "Learn Web Development", name: "w3schools", category: "Study", url: "https://www.w3schools.com/", description: "Free tutorials and projects to learn HTML, CSS, JavaScript and more." },
    { title: "Play Online Games", name: "Crazy Games", category: "Game", url: "https://www.crazygames.com/", description: "Play free online games directly in your browser." },
    { title: "AI Chat Assistant", name: "ChatGPT", category: "Other", url: "https://chat.openai.com/", description: "Chat with an AI assistant to get answers and ideas instantly." },
    { title: "Learn Piano", name: "Flowkey", category: "Study", url: "https://app.flowkey.com/", description: "Learn piano with interactive lessons and tutorials." },
    { title: "Fix & Repair Guides", name: "iFixit", category: "Study", url: "https://www.ifixit.com/", description: "Free guides and tools to repair electronics and gadgets yourself." },
    { title: "Learn Languages", name: "Duolingo", category: "Study", url: "https://www.duolingo.com/", description: "Learn languages with fun, gamified lessons online." },
    { title: "File Converter", name: "AllToAll", category: "Tool", url: "https://www.alltoall.net/", description: "Convert files between many formats online." },
    { title: "A grid-based online type tool", name: "Grid Type", category: "Tool", url: "https://www.grid-type.com/", description: "Generate different types of grids, draw letters and download as font." },
    { title: "AI Signature", name: "Calligrapher AI", category: "Tool", url: "https://www.calligrapher.ai/", description: "Generate realistic handwritten signature with AI." },
    { title: "Design Tool(Online PS)", name: "Gaoding PS", category: "Tool", url: "https://ps.gaoding.com/", description: "Online photo editing and design tools." },
    { title: "Background Eraser", name: "Magic Eraser", category: "Tool", url: "https://magicstudio.com/zh/magiceraser/", description: "Remove unwanted objects from images with AI." },
    { title: "Productivity Helper", name: "Goblin Tools", category: "Tool", url: "https://goblin.tools/", description: "Simple tools to break down tasks and think clearly." },
    { title: "Color Reference", name: "Encycolorpedia", category: "Tool", url: "https://encycolorpedia.com/named", description: "Explore named colors and color information." },
    { title: "Software Resources", name: "Adobe Resources", category: "Other", url: "http://adobe.v404.cn/adobe/", description: "Adobe software links and related resources." },
    { title: "File Converter", name: "AConvert", category: "Tool", url: "https://www.aconvert.com/", description: "Convert documents, images, audio, and video files." },
    { title: "How-To Guides", name: "WikiHow", category: "Study", url: "https://www.wikihow.com/Main-Page", description: "Step-by-step guides for everyday tasks." },
    { title: "Skill Testing", name: "Human Benchmark", category: "Other", url: "https://humanbenchmark.com/", description: "Test your memory, speed, and reaction time." },
    { title: "Music Discovery", name: "Gnoosic", category: "Other", url: "https://www.gnoosic.com/", description: "Discover new music based on your taste." },
    { title: "Background Remover", name: "Remove.bg", category: "Tool", url: "https://www.remove.bg/", description: "Remove image backgrounds automatically with AI." },
    { title: "AI Art Generator", name: "Artbreeder", category: "Tool", url: "https://www.artbreeder.com/", description: "Create and remix images using AI." },
    { title: "Weather Map", name: "Windy", category: "Tool", url: "https://www.windy.com/", description: "Advanced weather forecasts and live wind maps." },
    { title: "Website Builder", name: "Wix", category: "Tool", url: "https://www.wix.com/", description: "Build and customize websites without coding." },
    { title: "Time Zone Tool", name: "Every Time Zone", category: "Tool", url: "https://everytimezone.com/", description: "Visualize and compare time zones easily." },
    { title: "Presentation Templates (PPT)", name: "Slidesgo", category: "Tool", url: "https://slidesgo.com/", description: "Free presentation templates for slides." },
    { title: "Music in Movies & TV & Games", name: "TuneFind", category: "Other", url: "https://www.tunefind.com/", description: "Find songs used in TV shows, movies and games." },
    { title: "Mouse Tester", name: "Polling Rate Check", category: "Tool", url: "https://cps-check.com/cn/polling-rate-check", description: "Check mouse polling rate and performance." },
    { title: "Map Generator", name: "Watabou", category: "Tool", url: "https://watabou.github.io/", description: "Generate fantasy maps and worlds." },
    { title: "Time Visualization", name: "Every Second", category: "Other", url: "https://everysecond.io/", description: "Visualize data and events over time." },
    { title: "Design Tool", name: "Chuangkit", category: "Tool", url: "https://www.chuangkit.com/", description: "Online graphic design and poster maker." },
    { title: "Video Background Remover", name: "Unscreen", category: "Tool", url: "https://www.unscreen.com/", description: "Remove video backgrounds automatically." },
    { title: "App Icon Generator", name: "AppIcons", category: "Tool", url: "https://appicons.co/", description: "Generate app icons for multiple platforms." },
    { title: "Name Meanings", name: "Behind the Name", category: "Other", url: "https://www.behindthename.com/", description: "Explore name origins and meanings." },
    { title: "Writing Assistant (AI)", name: "Grammarly", category: "Tool", url: "https://www.grammarly.com/", description: "Improve writing with grammar and style checks." },
    { title: "3D Models", name: "Thingiverse", category: "Other", url: "https://www.thingiverse.com/", description: "Download and share 3D printable models." },
    { title: "Shortcut Reference (hotkey)", name: "Hotkey Cheat Sheet", category: "Tool", url: "https://hotkeycheatsheet.com/", description: "Keyboard shortcuts for popular software." },
    { title: "Photo Editor", name: "FotoJet", category: "Tool", url: "https://www.fotojet.com/", description: "Create designs, collages, and edits online." },
    { title: "Art Effects", name: "FotoSketcher", category: "Tool", url: "https://fotosketcher.com/", description: "Turn photos into artistic drawings." },
    { title: "Product Discovery", name: "Product Hunt", category: "Other", url: "https://www.producthunt.com/", description: "Discover new tech products and startups." },
    { title: "Pronunciation Practice", name: "SpeechAce", category: "Study", url: "https://www.speechace.com/", description: "Practice and improve English pronunciation." },
    { title: "Sand Tetris Game", name: "Sandtris", category: "Game", url: "https://sandtris.com/", description: "A sand-based twist on classic Tetris." },
    { title: "Online Tetris Battle", name: "Tetr.io", category: "Game", url: "https://tetr.io/", description: "Play a modern online Tetris game solo or against others." },
    { title: "Game Time Tracker", name: "HowLongToBeat", category: "Game", url: "https://howlongtobeat.com/", description: "Check how long it takes to beat games." },
    { title: "Dictionary", name: "Merriam-Webster", category: "Study", url: "https://www.merriam-webster.com/", description: "Definitions, meanings, and word usage." },
    { title: "Online Music Games (chinese)", name: "Beatstage", category: "Game", url: "https://www.beatstage.com/", description: "Learn rhythm and timing through music." },
    { title: "Guessing Game (PIN)", name: "Guess The Pin", category: "Game", url: "https://www.guessthepin.com/", description: "Guess the pin (four-digit PIN)." },
    { title: "Match-3 battle", name: "Guivo", category: "Game", url: "https://guivo.io/", description: "A skill-based Match-3 battle arena." },
    { title: "Online Chess", name: "Chess.com", category: "Game", url: "https://www.chess.com/", description: "Play chess online and improve your skills." },
    { title: "Real or Photoshop", name: "Adobe Challenge", category: "Game", url: "https://landing.adobe.com/en/na/products/creative-cloud/69308-real-or-photoshop/index.html", description: "Guess whether images are real or edited." },
    { title: "Online Mahjong (Chinese)", name: "Mahjong Soul", category: "Game", url: "https://www.maj-soul.com/#/home", description: "Play anime-style Japanese mahjong online." },
    { title: "Typing Race", name: "TypeRacer", category: "Game", url: "https://play.typeracer.com/", description: "Race others by typing text quickly." },
    { title: "Muscle Guide", name: "MuscleWiki", category: "Study", url: "https://musclewiki.com/", description: "Learn muscle anatomy and exercises." },
    { title: "Online Courses", name: "Coursera", category: "Study", url: "https://www.coursera.org/", description: "Learn skills with online courses." },
    { title: "Language Learning", name: "Language Player", category: "Study", url: "https://languageplayer.io/", description: "Learn languages through video content." },
    { title: "Pronunciation Audio", name: "Forvo", category: "Study", url: "https://forvo.com/", description: "Hear native pronunciation of words." },
    { title: "Lens Simulator", name: "Samyang Lens Simulator", category: "Study", url: "https://www.lksamyang.com/en/product/simulator/lens.php", description: "Simulate camera lenses and focal lengths." },
    { title: "Build Website (AI)", name: "Atoms.dev", category: "Tool", url: "https://atoms.dev/", description: "Curated collection of ready-to-use web components." },
    { title: "Music Rhythm Game", name: "Rhythm Plus", category: "Game", url: "https://rhythm-plus.com/", description: "Create, analyze, and practice musical rhythms." },
    { title: "Indie Game Platform", name: "Itch.io", category: "Game", url: "https://itch.io/", description: "Discover, play, and distribute indie games." },
    { title: "High-Quality Wallpapers", name: "Wallhaven.cc", category: "Other", url: "https://wallhaven.cc/", description: "Browse high-resolution wallpapers." },
    { title: "Create Music (AI)", name: "Suno.com", category: "Tool", url: "https://suno.com/", description: "Generate audio using AI-powered music tools." },
    { title: "Steam Game Database", name: "SteamDB.info", category: "Tool", url: "https://steamdb.info/", description: "Explore Steam game data, prices, and analytics." },
    { title: "Tons of Tools (mandarin)", name: "Gaituya", category: "Tool", url: "https://www.gaituya.com/", description: "Online platform with tons of tools." },
    { title: "Generate Name (mandarin)", name: "QMSJMFB Chengyu", category: "Tool", url: "https://www.qmsjmfb.com/chengyu.php", description: "Generate Chinese name and learn idioms." },
    { title: "Move your Mouse", name: "Pointer Pointer", category: "Other", url: "https://pointerpointer.com/", description: "Move your cursor and see someone pointing at it." },
    { title: "Anime Screenshot Finder", name: "Trace.moe", category: "Tool", url: "https://trace.moe/", description: "Identify anime titles by uploading a screenshot." },
    { title: "Remove Vocals from Music", name: "VocalRemover.org", category: "Tool", url: "https://vocalremover.org/", description: "Remove vocals or isolate instruments from songs." }
];

// ---- Navigation ----
(function initNav() {
  const nav = document.getElementById('mainNav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!nav) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 10) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    if (current > lastScroll && current > 120) {
      nav.classList.add('hidden');
    } else {
      nav.classList.remove('hidden');
    }
    lastScroll = current;
  }, { passive: true });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    // Close menu on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }
})();
// ---- Theme Toggle ----
(function initTheme() {
  const btn = document.getElementById('themeBtn');
  const html = document.documentElement;
  if (!btn) return;

  // Load saved theme
  const saved = localStorage.getItem('theme');
  if (saved) html.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();
// ---- Tool Cards Rendering ----
(function initTools() {
  const grid = document.getElementById('toolsGrid');
  const filterBar = document.getElementById('filterBar');
  const filterCount = document.getElementById('filterCount');
  const totalCount = document.getElementById('totalCount');
  if (!grid) return;

  const arrowSVG = '<svg class="tool-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>';

  function renderCards(category) {
    const filtered = category === 'all' ? toolsData : toolsData.filter(t => t.category.toLowerCase() === category.toLowerCase());
    grid.innerHTML = '';

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="no-results"><div class="no-results-icon">¯\\_(ツ)_/¯</div><h3>No tools found</h3><p>Try a different category</p></div>';
      if (filterCount) filterCount.textContent = '0 results';
      return;
    }

    filtered.forEach((tool, i) => {
      const card = document.createElement('a');
      card.href = tool.url;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.className = 'tool-card fade-up';
      card.style.animationDelay = Math.min(i * 0.03, 0.4) + 's';
      card.innerHTML = `
        <div class="tool-card-header">
          <div class="tool-card-title">${tool.title}</div>
          <span class="tool-card-badge">${tool.category}</span>
        </div>
        <div class="tool-card-name">${tool.name}</div>
        <div class="tool-card-desc">${tool.description}</div>
        ${arrowSVG}
      `;
      grid.appendChild(card);
    });

    if (filterCount) filterCount.textContent = filtered.length + ' result' + (filtered.length !== 1 ? 's' : '');
  }

  // Filter buttons
  if (filterBar) {
    filterBar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCards(btn.dataset.category);
      });
    });
  }

  // Initial render
  renderCards('all');
  if (totalCount) totalCount.textContent = toolsData.length;
})();
// ---- Search Overlay ----
(function initSearch() {
  const btn = document.getElementById('searchBtn');
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  if (!btn || !overlay) return;

  function openSearch() {
    overlay.classList.add('open');
    setTimeout(() => input.focus(), 100);
  }

  function closeSearch() {
    overlay.classList.remove('open');
    input.value = '';
    results.innerHTML = '';
  }

  btn.addEventListener('click', () => {
    overlay.classList.contains('open') ? closeSearch() : openSearch();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSearch();
  });

  // Ctrl+K shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      overlay.classList.contains('open') ? closeSearch() : openSearch();
    }
    if (e.key === 'Escape') closeSearch();
  });

  // Live search
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (!q) { results.innerHTML = ''; return; }

    const matches = toolsData.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    ).slice(0, 10);

    if (matches.length === 0) {
      results.innerHTML = '<div class="search-hint">No results for "' + input.value + '"</div>';
      return;
    }

    results.innerHTML = matches.map(t => `
      <a class="search-result-item" href="${t.url}" target="_blank" rel="noopener">
        <div>
          <div class="search-result-title">${t.title}</div>
          <div class="search-result-name">${t.name}</div>
        </div>
        <span class="search-result-cat">${t.category}</span>
      </a>
    `).join('');
  });
})();
// ---- Recipe Finder (TheMealDB API) ----
(function initRecipes() {
  const input = document.getElementById('recipeInput');
  const searchBtn = document.getElementById('recipeSearchBtn');
  const grid = document.getElementById('recipeGrid');
  const status = document.getElementById('recipeStatus');
  const catBtns = document.querySelectorAll('.recipe-cat-btn');
  const mealCatBtns = document.querySelectorAll('.meal-cat-btn');
  const modal = document.getElementById('recipeModal');
  const modalContent = document.getElementById('recipeModalContent');
  const modalClose = document.getElementById('recipeModalClose');

  if (!input || !grid) return;

  const API = 'https://www.themealdb.com/api/json/v1/1';
  let selectedMealCategory = null;
  let currentCuisine = null;

  function showLoading() {
    grid.innerHTML = '';
    status.innerHTML = '<div class="recipe-loading"><div class="recipe-loading-spinner"></div>Searching recipes...</div>';
  }

  function showStatus(msg) {
    grid.innerHTML = '';
    status.innerHTML = '<div class="recipe-loading">' + msg + '</div>';
  }

  function clearStatus() { status.innerHTML = ''; }

  async function searchRecipes(query) {
    showLoading();
    try {
      const res = await fetch(API + '/search.php?s=' + encodeURIComponent(query));
      const data = await res.json();
      clearStatus();
      if (!data.meals) { showStatus('No recipes found for "' + query + '". Try another ingredient.'); return; }
      renderRecipeCards(data.meals);
    } catch (e) {
      clearStatus();
      showStatus('Error fetching recipes. Please try again.');
    }
  }

  async function searchByArea(area) {
    showLoading();
    currentCuisine = area;
    try {
      const res = await fetch(API + '/filter.php?a=' + encodeURIComponent(area));
      const data = await res.json();
      clearStatus();
      if (!data.meals) { showStatus('No recipes found for ' + area); return; }
      
      let meals = data.meals;
      
      // If a meal category is selected, filter by it
      if (selectedMealCategory) {
        meals = await filterByMealCategory(meals);
      }
      
      if (meals.length === 0) {
        showStatus('No recipes match your filters.');
        return;
      }
      
      renderRecipeCards(meals.slice(0, 20));
    } catch (e) {
      clearStatus();
      showStatus('Error fetching recipes. Please try again.');
    }
  }

  // Filter meals by selected meal category
  async function filterByMealCategory(meals) {
    if (!selectedMealCategory) return meals;
    
    const results = [];
    
    // Check each meal's category
    for (const meal of meals) {
      const detail = await fetch(API + '/lookup.php?i=' + meal.idMeal)
        .then(r => r.json())
        .catch(() => null);
      
      if (detail && detail.meals && detail.meals[0]) {
        const mealCategory = detail.meals[0].strCategory;
        if (mealCategory === selectedMealCategory) {
          results.push(meal);
        }
      }
    }
    
    return results;
  }

  // Search by meal category only (without cuisine)
  async function searchByMealCategory() {
    if (!selectedMealCategory) {
      loadRandomRecipes(12);
      return;
    }
    
    showLoading();
    
    try {
      const res = await fetch(API + '/filter.php?c=' + encodeURIComponent(selectedMealCategory));
      const data = await res.json();
      clearStatus();
      
      if (!data.meals || data.meals.length === 0) {
        showStatus('No recipes found for ' + selectedMealCategory + '.');
        return;
      }
      
      renderRecipeCards(data.meals.slice(0, 24));
    } catch (e) {
      clearStatus();
      showStatus('Error fetching recipes. Please try again.');
    }
  }

  function renderRecipeCards(meals) {
    grid.innerHTML = meals.map(m => `
      <div class="recipe-card" data-id="${m.idMeal}">
        <img src="${m.strMealThumb}" alt="${m.strMeal}" loading="lazy">
        <div class="recipe-card-body">
          <div class="recipe-card-title">${m.strMeal}</div>
          ${m.strArea ? '<div class="recipe-card-area">' + m.strArea + '</div>' : ''}
        </div>
      </div>
    `).join('');

    // Click to view details
    grid.querySelectorAll('.recipe-card').forEach(card => {
      card.addEventListener('click', () => showRecipeDetail(card.dataset.id));
    });
  }

  async function showRecipeDetail(id) {
    try {
      const res = await fetch(API + '/lookup.php?i=' + id);
      const data = await res.json();
      if (!data.meals || !data.meals[0]) return;
      const m = data.meals[0];

      // Build ingredients list
      let ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ing = m['strIngredient' + i];
        const measure = m['strMeasure' + i];
        if (ing && ing.trim()) ingredients.push((measure ? measure.trim() + ' ' : '') + ing.trim());
      }

      // Clean instructions
      const steps = m.strInstructions
        .split(/\r\n|\r|\n/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

      modalContent.innerHTML = `
        <button class="recipe-modal-close" id="recipeModalClose">×</button>
        <img class="recipe-modal-img" src="${m.strMealThumb}" alt="${m.strMeal}">
        <div class="recipe-modal-body">
          <h2>${m.strMeal}</h2>
          <div class="recipe-modal-meta">
            ${m.strArea ? '<span>' + m.strArea + '</span>' : ''}
            ${m.strCategory ? '<span>' + m.strCategory + '</span>' : ''}
            ${m.strTags ? '<span>' + m.strTags.split(',')[0] + '</span>' : ''}
          </div>
          ${m.strYoutube ? '<p><a href="' + m.strYoutube + '" target="_blank" style="color:var(--accent)">Watch on YouTube</a></p>' : ''}
          <h3>Ingredients</h3>
          <ul>${ingredients.map(i => '<li>' + i + '</li>').join('')}</ul>
          <h3>Instructions</h3>
          <ol>${steps.map(s => '<li>' + s + '</li>').join('')}</ol>
        </div>
      `;

      modal.classList.add('open');

      // Re-bind close button
      document.getElementById('recipeModalClose').addEventListener('click', () => modal.classList.remove('open'));
    } catch (e) {
      console.error('Failed to load recipe detail', e);
    }
  }

  // Load random recipes on page load
  async function loadRandomRecipes(count = 12) {
    showLoading();
    try {
      const promises = Array.from({ length: count }, () =>
        fetch(API + '/random.php').then(r => r.json())
      );
      const results = await Promise.all(promises);
      const meals = results
        .filter(r => r.meals && r.meals[0])
        .map(r => r.meals[0]);
      clearStatus();
      if (meals.length > 0) renderRecipeCards(meals);
      else showStatus('Click Search or pick a category to find recipes.');
    } catch (e) {
      clearStatus();
      showStatus('Click Search or pick a category to find recipes.');
    }
  }

  // Reset all filters
  function resetAllFilters() {
    catBtns.forEach(b => b.classList.remove('active'));
    mealCatBtns.forEach(b => b.classList.remove('active'));
    selectedMealCategory = null;
    currentCuisine = null;
  }

  // Reset meal category buttons
  function resetMealCatBtns() {
    mealCatBtns.forEach(b => b.classList.remove('active'));
    selectedMealCategory = null;
  }

  // Event listeners
  searchBtn.addEventListener('click', () => {
    const q = input.value.trim();
    if (q) {
      resetAllFilters();
      searchRecipes(q);
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) {
        resetAllFilters();
        searchRecipes(q);
      }
    }
  });

  // Cuisine buttons (single select, toggleable)
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) {
        // Clicking active button → deselect and reload random
        btn.classList.remove('active');
        currentCuisine = null;
        input.value = '';
        // If a meal category is selected, keep it
        if (selectedMealCategory) {
          searchByMealCategory();
        } else {
          loadRandomRecipes(12);
        }
      } else {
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCuisine = btn.dataset.area;
        input.value = '';
        searchByArea(btn.dataset.area);
      }
    });
  });

  // Meal category buttons (single select)
  mealCatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) {
        // Deselect
        btn.classList.remove('active');
        selectedMealCategory = null;
      } else {
        // Select (single select - deselect others)
        mealCatBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedMealCategory = btn.dataset.meal;
      }
      
      // Reset search input and cuisine
      input.value = '';
      catBtns.forEach(b => b.classList.remove('active'));
      currentCuisine = null;
      
      // Search based on current state
      if (!selectedMealCategory) {
        loadRandomRecipes(12);
      } else {
        searchByMealCategory();
      }
    });
  });

  // Close modal
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  // Load random recipes on init
  loadRandomRecipes(12);
})();
// ---- Disclaimer Modal ----
(function initDisclaimer() {
  const modal = document.getElementById('disclaimerModal');
  const acceptBtn = document.getElementById('acceptDisclaimer');
  const openBtn = document.getElementById('openDisclaimer');
  const closeBtn = document.getElementById('closeModal');
  if (!modal) return;

  function show() { modal.classList.add('show'); }
  function hide() { modal.classList.remove('show'); }

  if (!localStorage.getItem('disclaimerAccepted')) show();
  if (acceptBtn) acceptBtn.addEventListener('click', () => { localStorage.setItem('disclaimerAccepted', 'true'); hide(); });
  if (closeBtn) closeBtn.addEventListener('click', hide);
  if (openBtn) openBtn.addEventListener('click', show);
})();
// ---- Scroll to Top ----
(function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 200);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
// ---- Audio (background music, hidden) ----
(function() {
  const audio = document.getElementById('myAudio');
  if (audio) audio.style.display = 'none';
})();

// ---- Weather API (Open-Meteo) ----
(function initWeather() {
  const widget = document.getElementById('weatherWidget');
  const content = document.getElementById('weatherContent');
  const tempEl = document.getElementById('weatherTemp');
  const descEl = document.getElementById('weatherDesc');
  const iconEl = document.getElementById('weatherIcon');
  const locEl = document.getElementById('weatherLocation');
  const cityInput = document.getElementById('weatherCityInput');
  const searchBtn = document.getElementById('weatherSearchBtn');
  
  if (!widget) return;
  
  const weatherCodes = {
    0: { icon: '☀️', desc: 'Clear sky' },
    1: { icon: '🌤️', desc: 'Mainly clear' },
    2: { icon: '⛅', desc: 'Partly cloudy' },
    3: { icon: '☁️', desc: 'Overcast' },
    45: { icon: '🌫️', desc: 'Fog' },
    48: { icon: '🌫️', desc: 'Depositing rime fog' },
    51: { icon: '🌦️', desc: 'Light drizzle' },
    53: { icon: '🌦️', desc: 'Moderate drizzle' },
    55: { icon: '🌦️', desc: 'Dense drizzle' },
    61: { icon: '🌧️', desc: 'Slight rain' },
    63: { icon: '🌧️', desc: 'Moderate rain' },
    65: { icon: '🌧️', desc: 'Heavy rain' },
    71: { icon: '🌨️', desc: 'Slight snow' },
    73: { icon: '🌨️', desc: 'Moderate snow' },
    75: { icon: '🌨️', desc: 'Heavy snow' },
    80: { icon: '🌦️', desc: 'Slight rain showers' },
    81: { icon: '🌦️', desc: 'Moderate rain showers' },
    82: { icon: '🌧️', desc: 'Violent rain showers' },
    95: { icon: '⛈️', desc: 'Thunderstorm' },
    96: { icon: '⛈️', desc: 'Thunderstorm with slight hail' },
    99: { icon: '⛈️', desc: 'Thunderstorm with heavy hail' }
  };
  
  async function getWeather(lat, lon, locationName) {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const data = await res.json();
      
      const code = data.current_weather.weathercode;
      const temp = Math.round(data.current_weather.temperature);
      const weather = weatherCodes[code] || { icon: '🌡️', desc: 'Unknown' };
      
      iconEl.textContent = weather.icon;
      tempEl.textContent = temp + '°C';
      descEl.textContent = weather.desc;
      locEl.textContent = locationName;
      
      // Save to localStorage
      localStorage.setItem('weatherCity', locationName);
      localStorage.setItem('weatherLat', lat);
      localStorage.setItem('weatherLon', lon);
      
      widget.querySelector('.weather-loading').style.display = 'none';
      content.style.display = 'flex';
    } catch (e) {
      console.error('Weather error:', e);
    }
  }
  
  async function searchCity() {
    const city = cityInput.value.trim();
    if (!city) return;
    
    widget.querySelector('.weather-loading').style.display = 'flex';
    content.style.display = 'none';
    
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en`);
      const data = await res.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const name = result.name + (result.country ? ', ' + result.country : '');
        getWeather(result.latitude, result.longitude, name);
      } else {
        alert('City not found. Try another name.');
        widget.querySelector('.weather-loading').style.display = 'none';
        content.style.display = 'flex';
      }
    } catch (e) {
      alert('Error searching city. Please try again.');
      widget.querySelector('.weather-loading').style.display = 'none';
      content.style.display = 'flex';
    }
  }
  
  // Search button click
  if (searchBtn) {
    searchBtn.addEventListener('click', searchCity);
  }
  
  // Enter key in city input
  if (cityInput) {
    cityInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') searchCity();
    });
  }
  
  // Check localStorage first
  const savedCity = localStorage.getItem('weatherCity');
  const savedLat = localStorage.getItem('weatherLat');
  const savedLon = localStorage.getItem('weatherLon');
  
  if (savedCity && savedLat && savedLon) {
    getWeather(parseFloat(savedLat), parseFloat(savedLon), savedCity);
    if (cityInput) cityInput.value = savedCity.split(',')[0];
  } else {
    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en`);
            const data = await res.json();
            const name = data.results && data.results[0] ? data.results[0].name : 'Your Location';
            getWeather(latitude, longitude, name);
          } catch (e) {
            getWeather(latitude, longitude, 'Your Location');
          }
        },
        () => {
          // Default to London if location denied
          getWeather(51.5074, -0.1278, 'London');
        }
      );
    } else {
      // Default to London
      getWeather(51.5074, -0.1278, 'London');
    }
  }
})();

// ---- Book Search API (Open Library) ----
(function initBookSearch() {
  const input = document.getElementById('bookInput');
  const btn = document.getElementById('bookBtn');
  const result = document.getElementById('bookResult');
  
  if (!input || !btn) return;
  
  async function searchBook() {
    const query = input.value.trim();
    if (!query) return;
    
    result.innerHTML = '<div class="api-result-loading"><div class="recipe-loading-spinner"></div></div>';
    
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1`);
      const data = await res.json();
      
      if (data.docs && data.docs.length > 0) {
        const book = data.docs[0];
        const coverId = book.cover_i;
        const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : 'https://via.placeholder.com/120x170?text=No+Cover';
        
        // Get more details
        const author = book.author_name ? book.author_name.slice(0, 3).join(', ') : 'Unknown';
        const year = book.first_publish_year || 'N/A';
        const pages = book.number_of_pages_median || book.number_of_pages || 'N/A';
        const isbn = book.isbn ? book.isbn[0] : 'N/A';
        const subjects = book.subject ? book.subject.slice(0, 3).join(', ') : 'N/A';
        const language = book.language ? book.language.join(', ').toUpperCase() : 'N/A';
        const publisher = book.publisher ? book.publisher[0] : 'N/A';
        
        // Build links
        const olKey = book.key;
        const olUrl = olKey ? `https://openlibrary.org${olKey}` : '#';
        const previewUrl = book.has_fulltext ? `https://openlibrary.org${olKey}` : null;
        
        result.innerHTML = `
          <div class="book-card">
            <img src="${coverUrl}" alt="${book.title}" class="book-cover" onerror="this.src='https://via.placeholder.com/120x170?text=No+Cover'">
            <div class="book-info">
              <div class="book-title">${book.title}</div>
              <div class="book-author">by ${author}</div>
              <div class="book-meta">
                <div class="book-meta-item"><strong>Year:</strong> ${year}</div>
                <div class="book-meta-item"><strong>Pages:</strong> ${pages}</div>
                <div class="book-meta-item"><strong>Language:</strong> ${language}</div>
              </div>
              <div class="book-meta">
                <div class="book-meta-item"><strong>Publisher:</strong> ${publisher}</div>
              </div>
              ${book.first_sentence ? `<div class="book-desc">${book.first_sentence[0]}</div>` : ''}
              <div class="book-links">
                <a href="${olUrl}" target="_blank" class="book-link">View on Open Library</a>
                ${previewUrl ? `<a href="${previewUrl}" target="_blank" class="book-link secondary">Read Preview</a>` : ''}
              </div>
            </div>
          </div>
        `;
      } else {
        result.innerHTML = '<div class="api-result-empty">No books found. Try a different search term.</div>';
      }
    } catch (e) {
      result.innerHTML = '<div class="api-result-error">Error searching books. Please try again.</div>';
    }
  }
  
  btn.addEventListener('click', searchBook);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBook();
  });
})();

// ---- Currency Converter API (Frankfurter) ----
(function initCurrencyConverter() {
  const amount = document.getElementById('currencyAmount');
  const from = document.getElementById('currencyFrom');
  const to = document.getElementById('currencyTo');
  const result = document.getElementById('currencyResult');
  
  if (!amount || !result) return;
  
  async function convert() {
    const amt = parseFloat(amount.value);
    if (!amt || amt <= 0) {
      result.textContent = 'Enter amount';
      return;
    }
    
    const fromCurrency = from.value;
    const toCurrency = to.value;
    
    // If same currency, just show the amount
    if (fromCurrency === toCurrency) {
      result.textContent = `${amt.toFixed(2)} ${toCurrency}`;
      return;
    }
    
    result.textContent = 'Converting...';
    
    try {
      const res = await fetch(`https://api.frankfurter.app/latest?amount=${amt}&from=${fromCurrency}&to=${toCurrency}`);
      
      if (!res.ok) {
        result.textContent = 'Error';
        return;
      }
      
      const data = await res.json();
      
      if (data.rates && data.rates[toCurrency]) {
        const converted = data.rates[toCurrency].toFixed(2);
        const rate = (data.rates[toCurrency]).toFixed(4);
        result.innerHTML = `${converted} <span style="font-size: 12px; color: var(--text-muted);">${toCurrency}</span>`;
        result.title = `1 ${fromCurrency} = ${rate} ${toCurrency}`;
      } else {
        result.textContent = 'No rate available';
      }
    } catch (e) {
      console.error('Currency error:', e);
      result.textContent = 'Error';
    }
  }
  
  amount.addEventListener('input', convert);
  from.addEventListener('change', convert);
  to.addEventListener('change', convert);
  
  // Initial conversion with different currencies
  if (from && to && from.value === to.value) {
    to.value = 'EUR';
  }
  convert();
})();

// ---- Pokemon API (PokéAPI) ----
(function initPokemonSearch() {
  const input = document.getElementById('pokemonInput');
  const btn = document.getElementById('pokemonBtn');
  const result = document.getElementById('pokemonResult');
  const suggestions = document.getElementById('pokemonSuggestions');
  
  if (!input || !btn) return;
  
  let pokemonList = [];
  
  // Load all Pokemon names for autocomplete
  async function loadPokemonNames() {
    try {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1010');
      const data = await res.json();
      pokemonList = data.results.map(p => p.name);
    } catch (e) {
      console.error('Failed to load Pokemon list');
    }
  }
  
  // Show autocomplete suggestions
  function showSuggestions(query) {
    if (!suggestions || !query) {
      if (suggestions) suggestions.classList.remove('show');
      return;
    }
    
    const matches = pokemonList
      .filter(name => name.startsWith(query.toLowerCase()))
      .slice(0, 8);
    
    if (matches.length === 0) {
      suggestions.classList.remove('show');
      return;
    }
    
    suggestions.innerHTML = matches.map(name => {
      const highlighted = name.replace(new RegExp(`^${query}`, 'i'), `<strong>${query}</strong>`);
      return `<div class="autocomplete-item" data-name="${name}">${highlighted}</div>`;
    }).join('');
    
    suggestions.classList.add('show');
    
    // Click on suggestion
    suggestions.querySelectorAll('.autocomplete-item').forEach(item => {
      item.addEventListener('click', () => {
        input.value = item.dataset.name;
        suggestions.classList.remove('show');
        searchPokemon();
      });
    });
  }
  
  async function searchPokemon() {
    const query = input.value.trim().toLowerCase();
    if (!query) return;
    
    if (suggestions) suggestions.classList.remove('show');
    
    result.innerHTML = '<div class="api-result-loading"><div class="recipe-loading-spinner"></div></div>';
    
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
      
      if (!res.ok) {
        result.innerHTML = '<div class="api-result-error">Pokemon not found. Try a name or number (1-1010)</div>';
        return;
      }
      
      const data = await res.json();
      
      const types = data.types.map(t => t.type.name).join(', ');
      const stats = data.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join(' | ');
      const abilities = data.abilities.map(a => a.ability.name).join(', ');
      
      result.innerHTML = `
        <div class="pokemon-card">
          <img src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name}" class="pokemon-image">
          <div class="pokemon-info">
            <div class="pokemon-name">#${data.id} ${data.name}</div>
            <div class="pokemon-types">
              ${data.types.map(t => `<span class="pokemon-type">${t.type.name}</span>`).join('')}
            </div>
            <div class="pokemon-stats">
              <strong>Abilities:</strong> ${abilities}<br>
              <strong>Base Stats:</strong> ${stats}<br>
              <strong>Height:</strong> ${(data.height / 10).toFixed(1)}m | <strong>Weight:</strong> ${(data.weight / 10).toFixed(1)}kg
            </div>
          </div>
        </div>
      `;
      
      // Save to localStorage
      const recent = JSON.parse(localStorage.getItem('recentPokemon') || '[]');
      if (!recent.includes(data.name)) {
        recent.unshift(data.name);
        if (recent.length > 5) recent.pop();
        localStorage.setItem('recentPokemon', JSON.stringify(recent));
      }
    } catch (e) {
      result.innerHTML = '<div class="api-result-error">Pokemon not found. Try a name or number (1-1010)</div>';
    }
  }
  
  // Autocomplete on input
  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      showSuggestions(input.value.trim());
    }, 150);
  });
  
  // Hide suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (suggestions && !suggestions.contains(e.target) && e.target !== input) {
      suggestions.classList.remove('show');
    }
  });
  
  btn.addEventListener('click', searchPokemon);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchPokemon();
  });
  
  // Load Pokemon names on init
  loadPokemonNames();
})();

// ---- Country API (REST Countries) ----
(function initCountrySearch() {
  const input = document.getElementById('countryInput');
  const btn = document.getElementById('countryBtn');
  const result = document.getElementById('countryResult');
  
  if (!input || !btn) return;
  
  async function searchCountry() {
    const query = input.value.trim();
    if (!query) return;
    
    result.innerHTML = '<div class="api-result-loading"><div class="recipe-loading-spinner"></div></div>';
    
    try {
      const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          result.innerHTML = '<div class="api-result-empty">Country not found. Try a different name.</div>';
        } else {
          result.innerHTML = '<div class="api-result-error">Error searching country. Please try again.</div>';
        }
        return;
      }
      
      const data = await res.json();
      
      // Check if data is an array and has results
      if (!Array.isArray(data) || data.length === 0) {
        result.innerHTML = '<div class="api-result-empty">Country not found. Try a different name.</div>';
        return;
      }
      
      const country = data[0];
      const flag = country.flags ? (country.flags.svg || country.flags.png) : '';
      const capital = country.capital && country.capital.length > 0 ? country.capital.join(', ') : 'N/A';
      const population = country.population ? country.population.toLocaleString() : 'N/A';
      
      // Handle languages - it's an object with language codes as keys
      let languages = 'N/A';
      if (country.languages) {
        languages = Object.values(country.languages).join(', ');
      }
      
      // Handle currencies - it's an object with currency codes as keys
      let currency = 'N/A';
      if (country.currencies) {
        currency = Object.values(country.currencies).map(c => c.name || c).join(', ');
      }
      
      const region = country.region || 'N/A';
      const subregion = country.subregion || '';
      const tld = country.tld && country.tld.length > 0 ? country.tld.join(', ') : 'N/A';
      const timezones = country.timezones && country.timezones.length > 0 ? country.timezones[0] : 'N/A';
      
      result.innerHTML = `
        <div class="country-card">
          ${flag ? `<img src="${flag}" alt="${country.name.common} flag" class="country-flag">` : ''}
          <div class="country-name">${country.name.common}</div>
          ${country.name.official && country.name.official !== country.name.common ? 
            `<div style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">Official: ${country.name.official}</div>` : ''}
          <div class="country-info">
            <div class="country-info-item">
              <div class="country-label">Capital</div>
              <div class="country-value">${capital}</div>
            </div>
            <div class="country-info-item">
              <div class="country-label">Population</div>
              <div class="country-value">${population}</div>
            </div>
            <div class="country-info-item">
              <div class="country-label">Region</div>
              <div class="country-value">${region}${subregion ? ' / ' + subregion : ''}</div>
            </div>
            <div class="country-info-item">
              <div class="country-label">Languages</div>
              <div class="country-value">${languages}</div>
            </div>
            <div class="country-info-item">
              <div class="country-label">Currency</div>
              <div class="country-value">${currency}</div>
            </div>
            <div class="country-info-item">
              <div class="country-label">Time Zone</div>
              <div class="country-value">${timezones}</div>
            </div>
            <div class="country-info-item">
              <div class="country-label">Domain</div>
              <div class="country-value">${tld}</div>
            </div>
          </div>
        </div>
      `;
      
      // Save to localStorage
      const recent = JSON.parse(localStorage.getItem('recentCountries') || '[]');
      const countryName = country.name.common;
      if (!recent.includes(countryName)) {
        recent.unshift(countryName);
        if (recent.length > 5) recent.pop();
        localStorage.setItem('recentCountries', JSON.stringify(recent));
      }
    } catch (e) {
      console.error('Country search error:', e);
      result.innerHTML = '<div class="api-result-error">Error searching country. Please try again.</div>';
    }
  }
  
  btn.addEventListener('click', searchCountry);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchCountry();
  });
})();

// ---- Anime API (Jikan - MyAnimeList) ----
(function initAnimeExplorer() {
  const input = document.getElementById('animeInput');
  const searchBtn = document.getElementById('animeSearchBtn');
  const genreBtns = document.querySelectorAll('.anime-gen-btn');
  const grid = document.getElementById('animeGrid');
  const status = document.getElementById('animeStatus');
  const modal = document.getElementById('animeModal');
  const modalContent = document.getElementById('animeModalContent');
  const modalClose = document.getElementById('animeModalClose');
  
  if (!grid) return;
  
  const API = 'https://api.jikan.moe/v4';
  let selectedGenre = '';
  
  function showLoading() {
    grid.innerHTML = '';
    status.innerHTML = '<div class="recipe-loading"><div class="recipe-loading-spinner"></div>Loading anime...</div>';
  }
  
  function showStatus(msg) {
    grid.innerHTML = '';
    status.innerHTML = '<div class="recipe-loading">' + msg + '</div>';
  }
  
  function clearStatus() {
    status.innerHTML = '';
  }
  
  async function loadTopAnime(genre = '') {
    showLoading();
    try {
      let url = genre ? `${API}/anime?genres=${genre}&order_by=score&sort=desc&limit=24` : `${API}/top/anime?limit=24`;
      const res = await fetch(url);
      const data = await res.json();
      clearStatus();
      
      if (data.data && data.data.length > 0) {
        renderAnimeCards(data.data);
      } else {
        showStatus('No anime found');
      }
    } catch (e) {
      clearStatus();
      showStatus('Error loading anime. Please try again.');
    }
  }
  
  async function searchAnime(query) {
    showLoading();
    try {
      const res = await fetch(`${API}/anime?q=${encodeURIComponent(query)}&limit=24`);
      const data = await res.json();
      clearStatus();
      
      if (data.data && data.data.length > 0) {
        renderAnimeCards(data.data);
      } else {
        showStatus('No anime found for "' + query + '"');
      }
    } catch (e) {
      clearStatus();
      showStatus('Error searching anime. Please try again.');
    }
  }
  
  function renderAnimeCards(animeList) {
    grid.innerHTML = animeList.map(anime => `
      <div class="anime-card" data-id="${anime.mal_id}">
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}" loading="lazy">
        <div class="anime-card-body">
          <div class="anime-card-title">${anime.title}</div>
          ${anime.score ? `<div class="anime-card-score">⭐ ${anime.score}</div>` : ''}
        </div>
      </div>
    `).join('');
    
    grid.querySelectorAll('.anime-card').forEach(card => {
      card.addEventListener('click', () => showAnimeDetail(card.dataset.id));
    });
  }
  
  async function showAnimeDetail(id) {
    try {
      const res = await fetch(`${API}/anime/${id}/full`);
      const data = await res.json();
      const anime = data.data;
      
      modalContent.innerHTML = `
        <button class="recipe-modal-close" id="animeModalClose">×</button>
        <img class="anime-modal-img" src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
        <div class="anime-modal-body">
          <h2>${anime.title}</h2>
          ${anime.title_japanese ? `<p style="color: var(--text-faint); font-size: 14px;">${anime.title_japanese}</p>` : ''}
          <div class="anime-modal-meta">
            ${anime.score ? `<span class="anime-modal-score">⭐ ${anime.score}</span>` : ''}
            ${anime.episodes ? `<span>${anime.episodes} episodes</span>` : ''}
            ${anime.status ? `<span>${anime.status}</span>` : ''}
            ${anime.rating ? `<span>${anime.rating}</span>` : ''}
          </div>
          ${anime.synopsis ? `<h3>Synopsis</h3><p>${anime.synopsis}</p>` : ''}
          ${anime.genres && anime.genres.length > 0 ? `<h3>Genres</h3><p>${anime.genres.map(g => g.name).join(', ')}</p>` : ''}
          ${anime.studios && anime.studios.length > 0 ? `<h3>Studios</h3><p>${anime.studios.map(s => s.name).join(', ')}</p>` : ''}
          ${anime.url ? `<p><a href="${anime.url}" target="_blank" style="color: var(--accent);">View on MyAnimeList</a></p>` : ''}
        </div>
      `;
      
      modal.classList.add('open');
      document.getElementById('animeModalClose').addEventListener('click', () => modal.classList.remove('open'));
    } catch (e) {
      console.error('Failed to load anime detail', e);
    }
  }
  
  // Event listeners
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const q = input.value.trim();
      if (q) {
        genreBtns.forEach(b => b.classList.remove('active'));
        searchAnime(q);
      }
    });
  }
  
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (q) {
          genreBtns.forEach(b => b.classList.remove('active'));
          searchAnime(q);
        }
      }
    });
  }
  
  genreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        selectedGenre = '';
        loadTopAnime();
      } else {
        genreBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedGenre = btn.dataset.genre;
        input.value = '';
        loadTopAnime(selectedGenre);
      }
    });
  });
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }
  
  // Load top anime on init
  loadTopAnime();
})();

// ---- Drag and Drop for Tool Cards ----
(function initToolDragDrop() {
  const toolsSection = document.getElementById('toolsSection');
  if (!toolsSection) return;
  
  const cards = toolsSection.querySelectorAll('.api-tool-card');
  let draggedCard = null;
  
  // Load saved order from localStorage
  const savedOrder = localStorage.getItem('toolsCardOrder');
  if (savedOrder) {
    const order = JSON.parse(savedOrder);
    order.forEach(toolName => {
      const card = toolsSection.querySelector(`[data-tool="${toolName}"]`);
      if (card) toolsSection.appendChild(card);
    });
  }
  
  function saveOrder() {
    const currentCards = toolsSection.querySelectorAll('.api-tool-card');
    const order = Array.from(currentCards).map(card => card.dataset.tool);
    localStorage.setItem('toolsCardOrder', JSON.stringify(order));
  }
  
  cards.forEach(card => {
    const handle = card.querySelector('.drag-handle');
    
    // Drag start
    card.addEventListener('dragstart', (e) => {
      draggedCard = card;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    
    // Drag end
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      document.querySelectorAll('.api-tool-card').forEach(c => c.classList.remove('drag-over'));
      draggedCard = null;
      saveOrder();
    });
    
    // Drag over
    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      
      if (card !== draggedCard) {
        card.classList.add('drag-over');
        
        // Get the position of the dragged card
        const draggedRect = draggedCard.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        
        // Determine if we should insert before or after
        const draggedMidY = draggedRect.top + draggedRect.height / 2;
        const cardMidY = cardRect.top + cardRect.height / 2;
        
        if (draggedMidY < cardMidY) {
          toolsSection.insertBefore(draggedCard, card);
        } else {
          toolsSection.insertBefore(draggedCard, card.nextSibling);
        }
      }
    });
    
    // Drag leave
    card.addEventListener('dragleave', () => {
      card.classList.remove('drag-over');
    });
    
    // Drop
    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('drag-over');
    });
  });
})();
