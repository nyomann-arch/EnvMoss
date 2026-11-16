# Aturan AI Agent dan Batasan Proyek — EnvMoss

**Berkas:** `01-agent-rules.md`  
**Berlaku untuk:** seluruh pekerjaan AI Agent di repositori EnvMoss  
**Versi dokumen:** 1.1  
**Status:** Acuan kerja untuk baseline v1.0.0 dan roadmap pengembangan web berikutnya

Dokumen ini menetapkan cara AI Agent bekerja di proyek EnvMoss, batasan arsitektur dan keamanan, standar kualitas kode, serta alur inspeksi dan verifikasi. Tujuannya adalah membantu pengembang pemula membangun EnvMoss secara bertahap tanpa mengorbankan keamanan, kejelasan kode, atau ruang lingkup MVP.

---

## 1. Peran dan Prinsip Kerja Agent

Bertindak sebagai **software engineer dan UI/UX developer senior yang juga berperan sebagai mentor teknis**.

Prinsip kerja:

1. **Utamakan pemahaman.** Pahami kebutuhan dan kondisi proyek sebelum mengubah kode.
2. **Jelaskan dengan bahasa yang mudah dipahami.** Pengguna adalah developer pemula. Jelaskan alasan di balik keputusan teknis yang tidak langsung jelas.
3. **Tulis kode yang lengkap.** Jangan meninggalkan placeholder seperti `TODO`, `implement later`, atau komentar `tambahkan logika di sini`, kecuali bagian tersebut memang secara eksplisit berada di luar scope tugas.
4. **Pilih solusi sederhana.** Utamakan kode yang mudah dibaca, diuji, dan dipelihara daripada abstraksi atau pola yang tidak diperlukan.
5. **Jangan memperluas scope sendiri.** Implementasikan hanya pekerjaan yang diminta dan yang termasuk milestone aktif.
6. **Jujur mengenai hasil.** Jangan menyatakan fitur berhasil jika belum diverifikasi.

## 2. Otoritas Dokumen dan Penyelesaian Konflik

Folder `docs/` berisi tiga acuan proyek:

1. `01-agent-rules.md` — perilaku agent, keamanan, batasan teknis, dan workflow.
2. `02-prd-envmoss.md` — kebutuhan produk, logika komparasi, fitur, scope, dan acceptance criteria.
3. `03-design-systems.md` — identitas visual, design tokens, komponen UI, dan aksesibilitas.

Gunakan setiap dokumen sesuai tanggung jawabnya. Jangan menjadikan satu dokumen sebagai alasan untuk mengabaikan tanggung jawab dokumen lainnya.

### 2.1 Urutan keputusan

1. Instruksi terbaru yang secara eksplisit disetujui pengguna mengatasi keputusan lama yang sudah tidak berlaku.
2. Untuk keamanan dan batasan teknis, ikuti dokumen ini.
3. Untuk perilaku produk dan logika bisnis, ikuti PRD.
4. Untuk tampilan dan interaksi visual, ikuti Design System.

### 2.2 Jika terjadi konflik

- Jangan diam-diam memilih salah satu interpretasi jika konflik dapat mengubah keamanan, arsitektur, perilaku produk, atau hasil data.
- Jelaskan bagian yang bertentangan, dampaknya, dan pilihan yang tersedia.
- Minta klarifikasi hanya jika keputusan pengguna memang diperlukan untuk melanjutkan dengan aman dan benar.
- Jangan menolak perubahan hanya karena dokumen lama belum diperbarui. Jika pengguna secara eksplisit menyetujui perubahan scope atau arsitektur, bantu identifikasi dokumen yang perlu diselaraskan.
- Jangan menganggap izin untuk satu perubahan sebagai izin untuk memperluas fitur lain.

## 3. Arsitektur dan Batasan Teknologi

### 3.1 Arsitektur Web EnvMoss

Baseline EnvMoss v1.0.0 adalah **aplikasi web statis yang seluruh logika pemrosesan file-nya berjalan di browser pengguna**. Roadmap setelah v1.0.0 memperluas situs menjadi beberapa halaman statis (Landing, Tool, dan Guide), tetapi tidak mengubah prinsip pemrosesan file secara lokal.

Stack yang digunakan:

- HTML5 semantik.
- CSS3 murni.
- Vanilla JavaScript ES6+.
- JavaScript ES Modules bawaan browser jika diperlukan.
- Browser File API untuk membaca file lokal.
- Clipboard API untuk menyalin Markdown Checklist.
- Blob API dan `URL.createObjectURL()` untuk membuat file hasil unduhan.

### 3.2 Teknologi yang tidak boleh digunakan untuk MVP

Jangan menambahkan:

- Backend, server aplikasi, API routes, atau endpoint pemrosesan.
- Database atau cloud storage.
- Login, registrasi, atau autentikasi.
- React, Vue, Angular, Next.js, atau framework frontend lainnya.
- Tailwind CSS, Bootstrap, jQuery, atau CSS framework.
- Package manager atau bundler sebagai kebutuhan runtime aplikasi web.
- Library eksternal, CDN, font eksternal, analytics, atau script pihak ketiga untuk aplikasi web.
- Service Worker, PWA, Cache API untuk penyimpanan aplikasi, atau mekanisme offline-caching pada roadmap web saat ini.

Jangan membuat fitur tambahan di luar scope hanya karena teknologi tersebut tersedia. Pengecualian teknologi untuk CLI hanya dapat dipertimbangkan pada jalur pengembangan terpisah setelah pengguna menyetujui milestone CLI secara eksplisit; pengecualian tersebut tidak berlaku untuk aplikasi web.

### 3.3 Penjelasan penting tentang koneksi internet

Tidak adanya backend berarti **isi file `.env` tidak dikirim ke server**. Namun, ketika website statis dibuka dari GitHub Pages, Vercel, atau hosting lain, browser tetap perlu mengunduh HTML, CSS, dan JavaScript dari hosting tersebut.

Aplikasi web yang di-hosting tetap memerlukan koneksi internet untuk mengunduh aset statisnya. Source code yang sudah diunduh dapat dijalankan secara lokal melalui HTTP server tanpa internet, tetapi membuka `index.html` langsung melalui `file://` tidak dijamin bekerja karena penggunaan ES Modules. Roadmap web saat ini **tidak menjanjikan offline caching**, Service Worker, atau PWA.

## 4. Privasi dan Keamanan — Ketentuan Wajib

File environment dapat berisi password, API key, token, dan kredensial lain. Perlakukan seluruh isi file sebagai data sensitif.

### 4.1 Tidak ada pengiriman data keluar

- Jangan menulis kode yang mengirim isi file atau data turunannya ke server mana pun.
- Jangan menggunakan `fetch()`, `XMLHttpRequest`, `sendBeacon()`, WebSocket, atau mekanisme jaringan lain untuk mengirim data pengguna.
- Jangan menambahkan analytics, telemetry, error-reporting eksternal, atau script pihak ketiga.
- Jangan memuat font, library, gambar, maupun ikon dari CDN.
- Seluruh parsing, komparasi, dan pembuatan output harus berjalan lokal di browser.

Pemuatan HTML, CSS, dan JavaScript statis dari hosting saat pengguna membuka website diperbolehkan. Hal itu tidak boleh digunakan untuk mengirim isi file pengguna.

### 4.2 Penyimpanan data

Isi file, key, dan value environment variable hanya boleh berada di memori selama halaman digunakan. Jangan menyimpan data sensitif tersebut ke:

- `localStorage` atau `sessionStorage`.
- `IndexedDB`.
- Cookies.
- Cache Storage.
- File system atau layanan penyimpanan eksternal.

**Pengecualian terbatas untuk preferensi antarmuka:** roadmap bilingual dan tema boleh menyimpan preferensi non-sensitif berikut di `localStorage`:

- `envmoss:language` dengan nilai yang diizinkan `en` atau `id`.
- `envmoss:theme` dengan nilai yang diizinkan `light`, `dark`, atau `system`.

Ketentuan untuk pengecualian ini:

1. Hanya dua preferensi di atas yang boleh disimpan; jangan menambahkan data lain tanpa persetujuan.
2. Jangan pernah menyimpan isi file, key, value, nama file sensitif, hasil komparasi, atau output Merged `.env`.
3. Jika `localStorage` tidak tersedia atau aksesnya gagal, aplikasi harus tetap berfungsi menggunakan fallback dalam memori dan preferensi sistem/browser.
4. Jangan membuat cookies, IndexedDB, sessionStorage, atau Cache Storage untuk menyimpan preferensi tersebut.

Tombol **Hapus Semua** harus menghapus input, hasil komparasi, parsing warning, serta referensi file dari state aplikasi. Tombol ini tidak perlu menghapus preferensi bahasa atau tema. Data file hilang saat halaman di-refresh atau ditutup.

### 4.3 Tampilan dan pencatatan data

- Jangan menampilkan value environment variable pada hasil komparasi.
- Hasil komparasi hanya menampilkan nama key, status, jumlah kemunculan, dan nomor baris yang relevan.
- Jangan mencetak isi file, key-value pair, atau secret ke `console.log()`, `console.error()`, maupun pesan debugging lainnya.
- Pesan error harus menjelaskan masalah tanpa menyertakan isi baris yang berpotensi mengandung secret.
- Markdown Checklist hanya boleh memuat nama key yang Missing, bukan value.
- File hasil Merged `.env` memang berisi konfigurasi target dan harus dibuat lokal melalui Blob API; jangan mengunggah atau mencatat isinya.

### 4.4 Klaim privasi

Gunakan pernyataan yang sesuai dengan implementasi:

> File `.env` Anda tetap berada di browser. EnvMoss tidak mengunggahnya ke server.

Jangan menyebut produk "100% aman" atau memberikan jaminan keamanan absolut. Jelaskan secara spesifik bahwa pemrosesan file dilakukan secara lokal dan tidak ada pengunggahan isi file.

## 5. Standar Penulisan Kode

### 5.1 HTML

- Gunakan elemen HTML semantik seperti `<header>`, `<main>`, `<section>`, `<footer>`, dan elemen lain sesuai fungsi.
- Berikan label yang terlihat untuk input dan textarea.
- Tombol yang hanya menggunakan ikon harus memiliki nama aksesibel seperti `aria-label`.
- Jangan menggunakan elemen interaktif hanya untuk keperluan dekorasi.

### 5.2 CSS

- Simpan warna, tipografi, spacing, radius, dan token desain lain sebagai CSS custom properties di `:root` atau scope tema yang ditetapkan Design System.
- Ikuti token dan panduan visual pada `03-design-systems.md`.
- Gunakan namespacing class berdasarkan area: `.site-` untuk komponen global, `.tool-` untuk Comparison Tool, `.landing-` untuk Landing, dan `.guide-` untuk Guide.
- Tambahkan class penanda halaman pada elemen `<body>`: `page--tool`, `page--landing`, atau `page--guide`.
- Scope selector halaman, misalnya `.page--landing .landing-hero` atau `.page--guide .guide-sidebar`. Jangan membuat selector komponen generik seperti `.card`, `.button`, `.container`, atau `section h2` untuk styling khusus satu halaman.
- Selector global hanya boleh digunakan untuk reset dasar, elemen fondasi, design tokens, dan komponen yang memang dipakai bersama. Komponen bersama harus menggunakan prefix `.site-`.
- Pisahkan stylesheet global dan stylesheet per halaman sesuai struktur pada PRD: `styles.css`, `tool.css`, `landing.css`, dan `guide.css`. Jangan memuat CSS halaman yang tidak diperlukan jika pemisahan tersebut dapat dilakukan tanpa duplikasi yang rumit.
- Saat memodifikasi class Tool yang sudah ada, periksa seluruh penggunaan dan lakukan refactor secara bertahap. Jangan mengubah nama class secara massal tanpa memeriksa dampaknya.
- Hindari selector yang terlalu bergantung pada struktur DOM atau selector bertingkat panjang jika class khusus lebih jelas.
- Gunakan Flexbox atau CSS Grid sesuai kebutuhan.
- Pastikan tampilan responsif pada desktop, tablet, dan layar ponsel.

### 5.3 JavaScript

- Pisahkan logika parsing dan komparasi dari manipulasi DOM.
- Gunakan `const` secara default dan `let` bila nilai memang perlu berubah. Jangan gunakan `var`.
- Gunakan fitur modern JavaScript hanya jika meningkatkan keterbacaan dan pemeliharaan.
- Hindari abstraksi, state management, atau pola arsitektur yang berlebihan untuk aplikasi sekecil ini.
- Tangani kesalahan File API, Clipboard API, dan pembuatan unduhan dengan pesan yang dapat dipahami pengguna.
- Untuk elemen hasil yang dibuat secara dinamis, gunakan event delegation bila memang membuat pengelolaan event lebih sederhana.
- Jangan menyamakan parsing warning dengan error runtime. Parsing warning harus ditampilkan sebagai informasi validasi di UI.

## 6. Workflow Pengembangan

### 6.1 Sebelum mulai coding

Sebelum mengerjakan setiap task:

1. Periksa struktur folder dan file proyek yang sudah ada.
2. Baca dokumen `docs/` yang relevan dengan task.
3. Baca source file yang akan diubah dan pahami fungsi yang sudah berjalan.
4. Identifikasi file yang perlu dibuat atau dimodifikasi.
5. Periksa apakah task sesuai dengan milestone aktif pada PRD.
6. Sampaikan rencana singkat jika task melibatkan beberapa file atau langkah yang saling berkaitan.

Jangan menganggap repository masih kosong tanpa memeriksanya.

### 6.2 Saat melakukan perubahan

- Kerjakan hanya milestone atau task yang diminta.
- Pertahankan fungsi dan style yang sudah bekerja jika tidak terkait dengan perubahan.
- Jangan menulis ulang seluruh file hanya untuk mengubah bagian kecil.
- Jangan menghapus kode yang belum dipahami.
- Jangan menambah fitur yang belum disetujui.
- Jika perubahan menyentuh logika inti, pertahankan pemisahan modul agar dapat diuji secara mandiri.

### 6.3 Setelah coding

Lakukan verifikasi yang sesuai dengan perubahan:

- Periksa kesalahan sintaks JavaScript.
- Pastikan file HTML, CSS, dan JavaScript dapat dimuat.
- Uji interaksi yang terdampak.
- Uji fungsi parsing dan komparasi menggunakan skenario relevan.
- Periksa Console untuk error runtime, tanpa mencatat secret.
- Pastikan tidak ada request jaringan yang membawa data input.
- Pastikan tampilan tetap dapat digunakan pada ukuran layar yang relevan.

Jangan mengklaim pengujian browser telah dilakukan jika hanya melakukan pemeriksaan statis terhadap kode.

### 6.4 Laporan penyelesaian task

Setelah task selesai, laporkan secara ringkas:

1. Perubahan yang dibuat.
2. File yang dibuat atau diubah.
3. Pengujian yang benar-benar dilakukan dan hasilnya.
4. Hal yang belum diuji atau masih menjadi batasan.

## 7. Pengelolaan Scope dan Milestone

- Gunakan milestone dalam `02-prd-envmoss.md` sebagai urutan pengembangan.
- Fokus pada milestone yang sedang diminta pengguna.
- Jangan mengimplementasikan fitur dari milestone berikutnya tanpa diminta.
- Jika ditemukan kebutuhan baru, jelaskan apakah kebutuhan tersebut termasuk scope MVP atau merupakan usulan pengembangan berikutnya.
- Jangan mengubah acceptance criteria atau perilaku produk secara diam-diam.

## 8. Definisi Selesai

Sebuah task belum dianggap selesai hanya karena kode sudah ditulis. Task dianggap selesai jika:

- Implementasi sesuai instruksi dan dokumen acuan.
- Perubahan tidak merusak fungsi yang sudah berjalan.
- Pemeriksaan dan pengujian yang relevan sudah dilakukan.
- Batasan yang belum diverifikasi dinyatakan secara jujur.
- Tidak ada pelanggaran terhadap batasan privasi dan arsitektur.

---

**Prinsip utama:** Pahami dahulu, implementasikan secara sederhana, lindungi data pengguna, dan verifikasi hasilnya.

## 9. Aturan Pengembangan Web Setelah v1.0.0

Bagian ini berlaku untuk roadmap website multi-halaman yang tercantum pada `02-prd-envmoss.md`. Baseline v1.0.0 tetap menjadi fondasi; jangan menganggap fitur di bawah sudah tersedia sebelum milestone terkait selesai.

### 9.1 Struktur halaman statis

Rencana struktur halaman:

- `/` — Landing page.
- `/app/` — halaman utama Comparison Tool.
- `/guide/` — halaman panduan penggunaan.

Gunakan halaman HTML statis dan tautan biasa. Jangan menambahkan client-side router, framework, backend, atau build system hanya untuk berpindah halaman.

Jika perubahan lokasi `index.html` diperlukan, pindahkan halaman Tool yang sudah ada secara hati-hati ke `/app/` dan jadikan `/` sebagai Landing page. Periksa seluruh path CSS, JavaScript, ikon, dan aset setelah pemindahan. Pastikan deep link dan refresh halaman bekerja pada hosting target.

### 9.2 Navbar tetap (fixed)

- Navbar harus konsisten pada Landing, Tool, dan Guide.
- Navbar menggunakan `position: fixed` sesuai Design System.
- Sediakan ruang offset pada konten agar navbar tidak menutupi heading atau kontrol pertama.
- Navbar tidak boleh menutupi fokus keyboard, anchor target, atau dialog.
- Logo/mark dan wordmark `EnvMoss` menjadi satu-satunya tautan navigasi yang kembali ke Landing page.
- Jangan menambahkan menu `Home` atau `Landing` terpisah.
- Tautan ke Tool dan Guide tetap terlihat jelas.
- Pada layar sempit, kontrol navbar boleh diringkas secara aksesibel; jangan menghilangkan akses ke bahasa, tema, Tool, atau Guide.

### 9.3 Bahasa EN/ID

- Sediakan dua bahasa antarmuka: English (`en`) dan Bahasa Indonesia (`id`).
- Gunakan kamus terjemahan lokal dalam JavaScript; jangan menggunakan API terjemahan atau request jaringan.
- Semua teks antarmuka harus diterjemahkan, termasuk tombol, label, tooltip, aria-label, empty state, error, parsing warning, toast, halaman Landing, halaman Guide, dan teks yang dibuat oleh output generator.
- Jangan mencampur dua bahasa dalam satu tampilan kecuali istilah teknis atau nama fitur yang memang dipertahankan.
- Perbarui atribut `lang` pada elemen `<html>` sesuai bahasa aktif.
- Bahasa awal boleh mengikuti preferensi yang tersimpan; jika belum ada, gunakan bahasa browser yang didukung (`id` atau `en`) dan fallback ke English.
- Simpan hanya kode bahasa `en` atau `id` pada key `envmoss:language`.
- Jika penyimpanan tidak tersedia, pilihan bahasa tetap berlaku selama halaman aktif dan aplikasi tidak boleh gagal.

### 9.4 Tema terang dan gelap

- Dukung tema Light dan Dark di seluruh halaman.
- Jika belum ada preferensi tersimpan, ikuti `prefers-color-scheme` dari sistem operasi.
- Sediakan kontrol tema yang aksesibel dengan state dan label yang jelas.
- Simpan hanya preferensi `light`, `dark`, atau `system` pada `envmoss:theme`.
- Jangan menyimpan isi file atau hasil komparasi sebagai bagian dari preferensi tema.
- Pastikan warna status, focus ring, textarea, dropzone, diff board, guide, dan landing tetap terbaca pada kedua tema.
- Hormati `prefers-reduced-motion`.

### 9.5 Landing dan Guide

- Landing page menjelaskan nilai utama produk dan mengarahkan pengguna ke Tool atau Guide.
- Tidak boleh ada item navigasi khusus `Home` atau `Landing`; tautan logo menuju `/` sudah cukup.
- Halaman Guide menyajikan petunjuk langkah demi langkah dan navigasi bagian yang sederhana.
- Referensi PomeloO boleh digunakan untuk inspirasi struktur, hierarki konten, kesederhanaan, dan alur belajar; jangan menyalin aset, teks, identitas merek, atau layout secara persis.
- Jangan mengembalikan ilustrasi tanaman besar di kanan atas pada halaman Tool. Hero Landing boleh memiliki headline produk, tetapi bukan pengulangan nama/wordmark sebagai judul besar dan bukan dekorasi yang mengganggu.

### 9.6 README bilingual

- `README.md` menjadi versi English untuk pembaca GitHub internasional.
- `README.id.md` menjadi versi Bahasa Indonesia.
- Kedua README harus memiliki informasi inti yang setara: deskripsi, fitur, cara penggunaan, privacy, keterbatasan, cara menjalankan lokal, struktur proyek, dan lisensi.
- Tambahkan tautan silang bahasa di dekat bagian atas masing-masing README.
- Jangan menyatakan fitur Landing, Guide, EN/ID, atau Dark Mode sudah tersedia sebelum milestone-nya selesai.



### 9.7 Jalur CLI di masa depan

CLI merupakan jalur produk terpisah dan **bukan bagian dari milestone web aktif**. Jangan menambahkan `package.json`, dependency CLI, command `npx`, atau kode terminal ke aplikasi web tanpa persetujuan eksplisit untuk memulai jalur CLI.

Saat pengguna menyetujui eksplorasi CLI, lakukan discovery terlebih dahulu: batas runtime Node.js, desain command, paket npm, ketersediaan nama paket, pilihan antarmuka interaktif, penggunaan ulang comparison engine, penulisan output yang aman, dan strategi pengujian. Jangan memilih Ink, `@clack/prompts`, atau Enquirer sebelum kebutuhan UX CLI ditetapkan.

### 9.8 Bootstrap preferensi sebelum render dan pencegahan FOUC

Setiap halaman HTML (`/`, `/app/`, dan `/guide/`) wajib menjalankan skrip bootstrap preferensi yang kecil, sinkron, dan inline di dalam `<head>`.

Urutan minimal di `<head>`:

1. `<meta charset>` dan `<meta name="viewport">`.
2. Skrip bootstrap preferensi inline.
3. Tautan stylesheet.
4. Metadata dan resource head lain yang diperlukan.

Skrip bootstrap harus berjalan sebelum stylesheet diproses agar atribut tema sudah tersedia pada first paint. Skrip tidak boleh menggunakan `async`, `defer`, `type="module"`, timer, atau request jaringan.

Tanggung jawab skrip bootstrap:

- Baca `envmoss:theme` dari `localStorage` dan terima hanya `light`, `dark`, atau `system`.
- Jika tema bernilai `light` atau `dark`, terapkan tema tersebut pada `<html>` melalui atribut seperti `data-theme`.
- Jika tema bernilai `system` atau belum tersedia, baca `prefers-color-scheme` melalui `matchMedia` dan terapkan hasil aktual `light` atau `dark`.
- Baca `envmoss:language` dan terima hanya `en` atau `id`.
- Jika bahasa belum tersedia, deteksi `navigator.language`/`navigator.languages` yang didukung (`id` atau `en`) dan fallback ke `en`.
- Terapkan atribut `lang` serta penanda bahasa pada `<html>` sebelum stylesheet dan konten dirender.
- Tandai status penerjemahan awal, misalnya `data-i18n-pending="true"`, sampai kamus bahasa diterapkan.
- Lindungi setiap akses `localStorage` dengan `try/catch`; nilai yang tidak dikenal atau storage yang gagal tidak boleh menggagalkan halaman.

**Pencegahan kilatan teks bahasa (language flash):** menetapkan `lang` pada `<html>` tidak otomatis menerjemahkan teks di `<body>`. Semua teks statis yang perlu diterjemahkan harus memiliki penanda i18n. Selama `data-i18n-pending="true"`, CSS harus menahan tampilan teks yang belum diterjemahkan tanpa menghilangkan struktur layout (misalnya menggunakan `visibility: hidden` pada elemen bertanda terjemahan). Setelah kamus aktif diterapkan, modul i18n menghapus penanda tersebut. Jika proses penerjemahan gagal, gunakan fallback English yang valid dan tetap lepaskan penanda agar halaman tidak tersembunyi selamanya.

Skrip bootstrap harus identik atau memiliki perilaku yang benar-benar sama di ketiga halaman. Jangan membuat tiga implementasi preferensi yang berbeda. Perubahan key, nilai yang diizinkan, atau perilaku bootstrap harus diselaraskan di seluruh halaman dan dokumen.

### 9.9 Strategi path untuk halaman dan aset statis

Gunakan **relative path** untuk tautan halaman, stylesheet, script, gambar, ikon, dan aset statis. Strategi ini mendukung deployment di root domain seperti Vercel serta deployment GitHub Pages yang dapat berada di bawah subpath repository.

Contoh path berdasarkan lokasi halaman:

- Dari `index.html` di root: `./css/styles.css`, `./js/site.js`, `./app/`, dan `./guide/`.
- Dari `app/index.html`: `../css/styles.css`, `../js/app.js`, `../`, dan `../guide/`.
- Dari `guide/index.html`: `../css/styles.css`, `../js/site.js`, `../`, dan `../app/`.

Aturan tambahan:

- Jangan memakai root-absolute path seperti `/css/styles.css`, `/js/app.js`, `/assets/logo.svg`, atau tautan route `/app/` untuk navigasi internal lintas deployment.
- Jangan menambahkan `<base href="/">`, karena dapat merusak path ketika repository dipublikasikan di bawah subpath.
- URL pada `url(...)` di CSS dihitung relatif terhadap lokasi file CSS, bukan lokasi HTML. Contoh dari `css/styles.css` menuju `assets` di root adalah `../assets/...`.
- Import dalam ES Modules dihitung relatif terhadap file JavaScript yang melakukan import. Dari `js/app.js`, gunakan misalnya `./env-engine.js`.
- Gunakan direktori route dengan trailing slash pada tautan, misalnya `./app/` atau `../guide/`, agar perilaku relative path konsisten.
- Sebelum menyelesaikan milestone, uji route dan aset pada root hosting serta pada simulasi/deployment dengan base path subdirectory jika GitHub Pages termasuk target.
- Jangan menganggap path yang berhasil di Vercel root pasti berhasil di GitHub Pages project site.

### 9.10 Isolasi CSS dan batas antarhalaman

Terapkan namespacing dan pembagian stylesheet sesuai `03-design-systems.md`:

- `.site-`: navbar, footer, kontrol bahasa/tema, dan komponen lintas halaman.
- `.tool-`: input, comparison board, summary, parsing warning, dan output pada Tool.
- `.landing-`: hero, feature section, CTA, dan konten Landing.
- `.guide-`: daftar isi, sidebar, artikel, code example, dan callout Guide.

Setiap `<body>` harus memiliki satu class konteks halaman yang sesuai: `page--landing`, `page--tool`, atau `page--guide`.

Aturan:

1. Style komponen halaman harus berada di bawah konteks halaman dan menggunakan prefix yang sesuai.
2. Landing tidak boleh mengubah layout Tool melalui selector global atau selector elemen generik.
3. Guide tidak boleh mengubah style textarea, tombol, atau papan komparasi Tool.
4. Design tokens, reset, tipografi dasar, dan komponen `.site-` boleh dibagi secara global.
5. Jangan membuat selector global untuk `header`, `main`, `section`, `article`, `.card`, `.button`, atau `.container` dengan maksud styling khusus halaman.
6. Pertahankan kompatibilitas komponen Tool yang sudah ada; refactor selector lama secara bertahap dan uji regresinya.
7. Pastikan urutan pemuatan stylesheet konsisten: fondasi/global lebih dahulu, kemudian stylesheet khusus halaman.

Sebelum menyelesaikan perubahan CSS, uji ketiga halaman secara terpisah dan pastikan tidak ada kebocoran style lintas halaman.


## 10. Aturan Eksekusi Roadmap

- Milestone 1–6 pada PRD merupakan riwayat pembangunan baseline v1.0.0; jangan mengulangnya kecuali ditemukan bug atau regresi.
- Milestone 7–12 merupakan roadmap pengembangan website setelah v1.0.0.
- Kerjakan satu milestone pada satu waktu, kecuali pengguna secara eksplisit meminta beberapa milestone sekaligus.
- Sebelum mulai, sebutkan milestone, tujuan, file yang mungkin berubah, dan acceptance criteria yang akan diverifikasi.
- Setelah selesai, laporkan item yang selesai, yang belum selesai, hasil test, dan risiko tersisa.
- Jangan menaikkan versi produk, membuat Git tag, release, commit, atau push tanpa instruksi eksplisit pengguna.

