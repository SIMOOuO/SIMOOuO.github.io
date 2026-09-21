/* ============================================
   SPA.js
   Single Page Application navigation module.
   Intercepts internal link clicks and swaps
   page content without full reload, keeping
   audio context alive across pages.
   ============================================ */

const SPA = (function () {
  let _initialized = false;

  // Pages that should use SPA navigation
  const SPA_PAGES = ['index.html', 'tools.html', 'food.html', 'anime.html', 'game.html', 'about.html'];

  // Check if a URL is an internal SPA page
  function _isInternalPage(url) {
    try {
      const u = new URL(url, window.location.origin);
      if (u.origin !== window.location.origin) return false;
      const pathname = u.pathname.split('/').pop() || 'index.html';
      return SPA_PAGES.includes(pathname);
    } catch {
      return false;
    }
  }

  // Fetch page HTML and extract body content
  async function _fetchPage(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return {
      title: doc.title,
      body: doc.body.innerHTML,
      bodyClass: doc.body.className,
      theme: doc.documentElement.getAttribute('data-theme')
    };
  }

  // Navigate to a new page
  async function _navigate(url, pushState = true) {
    try {
      // Show subtle loading indicator
      document.body.style.opacity = '0.7';
      document.body.style.transition = 'opacity 0.15s ease';

      const page = await _fetchPage(url);

      // Update page content
      document.body.innerHTML = page.body;
      document.body.className = page.bodyClass || '';
      document.title = page.title;

      if (page.theme) {
        document.documentElement.setAttribute('data-theme', page.theme);
      }

      // Update URL
      if (pushState) {
        window.history.pushState({}, '', url);
      }

      // Restore opacity
      requestAnimationFrame(() => {
        document.body.style.opacity = '1';
      });

      // Re-initialize page-specific scripts
      _reinitializeScripts();

      // Scroll to top
      window.scrollTo(0, 0);

    } catch (err) {
      console.error('SPA navigation failed:', err);
      // Fallback to full page load
      window.location.href = url;
    }
  }

  // Re-initialize scripts after page swap
  function _reinitializeScripts() {
    // Re-init navigation
    if (typeof initNav === 'function') initNav();

    // Re-init theme toggle
    if (typeof initTheme === 'function') initTheme();

    // Re-init page-specific features
    const pathname = window.location.pathname.split('/').pop() || 'index.html';

    if (pathname === 'index.html' || pathname === '') {
      // Home page features
      if (typeof initTools === 'function') initTools();
      if (typeof initSearch === 'function') initSearch();
      if (typeof initWeather === 'function') initWeather();
    }

    if (pathname === 'tools.html') {
      if (typeof initToolsPage === 'function') initToolsPage();
    }

    if (pathname === 'food.html') {
      if (typeof initRecipes === 'function') initRecipes();
    }

    if (pathname === 'anime.html') {
      if (typeof initAnimePage === 'function') initAnimePage();
    }

    // Re-bind settings button
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn && typeof SettingsPanel !== 'undefined') {
      settingsBtn.addEventListener('click', () => SettingsPanel.toggle());
    }

    // Re-bind scroll-to-top button
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          scrollTopBtn.classList.add('visible');
        } else {
          scrollTopBtn.classList.remove('visible');
        }
      }, { passive: true });

      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Re-bind disclaimer modal
    const openDisclaimer = document.getElementById('openDisclaimer');
    const closeModal = document.getElementById('closeModal');
    const disclaimerModal = document.getElementById('disclaimerModal');
    const acceptDisclaimer = document.getElementById('acceptDisclaimer');

    if (openDisclaimer && disclaimerModal) {
      openDisclaimer.addEventListener('click', () => {
        disclaimerModal.classList.add('show');
      });
    }

    if (closeModal && disclaimerModal) {
      closeModal.addEventListener('click', () => {
        disclaimerModal.classList.remove('show');
      });
    }

    if (acceptDisclaimer && disclaimerModal) {
      acceptDisclaimer.addEventListener('click', () => {
        disclaimerModal.classList.remove('show');
      });
    }
  }

  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    _navigate(window.location.href, false);
  });

  return {
    init() {
      if (_initialized) return;
      _initialized = true;

      // Intercept all link clicks
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Skip external links, anchors, and non-SPA pages
        if (href.startsWith('http') && !href.includes(window.location.hostname)) return;
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        if (link.target === '_blank') return;

        // Check if it's an internal SPA page
        if (_isInternalPage(href)) {
          e.preventDefault();
          _navigate(href);
        }
      });
    },

    // Manual navigation
    navigate(url) {
      _navigate(url);
    }
  };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SPA.init());
} else {
  SPA.init();
}
