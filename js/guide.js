/**
 * guide.js — EnvMoss
 *
 * Perilaku khusus halaman Guide:
 *   - Toggle daftar isi (table of contents) pada layar sempit.
 *     Di layar lebar TOC tampil sebagai sidebar sticky dan toggle disembunyikan
 *     oleh CSS; di mobile daftar disembunyikan sampai tombol ditekan.
 *
 * Tidak ada jaringan, storage, atau dependensi eksternal.
 */

(function () {
  'use strict';

  var nav = document.querySelector('.guide-toc');
  var toggle = document.getElementById('guide-toc-toggle');
  var list = document.getElementById('guide-toc-list');

  if (!nav || !toggle || !list) {
    return;
  }

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function isOpen() {
    return nav.classList.contains('is-open');
  }

  toggle.addEventListener('click', function () {
    setOpen(!isOpen());
  });

  // Menutup daftar setelah pengguna memilih section (pengalaman mobile).
  list.addEventListener('click', function (event) {
    if (event.target && event.target.closest && event.target.closest('a')) {
      setOpen(false);
    }
  });

  // Escape menutup daftar yang terbuka.
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
})();
