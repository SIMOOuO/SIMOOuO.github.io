/* ============================================
   settings-init.js
   Bootstraps the settings system on page load.
   Include AFTER SettingsStorage, AudioManager,
   SettingsPanel, and main.js.
   ============================================ */

(function () {
  // Initialize in correct order
  // SettingsStorage is already available (IIFE, synchronous)
  // AudioManager needs DOM ready
  // SettingsPanel needs DOM ready

  document.addEventListener('DOMContentLoaded', function () {
    // 1. Init audio manager (creates audio element, applies saved volume)
    AudioManager.init();

    // 2. Init settings panel (builds UI, applies theme + motion prefs)
    SettingsPanel.init();

    // 3. Wire up the settings gear button in the nav
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', function () {
        SettingsPanel.toggle();
      });
    }
  });
})();
