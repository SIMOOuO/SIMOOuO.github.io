// ============================================
// TOOLS PAGE — All JavaScript
// ============================================

// ================================================================
// BOOK SEARCH API (Open Library)
// https://openlibrary.org/developers/api
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
  
  // Autocomplete on input
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
            const highlighted = title.replace(new RegExp(query, 'i'), `<strong>${query}</strong>`);
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
  
  // Hide suggestions when clicking outside
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
// https://open.er-api.com/
// ================================================================
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
      // Use open.er-api.com which has no CORS issues
      const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      
      if (!res.ok) {
        result.textContent = 'Error';
        return;
      }
      
      const data = await res.json();
      
      if (data.result === 'success' && data.rates && data.rates[toCurrency]) {
        const rate = data.rates[toCurrency];
        const converted = (amt * rate).toFixed(2);
        result.innerHTML = `${converted} <span style="font-size: 12px; color: var(--text-muted);">${toCurrency}</span>`;
        result.title = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
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

// ================================================================
// POKEMON API (PokéAPI)
// https://pokeapi.co/
// ================================================================
(function initPokemonSearch() {
  const input = document.getElementById('pokemonInput');
  const btn = document.getElementById('pokemonBtn');
  const result = document.getElementById('pokemonResult');
  const suggestions = document.getElementById('pokemonSuggestions');
  
  if (!input || !btn) return;
  
  let pokemonList = [];
  const pokemonTypes = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];
  
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
    
    // Check if query matches a type
    const typeMatches = pokemonTypes.filter(t => t.startsWith(query.toLowerCase()));
    
    // Check if query matches Pokemon names
    const nameMatches = pokemonList
      .filter(name => name.startsWith(query.toLowerCase()))
      .slice(0, 6);
    
    if (typeMatches.length === 0 && nameMatches.length === 0) {
      suggestions.classList.remove('show');
      return;
    }
    
    let html = '';
    
    if (typeMatches.length > 0) {
      html += '<div style="padding: 8px 14px; font-size: 11px; color: var(--text-faint); text-transform: uppercase;">Types</div>';
      html += typeMatches.map(type => {
        const highlighted = type.replace(new RegExp(`^${query}`, 'i'), `<strong>${query}</strong>`);
        return `<div class="autocomplete-item" data-type="${type}">🏷️ ${highlighted} (type)</div>`;
      }).join('');
    }
    
    if (nameMatches.length > 0) {
      html += '<div style="padding: 8px 14px; font-size: 11px; color: var(--text-faint); text-transform: uppercase;">Pokémon</div>';
      html += nameMatches.map(name => {
        const highlighted = name.replace(new RegExp(`^${query}`, 'i'), `<strong>${query}</strong>`);
        return `<div class="autocomplete-item" data-name="${name}">${highlighted}</div>`;
      }).join('');
    }
    
    suggestions.innerHTML = html;
    suggestions.classList.add('show');
    
    // Click on suggestion
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
  
  async function searchPokemonByType() {
    const type = input.value.trim().toLowerCase();
    if (!type) return;
    
    if (suggestions) suggestions.classList.remove('show');
    
    result.innerHTML = '<div class="api-result-loading"><div class="recipe-loading-spinner"></div></div>';
    
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      
      if (!res.ok) {
        result.innerHTML = '<div class="api-result-error">Type not found. Available types: ' + pokemonTypes.join(', ') + '</div>';
        return;
      }
      
      const data = await res.json();
      const pokemon = data.pokemon.slice(0, 12).map(p => p.pokemon);
      
      let html = `<div style="margin-bottom: 16px; font-size: 14px; color: var(--text-muted);">Found ${data.pokemon.length} ${type} type Pokémon</div>`;
      html += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px;">';
      
      for (const p of pokemon) {
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.name}`);
          const pokeData = await res.json();
          
          html += `
            <div style="background: var(--bg); border-radius: 8px; padding: 12px; text-align: center; cursor: pointer;" onclick="document.getElementById('pokemonInput').value='${p.name}'; document.getElementById('pokemonBtn').click();">
              <img src="${pokeData.sprites.other['official-artwork'].front_default}" alt="${p.name}" style="width: 80px; height: 80px; object-fit: contain;">
              <div style="font-size: 13px; font-weight: 600; text-transform: capitalize; margin-top: 4px;">${p.name}</div>
              <div style="font-size: 11px; color: var(--text-muted);">#${pokeData.id}</div>
            </div>
          `;
        } catch (e) {
          console.error('Failed to load', p.name);
        }
      }
      
      html += '</div>';
      result.innerHTML = html;
    } catch (e) {
      result.innerHTML = '<div class="api-result-error">Error searching by type</div>';
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
  
  btn.addEventListener('click', () => {
    const query = input.value.trim().toLowerCase();
    // Check if it's a type
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
  
  // Load Pokemon names on init
  loadPokemonNames();
})();

// ================================================================
// COUNTRY API (countries.dev)
// https://countries.dev/
// Endpoints: /name/{name}, /alpha/{code}, /countries, /region/{region}, /currency/{code}, /lang/{code}, /callingcode/{code}
// ================================================================
(function initCountrySearch() {
  const input = document.getElementById('countryInput');
  const btn = document.getElementById('countryBtn');
  const result = document.getElementById('countryResult');
  
  if (!input || !btn) return;
  
  // Store all countries for autocomplete and random selection
  let allCountries = [];
  
  // Fetch all countries on init for autocomplete
  async function loadAllCountries() {
    try {
      const res = await fetch('https://countries.dev/countries');
      const data = await res.json();
      // API returns array directly
      allCountries = Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Failed to load countries list');
    }
  }
  loadAllCountries();
  
  // Show autocomplete suggestions
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
    
    // Match by name, alpha2Code, or alpha3Code
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
      const highlighted = name.replace(new RegExp(query, 'i'), `<strong>${query}</strong>`);
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
      // Detect if input is an ISO code (2 or 3 uppercase letters)
      const isAlphaCode = /^[A-Za-z]{2,3}$/.test(query);
      
      let url;
      if (isAlphaCode) {
        // Use /alpha/{code} endpoint for ISO codes
        url = `https://countries.dev/alpha/${encodeURIComponent(query.toUpperCase())}`;
      } else {
        // Use /name/{name} endpoint for country names
        url = `https://countries.dev/name/${encodeURIComponent(query)}`;
      }
      
      const res = await fetch(url);
      
      if (!res.ok) {
        result.innerHTML = '<div class="api-result-empty">Country not found. Try a different name or ISO code (e.g. US, JPN).</div>';
        return;
      }
      
      const response = await res.json();
      
      // API returns an array, get first element
      const country = Array.isArray(response) ? response[0] : response;
      
      if (!country || !country.name) {
        result.innerHTML = '<div class="api-result-empty">Country not found. Try a different name or ISO code (e.g. US, JPN).</div>';
        return;
      }
      
      // Parse response - countries.dev uses specific field names
      const name = country.name || query;
      const nativeName = country.nativeName || '';
      const capital = country.capital || 'N/A';
      
      // Currency is an array of objects
      let currency = 'N/A';
      if (country.currencies && Array.isArray(country.currencies) && country.currencies.length > 0) {
        const curr = country.currencies[0];
        currency = `${curr.symbol || ''} ${curr.code}`.trim();
      }
      
      // Calling codes is an array
      let phoneCode = 'N/A';
      if (country.callingCodes && Array.isArray(country.callingCodes) && country.callingCodes.length > 0) {
        phoneCode = country.callingCodes[0];
      }
      
      const region = country.region || 'N/A';
      const subregion = country.subregion || '';
      const population = country.population ? country.population.toLocaleString() : 'N/A';
      const area = country.area ? `${country.area.toLocaleString()} km²` : 'N/A';
      
      // Languages is an array of objects with 'name' property
      let languages = 'N/A';
      if (country.languages && Array.isArray(country.languages) && country.languages.length > 0) {
        languages = country.languages.map(l => l.name || l).join(', ');
      }
      
      // Flag is an emoji
      let flag = '';
      if (country.flag) {
        flag = `<div style="font-size:64px;margin-bottom:16px;">${country.flag}</div>`;
      }
      
      // ISO codes - use correct field names
      const alpha2 = country.alpha2Code || '';
      const alpha3 = country.alpha3Code || '';
      
      result.innerHTML = `
        <div class="country-card">
          ${flag}
          <div class="country-name">${name}</div>
          ${nativeName && nativeName !== name ? `<div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">${nativeName}</div>` : ''}
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
              <div class="country-label">Currency</div>
              <div class="country-value">${currency}</div>
            </div>
            <div class="country-info-item">
              <div class="country-label">Phone Code</div>
              <div class="country-value">+${phoneCode}</div>
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
              <div class="country-label">Languages</div>
              <div class="country-value">${languages}</div>
            </div>
            ${alpha2 || alpha3 ? `
            <div class="country-info-item">
              <div class="country-label">ISO Codes</div>
              <div class="country-value">${alpha2}${alpha3 ? ' / ' + alpha3 : ''}</div>
            </div>
            ` : ''}
          </div>
        </div>
      `;
      
      // Save to localStorage
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
  
  // Autocomplete on input
  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      showCountrySuggestions(input.value.trim());
    }, 150);
  });
  
  // Hide suggestions when clicking outside
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
// TOOL CARDS REORDER (Move Up/Down)
// LocalStorage persistence for card order
// ================================================================
(function() {
  const toolsSection = document.getElementById('toolsSection');
  if (!toolsSection) return;

  // Restore saved order from localStorage
  function restoreOrder() {
    const savedOrder = JSON.parse(localStorage.getItem('toolOrder') || '[]');
    if (savedOrder.length === 0) return;

    const cards = Array.from(toolsSection.querySelectorAll('.api-tool-card'));
    const cardMap = new Map();
    cards.forEach(card => {
      cardMap.set(card.dataset.tool, card);
    });

    // Reorder cards based on saved order
    savedOrder.forEach(toolId => {
      const card = cardMap.get(toolId);
      if (card) {
        toolsSection.appendChild(card);
      }
    });
  }

  // Update button states (disable first up, last down)
  function updateButtons() {
    const cards = Array.from(toolsSection.querySelectorAll('.api-tool-card'));
    cards.forEach((card, index) => {
      const upBtn = card.querySelector('.card-move-up');
      const downBtn = card.querySelector('.card-move-down');
      
      if (upBtn) {
        upBtn.disabled = index === 0;
        upBtn.style.opacity = index === 0 ? '0.3' : '1';
        upBtn.style.pointerEvents = index === 0 ? 'none' : 'auto';
      }
      if (downBtn) {
        downBtn.disabled = index === cards.length - 1;
        downBtn.style.opacity = index === cards.length - 1 ? '0.3' : '1';
        downBtn.style.pointerEvents = index === cards.length - 1 ? 'none' : 'auto';
      }
    });
  }

  // Save current order to localStorage
  function saveOrder() {
    const cards = Array.from(toolsSection.querySelectorAll('.api-tool-card'));
    const order = cards.map(card => card.dataset.tool);
    localStorage.setItem('toolOrder', JSON.stringify(order));
    updateButtons();
  }

  // Attach click handlers to all move buttons
  function attachHandlers() {
    const cards = Array.from(toolsSection.querySelectorAll('.api-tool-card'));
    
    cards.forEach((card) => {
      const upBtn = card.querySelector('.card-move-up');
      const downBtn = card.querySelector('.card-move-down');

      if (upBtn) {
        upBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const currentCards = Array.from(toolsSection.querySelectorAll('.api-tool-card'));
          const currentIndex = currentCards.indexOf(card);
          if (currentIndex > 0) {
            toolsSection.insertBefore(card, currentCards[currentIndex - 1]);
            saveOrder();
          }
        });
      }

      if (downBtn) {
        downBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const currentCards = Array.from(toolsSection.querySelectorAll('.api-tool-card'));
          const currentIndex = currentCards.indexOf(card);
          if (currentIndex < currentCards.length - 1) {
            toolsSection.insertBefore(currentCards[currentIndex + 1], card);
            saveOrder();
          }
        });
      }
    });
  }

  // Initialize: restore order, attach handlers, update buttons
  restoreOrder();
  attachHandlers();
  updateButtons();
})();

// ================================================================
// RANDOM RECOMMENDATIONS
// Random book, Pokemon, and country buttons
// ================================================================
(function initRandomFeatures() {
  // Book random
  const bookRandomBtn = document.getElementById('bookRandomBtn');
  if (bookRandomBtn) {
    bookRandomBtn.addEventListener('click', async () => {
      const input = document.getElementById('bookInput');
      const btn = document.getElementById('bookBtn');
      if (!input || !btn) return;
      
      // Use random subjects to get random books
      const subjects = ['fiction', 'mystery', 'science', 'history', 'fantasy', 'romance', 'adventure', 'philosophy', 'art', 'music', 'travel', 'cooking', 'technology', 'biography', 'poetry'];
      const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
      const randomPage = Math.floor(Math.random() * 50) + 1;
      
      try {
        const res = await fetch(`https://openlibrary.org/subjects/${randomSubject}.json?limit=1&offset=${randomPage}`);
        const data = await res.json();
        
        if (data.works && data.works.length > 0) {
          const book = data.works[0];
          input.value = book.title;
          btn.click();
        }
      } catch (e) {
        console.error('Failed to get random book');
      }
    });
  }
  
  // Pokemon random
  const pokemonRandomBtn = document.getElementById('pokemonRandomBtn');
  if (pokemonRandomBtn) {
    pokemonRandomBtn.addEventListener('click', () => {
      const input = document.getElementById('pokemonInput');
      const btn = document.getElementById('pokemonBtn');
      if (!input || !btn) return;
      
      // Random Pokemon ID (1-1010)
      const randomId = Math.floor(Math.random() * 1010) + 1;
      input.value = randomId;
      btn.click();
    });
  }
  
  // Country random
  const countryRandomBtn = document.getElementById('countryRandomBtn');
  if (countryRandomBtn) {
    countryRandomBtn.addEventListener('click', () => {
      const input = document.getElementById('countryInput');
      const btn = document.getElementById('countryBtn');
      if (!input || !btn) return;
      
      // Try to get countries from the initCountrySearch scope via localStorage or fetch fresh
      // Since allCountries is in a different scope, we fetch /countries again
      fetch('https://countries.dev/countries')
        .then(res => res.json())
        .then(data => {
          const countries = Array.isArray(data) ? data : [];
          if (countries.length > 0) {
            const randomCountry = countries[Math.floor(Math.random() * countries.length)];
            input.value = randomCountry.name;
            btn.click();
          }
        })
        .catch(() => {
          // Fallback to hardcoded list if API fails
          const fallbackCountries = [
            'Japan', 'Thailand', 'United States', 'Germany', 'Brazil', 'Australia',
            'France', 'Italy', 'Spain', 'Canada', 'Mexico', 'India', 'China',
            'South Korea', 'United Kingdom', 'Netherlands', 'Sweden', 'Norway'
          ];
          const randomCountry = fallbackCountries[Math.floor(Math.random() * fallbackCountries.length)];
          input.value = randomCountry;
          btn.click();
        });
    });
  }
})();

// ================================================================
// CURRENCY COUNTRY SEARCH
// Search country to auto-fill currency converter
// Uses countries.dev API
// ================================================================
(function initCurrencyCountrySearch() {
  const input = document.getElementById('currencyCountryInput');
  const suggestions = document.getElementById('currencyCountrySuggestions');
  const fromSelect = document.getElementById('currencyFrom');
  const toSelect = document.getElementById('currencyTo');
  
  if (!input || !suggestions) return;
  
  // Store all countries for filtering
  let allCountries = [];
  
  // Fetch all countries on init
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
      
      // Filter countries by name
      const matches = allCountries
        .filter(c => (c.name || '').toLowerCase().includes(q))
        .slice(0, 8);
      
      if (matches.length === 0) {
        suggestions.classList.remove('show');
        return;
      }
      
      suggestions.innerHTML = matches.map(country => {
        const name = country.name;
        // Extract currency code from currencies array
        let currencyCode = '';
        if (country.currencies && Array.isArray(country.currencies) && country.currencies.length > 0) {
          currencyCode = country.currencies[0].code || '';
        }
        
        const highlighted = name.replace(new RegExp(query, 'i'), `<strong>${query}</strong>`);
        return `<div class="autocomplete-item" data-currency="${currencyCode}" data-name="${name}">${highlighted}${currencyCode ? ` (${currencyCode})` : ''}</div>`;
      }).join('');
      
      suggestions.classList.add('show');
      
      suggestions.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
          const currency = item.dataset.currency;
          const name = item.dataset.name;
          
          // Set the "from" currency to the selected country's currency
          if (currency) {
            fromSelect.value = currency;
          }
          
          // Clear the input
          input.value = name;
          
          // Hide suggestions
          suggestions.classList.remove('show');
          
          // Trigger conversion
          const amount = document.getElementById('currencyAmount');
          if (amount) {
            amount.dispatchEvent(new Event('input'));
          }
        });
      });
    }, 150);
  });
  
  // Hide suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!suggestions.contains(e.target) && e.target !== input) {
      suggestions.classList.remove('show');
    }
  });
})();
