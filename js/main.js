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