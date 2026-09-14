// ---- Anime API (Jikan - MyAnimeList) — Redesigned ----
(function initAnimeExplorer() {
  const input = document.getElementById('animeInput');
  const searchBtn = document.getElementById('animeSearchBtn');
  const randomBtn = document.getElementById('animeRandomBtn');
  const grid = document.getElementById('animeGrid');
  const status = document.getElementById('animeStatus');
  const modal = document.getElementById('animeModal');
  const modalContent = document.getElementById('animeModalContent');
  const suggestions = document.getElementById('animeSuggestions');
  const pagination = document.getElementById('animePagination');
  const heroBg = document.getElementById('animeHeroBg');
  const mainTabs = document.querySelectorAll('.anime-main-tab');
  const scheduleDays = document.getElementById('scheduleDays');
  const scheduleDayBtns = document.querySelectorAll('.schedule-day-btn');
  const watchTabs = document.getElementById('watchTabs');
  const watchTabBtns = document.querySelectorAll('.watch-tab-btn');
  const sidebarGenres = document.querySelectorAll('.sidebar-gen-btn');
  const top10List = document.getElementById('top10List');
  const seasonInfo = document.getElementById('seasonInfo');

  if (!grid) return;

  const API = 'https://api.jikan.moe/v4';
  let currentTab = 'season';
  let currentWatchTab = 'recent-episodes';
  let currentScheduleDay = '';
  let selectedGenre = '';
  let currentPage = 1;
  let lastQuery = '';
  let lastSearchType = 'anime';
  const ITEMS_PER_PAGE = 18;

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
    status.innerHTML = '<div class="recipe-loading"><div class="recipe-loading-spinner"></div>Loading...</div>';
  }

  function showStatus(msg) {
    grid.innerHTML = '';
    status.innerHTML = '<div class="recipe-loading">' + msg + '</div>';
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
          return '<div class="top10-item" data-id="' + item.mal_id + '">' +
            '<span class="top10-rank ' + rankClass + '">' + (i + 1) + '</span>' +
            '<img class="top10-img" src="' + item.images.jpg.image_url + '" alt="" loading="lazy">' +
            '<div class="top10-info">' +
            '<div class="top10-title">' + item.title + '</div>' +
            (item.score ? '<div class="top10-score">★ ' + item.score + '</div>' : '') +
            '</div></div>';
        }).join('');
        top10List.querySelectorAll('.top10-item').forEach(el => {
          el.addEventListener('click', () => showAnimeDetail(el.dataset.id));
        });
      }
    } catch (e) { console.error('Top 10 load failed', e); }
  }

  // --- Load Season Info ---
  async function loadSeasonInfo() {
    if (!seasonInfo) return;
    try {
      const res = await apiFetch(API + '/seasons/now?limit=1');
      const data = await res.json();
      if (data.data && data.season) {
        const s = data.season;
        seasonInfo.innerHTML = '<div class="season-name">' + (s.season || '') + ' ' + (s.year || '') + '</div>' +
          '<div class="season-count">' + (data.pagination ? data.pagination.items.total + ' anime this season' : '') + '</div>';
      }
    } catch (e) { console.error('Season info failed', e); }
  }

  // --- Main Tab Loading ---
  async function loadCurrentTab(page) {
    showLoading();
    currentPage = page || 1;
    pagination.innerHTML = '';

    try {
      let url = '';
      let type = 'anime';

      if (currentTab === 'season') {
        url = API + '/seasons/now?limit=' + ITEMS_PER_PAGE + '&page=' + currentPage;
        if (selectedGenre) url += '&genres=' + selectedGenre;
      } else if (currentTab === 'top') {
        url = API + '/top/anime?limit=' + ITEMS_PER_PAGE + '&page=' + currentPage;
        if (selectedGenre) url += '&genres=' + selectedGenre;
      } else if (currentTab === 'airing') {
        url = API + '/top/anime?filter=airing&limit=' + ITEMS_PER_PAGE + '&page=' + currentPage;
      } else if (currentTab === 'upcoming') {
        url = API + '/top/anime?filter=upcoming&limit=' + ITEMS_PER_PAGE + '&page=' + currentPage;
      } else if (currentTab === 'manga') {
        type = 'manga';
        url = API + '/top/manga?limit=' + ITEMS_PER_PAGE + '&page=' + currentPage;
        if (selectedGenre) url += '&genres=' + selectedGenre;
      } else if (currentTab === 'characters') {
        type = 'characters';
        url = API + '/characters?limit=' + ITEMS_PER_PAGE + '&page=' + currentPage;
      } else if (currentTab === 'schedule') {
        url = API + '/schedules';
        if (currentScheduleDay) url += '?filter=' + currentScheduleDay;
      } else if (currentTab === 'watch') {
        type = 'watch';
        if (currentWatchTab === 'recent-episodes') url = API + '/watch/episodes?limit=' + ITEMS_PER_PAGE;
        else if (currentWatchTab === 'popular-episodes') url = API + '/watch/episodes/popular?limit=' + ITEMS_PER_PAGE;
        else if (currentWatchTab === 'recent-promos') url = API + '/watch/promos?limit=' + ITEMS_PER_PAGE;
        else if (currentWatchTab === 'popular-promos') url = API + '/watch/promos/popular?limit=' + ITEMS_PER_PAGE;
      }

      const res = await apiFetch(url);
      const data = await res.json();
      clearStatus();

      if (data.data && data.data.length > 0) {
        if (type === 'characters') {
          renderCharacterCards(data.data);
          renderPagination(data.pagination);
        } else if (type === 'watch') {
          renderWatchCards(data.data);
          pagination.innerHTML = '';
        } else if (type === 'manga') {
          renderMangaCards(data.data);
          renderPagination(data.pagination);
        } else if (currentTab === 'schedule') {
          renderScheduleData(data.data);
          pagination.innerHTML = '';
        } else {
          renderAnimeCards(data.data);
          renderPagination(data.pagination);
        }
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
      const score = item.score ? '<div class="anime-card-score">★ ' + item.score + '</div>' : '';
      const eps = item.episodes ? '<div style="font-size:11px;color:var(--text-faint);">' + item.episodes + ' ep</div>' : '';
      return '<div class="anime-card" data-id="' + item.mal_id + '">' +
        '<img src="' + imgUrl + '" alt="' + title + '" loading="lazy">' +
        '<div class="anime-card-body">' +
        '<div class="anime-card-title">' + title + '</div>' +
        score + eps +
        '</div></div>';
    }).join('');

    grid.querySelectorAll('.anime-card').forEach(card => {
      card.addEventListener('click', () => showAnimeDetail(card.dataset.id));
    });
  }

  // --- Render Manga Cards ---
  function renderMangaCards(list) {
    grid.innerHTML = list.map(item => {
      const imgUrl = (item.images && item.images.jpg) ? item.images.jpg.image_url : '';
      const title = item.title || 'Unknown';
      const score = item.scored ? '<div class="anime-card-score">★ ' + item.scored + '</div>' : '';
      const chaps = item.chapters ? '<div style="font-size:11px;color:var(--text-faint);">' + item.chapters + ' ch</div>' : '';
      return '<div class="anime-card" data-id="' + item.mal_id + '" data-type="manga">' +
        '<img src="' + imgUrl + '" alt="' + title + '" loading="lazy">' +
        '<div class="anime-card-body">' +
        '<div class="anime-card-title">' + title + '</div>' +
        score + chaps +
        '</div></div>';
    }).join('');

    grid.querySelectorAll('.anime-card').forEach(card => {
      card.addEventListener('click', () => showMangaDetail(card.dataset.id));
    });
  }

  // --- Render Character Cards ---
  function renderCharacterCards(characters) {
    grid.innerHTML = characters.map(char => {
      const imgUrl = (char.images && char.images.jpg) ? char.images.jpg.image_url : '';
      return '<div class="anime-card character-card" data-id="' + char.mal_id + '">' +
        '<img src="' + imgUrl + '" alt="' + (char.name || '') + '" loading="lazy">' +
        '<div class="anime-card-body">' +
        '<div class="anime-card-title">' + (char.name || '') + '</div>' +
        (char.favorites ? '<div class="anime-card-score">❤ ' + char.favorites.toLocaleString() + '</div>' : '') +
        '</div></div>';
    }).join('');

    grid.querySelectorAll('.character-card').forEach(card => {
      card.addEventListener('click', () => showCharacterDetail(card.dataset.id));
    });
  }

  // --- Render Watch Cards ---
  function renderWatchCards(list) {
    grid.innerHTML = list.map(item => {
      const ep = item.episode || '';
      const title = (item.title || item.anime && item.anime.title) || 'Unknown';
      const animeTitle = item.anime ? item.anime.title : '';
      let thumbUrl = '';
      if (item.trailer && item.trailer.images) {
        thumbUrl = item.trailer.images.image_url || item.trailer.maximum_image_url || '';
      }
      if (!thumbUrl && item.anime && item.anime.images) {
        thumbUrl = item.anime.images.jpg.image_url || '';
      }
      const isPromo = !!item.trailer;

      return '<div class="watch-card" data-url="' + (ep.url || item.trailer && item.trailer.url || '') + '">' +
        '<div class="watch-card-thumb">' +
        (thumbUrl ? '<img src="' + thumbUrl + '" alt="" loading="lazy">' : '<div style="background:var(--bg-elevated);width:100%;height:100%;"></div>') +
        '<div class="watch-card-play"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>' +
        '</div>' +
        '<div class="watch-card-body">' +
        '<div class="watch-card-title">' + (isPromo ? title : animeTitle) + '</div>' +
        '<div class="watch-card-ep">' + (isPromo ? 'Promo' : (ep.title || 'Episode')) + '</div>' +
        '</div></div>';
    }).join('');

    grid.querySelectorAll('.watch-card').forEach(card => {
      card.addEventListener('click', () => {
        const url = card.dataset.url;
        if (url) window.open(url, '_blank');
      });
    });
  }

  // --- Render Schedule Data ---
  function renderScheduleData(days) {
    let html = '';
    days.forEach(day => {
      if (!day.data || day.data.length === 0) return;
      html += '<div style="margin-bottom:28px;">';
      html += '<h3 style="font-family:var(--font-display);font-size:18px;font-weight:600;margin-bottom:14px;color:var(--text);">' + (day.filter || day.day || '') + '</h3>';
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;">';
      day.data.forEach(item => {
        const imgUrl = (item.images && item.images.jpg) ? item.images.jpg.image_url : '';
        html += '<div class="anime-card" data-id="' + item.mal_id + '">' +
          '<img src="' + imgUrl + '" alt="' + (item.title || '') + '" loading="lazy">' +
          '<div class="anime-card-body">' +
          '<div class="anime-card-title">' + (item.title || '') + '</div>' +
          (item.score ? '<div class="anime-card-score">★ ' + item.score + '</div>' : '') +
          '</div></div>';
      });
      html += '</div></div>';
    });
    grid.innerHTML = html;
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
    html += '<button class="anime-pagination-btn" ' + (currentPage === 1 ? 'disabled' : '') + ' data-page="' + (currentPage - 1) + '">← Prev</button>';

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
    html += '<button class="anime-pagination-btn" ' + (currentPage === totalPages ? 'disabled' : '') + ' data-page="' + (currentPage + 1) + '">Next →</button>';
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
      let url;
      if (currentTab === 'characters') {
        url = API + '/characters?q=' + encodeURIComponent(query) + '&limit=' + ITEMS_PER_PAGE + '&page=' + currentPage;
        lastSearchType = 'characters';
      } else if (currentTab === 'manga') {
        url = API + '/manga?q=' + encodeURIComponent(query) + '&limit=' + ITEMS_PER_PAGE + '&page=' + currentPage;
        lastSearchType = 'manga';
      } else {
        url = API + '/anime?q=' + encodeURIComponent(query) + '&limit=' + ITEMS_PER_PAGE + '&page=' + currentPage;
        lastSearchType = 'anime';
      }

      const res = await apiFetch(url);
      const data = await res.json();
      clearStatus();

      if (data.data && data.data.length > 0) {
        if (lastSearchType === 'characters') {
          renderCharacterCards(data.data);
        } else if (lastSearchType === 'manga') {
          renderMangaCards(data.data);
        } else {
          renderAnimeCards(data.data);
        }
        renderPagination(data.pagination);
      } else {
        showStatus('No results found for "' + query + '"');
      }
    } catch (e) {
      clearStatus();
      showStatus('Error searching. Please try again.');
    }
  }

  // --- Random ---
  async function getRandom() {
    showLoading();
    pagination.innerHTML = '';
    try {
      let url;
      if (currentTab === 'characters') {
        url = API + '/characters?limit=' + ITEMS_PER_PAGE;
      } else if (currentTab === 'manga') {
        url = API + '/manga?limit=' + ITEMS_PER_PAGE;
      } else {
        url = API + '/anime?limit=' + ITEMS_PER_PAGE;
      }
      const res = await apiFetch(url);
      const data = await res.json();
      clearStatus();
      if (data.data && data.data.length > 0) {
        const shuffled = data.data.sort(() => 0.5 - Math.random());
        if (currentTab === 'characters') renderCharacterCards(shuffled);
        else if (currentTab === 'manga') renderMangaCards(shuffled);
        else renderAnimeCards(shuffled);
      }
    } catch (e) {
      clearStatus();
      showStatus('Error getting random results.');
    }
  }

  // --- Anime Detail Modal ---
  async function showAnimeDetail(id) {
    try {
      modalContent.innerHTML = '<button class="recipe-modal-close" id="animeModalClose">×</button><div style="padding:60px;text-align:center;"><div class="recipe-loading-spinner"></div></div>';
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

      // Load characters
      let charsHtml = '';
      try {
        const charRes = await apiFetch(API + '/anime/' + id + '/characters');
        const charData = await charRes.json();
        if (charData.data && charData.data.length > 0) {
          charsHtml = '<h3>Characters</h3><div style="display:flex;flex-wrap:wrap;gap:8px;">' +
            charData.data.slice(0, 8).map(c => {
              const char = c.character;
              const img = char.images && char.images.jpg ? char.images.jpg.image_url : '';
              return '<div style="text-align:center;width:60px;">' +
                '<img src="' + img + '" style="width:60px;height:80px;object-fit:cover;border-radius:6px;" loading="lazy">' +
                '<div style="font-size:10px;margin-top:4px;line-height:1.2;color:var(--text-muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">' + char.name + '</div>' +
                '<div style="font-size:9px;color:var(--text-faint);">' + (c.role || '') + '</div></div>';
            }).join('') + '</div>';
        }
      } catch (e) {}

      // Load staff
      let staffHtml = '';
      try {
        const staffRes = await apiFetch(API + '/anime/' + id + '/staff');
        const staffData = await staffRes.json();
        if (staffData.data && staffData.data.length > 0) {
          staffHtml = '<h3>Staff</h3><div style="font-size:13px;color:var(--text-muted);line-height:1.8;">' +
            staffData.data.slice(0, 6).map(s => {
              const name = s.person ? s.person.name : '';
              const positions = s.positions ? s.positions.join(', ') : '';
              return '<div><strong style="color:var(--text);">' + name + '</strong> — ' + positions + '</div>';
            }).join('') + '</div>';
        }
      } catch (e) {}

      // Load statistics
      let statsHtml = '';
      try {
        const statsRes = await apiFetch(API + '/anime/' + id + '/statistics');
        const statsData = await statsRes.json();
        if (statsData.data && statsData.data.scores) {
          const scores = statsData.data.scores;
          const maxVotes = Math.max(...scores.map(s => s.votes));
          statsHtml = '<h3>Score Distribution</h3><div style="display:flex;flex-direction:column;gap:4px;">';
          scores.forEach(s => {
            const pct = maxVotes > 0 ? (s.votes / maxVotes * 100) : 0;
            statsHtml += '<div style="display:flex;align-items:center;gap:8px;font-size:12px;">' +
              '<span style="width:20px;color:var(--text-muted);">' + s.score + '</span>' +
              '<div style="flex:1;height:8px;background:var(--bg-elevated);border-radius:4px;overflow:hidden;">' +
              '<div style="width:' + pct + '%;height:100%;background:var(--accent);border-radius:4px;"></div></div>' +
              '<span style="width:50px;text-align:right;color:var(--text-faint);font-size:11px;">' + s.votes.toLocaleString() + '</span></div>';
          });
          statsHtml += '</div>';
        }
      } catch (e) {}

      // Load relations
      let relationsHtml = '';
      try {
        const relRes = await apiFetch(API + '/anime/' + id + '/relations');
        const relData = await relRes.json();
        if (relData.data && relData.data.length > 0) {
          relationsHtml = '<h3>Relations</h3>';
          relData.data.forEach(rel => {
            relationsHtml += '<div style="margin-bottom:8px;"><span style="font-size:12px;color:var(--accent);font-weight:600;">' + (rel.relation || '') + ':</span> ' +
              rel.entry.map(e => '<span style="font-size:13px;color:var(--text-muted);">' + e.name + '</span>').join(', ') + '</div>';
          });
        }
      } catch (e) {}

      // Load external links
      let externalsHtml = '';
      try {
        const extRes = await apiFetch(API + '/anime/' + id + '/external');
        const extData = await extRes.json();
        if (extData.data && extData.data.length > 0) {
          externalsHtml = '<h3>External Links</h3><div style="display:flex;flex-wrap:wrap;gap:8px;">' +
            extData.data.slice(0, 8).map(e =>
              '<a href="' + e.url + '" target="_blank" style="padding:6px 12px;border:1px solid var(--border);border-radius:6px;font-size:12px;color:var(--text-muted);transition:all 0.2s;">' + (e.name || e.url) + '</a>'
            ).join('') + '</div>';
        }
      } catch (e) {}

      const trailer = item.trailer && item.trailer.url ? '<p><a href="' + item.trailer.url + '" target="_blank" style="color:var(--accent);">Watch Trailer</a></p>' : '';
      const streamInfo = item.streaming && item.streaming.length > 0 ? '<h3>Streaming</h3><div style="display:flex;flex-wrap:wrap;gap:8px;">' + item.streaming.map(s => '<a href="' + s.url + '" target="_blank" style="padding:6px 12px;border:1px solid var(--border);border-radius:6px;font-size:12px;color:var(--text-muted);">' + s.name + '</a>').join('') + '</div>' : '';

      modalContent.innerHTML = '<button class="recipe-modal-close" id="animeModalClose">×</button>' +
        '<img class="anime-modal-img" src="' + (item.images.jpg.large_image_url || item.images.jpg.image_url) + '" alt="' + item.title + '">' +
        '<div class="anime-modal-body">' +
        '<h2>' + item.title + '</h2>' +
        (item.title_japanese ? '<p style="color:var(--text-faint);font-size:14px;">' + item.title_japanese + '</p>' : '') +
        '<div class="anime-modal-meta">' +
        (item.score ? '<span class="anime-modal-score">★ ' + item.score + '</span>' : '') +
        (item.rank ? '<span>#' + item.rank + '</span>' : '') +
        (item.popularity ? '<span>Popularity #' + item.popularity + '</span>' : '') +
        (item.episodes ? '<span>' + item.episodes + ' episodes</span>' : '') +
        (item.status ? '<span>' + item.status + '</span>' : '') +
        (item.rating ? '<span>' + item.rating + '</span>' : '') +
        (item.duration ? '<span>' + item.duration + '</span>' : '') +
        (item.source ? '<span>' + item.source + '</span>' : '') +
        '</div>' +
        (item.synopsis ? '<h3>Synopsis</h3><p>' + item.synopsis + '</p>' : '') +
        (item.genres && item.genres.length > 0 ? '<h3>Genres</h3><p>' + item.genres.map(g => g.name).join(', ') + '</p>' : '') +
        (item.studios && item.studios.length > 0 ? '<h3>Studios</h3><p>' + item.studios.map(s => s.name).join(', ') + '</p>' : '') +
        (item.producers && item.producers.length > 0 ? '<h3>Producers</h3><p>' + item.producers.map(p => p.name).join(', ') + '</p>' : '') +
        (item.themes && item.themes.length > 0 ? '<h3>Themes</h3><p>' + item.themes.map(t => t.name).join(', ') + '</p>' : '') +
        trailer + streamInfo +
        statsHtml + charsHtml + staffHtml + relationsHtml + recsHtml + externalsHtml +
        (item.url ? '<p style="margin-top:16px;"><a href="' + item.url + '" target="_blank" style="color:var(--accent);">View on MyAnimeList →</a></p>' : '') +
        '</div>';

      document.getElementById('animeModalClose').addEventListener('click', () => modal.classList.remove('open'));

      // Bind recommendation clicks
      modalContent.querySelectorAll('.rec-anime').forEach(el => {
        el.addEventListener('click', () => showAnimeDetail(el.dataset.id));
      });
    } catch (e) {
      console.error('Failed to load anime detail', e);
    }
  }

  // --- Manga Detail Modal ---
  async function showMangaDetail(id) {
    try {
      modalContent.innerHTML = '<button class="recipe-modal-close" id="animeModalClose">×</button><div style="padding:60px;text-align:center;"><div class="recipe-loading-spinner"></div></div>';
      modal.classList.add('open');
      document.getElementById('animeModalClose').addEventListener('click', () => modal.classList.remove('open'));

      const res = await apiFetch(API + '/manga/' + id + '/full');
      const data = await res.json();
      const item = data.data;

      // Characters
      let charsHtml = '';
      try {
        const charRes = await apiFetch(API + '/manga/' + id + '/characters');
        const charData = await charRes.json();
        if (charData.data && charData.data.length > 0) {
          charsHtml = '<h3>Characters</h3><div style="display:flex;flex-wrap:wrap;gap:8px;">' +
            charData.data.slice(0, 8).map(c => {
              const char = c.character;
              const img = char.images && char.images.jpg ? char.images.jpg.image_url : '';
              return '<div style="text-align:center;width:60px;">' +
                '<img src="' + img + '" style="width:60px;height:80px;object-fit:cover;border-radius:6px;" loading="lazy">' +
                '<div style="font-size:10px;margin-top:4px;line-height:1.2;color:var(--text-muted);">' + char.name + '</div></div>';
            }).join('') + '</div>';
        }
      } catch (e) {}

      // Recommendations
      let recsHtml = '';
      try {
        const recRes = await apiFetch(API + '/manga/' + id + '/recommendations');
        const recData = await recRes.json();
        if (recData.data && recData.data.length > 0) {
          recsHtml = '<h3>Recommendations</h3><div style="display:flex;flex-wrap:wrap;gap:8px;">' +
            recData.data.slice(0, 6).map(r => {
              const entry = r.entry;
              const img = entry.images && entry.images.jpg ? entry.images.jpg.image_url : '';
              return '<div style="text-align:center;width:70px;cursor:pointer;" class="rec-manga" data-id="' + entry.mal_id + '">' +
                '<img src="' + img + '" style="width:70px;height:95px;object-fit:cover;border-radius:6px;" loading="lazy">' +
                '<div style="font-size:10px;margin-top:4px;line-height:1.2;color:var(--text-muted);">' + entry.title + '</div></div>';
            }).join('') + '</div>';
        }
      } catch (e) {}

      // Relations
      let relationsHtml = '';
      try {
        const relRes = await apiFetch(API + '/manga/' + id + '/relations');
        const relData = await relRes.json();
        if (relData.data && relData.data.length > 0) {
          relationsHtml = '<h3>Relations</h3>';
          relData.data.forEach(rel => {
            relationsHtml += '<div style="margin-bottom:8px;"><span style="font-size:12px;color:var(--accent);font-weight:600;">' + (rel.relation || '') + ':</span> ' +
              rel.entry.map(e => '<span style="font-size:13px;color:var(--text-muted);">' + e.name + '</span>').join(', ') + '</div>';
          });
        }
      } catch (e) {}

      // Statistics
      let statsHtml = '';
      try {
        const statsRes = await apiFetch(API + '/manga/' + id + '/statistics');
        const statsData = await statsRes.json();
        if (statsData.data && statsData.data.scores) {
          const scores = statsData.data.scores;
          const maxVotes = Math.max(...scores.map(s => s.votes));
          statsHtml = '<h3>Score Distribution</h3><div style="display:flex;flex-direction:column;gap:4px;">';
          scores.forEach(s => {
            const pct = maxVotes > 0 ? (s.votes / maxVotes * 100) : 0;
            statsHtml += '<div style="display:flex;align-items:center;gap:8px;font-size:12px;">' +
              '<span style="width:20px;color:var(--text-muted);">' + s.score + '</span>' +
              '<div style="flex:1;height:8px;background:var(--bg-elevated);border-radius:4px;overflow:hidden;">' +
              '<div style="width:' + pct + '%;height:100%;background:var(--accent);border-radius:4px;"></div></div>' +
              '<span style="width:50px;text-align:right;color:var(--text-faint);font-size:11px;">' + s.votes.toLocaleString() + '</span></div>';
          });
          statsHtml += '</div>';
        }
      } catch (e) {}

      modalContent.innerHTML = '<button class="recipe-modal-close" id="animeModalClose">×</button>' +
        '<img class="anime-modal-img" src="' + (item.images.jpg.large_image_url || item.images.jpg.image_url) + '" alt="' + item.title + '">' +
        '<div class="anime-modal-body">' +
        '<h2>' + item.title + '</h2>' +
        (item.title_japanese ? '<p style="color:var(--text-faint);font-size:14px;">' + item.title_japanese + '</p>' : '') +
        '<div class="anime-modal-meta">' +
        (item.scored ? '<span class="anime-modal-score">★ ' + item.scored + '</span>' : '') +
        (item.rank ? '<span>#' + item.rank + '</span>' : '') +
        (item.popularity ? '<span>Popularity #' + item.popularity + '</span>' : '') +
        (item.chapters ? '<span>' + item.chapters + ' chapters</span>' : '') +
        (item.volumes ? '<span>' + item.volumes + ' volumes</span>' : '') +
        (item.status ? '<span>' + item.status + '</span>' : '') +
        (item.type ? '<span>' + item.type + '</span>' : '') +
        '</div>' +
        (item.synopsis ? '<h3>Synopsis</h3><p>' + item.synopsis + '</p>' : '') +
        (item.genres && item.genres.length > 0 ? '<h3>Genres</h3><p>' + item.genres.map(g => g.name).join(', ') + '</p>' : '') +
        (item.authors && item.authors.length > 0 ? '<h3>Authors</h3><p>' + item.authors.map(a => a.name).join(', ') + '</p>' : '') +
        (item.serializations && item.serializations.length > 0 ? '<h3>Serializations</h3><p>' + item.serializations.map(s => s.name).join(', ') + '</p>' : '') +
        (item.themes && item.themes.length > 0 ? '<h3>Themes</h3><p>' + item.themes.map(t => t.name).join(', ') + '</p>' : '') +
        statsHtml + charsHtml + relationsHtml + recsHtml +
        (item.url ? '<p style="margin-top:16px;"><a href="' + item.url + '" target="_blank" style="color:var(--accent);">View on MyAnimeList →</a></p>' : '') +
        '</div>';

      document.getElementById('animeModalClose').addEventListener('click', () => modal.classList.remove('open'));

      modalContent.querySelectorAll('.rec-manga').forEach(el => {
        el.addEventListener('click', () => showMangaDetail(el.dataset.id));
      });
    } catch (e) {
      console.error('Failed to load manga detail', e);
    }
  }

  // --- Character Detail Modal ---
  async function showCharacterDetail(id) {
    try {
      modalContent.innerHTML = '<button class="recipe-modal-close" id="animeModalClose">×</button><div style="padding:60px;text-align:center;"><div class="recipe-loading-spinner"></div></div>';
      modal.classList.add('open');
      document.getElementById('animeModalClose').addEventListener('click', () => modal.classList.remove('open'));

      const res = await apiFetch(API + '/characters/' + id + '/full');
      const data = await res.json();
      const char = data.data;

      // Voice actors
      let vaHtml = '';
      try {
        const vaRes = await apiFetch(API + '/characters/' + id + '/voices');
        const vaData = await vaRes.json();
        if (vaData.data && vaData.data.length > 0) {
          vaHtml = '<h3>Voice Actors</h3><div style="display:flex;flex-wrap:wrap;gap:8px;">' +
            vaData.data.slice(0, 8).map(va => {
              const person = va.person;
              const img = person.images && person.images.jpg ? person.images.jpg.image_url : '';
              const lang = va.language || '';
              return '<div style="text-align:center;width:60px;">' +
                '<img src="' + img + '" style="width:60px;height:80px;object-fit:cover;border-radius:6px;" loading="lazy">' +
                '<div style="font-size:10px;margin-top:4px;color:var(--text-muted);">' + person.name + '</div>' +
                '<div style="font-size:9px;color:var(--text-faint);">' + lang + '</div></div>';
            }).join('') + '</div>';
        }
      } catch (e) {}

      // Anime appearances
      let animeHtml = '';
      if (char.anime && char.anime.length > 0) {
        animeHtml = '<h3>Anime Appearances</h3><div style="display:flex;flex-wrap:wrap;gap:8px;">' +
          char.anime.slice(0, 10).map(a => {
            const role = a.role || '';
            return '<div style="text-align:center;width:70px;cursor:pointer;" class="va-anime" data-id="' + a.anime.mal_id + '">' +
              '<img src="' + (a.anime.images && a.anime.images.jpg ? a.anime.images.jpg.image_url : '') + '" style="width:70px;height:95px;object-fit:cover;border-radius:6px;" loading="lazy">' +
              '<div style="font-size:10px;margin-top:4px;line-height:1.2;color:var(--text-muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">' + a.anime.name + '</div>' +
              '<div style="font-size:9px;color:var(--accent);">' + role + '</div></div>';
          }).join('') + '</div>';
      }

      // Manga appearances
      let mangaHtml = '';
      if (char.manga && char.manga.length > 0) {
        mangaHtml = '<h3>Manga Appearances</h3><div style="display:flex;flex-wrap:wrap;gap:8px;">' +
          char.manga.slice(0, 10).map(m => {
            const role = m.role || '';
            return '<div style="text-align:center;width:70px;cursor:pointer;" class="va-manga" data-id="' + m.manga.mal_id + '">' +
              '<img src="' + (m.manga.images && m.manga.images.jpg ? m.manga.images.jpg.image_url : '') + '" style="width:70px;height:95px;object-fit:cover;border-radius:6px;" loading="lazy">' +
              '<div style="font-size:10px;margin-top:4px;line-height:1.2;color:var(--text-muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">' + m.manga.name + '</div>' +
              '<div style="font-size:9px;color:var(--accent);">' + role + '</div></div>';
          }).join('') + '</div>';
      }

      modalContent.innerHTML = '<button class="recipe-modal-close" id="animeModalClose">×</button>' +
        '<img class="anime-modal-img" src="' + (char.images.jpg.image_url || '') + '" alt="' + char.name + '">' +
        '<div class="anime-modal-body">' +
        '<h2>' + char.name + '</h2>' +
        (char.name_kanji ? '<p style="color:var(--text-faint);font-size:14px;">' + char.name_kanji + '</p>' : '') +
        '<div class="anime-modal-meta">' +
        (char.favorites ? '<span class="anime-modal-score">❤ ' + char.favorites.toLocaleString() + ' favorites</span>' : '') +
        '</div>' +
        (char.about ? '<h3>About</h3><p>' + char.about.replace(/\n/g, '<br>') + '</p>' : '') +
        vaHtml + animeHtml + mangaHtml +
        (char.url ? '<p style="margin-top:16px;"><a href="' + char.url + '" target="_blank" style="color:var(--accent);">View on MyAnimeList →</a></p>' : '') +
        '</div>';

      document.getElementById('animeModalClose').addEventListener('click', () => modal.classList.remove('open'));

      // Bind anime/manga clicks
      modalContent.querySelectorAll('.va-anime').forEach(el => {
        el.addEventListener('click', () => { modal.classList.remove('open'); setTimeout(() => showAnimeDetail(el.dataset.id), 300); });
      });
      modalContent.querySelectorAll('.va-manga').forEach(el => {
        el.addEventListener('click', () => { modal.classList.remove('open'); setTimeout(() => showMangaDetail(el.dataset.id), 300); });
      });
    } catch (e) {
      console.error('Failed to load character detail', e);
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
          let url;
          if (currentTab === 'characters') url = API + '/characters?q=' + encodeURIComponent(query) + '&limit=5';
          else if (currentTab === 'manga') url = API + '/manga?q=' + encodeURIComponent(query) + '&limit=5';
          else url = API + '/anime?q=' + encodeURIComponent(query) + '&limit=5';

          const res = await apiFetch(url);
          const data = await res.json();
          if (data.data && data.data.length > 0) {
            suggestions.innerHTML = data.data.map(item => {
              const name = currentTab === 'characters' ? item.name : item.title;
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

  // --- Main Tab Switching ---
  mainTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      mainTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.tab;

      // Show/hide schedule days
      if (scheduleDays) scheduleDays.style.display = currentTab === 'schedule' ? 'flex' : 'none';
      // Show/hide watch tabs
      if (watchTabs) watchTabs.style.display = currentTab === 'watch' ? 'flex' : 'none';

      // Update search placeholder
      if (input) {
        if (currentTab === 'characters') input.placeholder = 'Search characters...';
        else if (currentTab === 'manga') input.placeholder = 'Search manga...';
        else input.placeholder = 'Search anime...';
      }

      // Show/hide random button
      if (randomBtn) {
        randomBtn.style.display = (currentTab === 'schedule' || currentTab === 'watch') ? 'none' : 'flex';
      }

      input.value = '';
      lastQuery = '';
      selectedGenre = '';
      sidebarGenres.forEach(b => b.classList.remove('active'));
      sidebarGenres[0].classList.add('active');

      loadCurrentTab(1);
    });
  });

  // --- Schedule Day Buttons ---
  scheduleDayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      scheduleDayBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentScheduleDay = btn.dataset.day;
      loadCurrentTab(1);
    });
  });

  // --- Watch Tab Buttons ---
  watchTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      watchTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentWatchTab = btn.dataset.watch;
      loadCurrentTab(1);
    });
  });

  // --- Sidebar Genre Buttons ---
  sidebarGenres.forEach(btn => {
    btn.addEventListener('click', () => {
      sidebarGenres.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedGenre = btn.dataset.genre;
      input.value = '';
      lastQuery = '';
      loadCurrentTab(1);
    });
  });

  // --- Search Button ---
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const q = input.value.trim();
      if (q) {
        sidebarGenres.forEach(b => b.classList.remove('active'));
        lastQuery = '';
        searchContent(q);
      }
    });
  }

  // --- Random Button ---
  if (randomBtn) {
    randomBtn.addEventListener('click', () => {
      input.value = '';
      lastQuery = '';
      sidebarGenres.forEach(b => b.classList.remove('active'));
      sidebarGenres[0].classList.add('active');
      selectedGenre = '';
      getRandom();
    });
  }

  // --- Enter Key ---
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (q) {
          sidebarGenres.forEach(b => b.classList.remove('active'));
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
  loadSeasonInfo();
  loadCurrentTab(1);
})();
