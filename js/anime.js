// ============================================
// ANIME PAGE — All JavaScript (Sorai-style)
// ============================================

(function initAnimeExplorer() {
  const input = document.getElementById('animeInput');
  const searchBtn = document.getElementById('animeSearchBtn');
  const grid = document.getElementById('animeGrid');
  const status = document.getElementById('animeStatus');
  const modal = document.getElementById('animeModal');
  const modalContent = document.getElementById('animeModalContent');
  const suggestions = document.getElementById('animeSuggestions');
  const pagination = document.getElementById('animePagination');
  const heroBg = document.getElementById('animeHeroBg');
  const tabs = document.querySelectorAll('.anime-tab');
  const filterBtns = document.querySelectorAll('.anime-filter-btn');
  const top10List = document.getElementById('top10List');
  const sectionTitle = document.getElementById('sectionTitle');
  const viewAllLink = document.getElementById('viewAllLink');

  if (!grid) return;

  const API = 'https://api.jikan.moe/v4';
  let currentTab = 'season';
  let selectedGenre = '';
  let currentPage = 1;
  let lastQuery = '';
  const ITEMS_PER_PAGE = 20;

  // Rate limiter for Jikan API (3 req/sec)
  let lastRequestTime = 0;
  async function apiFetch(url) {
    const now = Date.now();
    const diff = now - lastRequestTime;
    if (diff < 350) {
      await new Promise(r => setTimeout(r, 350 - diff));
    }
    lastRequestTime = Date.now();
    const res = await fetch(url);
    if (res.status === 429) {
      await new Promise(r => setTimeout(r, 1500));
      return apiFetch(url);
    }
    return res;
  }

  function showLoading() {
    grid.innerHTML = '';
    status.innerHTML = '<div class="api-result-loading"><div class="recipe-loading-spinner"></div></div>';
  }

  function showStatus(msg) {
    grid.innerHTML = '';
    status.innerHTML = '<div class="api-result-loading">' + msg + '</div>';
  }

  function clearStatus() { status.innerHTML = ''; }

  // --- Load Top 10 Sidebar ---
  async function loadTop10() {
    if (!top10List) return;
    try {
      const res = await apiFetch(API + '/top/anime?limit=10');
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        top10List.innerHTML = data.data.map((item, i) => {
          const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
          const type = item.type || 'TV';
          const typeClass = type.toLowerCase();
          return '<div class="top10-item" data-id="' + item.mal_id + '">' +
            '<span class="top10-rank ' + rankClass + '">' + String(i + 1).padStart(2, '0') + '</span>' +
            '<img class="top10-img" src="' + item.images.jpg.image_url + '" alt="" loading="lazy">' +
            '<div class="top10-info">' +
            '<div class="top10-title">' + item.title + '</div>' +
            '<div class="top10-meta">' +
            (item.score ? '<span class="top10-score">★ ' + item.score + '</span>' : '') +
            '<span class="top10-type-badge">' + type + '</span>' +
            '</div></div></div>';
        }).join('');
        top10List.querySelectorAll('.top10-item').forEach(el => {
          el.addEventListener('click', () => showAnimeDetail(el.dataset.id));
        });
      }
    } catch (e) { console.error('Top 10 load failed', e); }
  }

  // --- Load Current Tab ---
  async function loadCurrentTab(page, showAll = false) {
    showLoading();
    currentPage = page || 1;
    pagination.innerHTML = '';

    // If showing all, hide view all link and show filters
    if (showAll) {
      if (viewAllLink) viewAllLink.style.display = 'none';
      const filtersEl = document.getElementById('animeFilters');
      if (filtersEl) filtersEl.style.display = 'flex';
    }

    try {
      let url = '';

      if (currentTab === 'season') {
        url = API + '/seasons/now?limit=' + ITEMS_PER_PAGE + '&page=' + currentPage;
        if (selectedGenre) url += '&genres=' + selectedGenre;
      } else if (currentTab === 'popular') {
        url = API + '/top/anime?filter=bypopularity&limit=' + ITEMS_PER_PAGE + '&page=' + currentPage;
        if (selectedGenre) url += '&genres=' + selectedGenre;
      } else if (currentTab === 'upcoming') {
        url = API + '/top/anime?filter=upcoming&limit=' + ITEMS_PER_PAGE + '&page=' + currentPage;
        if (selectedGenre) url += '&genres=' + selectedGenre;
      } else if (currentTab === 'top') {
        url = API + '/top/anime?limit=' + ITEMS_PER_PAGE + '&page=' + currentPage;
        if (selectedGenre) url += '&genres=' + selectedGenre;
      }

      const res = await apiFetch(url);
      const data = await res.json();
      clearStatus();

      if (data.data && data.data.length > 0) {
        renderAnimeCards(data.data);
        renderPagination(data.pagination);
      } else {
        showStatus('No results found');
      }
    } catch (e) {
      clearStatus();
      showStatus('Error loading data. Please try again.');
    }
  }

  // --- Render Anime Cards ---
  function renderAnimeCards(list) {
    grid.innerHTML = list.map(item => {
      const imgUrl = (item.images && item.images.jpg) ? item.images.jpg.image_url : '';
      const title = item.title || 'Unknown';
      const score = item.score || '';
      const type = item.type || '';
      const typeClass = type.toLowerCase();
      const year = item.year || (item.aired && item.aired.prop && item.aired.prop.from ? item.aired.prop.from.year : '');

      return '<div class="anime-card" data-id="' + item.mal_id + '">' +
        '<div class="anime-card-img-wrap">' +
        '<img src="' + imgUrl + '" alt="' + title + '" loading="lazy">' +
        (score ? '<div class="anime-card-rating"><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' + score + '</div>' : '') +
        (type ? '<div class="anime-card-type ' + typeClass + '">' + type + '</div>' : '') +
        '</div>' +
        '<div class="anime-card-info">' +
        '<div class="anime-card-title">' + title + '</div>' +
        (year ? '<div class="anime-card-year">' + year + '</div>' : '') +
        '</div></div>';
    }).join('');

    grid.querySelectorAll('.anime-card').forEach(card => {
      card.addEventListener('click', () => showAnimeDetail(card.dataset.id));
    });
  }

  // --- Pagination ---
  function renderPagination(paginationData) {
    if (!paginationData || !paginationData.last_visible_page) {
      pagination.innerHTML = '';
      return;
    }
    const totalPages = paginationData.last_visible_page;
    let html = '';
    
    html += '<button class="anime-pagination-btn" ' + (currentPage === 1 ? 'disabled' : '') + ' data-page="' + (currentPage - 1) + '">&lt;</button>';

    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) startPage = Math.max(1, endPage - maxVisible + 1);

    if (startPage > 1) {
      html += '<button class="anime-pagination-btn" data-page="1">1</button>';
      if (startPage > 2) html += '<span class="anime-pagination-info">...</span>';
    }
    for (let i = startPage; i <= endPage; i++) {
      html += '<button class="anime-pagination-btn ' + (i === currentPage ? 'active' : '') + '" data-page="' + i + '">' + i + '</button>';
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) html += '<span class="anime-pagination-info">...</span>';
      html += '<button class="anime-pagination-btn" data-page="' + totalPages + '">' + totalPages + '</button>';
    }
    html += '<button class="anime-pagination-btn" ' + (currentPage === totalPages ? 'disabled' : '') + ' data-page="' + (currentPage + 1) + '">&gt;</button>';
    pagination.innerHTML = html;

    pagination.querySelectorAll('.anime-pagination-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const page = parseInt(btn.dataset.page);
        if (lastQuery) {
          searchContent(lastQuery, page);
        } else {
          loadCurrentTab(page);
        }
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // --- Search ---
  async function searchContent(query, page) {
    showLoading();
    currentPage = page || 1;
    lastQuery = query;
    pagination.innerHTML = '';

    try {
      const url = API + '/anime?q=' + encodeURIComponent(query) + '&limit=' + ITEMS_PER_PAGE + '&page=' + currentPage;
      const res = await apiFetch(url);
      const data = await res.json();
      clearStatus();

      if (data.data && data.data.length > 0) {
        renderAnimeCards(data.data);
        renderPagination(data.pagination);
      } else {
        showStatus('No results found for "' + query + '"');
      }
    } catch (e) {
      clearStatus();
      showStatus('Error searching. Please try again.');
    }
  }

  // --- Anime Detail Modal ---
  async function showAnimeDetail(id) {
    try {
      modalContent.innerHTML = '<button class="recipe-modal-close" id="animeModalClose">&times;</button><div style="padding:60px;text-align:center;"><div class="recipe-loading-spinner"></div></div>';
      modal.classList.add('open');
      document.getElementById('animeModalClose').addEventListener('click', () => modal.classList.remove('open'));

      const res = await apiFetch(API + '/anime/' + id + '/full');
      const data = await res.json();
      const item = data.data;

      // Load recommendations
      let recsHtml = '';
      try {
        const recRes = await apiFetch(API + '/anime/' + id + '/recommendations');
        const recData = await recRes.json();
        if (recData.data && recData.data.length > 0) {
          recsHtml = '<h3>Recommendations</h3><div style="display:flex;flex-wrap:wrap;gap:8px;">' +
            recData.data.slice(0, 6).map(r => {
              const entry = r.entry;
              const img = entry.images && entry.images.jpg ? entry.images.jpg.image_url : '';
              return '<div style="text-align:center;width:70px;cursor:pointer;" class="rec-anime" data-id="' + entry.mal_id + '">' +
                '<img src="' + img + '" style="width:70px;height:95px;object-fit:cover;border-radius:6px;" loading="lazy">' +
                '<div style="font-size:10px;margin-top:4px;line-height:1.2;color:var(--text-muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">' + entry.title + '</div></div>';
            }).join('') + '</div>';
        }
      } catch (e) {}

      const trailer = item.trailer && item.trailer.url ? '<p><a href="' + item.trailer.url + '" target="_blank" style="color:var(--accent);">Watch Trailer</a></p>' : '';

      modalContent.innerHTML = '<button class="recipe-modal-close" id="animeModalClose">&times;</button>' +
        '<img class="anime-modal-img" src="' + (item.images.jpg.large_image_url || item.images.jpg.image_url) + '" alt="' + item.title + '">' +
        '<div class="anime-modal-body">' +
        '<h2>' + item.title + '</h2>' +
        (item.title_japanese ? '<p style="color:var(--text-faint);font-size:14px;">' + item.title_japanese + '</p>' : '') +
        '<div class="anime-modal-meta">' +
        (item.score ? '<span class="anime-modal-score">★ ' + item.score + '</span>' : '') +
        (item.episodes ? '<span>' + item.episodes + ' episodes</span>' : '') +
        (item.status ? '<span>' + item.status + '</span>' : '') +
        (item.type ? '<span>' + item.type + '</span>' : '') +
        '</div>' +
        (item.synopsis ? '<h3>Synopsis</h3><p>' + item.synopsis + '</p>' : '') +
        (item.genres && item.genres.length > 0 ? '<h3>Genres</h3><p>' + item.genres.map(g => g.name).join(', ') + '</p>' : '') +
        (item.studios && item.studios.length > 0 ? '<h3>Studios</h3><p>' + item.studios.map(s => s.name).join(', ') + '</p>' : '') +
        trailer + recsHtml +
        (item.url ? '<p style="margin-top:16px;"><a href="' + item.url + '" target="_blank" style="color:var(--accent);">View on MyAnimeList →</a></p>' : '') +
        '</div>';

      document.getElementById('animeModalClose').addEventListener('click', () => modal.classList.remove('open'));

      modalContent.querySelectorAll('.rec-anime').forEach(el => {
        el.addEventListener('click', () => showAnimeDetail(el.dataset.id));
      });
    } catch (e) {
      console.error('Failed to load anime detail', e);
    }
  }

  // --- Autocomplete ---
  let searchDebounce;
  if (input && suggestions) {
    input.addEventListener('input', () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(async () => {
        const query = input.value.trim();
        if (query.length < 2) { suggestions.classList.remove('show'); return; }
        try {
          const url = API + '/anime?q=' + encodeURIComponent(query) + '&limit=5';
          const res = await apiFetch(url);
          const data = await res.json();
          if (data.data && data.data.length > 0) {
            suggestions.innerHTML = data.data.map(item => {
              const name = item.title;
              const highlighted = name.replace(new RegExp(query, 'i'), '<strong>' + query + '</strong>');
              return '<div class="autocomplete-item" data-name="' + name + '">' + highlighted + '</div>';
            }).join('');
            suggestions.classList.add('show');
            suggestions.querySelectorAll('.autocomplete-item').forEach(item => {
              item.addEventListener('click', () => {
                input.value = item.dataset.name;
                suggestions.classList.remove('show');
                lastQuery = '';
                searchContent(item.dataset.name);
              });
            });
          } else { suggestions.classList.remove('show'); }
        } catch (e) { suggestions.classList.remove('show'); }
      }, 300);
    });

    document.addEventListener('click', (e) => {
      if (!suggestions.contains(e.target) && e.target !== input) suggestions.classList.remove('show');
    });
  }

  // --- Hero Background ---
  async function loadHeroBackground() {
    if (!heroBg) return;
    try {
      const res = await apiFetch(API + '/top/anime?limit=1');
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        heroBg.style.backgroundImage = 'url(' + data.data[0].images.jpg.large_image_url + ')';
      }
    } catch (e) {}
  }

  // --- Tab Switching ---
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.tab;

      // Update section title
      const titles = {
        'season': 'IN SEASON',
        'popular': 'MOST POPULAR',
        'upcoming': 'UPCOMING',
        'top': 'TOP RATED'
      };
      if (sectionTitle) sectionTitle.textContent = titles[currentTab] || 'ANIME';

      // Show/hide filters for certain tabs
      const filtersEl = document.getElementById('animeFilters');
      if (filtersEl) {
        filtersEl.style.display = (currentTab === 'season') ? 'none' : 'flex';
      }

      // Update view all link
      if (viewAllLink) {
        viewAllLink.style.display = (currentTab === 'season') ? 'block' : 'none';
      }

      input.value = '';
      lastQuery = '';
      selectedGenre = '';
      filterBtns.forEach(b => b.classList.remove('active'));
      filterBtns[0].classList.add('active');

      loadCurrentTab(1);
    });
  });

  // --- View All Link ---
  if (viewAllLink) {
    viewAllLink.addEventListener('click', (e) => {
      e.preventDefault();
      // Load all items for current tab with pagination
      loadCurrentTab(1, true); // true = show all (full pagination)
    });
  }

  // --- Genre Filter Buttons ---
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedGenre = btn.dataset.genre;
      input.value = '';
      lastQuery = '';
      loadCurrentTab(1);
    });
  });

  // --- Top 10 Tab Switching (removed - just show all 10) ---
  // Weekly/Monthly tabs removed as requested

  // --- Search Button ---
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const q = input.value.trim();
      if (q) {
        filterBtns.forEach(b => b.classList.remove('active'));
        lastQuery = '';
        searchContent(q);
      }
    });
  }

  // --- Enter Key ---
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (q) {
          filterBtns.forEach(b => b.classList.remove('active'));
          lastQuery = '';
          searchContent(q);
        }
      }
    });
  }

  // --- Modal Close ---
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  // --- Init ---
  loadHeroBackground();
  loadTop10();
  loadCurrentTab(1);
})();
