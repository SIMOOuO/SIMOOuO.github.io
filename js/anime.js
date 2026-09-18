// ============================================
// ANIME PAGE — Now backed by @mateoaranda/jikanjs (via esm.sh)
// ============================================

// Local browser port of @mateoaranda/jikanjs.
// The original library depends on Node's `https` module which the browser
// doesn't provide. `lib/util/Request.js` here re-implements the same class
// interface using the browser's native fetch(). All jikanjs function names,
// argument order and defaults are preserved (see js/lib/jikan.js).
import jikanjs from './lib/jikan.js';

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
  const top10List = document.getElementById('top10List');
  const sectionTitle = document.getElementById('sectionTitle');
  const viewAllLink = document.getElementById('viewAllLink');

  if (!grid) return;

  let currentTab = 'season';
  let currentPage = 1;
  let lastQuery = '';
  let fullMode = false;
  const ITEMS_PER_PAGE = 20;

  // Remembers the last action so the Refresh button (shown on error) can retry it.
  let lastAction = null; // () => Promise<void>

  const mainLayout = document.querySelector('.anime-main-layout');
  const sidebarRight = document.querySelector('.anime-sidebar-right');

  function applyViewMode() {
    if (sidebarRight) sidebarRight.style.display = fullMode ? 'none' : '';
    if (viewAllLink) viewAllLink.style.display = fullMode ? 'none' : '';
    if (mainLayout) mainLayout.classList.toggle('full-width', fullMode);
  }

  // --- Throttled + retrying jikanjs wrapper ---
  // Jikan is rate-limited to ~3 req/sec. We serialize calls with a 400ms gap
  // and retry once on transient errors (429/504 from MAL upstream).
  let apiChain = Promise.resolve();
  let lastCallAt = 0;

  function callJikan(method, args) {
    const run = async () => {
      const now = Date.now();
      const gap = now - lastCallAt;
      if (gap < 400) await new Promise(r => setTimeout(r, 400 - gap));
      lastCallAt = Date.now();
      try {
        return await jikanjs[method](...args);
      } catch (e) {
        // Retry once after a longer wait — 504/429 are usually transient
        await new Promise(r => setTimeout(r, 1500));
        lastCallAt = Date.now();
        return await jikanjs[method](...args);
      }
    };
    // Serialize to guarantee the 400ms spacing even under concurrent calls
    const next = apiChain.then(run, run);
    apiChain = next.catch(() => {}); // don't let one failure poison the chain
    return next;
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

  // Renders an error message with a Refresh button that re-runs `lastAction`.
  function showError(msg) {
    grid.innerHTML = '';
    pagination.innerHTML = '';
    status.innerHTML =
      '<div class="anime-error-box">' +
        '<div class="anime-error-msg">' + msg + '</div>' +
        '<button type="button" id="animeRefreshBtn" class="anime-refresh-btn">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/></svg>' +
          'Refresh' +
        '</button>' +
      '</div>';
    const btn = document.getElementById('animeRefreshBtn');
    if (btn) btn.addEventListener('click', () => { if (lastAction) lastAction(); });
  }

  // --- Top 10 Sidebar ---
  async function loadTop10() {
    if (!top10List) return;
    try {
      // jikanjs.loadTop('anime') — returns first page (25 items); we slice to 10
      const data = await callJikan('loadTop', ['anime']);
      const list = (data && data.data) ? data.data.slice(0, 10) : [];
      if (list.length > 0) {
        top10List.innerHTML = list.map((item, i) => {
          const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
          const type = item.type || 'TV';
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
          el.addEventListener('click', () => {
            const img = el.querySelector('.top10-img');
            const titleEl = el.querySelector('.top10-title');
            showAnimeDetail(el.dataset.id, img ? img.src : '', titleEl ? titleEl.textContent : '');
          });
        });
      }
    } catch (e) { console.error('Top 10 load failed', e); }
  }

  // --- Route each tab to the right jikanjs call ---
  function fetchForCurrentTab(page) {
    if (currentTab === 'season')   return callJikan('loadCurrentSeason',  [page]);
    if (currentTab === 'upcoming') return callJikan('loadUpcomingSeason', [page]);
    if (currentTab === 'popular')  return callJikan('loadTop', ['anime', page, undefined, 'bypopularity']);
    if (currentTab === 'top')      return callJikan('loadTop', ['anime', page]);
    return callJikan('loadTop', ['anime', page]);
  }

  // --- Load Current Tab (server-side pagination via jikanjs) ---
  async function loadCurrentTab(page, showAll) {
    // Remember this call so the Refresh button can retry the exact same request.
    lastAction = () => loadCurrentTab(page, showAll);

    showLoading();
    currentPage = page || 1;
    pagination.innerHTML = '';

    if (showAll === true) fullMode = true;
    applyViewMode();

    try {
      const data = await fetchForCurrentTab(currentPage);
      clearStatus();
      if (data && data.data && data.data.length > 0) {
        renderAnimeCards(data.data);
        renderPagination(data.pagination);
      } else {
        showStatus('No results found');
      }
    } catch (e) {
      showError('Failed to load. The Jikan API may be temporarily unavailable.');
      console.error(e);
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
      card.addEventListener('click', () => {
        const imgEl = card.querySelector('.anime-card-img-wrap img');
        const titleEl = card.querySelector('.anime-card-title');
        const imgUrl = imgEl ? imgEl.src : '';
        const title = titleEl ? titleEl.textContent : 'Unknown';
        showAnimeDetail(card.dataset.id, imgUrl, title);
      });
    });
  }

  // --- Pagination (server-side via Jikan's pagination.last_visible_page) ---
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
    // Remember for the Refresh button.
    lastAction = () => searchContent(query, page);

    showLoading();
    currentPage = page || 1;
    lastQuery = query;
    pagination.innerHTML = '';

    try {
      // jikanjs.search(type, query, limit, params) — pass page via params.
      const data = await callJikan('search', ['anime', query, 25, { page: currentPage, sfw: true }]);
      clearStatus();
      if (data && data.data && data.data.length > 0) {
        renderAnimeCards(data.data);
        renderPagination(data.pagination);
      } else {
        showStatus('No results found for "' + query + '"');
      }
    } catch (e) {
      showError('Search failed. The Jikan API may be temporarily unavailable.');
      console.error(e);
    }
  }

  // --- Anime Detail Modal ---
  async function showAnimeDetail(id, fallbackImg, fallbackTitle) {
    try {
      modalContent.innerHTML = '<button class="recipe-modal-close" id="animeModalClose">&times;</button><div style="padding:60px;text-align:center;"><div class="recipe-loading-spinner"></div></div>';
      modal.classList.add('open');
      document.getElementById('animeModalClose').addEventListener('click', () => modal.classList.remove('open'));

      // jikanjs.loadAnime(id, 'full') maps to /anime/{id}/full
      const data = await callJikan('loadAnime', [id, 'full']);
      const item = data && data.data;
      if (!item) throw new Error('no data');

      // Recommendations — jikanjs.loadAnime(id, 'recommendations')
      let recsHtml = '';
      try {
        const recData = await callJikan('loadAnime', [id, 'recommendations']);
        if (recData && recData.data && recData.data.length > 0) {
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
      // Show fallback: picture and name from the card
      const imgSrc = fallbackImg || '';
      const title = fallbackTitle || 'Unknown Anime';
      modalContent.innerHTML = '<button class="recipe-modal-close" id="animeModalClose">&times;</button>' +
        (imgSrc ? '<img class="anime-modal-img" src="' + imgSrc + '" alt="' + title + '">' : '') +
        '<div class="anime-modal-body">' +
        '<h2>' + title + '</h2>' +
        '<p style="color:var(--accent);margin-top:12px;">Failed to load full details. The API may be temporarily unavailable.</p>' +
        '<p style="margin-top:16px;"><a href="https://myanimelist.net/anime/' + id + '" target="_blank" style="color:var(--accent);">View on MyAnimeList →</a></p>' +
        '</div>';
      document.getElementById('animeModalClose').addEventListener('click', () => modal.classList.remove('open'));
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
          const data = await callJikan('search', ['anime', query, 5, {}]);
          if (data && data.data && data.data.length > 0) {
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
      const data = await callJikan('loadTop', ['anime']);
      if (data && data.data && data.data.length > 0) {
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

      const titles = { 'season': 'IN SEASON', 'popular': 'MOST POPULAR', 'upcoming': 'UPCOMING', 'top': 'TOP RATED' };
      if (sectionTitle) sectionTitle.textContent = titles[currentTab] || 'ANIME';

      fullMode = (currentTab !== 'season');

      input.value = '';
      lastQuery = '';

      loadCurrentTab(1);
    });
  });

  // --- View All Link ---
  if (viewAllLink) {
    viewAllLink.addEventListener('click', (e) => {
      e.preventDefault();
      loadCurrentTab(1, true);
    });
  }

  // --- Search Button ---
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const q = input.value.trim();
      if (q) {
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
  fullMode = false;
  applyViewMode();
  loadHeroBackground();
  loadTop10();
  loadCurrentTab(1);
})();
