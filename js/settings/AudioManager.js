/* ============================================
   AudioManager.js
   Handles background music playback, volume,
   and UI sound effects.
   Persists playback position across page loads
   and fades in smoothly on resume.
   ============================================ */

const AudioManager = (function () {
  let bgAudio = null;
  let _fadeTimer = null;
  const FADE_DURATION = 1500; // ms for fade-in
  const POSITION_KEY = 'simo_bg_position';
  const VOLUME_KEY = 'simo_bg_volume';

  // ---- private helpers ----
  function _createAudio() {
    if (bgAudio) return;
    bgAudio = new Audio();
    bgAudio.loop = true;
    bgAudio.preload = 'auto';
    bgAudio.src = 'audio/Prod-by-24T.mp3';
    bgAudio.id = 'bgMusic';
    document.body.appendChild(bgAudio);
  }

  function _savePosition() {
    if (!bgAudio) return;
    try {
      localStorage.setItem(POSITION_KEY, bgAudio.currentTime.toString());
    } catch { /* ignore */ }
  }

  function _getSavedPosition() {
    try {
      const val = localStorage.getItem(POSITION_KEY);
      return val ? parseFloat(val) : 0;
    } catch {
      return 0;
    }
  }

  function _clearSavedPosition() {
    try { localStorage.removeItem(POSITION_KEY); } catch { /* ignore */ }
  }

  // Fade volume from 0 to target over duration
  function _fadeIn(targetVolume, duration) {
    if (!bgAudio) return;
    if (_fadeTimer) clearInterval(_fadeTimer);

    const steps = 30;
    const stepTime = duration / steps;
    const volumeStep = targetVolume / steps;
    let currentStep = 0;

    bgAudio.volume = 0;
    _fadeTimer = setInterval(() => {
      currentStep++;
      const newVol = Math.min(volumeStep * currentStep, targetVolume);
      bgAudio.volume = newVol;
      if (currentStep >= steps) {
        clearInterval(_fadeTimer);
        _fadeTimer = null;
      }
    }, stepTime);
  }

  function _applySettings() {
    if (!bgAudio) return;
    const s = SettingsStorage.getAll();

    if (!s.bgMusicEnabled) {
      bgAudio.pause();
      return;
    }

    const targetVolume = s.bgMusicVolume;

    // Restore saved position
    const savedPos = _getSavedPosition();
    if (savedPos > 0 && !isNaN(savedPos)) {
      bgAudio.currentTime = savedPos;
    }

    // Auto-play logic with fade-in
    if (s.autoPlay && bgAudio.paused) {
      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          _fadeIn(targetVolume, FADE_DURATION);
        }).catch(() => {
          // Browser blocked auto-play — will start on first user interaction
          _waitForInteraction(targetVolume);
        });
      }
    } else {
      // Not auto-playing, just set volume
      bgAudio.volume = targetVolume;
    }
  }

  function _waitForInteraction(targetVolume) {
    const handler = () => {
      const s = SettingsStorage.getAll();
      if (s.bgMusicEnabled && s.autoPlay && bgAudio.paused) {
        bgAudio.play().then(() => {
          _fadeIn(targetVolume, FADE_DURATION);
        }).catch(() => {});
      }
      document.removeEventListener('click', handler);
      document.removeEventListener('keydown', handler);
      document.removeEventListener('touchstart', handler);
    };
    document.addEventListener('click', handler, { once: false });
    document.addEventListener('keydown', handler, { once: false });
    document.addEventListener('touchstart', handler, { once: false });
  }

  // Save position before page unload
  window.addEventListener('beforeunload', () => {
    _savePosition();
  });

  // Also save on visibility change (tab switch, minimize)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      _savePosition();
    }
  });

  // ---- public API ----
  return {
    /** Initialize the audio manager — call once on DOMContentLoaded */
    init() {
      _createAudio();
      _applySettings();

      // Listen for settings changes
      window.addEventListener('simo:settings-changed', (e) => {
        const { key } = e.detail;
        if (['bgMusicVolume', 'bgMusicEnabled', 'autoPlay'].includes(key) || key === '__reset__') {
          _applySettings();
        }
      });
    },

    /** Play background music with optional fade-in */
    play(fadeIn = true) {
      if (!bgAudio) _createAudio();
      const targetVolume = SettingsStorage.get('bgMusicVolume');

      // Restore saved position if starting fresh
      if (bgAudio.currentTime === 0) {
        const savedPos = _getSavedPosition();
        if (savedPos > 0 && !isNaN(savedPos)) {
          bgAudio.currentTime = savedPos;
        }
      }

      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (fadeIn) {
            _fadeIn(targetVolume, FADE_DURATION);
          } else {
            bgAudio.volume = targetVolume;
          }
        }).catch(() => {});
      }
    },

    /** Pause background music */
    pause() {
      _savePosition();
      if (bgAudio) bgAudio.pause();
    },

    /** Set bg music volume (0–1) */
    setVolume(vol) {
      if (bgAudio) bgAudio.volume = Math.max(0, Math.min(1, vol));
    },

    /** Get current bg music volume */
    getVolume() {
      return bgAudio ? bgAudio.volume : SettingsStorage.get('bgMusicVolume');
    },

    /** Check if bg music is currently playing */
    isPlaying() {
      return bgAudio ? !bgAudio.paused : false;
    },

    /** Play a short UI click sound (uses Web Audio API for instant feedback) */
    playUIClick() {
      if (!SettingsStorage.get('uiSoundEnabled')) return;
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(SettingsStorage.get('uiSoundVolume') * 0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      } catch { /* Web Audio not supported */ }
    },

    /** Toggle bg music on/off and persist */
    toggleBgMusic() {
      const current = SettingsStorage.get('bgMusicEnabled');
      SettingsStorage.set('bgMusicEnabled', !current);
      return !current; // returns new state
    },

    /** Get current playback position */
    getCurrentTime() {
      return bgAudio ? bgAudio.currentTime : 0;
    },

    /** Seek to a specific time */
    seekTo(time) {
      if (bgAudio) bgAudio.currentTime = time;
    },
  };
})();
