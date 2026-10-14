// ============================================
// ANIME PAGE — Powered by AniList GraphQL API
// https://anilist.co/graphiql
// ============================================

const ANILIST_URL = 'https://graphql.anilist.co';

// --- Helpers ---
function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 1 && month <= 3) return 'WINTER';
  if (month >= 4 && month <= 6) return 'SPRING';
  if (month >= 7 && month <= 9) return 'SUMMER';
  return 'FALL';
}

function getUpcomingSeason() {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  if (month >= 1 && month <= 3) return { season: 'SPRING', year };
  if (month >= 4 && month <= 6) return { season: 'SUMMER', year };
  if (month >= 7 && month <= 9) return { season: 'FALL', year };
  return { season: 'WINTER', year: year + 1 };
}

async function anilistQuery(query, variables) {
  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

// --- GraphQL fragments ---
const CARD_FIELDS = `
  id idMal
  title { romaji english native }
  coverImage { large extraLarge color }
  averageScore meanScore popularity
  episodes duration type status
  season seasonYear
  startDate { year month day }
  genres
  studios { nodes { id name } }
`;

// AniList caps `total` at 5000 on page 1. We track the real last page
// by watching when results stop or hasNextPage becomes false.
let _realLastPage = null;

const DETAIL_FIELDS = `
  id idMal
  title { romaji english native }
  coverImage { extraLarge large color }
  bannerImage
  description(asHtml: false)
  averageScore meanScore popularity favourites
  episodes duration type status
  season seasonYear
  startDate { year month day }
  endDate { year month day }
  genres
  nextAiringEpisode { episode timeUntilAiring }
  trailer { id site thumbnail }
  studios { nodes { id name } }
  recommendations(perPage: 8) {
    nodes { mediaRecommendation { id title { romaji } coverImage { medium } } }
  }
  relations {
    edges {
      node { id title { romaji } coverImage { medium } type }
      relationType(version: 2)
    }
  }
  tags { name rank isMediaSpoiler }
`;

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
  const PER_PAGE = 20;

  let lastAction = null;

  const mainLayout = document.querySelector('.anime-main-layout');
  const sidebarRight = document.querySelector('.anime-sidebar-right');

  function applyViewMode() {
    if (sidebarRight) sidebarRight.style.display = fullMode ? 'none' : '';
    if (viewAllLink) viewAllLink.style.display = fullMode ? 'none' : '';
    if (mainLayout) mainLayout.classList.toggle('full-width', fullMode);
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
      const data = await anilistQuery(
        `query($perPage: Int) {
          Page(perPage: $perPage) {
            media(sort: SCORE_DESC, type: ANIME) {
              id idMal title { romaji } coverImage { large } averageScore type
            }
          }
        }`,
        { perPage: 10 }
      );
      const list = (data && data.Page && data.Page.media) ? data.Page.media : [];
      if (list.length > 0) {
        top10List.innerHTML = list.map((item, i) => {
          const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
          const type = item.type || 'TV';
          return '<div class="top10-item" data-id="' + item.id + '">' +
            '<span class="top10-rank ' + rankClass + '">' + String(i + 1).padStart(2, '0') + '</span>' +
            '<img class="top10-img" src="' + (item.coverImage.large || '') + '" alt="" loading="lazy">' +
            '<div class="top10-info">' +
            '<div class="top10-title">' + (item.title.romaji || '') + '</div>' +
            '<div class="top10-meta">' +
            (item.averageScore ? '<span class="top10-score">&#9733; ' + item.averageScore + '%</span>' : '') +
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

  // --- Fetch for current tab ---
  function fetchForCurrentTab(page) {
    const curSeason = getCurrentSeason();
    const curYear = new Date().getFullYear();
    const upcoming = getUpcomingSeason();

    if (currentTab === 'season') {
      return anilistQuery(
        `query($page: Int, $perPage: Int, $season: MediaSeason, $year: Int) {
          Page(page: $page, perPage: $perPage) {
            pageInfo { total currentPage lastPage hasNextPage }
            media(season: $season, seasonYear: $year, sort: POPULARITY_DESC, type: ANIME) {
              ${CARD_FIELDS}
            }
          }
        }`,
        { page, perPage: PER_PAGE, season: curSeason, year: curYear }
      );
    }
    if (currentTab === 'upcoming') {
      return anilistQuery(
        `query($page: Int, $perPage: Int, $season: MediaSeason, $year: Int) {
          Page(page: $page, perPage: $perPage) {
            pageInfo { total currentPage lastPage hasNextPage }
            media(season: $season, seasonYear: $year, sort: POPULARITY_DESC, type: ANIME) {
              ${CARD_FIELDS}
            }
          }
        }`,
        { page, perPage: PER_PAGE, season: upcoming.season, year: upcoming.year }
      );
    }
    if (currentTab === 'popular') {
      return anilistQuery(
        `query($page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            pageInfo { total currentPage lastPage hasNextPage }
            media(sort: POPULARITY_DESC, type: ANIME) {
              ${CARD_FIELDS}
            }
          }
        }`,
        { page, perPage: PER_PAGE }
      );
    }
    if (currentTab === 'top') {
      return anilistQuery(
        `query($page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            pageInfo { total currentPage lastPage hasNextPage }
            media(sort: SCORE_DESC, type: ANIME) {
              ${CARD_FIELDS}
            }
          }
        }`,
        { page, perPage: PER_PAGE }
      );
    }
    return anilistQuery(
      `query($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo { total currentPage lastPage hasNextPage }
          media(sort: SCORE_DESC, type: ANIME) { ${CARD_FIELDS} }
        }
      }`,
      { page, perPage: PER_PAGE }
    );
  }

  // --- Load Current Tab ---
  async function loadCurrentTab(page, showAll) {
    lastAction = () => loadCurrentTab(page, showAll);
    showLoading();
    currentPage = page || 1;
    pagination.innerHTML = '';
    if (showAll === true) fullMode = true;
    applyViewMode();

    try {
      const data = await fetchForCurrentTab(currentPage);
      clearStatus();
      const pageInfo = data && data.Page && data.Page.pageInfo;
      const media = data && data.Page && data.Page.media;

      // Track the real last page — AniList caps total at 5000 on page 1,
      // so lastPage can be inflated. We correct it when we hit an empty page
      // or when hasNextPage is false.
      if (media && media.length > 0) {
        _realLastPage = pageInfo.currentPage;
        if (pageInfo.hasNextPage === false) {
          _realLastPage = pageInfo.currentPage;
        }
        renderAnimeCards(media);
        renderPagination(pageInfo);
      } else {
        // Empty page — we've gone past the real last page
        if (_realLastPage === null) _realLastPage = Math.max(1, currentPage - 1);
        currentPage = _realLastPage;
        showStatus('No more results — page ' + _realLastPage + ' is the last page with content.');
        // Update pagination to reflect the real end
        const fakePageInfo = { currentPage: _realLastPage, lastPage: _realLastPage, hasNextPage: false, total: _realLastPage * PER_PAGE };
        renderPagination(fakePageInfo);
      }
    } catch (e) {
      showError('Failed to load. The AniList API may be temporarily unavailable.');
      console.error(e);
    }
  }

  // --- Render Anime Cards ---
  function renderAnimeCards(list) {
    grid.innerHTML = list.map(item => {
      const imgUrl = (item.coverImage && item.coverImage.large) ? item.coverImage.large : '';
      const title = (item.title && (item.title.romaji || item.title.english)) || 'Unknown';
      const score = item.averageScore || '';
      const type = item.type || '';
      const typeClass = type.toLowerCase();
      const year = item.seasonYear || (item.startDate && item.startDate.year) || '';

      return '<div class="anime-card" data-id="' + item.id + '">' +
        '<div class="anime-card-img-wrap">' +
        '<img src="' + imgUrl + '" alt="' + title + '" loading="lazy"' +
        (item.coverImage && item.coverImage.color ? ' style="border-bottom: 3px solid ' + item.coverImage.color + '"' : '') +
        '>' +
        (score ? '<div class="anime-card-rating"><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' + score + '%</div>' : '') +
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
        showAnimeDetail(card.dataset.id, imgEl ? imgEl.src : '', titleEl ? titleEl.textContent : 'Unknown');
      });
    });
  }

  // --- Pagination ---
  function renderPagination(pageInfo) {
    if (!pageInfo) {
      pagination.innerHTML = '';
      return;
    }

    const hasNext = pageInfo.hasNextPage;
    const reportedLast = pageInfo.lastPage || 1;

    // AniList caps total at 5000 on page 1, inflating lastPage.
    // We use _realLastPage (discovered by navigating) when available,
    // otherwise we cap the visible range to avoid showing 250 pages
    // when the actual content is much less.
    let effectiveLast;
    if (_realLastPage !== null && !hasNext) {
      // We've found the real end
      effectiveLast = _realLastPage;
    } else if (_realLastPage !== null) {
      // We know at least up to _realLastPage; show a bit more
      effectiveLast = Math.min(reportedLast, _realLastPage + 5);
    } else if (currentPage === 1) {
      // On page 1, AniList's lastPage is likely inflated (5000 cap).
      // Show a conservative range — user can keep clicking next.
      effectiveLast = Math.min(reportedLast, 10);
    } else {
      effectiveLast = reportedLast;
    }

    effectiveLast = Math.max(effectiveLast, currentPage);

    // If there's no next page and we're on page 1 with few results, hide pagination
    if (!hasNext && currentPage === 1 && effectiveLast <= 1) {
      pagination.innerHTML = '';
      return;
    }

    const totalPages = effectiveLast;
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
    // Show ellipsis + last page only if we haven't capped the range
    if (endPage < totalPages && (hasNext || _realLastPage !== null)) {
      if (endPage < totalPages - 1) html += '<span class="anime-pagination-info">...</span>';
      html += '<button class="anime-pagination-btn" data-page="' + totalPages + '">' + totalPages + '</button>';
    }
    // Disable next button if AniList says there's no next page
    const nextDisabled = !hasNext;
    html += '<button class="anime-pagination-btn" ' + (nextDisabled ? 'disabled' : '') + ' data-page="' + (currentPage + 1) + '">&gt;</button>';
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
    lastAction = () => searchContent(query, page);
    showLoading();
    currentPage = page || 1;
    lastQuery = query;
    pagination.innerHTML = '';
    _realLastPage = null;

    try {
      const data = await anilistQuery(
        `query($page: Int, $perPage: Int, $search: String) {
          Page(page: $page, perPage: $perPage) {
            pageInfo { total currentPage lastPage hasNextPage }
            media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
              ${CARD_FIELDS}
            }
          }
        }`,
        { page: currentPage, perPage: PER_PAGE, search: query }
      );
      clearStatus();
      const pageInfo = data && data.Page && data.Page.pageInfo;
      const media = data && data.Page && data.Page.media;
      if (media && media.length > 0) {
        _realLastPage = pageInfo.currentPage;
        if (pageInfo.hasNextPage === false) _realLastPage = pageInfo.currentPage;
        renderAnimeCards(media);
        renderPagination(pageInfo);
      } else {
        showStatus('No results found for "' + query + '"');
      }
    } catch (e) {
      showError('Search failed. The AniList API may be temporarily unavailable.');
      console.error(e);
    }
  }

  // --- Anime Detail Modal ---
  async function showAnimeDetail(id, fallbackImg, fallbackTitle) {
    try {
      modalContent.innerHTML = '<button class="recipe-modal-close" id="animeModalClose">&times;</button><div style="padding:60px;text-align:center;"><div class="recipe-loading-spinner"></div></div>';
      modal.classList.add('open');
      document.getElementById('animeModalClose').addEventListener('click', () => modal.classList.remove('open'));

      const data = await anilistQuery(
        `query($id: Int) { Media(id: $id, type: ANIME) { ${DETAIL_FIELDS} } }`,
        { id: parseInt(id) }
      );
      const item = data && data.Media;
      if (!item) throw new Error('no data');

      // Build recommendations HTML
      let recsHtml = '';
      if (item.recommendations && item.recommendations.nodes && item.recommendations.nodes.length > 0) {
        const recs = item.recommendations.nodes.filter(n => n.mediaRecommendation).map(n => n.mediaRecommendation);
        if (recs.length > 0) {
          recsHtml = '<h3>Recommendations</h3><div style="display:flex;flex-wrap:wrap;gap:8px;">' +
            recs.slice(0, 8).map(r => {
              const img = r.coverImage && r.coverImage.medium ? r.coverImage.medium : '';
              return '<div style="text-align:center;width:70px;cursor:pointer;" class="rec-anime" data-id="' + r.id + '">' +
                '<img src="' + img + '" style="width:70px;height:95px;object-fit:cover;border-radius:6px;" loading="lazy">' +
                '<div style="font-size:10px;margin-top:4px;line-height:1.2;color:var(--text-muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">' + (r.title.romaji || '') + '</div></div>';
            }).join('') + '</div>';
        }
      }

      // Build relations HTML
      let relationsHtml = '';
      if (item.relations && item.relations.edges && item.relations.edges.length > 0) {
        const relGroups = {};
        item.relations.edges.forEach(e => {
          const relType = e.relationType || 'OTHER';
          if (!relGroups[relType]) relGroups[relType] = [];
          relGroups[relType].push(e.node);
        });
        relationsHtml = '<h3>Relations</h3>';
        Object.entries(relGroups).forEach(([relType, nodes]) => {
          const label = relType.replace(/_/g, ' ');
          relationsHtml += '<div style="margin-bottom:12px;"><div style="font-size:11px;text-transform:uppercase;color:var(--text-faint);letter-spacing:0.06em;margin-bottom:6px;">' + label + '</div>';
          relationsHtml += '<div style="display:flex;flex-wrap:wrap;gap:8px;">';
          nodes.slice(0, 5).forEach(n => {
            const img = n.coverImage && n.coverImage.medium ? n.coverImage.medium : '';
            relationsHtml += '<div style="text-align:center;width:70px;cursor:pointer;" class="rec-anime" data-id="' + n.id + '">' +
              '<img src="' + img + '" style="width:70px;height:95px;object-fit:cover;border-radius:6px;" loading="lazy">' +
              '<div style="font-size:10px;margin-top:4px;line-height:1.2;color:var(--text-muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">' + (n.title.romaji || '') + '</div></div>';
          });
          relationsHtml += '</div></div>';
        });
      }

      const title = item.title.romaji || item.title.english || '';
      const nativeTitle = item.title.native || '';
      const bannerStyle = item.bannerImage ? ' style="background-image:url(' + item.bannerImage + ');background-size:cover;background-position:center;"' : '';
      const color = (item.coverImage && item.coverImage.color) || 'var(--accent)';

      // Build trailer HTML
      let trailerHtml = '';
      if (item.trailer && item.trailer.id && item.trailer.site === 'youtube') {
        trailerHtml = '<h3>Trailer</h3><div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" src="https://www.youtube.com/embed/' + item.trailer.id + '" allowfullscreen></iframe></div>';
      }

      // Build airing info
      let airingHtml = '';
      if (item.nextAiringEpisode) {
        const ep = item.nextAiringEpisode.episode;
        const secs = item.nextAiringEpisode.timeUntilAiring;
        const days = Math.floor(secs / 86400);
        const hours = Math.floor((secs % 86400) / 3600);
        airingHtml = '<div style="padding:10px 14px;background:var(--bg-elevated);border-radius:8px;margin-bottom:12px;font-size:13px;color:var(--text);">Ep ' + ep + ' airing in ' + days + 'd ' + hours + 'h</div>';
      }

      // Studio names
      const studioNames = (item.studios && item.studios.nodes) ? item.studios.nodes.map(s => s.name).join(', ') : '';

      modalContent.innerHTML = '<button class="recipe-modal-close" id="animeModalClose">&times;</button>' +
        '<div class="anime-modal-banner"' + bannerStyle + '>' +
          '<div class="anime-modal-banner-overlay"></div>' +
          '<div class="anime-modal-banner-content">' +
            '<img src="' + (item.coverImage.extraLarge || item.coverImage.large || fallbackImg || '') + '" alt="' + title + '" class="anime-modal-cover">' +
            '<div class="anime-modal-banner-info">' +
              '<h2>' + title + '</h2>' +
              (nativeTitle ? '<p style="color:rgba(255,255,255,0.7);font-size:14px;">' + nativeTitle + '</p>' : '') +
              '<div class="anime-modal-meta">' +
              (item.averageScore ? '<span class="anime-modal-score" style="background:' + color + '">&#9733; ' + item.averageScore + '%</span>' : '') +
              (item.episodes ? '<span>' + item.episodes + ' ep' + (item.episodes > 1 ? 's' : '') + '</span>' : '') +
              (item.duration ? '<span>' + item.duration + ' min/ep</span>' : '') +
              (item.status ? '<span>' + item.status.replace(/_/g, ' ') + '</span>' : '') +
              (item.type ? '<span>' + item.type + '</span>' : '') +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="anime-modal-body">' +
        airingHtml +
        (item.description ? '<h3>Synopsis</h3><p>' + item.description.replace(/<br\s*\/?>/g, '\n').replace(/<\/?i>/g, '').replace(/<\/?b>/g, '').replace(/\(Source:.*?\)/g, '').trim() + '</p>' : '') +
        (item.genres && item.genres.length > 0 ? '<h3>Genres</h3><div style="display:flex;flex-wrap:wrap;gap:6px;">' + item.genres.map(g => '<span style="padding:4px 12px;border-radius:100px;background:var(--bg-elevated);font-size:12px;color:var(--text-muted);">' + g + '</span>').join('') + '</div>' : '') +
        (studioNames ? '<h3>Studios</h3><p>' + studioNames + '</p>' : '') +
        (item.season && item.seasonYear ? '<h3>Season</h3><p>' + item.season + ' ' + item.seasonYear + '</p>' : '') +
        (item.popularity ? '<h3>Popularity</h3><p>' + Number(item.popularity).toLocaleString() + ' users' + (item.favourites ? ' &middot; ' + Number(item.favourites).toLocaleString() + ' favourites' : '') + '</p>' : '') +
        trailerHtml +
        relationsHtml +
        recsHtml +
        (item.idMal ? '<p style="margin-top:16px;"><a href="https://myanimelist.net/anime/' + item.idMal + '" target="_blank" style="color:var(--accent);">View on MyAnimeList &rarr;</a></p>' : '') +
        '<p><a href="https://anilist.co/anime/' + item.id + '" target="_blank" style="color:var(--accent);">View on AniList &rarr;</a></p>' +
        '</div>';

      document.getElementById('animeModalClose').addEventListener('click', () => modal.classList.remove('open'));
      modalContent.querySelectorAll('.rec-anime').forEach(el => {
        el.addEventListener('click', () => showAnimeDetail(el.dataset.id));
      });
    } catch (e) {
      console.error('Failed to load anime detail', e);
      const imgSrc = fallbackImg || '';
      const title = fallbackTitle || 'Unknown Anime';
      modalContent.innerHTML = '<button class="recipe-modal-close" id="animeModalClose">&times;</button>' +
        (imgSrc ? '<img class="anime-modal-img" src="' + imgSrc + '" alt="' + title + '">' : '') +
        '<div class="anime-modal-body">' +
        '<h2>' + title + '</h2>' +
        '<p style="color:var(--accent);margin-top:12px;">Failed to load full details. The API may be temporarily unavailable.</p>' +
        '<p style="margin-top:16px;"><a href="https://anilist.co/anime/' + id + '" target="_blank" style="color:var(--accent);">View on AniList &rarr;</a></p>' +
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
          const data = await anilistQuery(
            `query($search: String) {
              Page(perPage: 6) {
                media(search: $search, type: ANIME) {
                  id title { romaji } coverImage { medium }
                }
              }
            }`,
            { search: query }
          );
          const media = data && data.Page && data.Page.media;
          if (media && media.length > 0) {
            suggestions.innerHTML = media.map(item => {
              const name = item.title.romaji || '';
              const highlighted = name.replace(new RegExp(query, 'i'), '<strong>' + query + '</strong>');
              return '<div class="autocomplete-item" data-id="' + item.id + '" data-name="' + name + '">' + highlighted + '</div>';
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
      const data = await anilistQuery(
        `query { Page(perPage: 1) { media(sort: SCORE_DESC, type: ANIME) { coverImage { extraLarge } } } }`,
        {}
      );
      const media = data && data.Page && data.Page.media;
      if (media && media.length > 0 && media[0].coverImage) {
        heroBg.style.backgroundImage = 'url(' + media[0].coverImage.extraLarge + ')';
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
      _realLastPage = null;

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
