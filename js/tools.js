// ============================================
// TOOLS PAGE — Enhanced JavaScript
// ============================================

// ================================================================
// BOOK SEARCH API (Open Library)
// ================================================================
(function initBookSearch() {
  const input = document.getElementById('bookInput');
  const btn = document.getElementById('bookBtn');
  const result = document.getElementById('bookResult');
  const suggestions = document.getElementById('bookSuggestions');

  if (!input || !btn) return;

  async function searchBook() {
    const query = input.value.trim();
    if (!query) return;

    if (suggestions) suggestions.classList.remove('show');

    result.innerHTML = '<div class="api-result-loading"><div class="recipe-loading-spinner"></div></div>';

    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5&fields=title,key,author_name,first_publish_year,number_of_pages_median,language,isbn,publisher,subject,cover_i,first_sentence,ratings_count,ratings_average`);
      const data = await res.json();

      if (data.docs && data.docs.length > 0) {
        result.innerHTML = data.docs.map(book => {
          const coverId = book.cover_i;
          const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : 'https://via.placeholder.com/130x185?text=No+Cover';
          const author = book.author_name ? book.author_name.slice(0, 3).join(', ') : 'Unknown';
          const year = book.first_publish_year || 'N/A';
          const pages = book.number_of_pages_median || 'N/A';
          const isbn = book.isbn ? book.isbn[0] : null;
          const subjects = book.subject ? book.subject.slice(0, 6) : [];
          const publisher = book.publisher ? book.publisher[0] : 'N/A';
          const ratingCount = book.ratings_count || 0;
          const ratingAvg = book.ratings_average ? book.ratings_average.toFixed(1) : null;
          const olKey = book.key;
          const olUrl = olKey ? `https://openlibrary.org${olKey}` : '#';

          let ratingHtml = '';
          if (ratingAvg && ratingCount > 0) {
            const stars = '★'.repeat(Math.round(ratingAvg)) + '☆'.repeat(5 - Math.round(ratingAvg));
            ratingHtml = `<div class="book-meta-item"><strong>${stars}</strong> ${ratingAvg}/5 (${ratingCount.toLocaleString()} ratings)</div>`;
          }

          let subjectsHtml = '';
          if (subjects.length > 0) {
            subjectsHtml = '<div class="book-subjects">' + subjects.map(s =>
              `<span class="book-subject-tag">${s}</span>`
            ).join('') + '</div>';
          }

          return `
            <div class="book-card">
              <img src="${coverUrl}" alt="${book.title}" class="book-cover" onerror="this.src='https://via.placeholder.com/130x185?text=No+Cover'">
              <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">by ${author}</div>
                <div class="book-meta">
                  <div class="book-meta-item"><strong>${year}</strong> &nbsp;First published</div>
                  ${pages !== 'N/A' ? `<div class="book-meta-item"><strong>${pages}</strong> &nbsp;pages</div>` : ''}
                  ${ratingHtml}
                </div>
                <div class="book-meta">
                  <div class="book-meta-item">${publisher}</div>
                  ${isbn ? `<div class="book-meta-item">ISBN: ${isbn}</div>` : ''}
                </div>
                ${subjectsHtml}
                <div class="book-links">
                  <a href="${olUrl}" target="_blank" class="book-link">View on Open Library</a>
                </div>
              </div>
            </div>
          `;
        }).join('');
      } else {
        result.innerHTML = '<div class="api-result-empty">No books found. Try a different search term.</div>';
      }
    } catch (e) {
      result.innerHTML = '<div class="api-result-error">Error searching books. Please try again.</div>';
    }
  }

  // Autocomplete
  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const query = input.value.trim();
      if (!query || query.length < 2 || !suggestions) {
        if (suggestions) suggestions.classList.remove('show');
        return;
      }
      try {
        const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=8&fields=title,key`);
        const data = await res.json();
        if (data.docs && data.docs.length > 0) {
          suggestions.innerHTML = data.docs.map(book => {
            const title = book.title;
            const highlighted = title.replace(new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `<strong>${query}</strong>`);
            return `<div class="autocomplete-item" data-title="${title}">${highlighted}</div>`;
          }).join('');
          suggestions.classList.add('show');
          suggestions.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
              input.value = item.dataset.title;
              suggestions.classList.remove('show');
              searchBook();
            });
          });
        } else {
          suggestions.classList.remove('show');
        }
      } catch (e) {
        suggestions.classList.remove('show');
      }
    }, 300);
  });

  document.addEventListener('click', (e) => {
    if (suggestions && !suggestions.contains(e.target) && e.target !== input) {
      suggestions.classList.remove('show');
    }
  });

  btn.addEventListener('click', searchBook);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBook();
  });
})();

// ================================================================
// CURRENCY CONVERTER API (Exchange Rate API)
// ================================================================
(function initCurrencyConverter() {
  const amount = document.getElementById('currencyAmount');
  const from = document.getElementById('currencyFrom');
  const to = document.getElementById('currencyTo');
  const result = document.getElementById('currencyResult');
  const rateInfo = document.getElementById('currencyRateInfo');

  if (!amount || !result) return;

  async function convert() {
    const amt = parseFloat(amount.value);
    if (!amt || amt <= 0) {
      result.textContent = 'Enter amount';
      if (rateInfo) rateInfo.style.display = 'none';
      return;
    }

    const fromCurrency = from.value;
    const toCurrency = to.value;

    if (fromCurrency === toCurrency) {
      result.textContent = `${amt.toFixed(2)} ${toCurrency}`;
      if (rateInfo) {
        rateInfo.style.display = 'flex';
        rateInfo.innerHTML = 'Same currency — no conversion needed';
      }
      return;
    }

    result.textContent = '...';

    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      if (!res.ok) { result.textContent = 'Error'; return; }

      const data = await res.json();

      if (data.result === 'success' && data.rates && data.rates[toCurrency]) {
        const rate = data.rates[toCurrency];
        const converted = (amt * rate).toFixed(2);
        result.innerHTML = `${Number(converted).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span style="font-size: 13px; color: var(--text-muted); font-weight: 400;">${toCurrency}</span>`;

        if (rateInfo) {
          const timeStr = data.time_last_update_utc ? new Date(data.time_last_update_utc).toLocaleDateString() : '';
          rateInfo.style.display = 'flex';
          rateInfo.innerHTML = `1 ${fromCurrency} = <span class="rate-value">${rate.toFixed(4)} ${toCurrency}</span>` +
            (timeStr ? ` &middot; Updated ${timeStr}` : '');
        }
      } else {
        result.textContent = 'No rate';
        if (rateInfo) rateInfo.style.display = 'none';
      }
    } catch (e) {
      console.error('Currency error:', e);
      result.textContent = 'Error';
      if (rateInfo) rateInfo.style.display = 'none';
    }
  }

  amount.addEventListener('input', convert);
  from.addEventListener('change', convert);
  to.addEventListener('change', convert);

  if (from && to && from.value === to.value) {
    to.value = 'EUR';
  }
  convert();
})();

// ================================================================
// POKEMON API (PokeAPI) — Enhanced with stat bars
// ================================================================
(function initPokemonSearch() {
  const input = document.getElementById('pokemonInput');
  const btn = document.getElementById('pokemonBtn');
  const result = document.getElementById('pokemonResult');
  const suggestions = document.getElementById('pokemonSuggestions');

  if (!input || !btn) return;

  let pokemonList = [];
  const pokemonTypes = ['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'];

  const typeColors = {
    normal:'#919aa2',fire:'#f08030',water:'#6890f0',electric:'#f8d030',
    grass:'#78c850',ice:'#98d8d8',fighting:'#c03028',poison:'#a040a0',
    ground:'#e0c068',flying:'#a890f0',psychic:'#f85888',bug:'#a8b820',
    rock:'#b8a038',ghost:'#705898',dragon:'#7038f8',dark:'#705848',
    steel:'#b8b8d0',fairy:'#ee99ac'
  };

  const statLabels = {
    'hp': 'HP', 'attack': 'ATK', 'defense': 'DEF',
    'special-attack': 'SpA', 'special-defense': 'SpD', 'speed': 'SPD'
  };

  async function loadPokemonNames() {
    try {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
      const data = await res.json();
      pokemonList = data.results.map(p => p.name);
    } catch (e) {
      console.error('Failed to load Pokemon list');
    }
  }

  function showSuggestions(query) {
    if (!suggestions || !query) {
      if (suggestions) suggestions.classList.remove('show');
      return;
    }
    const typeMatches = pokemonTypes.filter(t => t.startsWith(query.toLowerCase()));
    const nameMatches = pokemonList.filter(n => n.startsWith(query.toLowerCase())).slice(0, 6);

    if (typeMatches.length === 0 && nameMatches.length === 0) {
      suggestions.classList.remove('show');
      return;
    }

    let html = '';
    if (typeMatches.length > 0) {
      html += '<div style="padding:8px 14px;font-size:10px;color:var(--text-faint);text-transform:uppercase;letter-spacing:0.06em;">Types</div>';
      html += typeMatches.map(type => {
        const highlighted = type.replace(new RegExp(`^${query}`, 'i'), `<strong>${query}</strong>`);
        return `<div class="autocomplete-item" data-type="${type}">${highlighted} <span style="font-size:10px;color:var(--text-faint);">(type)</span></div>`;
      }).join('');
    }
    if (nameMatches.length > 0) {
      html += '<div style="padding:8px 14px;font-size:10px;color:var(--text-faint);text-transform:uppercase;letter-spacing:0.06em;">Pok&eacute;mon</div>';
      html += nameMatches.map(name => {
        const highlighted = name.replace(new RegExp(`^${query}`, 'i'), `<strong>${query}</strong>`);
        return `<div class="autocomplete-item" data-name="${name}">${highlighted}</div>`;
      }).join('');
    }

    suggestions.innerHTML = html;
    suggestions.classList.add('show');

    suggestions.querySelectorAll('.autocomplete-item').forEach(item => {
      item.addEventListener('click', () => {
        if (item.dataset.type) {
          input.value = item.dataset.type;
          searchPokemonByType();
        } else {
          input.value = item.dataset.name;
          searchPokemon();
        }
        suggestions.classList.remove('show');
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
        result.innerHTML = '<div class="api-result-error">Pokemon not found. Try a name or number (1-1025)</div>';
        return;
      }

      const data = await res.json();
      const types = data.types.map(t => t.type.name);
      const mainType = types[0];
      const bgColor = typeColors[mainType] || '#666';

      const spriteUrl = data.sprites.other['official-artwork'].front_default ||
                        data.sprites.front_default || '';

      // Build stat bars
      const statsHtml = data.stats.map(s => {
        const val = s.base_stat;
        const pct = Math.min(100, (val / 255) * 100);
        const cls = val >= 100 ? 'high' : val >= 50 ? 'mid' : 'low';
        const label = statLabels[s.stat.name] || s.stat.name;
        return `<div class="pokemon-stat-row">
          <span class="pokemon-stat-label">${label}</span>
          <div class="pokemon-stat-bar-wrap">
            <div class="pokemon-stat-bar ${cls}" style="width:${pct}%"></div>
          </div>
          <span class="pokemon-stat-value">${val}</span>
        </div>`;
      }).join('');

      const totalStat = data.stats.reduce((sum, s) => sum + s.base_stat, 0);

      // Abilities
      const abilitiesHtml = data.abilities.map(a =>
        `<span class="pokemon-ability-tag${a.is_hidden ? ' hidden-ability' : ''}">${a.ability.name.replace('-', ' ')}${a.is_hidden ? ' (hidden)' : ''}</span>`
      ).join('');

      result.innerHTML = `
        <div class="pokemon-card">
          <div class="pokemon-sprite-wrap">
            <div class="pokemon-sprite-bg" style="background:${bgColor};"></div>
            <img src="${spriteUrl}" alt="${data.name}" class="pokemon-image">
          </div>
          <div class="pokemon-info">
            <div style="display:flex;align-items:center;gap:10px;">
              <span class="pokemon-id">#${String(data.id).padStart(4, '0')}</span>
            </div>
            <div class="pokemon-name">${data.name}</div>
            <div class="pokemon-types">
              ${types.map(t => `<span class="pokemon-type ${t}">${t}</span>`).join('')}
            </div>
            <div class="pokemon-physical">
              <span>${(data.height / 10).toFixed(1)}m tall</span>
              <span>${(data.weight / 10).toFixed(1)}kg</span>
            </div>
            <div class="pokemon-abilities">${abilitiesHtml}</div>
            <div class="pokemon-stats-grid">${statsHtml}</div>
            <div class="pokemon-total-stat">Total: ${totalStat}</div>
          </div>
        </div>
      `;

      const recent = JSON.parse(localStorage.getItem('recentPokemon') || '[]');
      if (!recent.includes(data.name)) {
        recent.unshift(data.name);
        if (recent.length > 5) recent.pop();
        localStorage.setItem('recentPokemon', JSON.stringify(recent));
      }
    } catch (e) {
      result.innerHTML = '<div class="api-result-error">Pokemon not found. Try a name or number (1-1025)</div>';
    }
  }

  async function searchPokemonByType() {
    const type = input.value.trim().toLowerCase();
    if (!type) return;
    if (suggestions) suggestions.classList.remove('show');

    result.innerHTML = '<div class="api-result-loading"><div class="recipe-loading-spinner"></div></div>';

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      if (!res.ok) {
        result.innerHTML = '<div class="api-result-error">Type not found. Available: ' + pokemonTypes.join(', ') + '</div>';
        return;
      }

      const data = await res.json();
      const pokemon = data.pokemon.slice(0, 12).map(p => p.pokemon);
      const typeColor = typeColors[type] || '#666';

      let html = `<div style="margin-bottom:16px;font-size:13px;color:var(--text-muted);">Found <strong>${data.pokemon.length}</strong> ${type}-type Pok&eacute;mon</div>`;
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px;">';

      for (const p of pokemon) {
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.name}`);
          const pokeData = await res.json();
          const sprite = pokeData.sprites.other['official-artwork'].front_default || pokeData.sprites.front_default || '';
          html += `
            <div style="background:var(--bg);border:1px solid var(--border-light);border-radius:10px;padding:10px;text-align:center;cursor:pointer;transition:all 0.2s;" class="type-poke-card" data-name="${p.name}">
              <img src="${sprite}" alt="${p.name}" style="width:70px;height:70px;object-fit:contain;">
              <div style="font-size:12px;font-weight:600;text-transform:capitalize;margin-top:4px;">${p.name}</div>
              <div style="font-size:10px;color:var(--text-faint);">#${pokeData.id}</div>
            </div>
          `;
        } catch (e) {
          console.error('Failed to load', p.name);
        }
      }

      html += '</div>';
      result.innerHTML = html;

      result.querySelectorAll('.type-poke-card').forEach(card => {
        card.addEventListener('click', () => {
          input.value = card.dataset.name;
          searchPokemon();
        });
        card.addEventListener('mouseenter', () => {
          card.style.borderColor = typeColor;
          card.style.boxShadow = `0 2px 8px ${typeColor}33`;
        });
        card.addEventListener('mouseleave', () => {
          card.style.borderColor = 'var(--border-light)';
          card.style.boxShadow = 'none';
        });
      });
    } catch (e) {
      result.innerHTML = '<div class="api-result-error">Error searching by type</div>';
    }
  }

  // Autocomplete
  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      showSuggestions(input.value.trim());
    }, 150);
  });

  document.addEventListener('click', (e) => {
    if (suggestions && !suggestions.contains(e.target) && e.target !== input) {
      suggestions.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    const query = input.value.trim().toLowerCase();
    if (pokemonTypes.includes(query)) {
      searchPokemonByType();
    } else {
      searchPokemon();
    }
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = input.value.trim().toLowerCase();
      if (pokemonTypes.includes(query)) {
        searchPokemonByType();
      } else {
        searchPokemon();
      }
    }
  });

  loadPokemonNames();
})();

// ================================================================
// COUNTRY API (countries.dev) — Enhanced with map link
// ================================================================
(function initCountrySearch() {
  const input = document.getElementById('countryInput');
  const btn = document.getElementById('countryBtn');
  const result = document.getElementById('countryResult');

  if (!input || !btn) return;

  let allCountries = [];

  async function loadAllCountries() {
    try {
      const res = await fetch('https://countries.dev/countries');
      const data = await res.json();
      allCountries = Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Failed to load countries list');
    }
  }
  loadAllCountries();

  const suggestions = document.createElement('div');
  suggestions.className = 'autocomplete-suggestions';
  input.parentNode.style.position = 'relative';
  input.parentNode.appendChild(suggestions);

  function showCountrySuggestions(query) {
    if (!query || query.length < 2 || allCountries.length === 0) {
      suggestions.classList.remove('show');
      return;
    }
    const q = query.toLowerCase();
    const matches = allCountries
      .filter(c => {
        const name = (c.name || '').toLowerCase();
        const alpha2 = (c.alpha2Code || '').toLowerCase();
        const alpha3 = (c.alpha3Code || '').toLowerCase();
        return name.includes(q) || alpha2 === q || alpha3 === q;
      })
      .slice(0, 8);

    if (matches.length === 0) {
      suggestions.classList.remove('show');
      return;
    }

    suggestions.innerHTML = matches.map(c => {
      const name = c.name;
      const code = c.alpha2Code || '';
      const highlighted = name.replace(new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `<strong>${query}</strong>`);
      return `<div class="autocomplete-item" data-name="${name}" data-code="${code}">${highlighted}${code ? ` <span style="color:var(--text-faint);font-size:11px;">(${code})</span>` : ''}</div>`;
    }).join('');

    suggestions.classList.add('show');

    suggestions.querySelectorAll('.autocomplete-item').forEach(item => {
      item.addEventListener('click', () => {
        input.value = item.dataset.name;
        suggestions.classList.remove('show');
        searchCountry();
      });
    });
  }

  async function searchCountry() {
    const query = input.value.trim();
    if (!query) return;

    suggestions.classList.remove('show');
    result.innerHTML = '<div class="api-result-loading"><div class="recipe-loading-spinner"></div></div>';

    try {
      const isAlphaCode = /^[A-Za-z]{2,3}$/.test(query);
      const url = isAlphaCode
        ? `https://countries.dev/alpha/${encodeURIComponent(query.toUpperCase())}`
        : `https://countries.dev/name/${encodeURIComponent(query)}`;

      const res = await fetch(url);
      if (!res.ok) {
        result.innerHTML = '<div class="api-result-empty">Country not found. Try a different name or ISO code (e.g. US, JPN).</div>';
        return;
      }

      const response = await res.json();
      const country = Array.isArray(response) ? response[0] : response;

      if (!country || !country.name) {
        result.innerHTML = '<div class="api-result-empty">Country not found.</div>';
        return;
      }

      const name = country.name || query;
      const nativeName = country.nativeName || '';
      const capital = country.capital || 'N/A';

      let currency = 'N/A';
      if (country.currencies && Array.isArray(country.currencies) && country.currencies.length > 0) {
        const curr = country.currencies[0];
        currency = `${curr.symbol || ''} ${curr.code}`.trim();
      }

      let phoneCode = 'N/A';
      if (country.callingCodes && Array.isArray(country.callingCodes) && country.callingCodes.length > 0) {
        phoneCode = country.callingCodes[0];
      }

      const region = country.region || 'N/A';
      const subregion = country.subregion || '';
      const population = country.population ? country.population.toLocaleString() : 'N/A';
      const area = country.area ? `${country.area.toLocaleString()} km²` : 'N/A';

      let languages = 'N/A';
      if (country.languages && Array.isArray(country.languages) && country.languages.length > 0) {
        languages = country.languages.map(l => l.name || l).join(', ');
      }

      let flag = '';
      if (country.flag) {
        flag = `<span class="country-flag-emoji">${country.flag}</span>`;
      }

      const alpha2 = country.alpha2Code || '';
      const alpha3 = country.alpha3Code || '';

      // Google Maps link
      const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(name)}`;
      // Wikipedia link
      const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`;

      // Timezone
      let timezones = 'N/A';
      if (country.timezones && Array.isArray(country.timezones) && country.timezones.length > 0) {
        timezones = country.timezones.slice(0, 3).join(', ');
      }

      // Border countries
      let borders = '';
      if (country.borders && Array.isArray(country.borders) && country.borders.length > 0) {
        const borderNames = country.borders.map(code => {
          const found = allCountries.find(c => c.alpha3Code === code);
          return found ? found.name : code;
        });
        borders = borderNames.join(', ');
      }

      result.innerHTML = `
        <div class="country-card">
          <div class="country-header">
            ${flag}
            <div>
              <div class="country-name">${name}</div>
              ${nativeName && nativeName !== name ? `<div class="country-native-name">${nativeName}</div>` : ''}
            </div>
          </div>
          <div class="country-info">
            <div class="country-info-item">
              <div class="country-label">Capital</div>
              <div class="country-value">${capital}</div>
            </div>
            <div class="country-info-item">
              <div class="country-label">Region</div>
              <div class="country-value">${region}${subregion ? ' · ' + subregion : ''}</div>
            </div>
            <div class="country-info-item">
              <div class="country-label">Population</div>
              <div class="country-value">${population}</div>
            </div>
            <div class="country-info-item">
              <div class="country-label">Area</div>
              <div class="country-value">${area}</div>
            </div>
            <div class="country-info-item">
              <div class="country-label">Currency</div>
              <div class="country-value">${currency}</div>
            </div>
            <div class="country-info-item">
              <div class="country-label">Phone Code</div>
              <div class="country-value">+${phoneCode}</div>
            </div>
            <div class="country-info-item">
              <div class="country-label">Languages</div>
              <div class="country-value">${languages}</div>
            </div>
            <div class="country-info-item">
              <div class="country-label">Timezones</div>
              <div class="country-value">${timezones}</div>
            </div>
            ${alpha2 || alpha3 ? `
            <div class="country-info-item">
              <div class="country-label">ISO Codes</div>
              <div class="country-value">${alpha2}${alpha3 ? ' / ' + alpha3 : ''}</div>
            </div>` : ''}
            ${borders ? `
            <div class="country-info-item" style="grid-column: 1 / -1;">
              <div class="country-label">Bordering Countries</div>
              <div class="country-value">${borders}</div>
            </div>` : ''}
          </div>
          <div class="country-links">
            <a href="${mapUrl}" target="_blank" class="country-map-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              View on Map
            </a>
            <a href="${wikiUrl}" target="_blank" class="country-wiki-link">
              Wikipedia
            </a>
          </div>
        </div>
      `;

      const recent = JSON.parse(localStorage.getItem('recentCountries') || '[]');
      if (!recent.includes(name)) {
        recent.unshift(name);
        if (recent.length > 5) recent.pop();
        localStorage.setItem('recentCountries', JSON.stringify(recent));
      }
    } catch (e) {
      console.error('Country search error:', e);
      result.innerHTML = '<div class="api-result-error">Error searching country. Please try again.</div>';
    }
  }

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      showCountrySuggestions(input.value.trim());
    }, 150);
  });

  document.addEventListener('click', (e) => {
    if (!suggestions.contains(e.target) && e.target !== input) {
      suggestions.classList.remove('show');
    }
  });

  btn.addEventListener('click', searchCountry);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchCountry();
  });
})();

// ================================================================
// TOOL CARDS REORDER
// ================================================================
(function() {
  const toolsSection = document.getElementById('toolsSection');
  if (!toolsSection) return;

  function restoreOrder() {
    const savedOrder = JSON.parse(localStorage.getItem('toolOrder') || '[]');
    if (savedOrder.length === 0) return;
    const cards = Array.from(toolsSection.querySelectorAll('.api-tool-card'));
    const cardMap = new Map();
    cards.forEach(card => cardMap.set(card.dataset.tool, card));
    savedOrder.forEach(toolId => {
      const card = cardMap.get(toolId);
      if (card) toolsSection.appendChild(card);
    });
  }

  function updateButtons() {
    const cards = Array.from(toolsSection.querySelectorAll('.api-tool-card'));
    cards.forEach((card, index) => {
      const upBtn = card.querySelector('.card-move-up');
      const downBtn = card.querySelector('.card-move-down');
      if (upBtn) {
        upBtn.disabled = index === 0;
        upBtn.style.opacity = index === 0 ? '0.25' : '1';
        upBtn.style.pointerEvents = index === 0 ? 'none' : 'auto';
      }
      if (downBtn) {
        downBtn.disabled = index === cards.length - 1;
        downBtn.style.opacity = index === cards.length - 1 ? '0.25' : '1';
        downBtn.style.pointerEvents = index === cards.length - 1 ? 'none' : 'auto';
      }
    });
  }

  function saveOrder() {
    const cards = Array.from(toolsSection.querySelectorAll('.api-tool-card'));
    const order = cards.map(card => card.dataset.tool);
    localStorage.setItem('toolOrder', JSON.stringify(order));
    updateButtons();
  }

  function attachHandlers() {
    const cards = Array.from(toolsSection.querySelectorAll('.api-tool-card'));
    cards.forEach((card) => {
      const upBtn = card.querySelector('.card-move-up');
      const downBtn = card.querySelector('.card-move-down');
      if (upBtn) {
        upBtn.addEventListener('click', (e) => {
          e.preventDefault(); e.stopPropagation();
          const currentCards = Array.from(toolsSection.querySelectorAll('.api-tool-card'));
          const idx = currentCards.indexOf(card);
          if (idx > 0) {
            toolsSection.insertBefore(card, currentCards[idx - 1]);
            saveOrder();
          }
        });
      }
      if (downBtn) {
        downBtn.addEventListener('click', (e) => {
          e.preventDefault(); e.stopPropagation();
          const currentCards = Array.from(toolsSection.querySelectorAll('.api-tool-card'));
          const idx = currentCards.indexOf(card);
          if (idx < currentCards.length - 1) {
            toolsSection.insertBefore(currentCards[idx + 1], card);
            saveOrder();
          }
        });
      }
    });
  }

  restoreOrder();
  attachHandlers();
  updateButtons();
})();

// ================================================================
// RANDOM RECOMMENDATIONS
// ================================================================
(function initRandomFeatures() {
  const bookRandomBtn = document.getElementById('bookRandomBtn');
  if (bookRandomBtn) {
    bookRandomBtn.addEventListener('click', async () => {
      const input = document.getElementById('bookInput');
      const btn = document.getElementById('bookBtn');
      if (!input || !btn) return;
      const subjects = ['fiction','mystery','science','history','fantasy','romance','adventure','philosophy','art','music','travel','cooking','technology','biography','poetry'];
      const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
      const randomPage = Math.floor(Math.random() * 50) + 1;
      try {
        const res = await fetch(`https://openlibrary.org/subjects/${randomSubject}.json?limit=1&offset=${randomPage}`);
        const data = await res.json();
        if (data.works && data.works.length > 0) {
          input.value = data.works[0].title;
          btn.click();
        }
      } catch (e) {
        console.error('Failed to get random book');
      }
    });
  }

  const pokemonRandomBtn = document.getElementById('pokemonRandomBtn');
  if (pokemonRandomBtn) {
    pokemonRandomBtn.addEventListener('click', () => {
      const input = document.getElementById('pokemonInput');
      const btn = document.getElementById('pokemonBtn');
      if (!input || !btn) return;
      const randomId = Math.floor(Math.random() * 1025) + 1;
      input.value = randomId;
      btn.click();
    });
  }

  const countryRandomBtn = document.getElementById('countryRandomBtn');
  if (countryRandomBtn) {
    countryRandomBtn.addEventListener('click', () => {
      const input = document.getElementById('countryInput');
      const btn = document.getElementById('countryBtn');
      if (!input || !btn) return;
      fetch('https://countries.dev/countries')
        .then(res => res.json())
        .then(data => {
          const countries = Array.isArray(data) ? data : [];
          if (countries.length > 0) {
            const rc = countries[Math.floor(Math.random() * countries.length)];
            input.value = rc.name;
            btn.click();
          }
        })
        .catch(() => {
          const fallback = ['Japan','Thailand','United States','Germany','Brazil','Australia','France','Italy','Spain','Canada','Mexico','India','China','South Korea','United Kingdom','Netherlands','Sweden','Norway'];
          input.value = fallback[Math.floor(Math.random() * fallback.length)];
          btn.click();
        });
    });
  }
})();

// ================================================================
// CURRENCY COUNTRY SEARCH
// ================================================================
(function initCurrencyCountrySearch() {
  const input = document.getElementById('currencyCountryInput');
  const suggestions = document.getElementById('currencyCountrySuggestions');
  const fromSelect = document.getElementById('currencyFrom');

  if (!input || !suggestions) return;

  let allCountries = [];

  async function loadAllCountries() {
    try {
      const res = await fetch('https://countries.dev/countries');
      const data = await res.json();
      allCountries = Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Failed to load countries for currency search');
    }
  }
  loadAllCountries();

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = input.value.trim();
      if (!query || query.length < 2 || allCountries.length === 0) {
        suggestions.classList.remove('show');
        return;
      }
      const q = query.toLowerCase();
      const matches = allCountries
        .filter(c => (c.name || '').toLowerCase().includes(q))
        .slice(0, 8);

      if (matches.length === 0) {
        suggestions.classList.remove('show');
        return;
      }

      suggestions.innerHTML = matches.map(country => {
        const name = country.name;
        let currencyCode = '';
        if (country.currencies && Array.isArray(country.currencies) && country.currencies.length > 0) {
          currencyCode = country.currencies[0].code || '';
        }
        const highlighted = name.replace(new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `<strong>${query}</strong>`);
        return `<div class="autocomplete-item" data-currency="${currencyCode}" data-name="${name}">${highlighted}${currencyCode ? ` (${currencyCode})` : ''}</div>`;
      }).join('');

      suggestions.classList.add('show');

      suggestions.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
          const currency = item.dataset.currency;
          const name = item.dataset.name;
          if (currency) fromSelect.value = currency;
          input.value = name;
          suggestions.classList.remove('show');
          const amount = document.getElementById('currencyAmount');
          if (amount) amount.dispatchEvent(new Event('input'));
        });
      });
    }, 150);
  });

  document.addEventListener('click', (e) => {
    if (!suggestions.contains(e.target) && e.target !== input) {
      suggestions.classList.remove('show');
    }
  });
})();
