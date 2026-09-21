/* ============================================
   SettingsStorage.js
   Persistent settings via localStorage.
   Single source of truth for all user preferences.
   ============================================ */

const SettingsStorage = (function () {
  const STORAGE_KEY = 'simo_settings';

  // Default values for every setting
  const DEFAULTS = {
    bgMusicVolume: 0.5,       // 0 – 1
    bgMusicEnabled: true,     // master toggle for bg music
    uiSoundVolume: 0.4,       // 0 – 1
    uiSoundEnabled: true,     // master toggle for UI sounds
    autoPlay: true,           // auto-start bg music on load
    theme: 'system',          // 'light' | 'dark' | 'system'
    reducedMotion: false,
  };

  // ---- helpers ----
  function _read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
    } catch {
      return { ...DEFAULTS };
    }
  }

  function _write(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch { /* storage full or blocked — silently ignore */ }
  }

  // ---- public API ----
  return {
    /** Get one setting value */
    get(key) {
      return _read()[key];
    },

    /** Set one setting value */
    set(key, value) {
      const data = _read();
      data[key] = value;
      _write(data);
      // Dispatch custom event so other modules can react
      window.dispatchEvent(new CustomEvent('simo:settings-changed', {
        detail: { key, value, all: data }
      }));
    },

    /** Get all settings as an object */
    getAll() {
      return _read();
    },

    /** Reset everything to defaults */
    reset() {
      _write({ ...DEFAULTS });
      window.dispatchEvent(new CustomEvent('simo:settings-changed', {
        detail: { key: '__reset__', value: null, all: DEFAULTS }
      }));
    },

    /** The default values (read-only reference) */
    DEFAULTS: Object.freeze({ ...DEFAULTS }),
  };
})();
