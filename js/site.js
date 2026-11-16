/**
 * site.js — EnvMoss
 *
 * Perilaku global lintas halaman (Landing, Tool, Guide):
 *   - Penanda tautan navigasi aktif (aria-current="page")
 *   - Kontrol bahasa EN/ID → preferensi envmoss:language
 *   - Kontrol tema Light/Dark/System → preferensi envmoss:theme
 *
 * Aturan privasi (wajib):
 *   - Hanya preferensi UI non-sensitif yang boleh ditulis ke localStorage:
 *     envmoss:language (en|id) dan envmoss:theme (light|dark|system).
 *   - Tidak ada fetch/XHR/jaringan untuk data apa pun.
 *   - Semua akses storage dibungkus try/catch; kegagalan tidak boleh
 *     menggagalkan halaman.
 */

import { initI18n, applyI18n, onLanguageChange, t } from './i18n.js';

(function () {
  'use strict';

  var root = document.documentElement;

  // -------------------------------------------------------------------------
  // Utilitas storage yang aman
  // -------------------------------------------------------------------------

  function storageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      /* storage diblokir — preferensi tetap berlaku dalam memori halaman */
    }
  }

  // -------------------------------------------------------------------------
  // Navigasi aktif
  // -------------------------------------------------------------------------

  function markActiveNav() {
    var path = window.location.pathname.replace(/\\/g, '/');
    var active = null;
    if (path.indexOf('/app') !== -1) {
      active = 'tool';
    } else if (path.indexOf('/guide') !== -1) {
      active = 'guide';
    }

    var links = document.querySelectorAll('.site-nav__link');
    for (var i = 0; i < links.length; i += 1) {
      var link = links[i];
      if (active && link.getAttribute('data-nav') === active) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    }
  }

  // -------------------------------------------------------------------------
  // Bahasa EN/ID
  // -------------------------------------------------------------------------

  function currentLang() {
    var lang = root.getAttribute('data-lang') || root.getAttribute('lang') || 'en';
    return lang === 'id' ? 'id' : 'en';
  }

  function applyLang(lang) {
    if (lang !== 'en' && lang !== 'id') {
      return;
    }
    root.setAttribute('lang', lang);
    root.setAttribute('data-lang', lang);
    storageSet('envmoss:language', lang);

    var buttons = document.querySelectorAll('.site-lang__btn');
    for (var i = 0; i < buttons.length; i += 1) {
      var btn = buttons[i];
      var isActive = btn.getAttribute('data-lang-set') === lang;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }

    // Terapkan kamus terjemahan ke seluruh DOM dan beri tahu modul halaman
    // (mis. app.js) untuk render ulang konten dinamis.
    applyI18n(lang);
  }

  function bindLangControls() {
    var buttons = document.querySelectorAll('.site-lang__btn');
    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].addEventListener('click', function () {
        applyLang(this.getAttribute('data-lang-set'));
      });
    }
    applyLang(currentLang());
  }

  // -------------------------------------------------------------------------
  // Tema Light / Dark / System
  // -------------------------------------------------------------------------

  var THEME_ORDER = ['light', 'dark', 'system'];
  var systemThemeQuery = null;

  function prefersDark() {
    try {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return true;
      }
    } catch (e) { /* abaikan */ }
    return false;
  }

  function resolveTheme(pref) {
    if (pref === 'light' || pref === 'dark') {
      return pref;
    }
    return prefersDark() ? 'dark' : 'light';
  }

  function currentThemePref() {
    var pref = root.getAttribute('data-theme-pref');
    if (pref === 'light' || pref === 'dark' || pref === 'system') {
      return pref;
    }
    var stored = storageGet('envmoss:theme');
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return 'system';
  }

  function applyTheme(pref) {
    if (THEME_ORDER.indexOf(pref) === -1) {
      return;
    }
    root.setAttribute('data-theme-pref', pref);
    root.setAttribute('data-theme', resolveTheme(pref));
    storageSet('envmoss:theme', pref);

    var toggle = document.getElementById('site-theme-toggle');
    if (toggle) {
      toggle.setAttribute('data-state', pref);
      refreshThemeLabel();
    }

    // Saat mode System aktif, ikuti perubahan preferensi OS secara langsung.
    watchSystemTheme(pref === 'system');
  }

  function watchSystemTheme(enabled) {
    try {
      if (!window.matchMedia) {
        return;
      }
      if (!systemThemeQuery) {
        systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      }
      if (enabled && systemThemeQuery.addEventListener) {
        systemThemeQuery.removeEventListener('change', onSystemThemeChange);
        systemThemeQuery.addEventListener('change', onSystemThemeChange);
      } else if (systemThemeQuery.removeEventListener) {
        systemThemeQuery.removeEventListener('change', onSystemThemeChange);
      }
    } catch (e) { /* matchMedia tidak tersedia — abaikan */ }
  }

  function refreshThemeLabel() {
    var toggle = document.getElementById('site-theme-toggle');
    if (!toggle) {
      return;
    }
    var pref = currentThemePref();
    toggle.setAttribute(
      'aria-label',
      t('theme.ariaState', { state: t('theme.' + pref) })
    );
  }

  function onSystemThemeChange() {
    if (currentThemePref() === 'system') {
      root.setAttribute('data-theme', prefersDark() ? 'dark' : 'light');
    }
  }

  function bindThemeControl() {
    var toggle = document.getElementById('site-theme-toggle');
    if (!toggle) {
      return;
    }
    toggle.addEventListener('click', function () {
      var current = currentThemePref();
      var next = THEME_ORDER[(THEME_ORDER.indexOf(current) + 1) % THEME_ORDER.length];
      applyTheme(next);
    });
    applyTheme(currentThemePref());
  }

  // -------------------------------------------------------------------------
  // Init
  // -------------------------------------------------------------------------

  // Terapkan kamus bahasa dari preferensi bootstrap sebelum interaksi apa pun.
  initI18n();

  markActiveNav();
  bindLangControls();
  bindThemeControl();

  // Label aria kontrol tema mengikuti bahasa aktif.
  onLanguageChange(function () {
    refreshThemeLabel();
  });
})();
