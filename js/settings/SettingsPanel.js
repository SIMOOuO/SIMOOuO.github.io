/* ============================================
   SettingsPanel.js
   Builds and manages the settings overlay UI.
   Depends on: SettingsStorage, AudioManager
   ============================================ */

const SettingsPanel = (function () {
  let panel = null;
  let backdrop = null;
  let isOpen = false;

  // ---- Build DOM ----
  function _buildPanel() {
    // Backdrop
    backdrop = document.createElement('div');
    backdrop.className = 'settings-backdrop';
    backdrop.addEventListener('click', close);

    // Panel container
    panel = document.createElement('div');
    panel.className = 'settings-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Settings');

    panel.innerHTML = _getPanelHTML();

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);

    _bindEvents();
    _syncUI();
  }

  function _getPanelHTML() {
    return `
      <!-- Header -->
      <div class="sp-header">
        <div class="sp-header-left">
          <span class="sp-brand">SIMO / SYSTEM PREFERENCES</span>
        </div>
        <button class="sp-close-btn" aria-label="Close settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Title -->
      <div class="sp-title-section">
        <h2 class="sp-title">SYSTEM SETTINGS</h2>
        <p class="sp-subtitle">Terminal Preference Settings</p>
      </div>

      <!-- Scrollable content -->
      <div class="sp-body">

        <!-- Section: Background Music -->
        <div class="sp-section">
          <div class="sp-section-header">
            <div>
              <div class="sp-section-label">BACKGROUND MUSIC</div>
              <div class="sp-section-desc">Observation Room - Background Music</div>
            </div>
            <label class="sp-toggle">
              <input type="checkbox" id="spBgMusicToggle">
              <span class="sp-toggle-track"></span>
            </label>
          </div>
          <div class="sp-slider-row">
            <span class="sp-slider-label">Volume</span>
            <input type="range" id="spBgVolume" class="sp-slider" min="0" max="100" value="50">
            <span class="sp-slider-value" id="spBgVolumeVal">50%</span>
          </div>
        </div>

        <!-- Section: Interface Sound -->
        <div class="sp-section">
          <div class="sp-section-header">
            <div>
              <div class="sp-section-label">INTERFACE SOUND</div>
              <div class="sp-section-desc">Operation & Startup Sounds</div>
            </div>
            <label class="sp-toggle">
              <input type="checkbox" id="spUiSoundToggle">
              <span class="sp-toggle-track"></span>
            </label>
          </div>
          <div class="sp-slider-row">
            <span class="sp-slider-label">Volume</span>
            <input type="range" id="spUiVolume" class="sp-slider" min="0" max="100" value="40">
            <span class="sp-slider-value" id="spUiVolumeVal">40%</span>
          </div>
        </div>

        <!-- Section: Auto-Play -->
        <div class="sp-section">
          <div class="sp-section-header">
            <div>
              <div class="sp-section-label">AUTO-PLAY</div>
              <div class="sp-section-desc">Automatically start background music on page load</div>
            </div>
            <label class="sp-toggle">
              <input type="checkbox" id="spAutoPlayToggle">
              <span class="sp-toggle-track"></span>
            </label>
          </div>
          <p class="sp-note">When enabled, music will start playing when the page loads. Browsers may require a first interaction before audio can play.</p>
        </div>

        <!-- Divider -->
        <div class="sp-divider"></div>

        <!-- Section: Theme -->
        <div class="sp-section">
          <div class="sp-section-header">
            <div>
              <div class="sp-section-label">INTERFACE COLOR THEME</div>
              <div class="sp-section-desc">Switch between light and dark appearance</div>
            </div>
          </div>
          <div class="sp-theme-buttons">
            <button class="sp-theme-btn" data-theme="system">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              Follow System
            </button>
            <button class="sp-theme-btn" data-theme="light">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              Light
            </button>
            <button class="sp-theme-btn" data-theme="dark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              Dark
            </button>
          </div>
        </div>

        <!-- Section: Reduced Motion -->
        <div class="sp-section">
          <div class="sp-section-header">
            <div>
              <div class="sp-section-label">REDUCED MOTION</div>
              <div class="sp-section-desc">Reduce camera movement and transition animations</div>
            </div>
            <label class="sp-toggle">
              <input type="checkbox" id="spReducedMotionToggle">
              <span class="sp-toggle-track"></span>
            </label>
          </div>
          <p class="sp-note" id="spMotionNote">Currently using full animation effects.</p>
        </div>

      </div>

      <!-- Footer -->
      <div class="sp-footer">
        <button class="sp-footer-btn sp-btn-reset" id="spResetBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
          </svg>
          RESET DEFAULTS
        </button>
        <button class="sp-footer-btn sp-btn-close" id="spCloseBtn">CLOSE</button>
      </div>
    `;
  }

  // ---- Event Binding ----
  function _bindEvents() {
    // Close buttons
    panel.querySelector('.sp-close-btn').addEventListener('click', close);
    panel.querySelector('#spCloseBtn').addEventListener('click', close);

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) close();
    });

    // Background Music toggle
    panel.querySelector('#spBgMusicToggle').addEventListener('change', (e) => {
      SettingsStorage.set('bgMusicEnabled', e.target.checked);
      if (e.target.checked) {
        AudioManager.play();
      } else {
        AudioManager.pause();
      }
      AudioManager.playUIClick();
    });

    // Background Music volume
    panel.querySelector('#spBgVolume').addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      panel.querySelector('#spBgVolumeVal').textContent = val + '%';
      SettingsStorage.set('bgMusicVolume', val / 100);
      AudioManager.setVolume(val / 100);
    });

    // UI Sound toggle
    panel.querySelector('#spUiSoundToggle').addEventListener('change', (e) => {
      SettingsStorage.set('uiSoundEnabled', e.target.checked);
      if (e.target.checked) AudioManager.playUIClick();
    });

    // UI Sound volume
    panel.querySelector('#spUiVolume').addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      panel.querySelector('#spUiVolumeVal').textContent = val + '%';
      SettingsStorage.set('uiSoundVolume', val / 100);
    });

    // Auto-play toggle
    panel.querySelector('#spAutoPlayToggle').addEventListener('change', (e) => {
      SettingsStorage.set('autoPlay', e.target.checked);
      AudioManager.playUIClick();
    });

    // Theme buttons
    panel.querySelectorAll('.sp-theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        SettingsStorage.set('theme', theme);
        _applyTheme(theme);
        AudioManager.playUIClick();
      });
    });

    // Reduced Motion toggle
    panel.querySelector('#spReducedMotionToggle').addEventListener('change', (e) => {
      SettingsStorage.set('reducedMotion', e.target.checked);
      _applyReducedMotion(e.target.checked);
      AudioManager.playUIClick();
    });

    // Reset button
    panel.querySelector('#spResetBtn').addEventListener('click', () => {
      SettingsStorage.reset();
      _syncUI();
      _applyTheme(SettingsStorage.get('theme'));
      _applyReducedMotion(SettingsStorage.get('reducedMotion'));
      // Re-apply audio
      if (SettingsStorage.get('bgMusicEnabled')) {
        AudioManager.play();
      } else {
        AudioManager.pause();
      }
      AudioManager.playUIClick();
    });

    // Listen for external settings changes
    window.addEventListener('simo:settings-changed', () => {
      _syncUI();
    });
  }

  // ---- Sync UI to current settings ----
  function _syncUI() {
    if (!panel) return;
    const s = SettingsStorage.getAll();

    panel.querySelector('#spBgMusicToggle').checked = s.bgMusicEnabled;
    panel.querySelector('#spBgVolume').value = Math.round(s.bgMusicVolume * 100);
    panel.querySelector('#spBgVolumeVal').textContent = Math.round(s.bgMusicVolume * 100) + '%';

    panel.querySelector('#spUiSoundToggle').checked = s.uiSoundEnabled;
    panel.querySelector('#spUiVolume').value = Math.round(s.uiSoundVolume * 100);
    panel.querySelector('#spUiVolumeVal').textContent = Math.round(s.uiSoundVolume * 100) + '%';

    panel.querySelector('#spAutoPlayToggle').checked = s.autoPlay;
    panel.querySelector('#spReducedMotionToggle').checked = s.reducedMotion;

    // Theme buttons
    panel.querySelectorAll('.sp-theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === s.theme);
    });

    // Motion note
    const note = panel.querySelector('#spMotionNote');
    if (note) {
      note.textContent = s.reducedMotion
        ? 'Reduced motion is active. Animations are minimized.'
        : 'Currently using full animation effects.';
    }
  }

  // ---- Apply theme ----
  function _applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      html.setAttribute('data-theme', theme);
    }
    // Also persist in the old key for backwards compat with main.js theme toggle
    localStorage.setItem('theme', theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme);
  }

  // ---- Apply reduced motion ----
  function _applyReducedMotion(enabled) {
    document.documentElement.classList.toggle('reduce-motion', enabled);
  }

  // ---- Public API ----
  return {
    /** Initialize the settings panel — call once on DOMContentLoaded */
    init() {
      _buildPanel();

      // Apply saved theme
      const savedTheme = SettingsStorage.get('theme');
      _applyTheme(savedTheme);

      // Apply saved reduced motion
      _applyReducedMotion(SettingsStorage.get('reducedMotion'));

      // Listen for system theme changes when in "system" mode
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (SettingsStorage.get('theme') === 'system') {
          _applyTheme('system');
        }
      });
    },

    /** Open the settings panel */
    open() {
      if (!panel) return;
      isOpen = true;
      panel.classList.add('open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    },

    /** Close the settings panel */
    close() {
      if (!panel) return;
      isOpen = false;
      panel.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    },

    /** Toggle the settings panel */
    toggle() {
      isOpen ? close() : this.open();
    },

    /** Check if panel is currently open */
    get isOpen() {
      return isOpen;
    }
  };

  function close() {
    if (!panel) return;
    isOpen = false;
    panel.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
})();
