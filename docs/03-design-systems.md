# Design System dan Identitas Visual — EnvMoss

**Berkas:** `03-design-systems.md`  
**Produk:** EnvMoss  
**Versi dokumen:** 1.1  
**Cakupan:** Tool v1.0.0 dan roadmap Landing, Guide, EN/ID, fixed navbar, serta Light/Dark Mode

Dokumen ini menetapkan kepribadian merek, tipografi, design tokens, komponen antarmuka, aturan responsivitas, dan aksesibilitas EnvMoss. Tujuannya adalah menghasilkan developer tool yang terasa modern, tenang, presisi, mudah dipahami, dan meyakinkan pengguna bahwa file mereka diproses secara lokal.

---

## 1. Filosofi dan Kepribadian Merek

### 1.1 Metafora Moss

Lumut tumbuh dan bertahan secara lokal, menyaring lingkungan di sekitarnya secara tenang, dan tetap membumi. Metafora ini mewakili EnvMoss:

- **Lokal:** file diproses di browser pengguna.
- **Menyaring:** aplikasi memeriksa struktur environment variable dan menemukan perbedaan.
- **Membumi:** produk menyelesaikan satu masalah developer dengan cara yang sederhana.
- **Tenang:** UI tidak membuat pengguna merasa tertekan atau menganggap setiap perbedaan sebagai error.

### 1.2 Kepribadian visual

EnvMoss harus terasa:

- Tenang dan organik.
- Bersih dan minimalis.
- Presisi serta mudah dipindai.
- Modern tanpa terlihat seperti template dashboard generik.
- Ramah bagi developer pemula, tetapi tetap pantas digunakan developer berpengalaman.
- Privacy-first tanpa klaim keamanan yang berlebihan.

Hindari warna neon, efek visual agresif, dekorasi yang tidak membantu, dan elemen dashboard yang tidak diperlukan.

## 2. Prinsip Pengalaman Pengguna

1. **Kejelasan lebih penting daripada dekorasi.** Pengguna harus langsung memahami mana Base, mana Target, dan apa arti setiap hasil.
2. **Status selalu eksplisit.** Jangan mengandalkan warna saja untuk menjelaskan Missing, Orphan, Duplicate, atau Mismatch.
3. **Privasi terlihat, bukan sekadar slogan.** Tampilkan pesan bahwa file tidak diunggah dekat area input atau aksi utama.
4. **Setiap aksi memberi feedback.** Pengguna harus tahu apakah file berhasil dibaca, komparasi selesai, clipboard berhasil disalin, atau terjadi kegagalan.
5. **Jangan menyembunyikan alternatif input.** Textarea dan pemilih file harus mudah ditemukan; drag-and-drop bukan satu-satunya cara.
6. **Hindari kepadatan berlebihan.** Hasil harus dapat dipindai tanpa membuat halaman terasa seperti IDE penuh.

## 3. Tipografi

Gunakan system font stack. Jangan memuat Google Fonts, font CDN, atau font eksternal pada MVP v1.0.

### 3.1 Font UI dan heading

Gunakan token:

```css
--font-ui: Inter, system-ui, -apple-system, BlinkMacSystemFont,
           "Segoe UI", Roboto, sans-serif;
```

`Inter` hanya akan digunakan jika sudah tersedia secara lokal di sistem pengguna. Jangan mengunduhnya dari internet.

Gunakan font ini untuk:

- Judul dan heading.
- Label input.
- Deskripsi dan petunjuk.
- Tombol.
- Badge dan pesan status.

### 3.2 Font kode dan variabel

Gunakan token:

```css
--font-code: "JetBrains Mono", "IBM Plex Mono", Menlo,
             Monaco, Consolas, "Courier New", monospace;
```

Font ini digunakan untuk:

- Nama key environment variable.
- Isi textarea.
- Contoh `.env`.
- Markdown Checklist.
- Nama file dan informasi teknis tertentu.

Font mono eksternal tidak boleh diunduh. Sistem akan menggunakan font yang tersedia dan fallback lokal.

### 3.3 Font logo

Gunakan token:

```css
--font-logo: "DMSansLocal", system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", Roboto, sans-serif;
```

Font ini digunakan untuk:

- Tulisan **EnvMoss** di logo.

### 3.4 Ukuran tipografi

Gunakan skala awal berikut dan sesuaikan secara proporsional bila diperlukan:

```css
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--heading-lg: 1.5rem;
--heading-xl: 2rem;
```

Jaga hierarki ukuran agar heading, label, dan teks bantuan mudah dibedakan.

## 4. Palet Warna dan Design Tokens

Seluruh nilai warna, spacing, typography, radius, dan ukuran layout harus didefinisikan sebagai CSS custom properties di `:root` pada `css/styles.css`.

### 4.1 Warna merek

```css
:root {
  --color-primary: #3D6B4F;
  --color-primary-light: #6B9B7A;
  --color-bg: #F7F9F6;
  --color-surface: #FFFFFF;
  --color-text-primary: #1A2E22;
  --color-text-secondary: #4A5C52;
  --color-border: #D8E2DB;
}
```

Penggunaan:

- `--color-primary`: tombol utama, fokus, dan aksen penting.
- `--color-primary-light`: hover dan aksen sekunder.
- `--color-bg`: latar halaman.
- `--color-surface`: kartu, textarea, dan dropzone.
- `--color-text-primary`: teks utama dan heading.
- `--color-text-secondary`: deskripsi dan teks pendukung.
- `--color-border`: garis pemisah dan batas komponen.

### 4.2 Warna status komparasi

Gunakan warna lembut berikut sebagai warna aksen awal:

```css
:root {
  --status-missing: #C45C5C;
  --status-orphan: #D4A017;
  --status-duplicate: #D17A22;
  --status-mismatch: #5B7C99;
}
```

Makna:

| Status | Warna aksen | Makna |
|---|---|---|
| Missing | Merah lembut | Key tersedia di Base tetapi tidak ada di Target |
| Orphan | Kuning tanah | Key tambahan pada Target |
| Duplicate | Jingga hangat | Key muncul lebih dari sekali dalam satu file |
| Mismatch | Biru keabu-abuan | Value berbeda; informasi, bukan error |

Jangan memakai warna status sebagai satu-satunya pembeda. Setiap badge harus memuat teks status.

### 4.3 Kontras warna

Warna aksen status dapat digunakan sebagai dasar desain, tetapi warna teks dan latar badge harus diperiksa kontrasnya.

- Targetkan kontras teks minimal sesuai WCAG AA.
- Bila warna aksen terlalu terang untuk teks kecil, buat token foreground yang lebih gelap dan token background dengan opacity rendah.
- Jangan mengorbankan keterbacaan demi mempertahankan warna aksen secara persis.
- Jangan menggunakan merah atau kuning standar browser secara otomatis.

Token tambahan dapat didefinisikan bila diperlukan, misalnya:

```css
:root {
  --status-missing-text: #8F3838;
  --status-orphan-text: #765500;
  --status-duplicate-text: #8A4A0C;
  --status-mismatch-text: #3D5D78;
}
```

Nilai foreground harus diverifikasi terhadap background yang benar-benar digunakan.

### 4.4 Spacing

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
}
```

Gunakan skala ini secara konsisten untuk padding, gap, margin, dan jarak antarbagian.

### 4.5 Border radius dan layout

```css
:root {
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --container-width: 1200px;
}
```

Hindari sudut yang terlalu tajam. Gunakan radius yang konsisten untuk tombol, kartu, dropzone, dan textarea.

Token tambahan untuk shadow, ukuran kontrol, atau breakpoint boleh ditambahkan jika memang dibutuhkan, tetapi jangan membuat token yang tidak digunakan.

## 5. Isolasi CSS dan Struktur Stylesheet

Bagian ini menetapkan batas styling agar Landing dan Guide tidak mengubah tampilan Comparison Tool.

### 5.1 Prefix class berdasarkan area

Gunakan prefix class yang konsisten:

| Prefix | Pemakaian |
|---|---|
| `.site-` | Komponen bersama: navbar, footer, kontrol bahasa/tema, dan elemen lintas halaman |
| `.tool-` | Comparison Tool: input, diff board, ringkasan, parsing warning, dan output |
| `.landing-` | Landing: hero, feature section, CTA, dan konten pengenalan produk |
| `.guide-` | Guide: sidebar, daftar isi, artikel, code example, dan callout |

Gunakan class konteks pada `<body>`:

- `page--landing` pada Landing.
- `page--tool` pada Comparison Tool.
- `page--guide` pada Guide.

Contoh:

```css
.site-navbar { /* komponen global */ }

.page--landing .landing-hero { /* khusus Landing */ }
.page--landing .landing-feature-card { /* khusus Landing */ }

.page--tool .tool-diff-board { /* khusus Tool */ }
.page--tool .tool-input-card { /* khusus Tool */ }

.page--guide .guide-sidebar { /* khusus Guide */ }
.page--guide .guide-article { /* khusus Guide */ }
```

### 5.2 Batas selector global

- Selector global boleh digunakan untuk reset dasar, elemen fondasi, design tokens, dan tipografi dasar.
- Komponen lintas halaman wajib menggunakan prefix `.site-`.
- Jangan menggunakan `.card`, `.button`, `.container`, `header`, `main`, `section h2`, atau selector elemen generik untuk memberi style khusus pada satu halaman.
- Semua komponen khusus halaman harus menggunakan prefix halaman dan sebisa mungkin di-scope dengan class `page--...`.
- Hindari selector bertingkat panjang yang bergantung pada kedalaman DOM.
- Jangan mengandalkan urutan stylesheet untuk mengatasi konflik class; selesaikan konflik dengan scope yang tepat.

### 5.3 Pembagian stylesheet

Pembagian yang direkomendasikan:

```text
css/
├── styles.css   # Reset, design tokens, tipografi dasar, komponen .site-
├── tool.css     # Komponen .tool- untuk Comparison Tool
├── landing.css  # Komponen .landing- untuk Landing
└── guide.css    # Komponen .guide- untuk Guide
```

Urutan pemuatan pada setiap halaman:

1. `styles.css`.
2. Stylesheet khusus halaman yang sedang dibuka (`tool.css`, `landing.css`, atau `guide.css`).

Jangan memuat stylesheet khusus halaman yang tidak diperlukan. Jika repository memakai pembagian file yang berbeda tetapi memiliki isolasi yang sama, pertahankan struktur yang sudah terbukti berjalan dan dokumentasikan pemetaannya.

### 5.4 Aturan perubahan CSS

- Jangan membuat style Landing mengubah komponen Tool.
- Jangan membuat style Guide mengubah komponen Tool atau Landing.
- Saat mengubah class lama Tool, periksa penggunaan di HTML dan JavaScript sebelum refactor.
- Jangan melakukan penggantian class massal tanpa uji regresi.
- Uji ketiga halaman secara terpisah pada Light dan Dark Mode.

---

## 6. Struktur dan Tata Letak UI

### 6.1 Arah visual berdasarkan referensi mockup

Gunakan mockup referensi EnvMoss terbaru sebagai acuan komposisi dan hierarki visual, bukan sebagai instruksi untuk menyalin setiap detail secara harfiah. Pertahankan karakter Moss Theme: bersih, organik, ringan, presisi, dan menenangkan. Aturan pada bagian ini terutama berlaku untuk halaman Tool; Landing memiliki hero ringkas yang didefinisikan secara terpisah pada Bagian 15.

Berkas referensi visual yang disertakan bersama dokumentasi: `docs/references/envmoss-ui-reference.jpeg`. Gunakan gambar tersebut untuk memahami komposisi panel, papan komparasi, dan hierarki informasi. Ketentuan penghapusan ilustrasi kanan atas dan tagline pada dokumen ini mengatasi elemen yang masih terlihat pada gambar referensi.

Keputusan visual yang wajib diikuti:

- **Navbar minimal:** tampilkan ikon/mark EnvMoss dan teks `EnvMoss` saja pada sisi kiri navbar.
- Jangan menampilkan tagline, subjudul pemasaran, atau deskripsi seperti `Local-First Environment Variable Detective` di samping logo atau sebagai hero heading.
- Jangan membuat hero section besar yang mengulang nama produk atau menjelaskan tagline.
- Hapus ilustrasi tanaman, bukit lumut, atau dekorasi botani besar di pojok kanan atas.
- Jangan mengganti ilustrasi tersebut dengan dekorasi besar lain yang mengambil perhatian dari fungsi utama.
- Gunakan latar off-white dan aksen hijau yang halus. Dekorasi latar boleh sangat subtil selama tidak mengganggu keterbacaan.
- Identitas organik cukup dibawa melalui logo/mark sederhana, palet warna, bentuk komponen, dan detail kecil.

Navbar boleh memiliki indikator kecil di sisi kanan yang menyatakan `100% Client-Side` atau `Diproses di browser`. Jangan menampilkan `Offline Ready`, karena MVP v1.0 tidak memiliki Service Worker atau offline caching.

### 6.2 Kerangka halaman desktop

Gunakan halaman kerja yang ringkas dan langsung membawa pengguna ke fungsi utama. Susunan yang direkomendasikan:

1. **Navbar ringkas:** ikon/mark dan nama `EnvMoss`; tanpa tagline atau hero copy.
2. **Area input:** dua kartu Base Environment dan Target Environment yang sejajar.
3. **Aksi komparasi:** tombol utama `Bandingkan` ditempatkan dekat kedua input dan mudah ditemukan; tombol `Hapus Semua` menjadi aksi sekunder.
4. **Area hasil:** papan komparasi dua panel sebagai area utama di sebelah kiri/tengah.
5. **Panel samping:** ringkasan empat status, indikator pemrosesan lokal, dan dua tombol output.
6. **Parsing warnings:** area terpisah yang muncul bila diperlukan.

Papan komparasi dan panel samping harus memiliki hierarki yang jelas. Papan komparasi merupakan fokus utama; panel samping mendukung pemahaman hasil dan tindakan lanjutan.

Jangan membuat sidebar navigasi permanen, dashboard analitik, hero banner, atau modul yang tidak diperlukan oleh PRD.

### 6.3 Navbar dan identitas merek

- Gunakan satu ikon/mark lokal yang sederhana, terinspirasi bentuk daun atau lumut.
- Letakkan ikon di sebelah kiri wordmark `EnvMoss`.
- Tampilkan nama produk dengan ukuran dan bobot yang cukup untuk dikenali, tetapi jangan terlalu dominan.
- Jangan menampilkan tagline atau deskripsi produk pada navbar.
- Jangan mengulang logo dan nama produk sebagai judul hero di bawah navbar.
- Jika dibutuhkan, gunakan indikator privasi ringkas di sisi kanan navbar; teksnya harus menjelaskan pemrosesan lokal, bukan mengklaim offline.
- Ikon harus menggunakan SVG lokal atau CSS sederhana, bukan library atau CDN eksternal.

### 6.4 Kartu input Base dan Target

Pada layar lebar, Base dan Target ditempatkan berdampingan dengan lebar dan struktur visual yang seimbang. Setiap kartu memiliki:

- Label yang jelas: `Base Environment` atau `Target Environment`.
- Contoh nama file seperti `.env.example` untuk Base dan `.env` atau `.env.production` untuk Target.
- Dropzone dengan batas putus-putus pada empty state.
- Kontrol file picker.
- Textarea yang terlihat dan dapat diedit sebagai fallback paste.
- Nama file setelah file dipilih atau di-drop.
- Kontrol untuk mengganti atau menghapus input.

Textarea adalah bagian dari area input, bukan layar atau mode terpisah yang sulit ditemukan. Jangan menghilangkan textarea demi membuat dropzone terlihat lebih ringkas.

Letakkan tombol `Bandingkan` dekat area input—misalnya di tengah bawah kedua kartu atau pada baris aksi setelah input—dan pastikan alur visual mengarah jelas ke tombol tersebut.

### 6.5 Papan komparasi dua panel

Pada layar lebar, gunakan dua panel sejajar:

- Panel Base berada di kiri.
- Panel Target berada di kanan.
- Kedua panel memiliki header dan penanda file yang jelas.
- Tampilkan nomor baris serta nama key yang relevan.
- Gunakan highlight baris lembut untuk Missing, Orphan, Duplicate, dan Mismatch.
- Sejajarkan baris yang saling berkaitan jika memungkinkan agar perbedaan mudah dipindai.
- Gunakan label status dan bukan warna saja.

**Batas privasi yang wajib:** papan ini bukan editor dan bukan tampilan mentah file. Jangan render value atau seluruh baris asli `.env`. Render representasi yang sudah disanitasi, misalnya `API_KEY = [nilai disembunyikan]`, atau hanya nama key dan label status. Jangan tampilkan value, bahkan jika key tidak tampak sensitif. Untuk Mismatch, cukup tampilkan `Value berbeda` tanpa memperlihatkan kedua value.

Untuk Missing, tandai key di panel Base dan tampilkan penanda bahwa key tidak ditemukan pada Target. Untuk Orphan, tandai key pada panel Target. Untuk Duplicate, tampilkan key beserta nomor seluruh kemunculannya. Untuk Mismatch, tandai key pada kedua panel dengan status informasi.

### 6.6 Panel ringkasan, privasi, dan aksi

Pada desktop, tempatkan panel ringkasan di sisi kanan papan komparasi jika ruang layar mencukupi. Panel ini memuat:

1. Ringkasan jumlah Missing, Orphan, Duplicate, dan Mismatch.
2. Indikator visual ringkas seperti cincin/donut boleh digunakan, tetapi setiap jumlah wajib disertai label teks.
3. Pesan privasi seperti `100% Client-Side` atau `File diproses di browser — tidak diunggah`.
4. Tombol `Salin Markdown Checklist`.
5. Tombol `Unduh Merged .env`.

Gunakan hitungan dari comparison engine; jangan membuat angka ilustratif atau angka hard-coded. Jangan memberi kesan bahwa semua temuan adalah error. Mismatch adalah informasi, Orphan bukan otomatis variabel usang, dan Duplicate dihitung berdasarkan aturan PRD.

Tombol output harus mudah ditemukan dan memiliki hierarki visual yang jelas. Jangan menambahkan tombol ekspor PDF atau fitur output lain yang berada di luar scope.

### 6.7 Dekorasi dan penggunaan ruang

- Jangan gunakan ilustrasi tanaman besar atau bukit lumut di pojok kanan atas.
- Jangan gunakan foto atau ilustrasi hero sebagai latar utama.
- Hindari ruang hero kosong yang hanya diisi tagline atau deskripsi pemasaran.
- Gunakan whitespace untuk memisahkan kelompok input, hasil, dan aksi.
- Gunakan dekorasi botani hanya sebagai detail kecil pada logo atau ikon jika diperlukan.
- Pastikan visual tidak membuat komponen utama terdorong jauh ke bawah halaman.

### 6.8 Responsivitas komposisi

- **Desktop:** dua kartu input sejajar; papan komparasi dua panel; panel ringkasan/aksi di sisi kanan.
- **Tablet:** pertahankan dua input sejajar hanya jika masih nyaman; jika terlalu sempit, susun input secara vertikal. Panel ringkasan dapat berpindah ke bawah papan komparasi.
- **Mobile:** susun Base dan Target secara vertikal. Tampilkan panel Base dan Target dalam susunan bertumpuk atau tab yang jelas; jangan memaksa dua kolom sempit yang membuat nama key sulit dibaca. Panel ringkasan dan aksi ditempatkan dalam urutan yang logis.
- Hindari horizontal scrolling pada seluruh halaman. Jika area kode membutuhkan lebar lebih, batasi scrolling pada area papan komparasi saja.

## 7. Komponen UI dan Interaction States

### 7.1 Dropzone

**Empty state:**

- Background menggunakan `--color-surface`.
- Border menggunakan garis putus-putus `--color-border`.
- Tampilkan ikon lokal sederhana atau ilustrasi CSS ringan.
- Tampilkan instruksi singkat untuk drop file atau memilih file.
- Textarea tetap tersedia sebagai cara input alternatif.

**Drag-over state:**

- Border berubah menjadi solid `--color-primary`.
- Background menggunakan aksen `--color-primary-light` dengan opacity rendah.
- Tampilkan feedback visual bahwa file dapat dilepaskan di area tersebut.

**Loaded state:**

- Tampilkan nama file.
- Tampilkan textarea yang telah diisi.
- Berikan opsi mengganti atau menghapus file.

**Error state:**

- Tampilkan pesan singkat dan jelas jika file gagal dibaca.
- Jangan menampilkan isi file atau secret pada pesan error.

Dropzone juga harus dapat digunakan melalui keyboard dan file picker. Penggunaan mouse drag-and-drop tidak boleh menjadi satu-satunya cara interaksi.

### 7.2 Textarea

- Gunakan font monospace.
- Berikan label yang terlihat.
- Pastikan teks dapat dibaca dan diedit.
- Gunakan ukuran minimum yang memadai untuk file `.env` kecil.
- Berikan focus state yang jelas.
- Hindari memotong isi teks secara horizontal jika memungkinkan; gunakan perilaku wrapping yang sesuai untuk menjaga keterbacaan.

### 7.3 Tombol

**Primary button:**

- Background `--color-primary`.
- Teks putih dengan kontras yang cukup.
- Digunakan untuk aksi utama seperti Bandingkan, Salin Markdown Checklist, dan Unduh Merged `.env`.
- Hover state sedikit lebih gelap.

**Secondary / ghost button:**

- Background transparan atau surface.
- Border `--color-border` bila diperlukan.
- Teks `--color-text-secondary`.
- Digunakan untuk Hapus Semua atau aksi sekunder.

**Disabled state:**

- Terlihat berbeda dari tombol aktif.
- Tidak hanya dibedakan melalui opacity yang terlalu rendah.
- Tombol Bandingkan tidak aktif sebelum kedua slot input tersedia.

**Focus state:**

- Semua tombol memiliki indikator fokus yang terlihat.
- Jangan menghilangkan outline tanpa menyediakan pengganti yang jelas.

### 7.4 Panel ringkasan status

- Tampilkan empat jumlah status secara ringkas pada panel samping.
- Setiap status harus memiliki label dan angka.
- Indikator cincin/donut bersifat opsional dan hanya pendukung; jangan menggantikan label dan angka.
- Gunakan warna status sebagai aksen, bukan sebagai satu-satunya penanda.
- Jangan menampilkan value environment variable.

### 7.5 Papan komparasi dan detail hasil

- Gunakan dua panel sejajar untuk Base dan Target pada layar lebar.
- Nama key menggunakan font monospace.
- Tampilkan nomor baris, badge status, dan jumlah kemunculan bila relevan.
- Gunakan highlight baris yang lembut dan tetap sertakan teks status.
- Jangan merender baris `.env` asli atau value apa pun; tampilkan representasi key yang sudah disanitasi.
- Mismatch hanya menampilkan informasi seperti `Value berbeda`, bukan kedua value.

### 7.6 Parsing warnings

- Pisahkan parsing warnings dari empat kategori komparasi.
- Gunakan tampilan peringatan yang jelas tetapi tidak agresif.
- Tampilkan sisi file dan nomor baris.
- Jangan menampilkan isi baris yang mungkin mengandung secret.

### 7.7 Empty state dan no-difference state

- Sebelum komparasi: jelaskan bahwa hasil akan muncul setelah pengguna menekan Bandingkan.
- Jika tidak ditemukan perbedaan key: tampilkan pesan bahwa struktur key cocok.
- Jangan menyatakan bahwa value atau konfigurasi aplikasi sudah pasti benar.

### 7.8 Feedback aksi

Berikan feedback yang jelas untuk:

- File berhasil dibaca.
- File gagal dibaca.
- Komparasi selesai.
- Markdown berhasil disalin.
- Clipboard tidak dapat diakses.
- File Merged berhasil dibuat atau diunduh.
- Input dan hasil berhasil dihapus.

Feedback tidak boleh menyertakan value secret.

## 8. Micro-copy dan Pesan Privasi

Tampilkan pesan privasi dekat area input atau tombol Bandingkan:

> File `.env` Anda tetap berada di browser. EnvMoss tidak mengunggahnya ke server.

Contoh micro-copy lain:

- Base: `Pilih atau tempel file .env.example Anda.`
- Target: `Pilih atau tempel file environment yang ingin diperiksa.`
- Drag-and-drop: `Seret file ke sini atau pilih dari perangkat.`
- Compare: `Bandingkan`
- Checklist: `Salin Markdown Checklist`
- Merge: `Unduh Merged .env`
- Clear: `Hapus Semua`
- Mismatch: `Value berbeda — informasi, bukan error.`
- Missing: `Key ini ada di Base tetapi belum ditemukan di Target.`
- Orphan: `Key ini hanya ditemukan di Target.`
- Duplicate: `Key ini ditulis lebih dari satu kali.`

Gunakan bahasa yang lugas. Hindari klaim seperti "secret Anda dijamin 100% aman".

## 9. Aksesibilitas

- Semua kontrol interaktif harus dapat digunakan dengan keyboard.
- Dropzone harus memiliki alternatif file picker yang dapat difokuskan dan diaktifkan melalui keyboard.
- Setiap textarea dan input harus memiliki label yang terhubung.
- Sediakan focus indicator yang terlihat.
- Jangan memakai warna sebagai satu-satunya penanda status.
- Jaga kontras teks sesuai WCAG AA sejauh berlaku.
- Status disabled harus tetap dapat dikenali.
- Pesan error dan hasil komparasi harus dapat diketahui oleh teknologi bantu; gunakan atribut atau pola ARIA secara tepat bila diperlukan.
- Jangan menggunakan `aria-live` secara berlebihan hingga setiap perubahan kecil dibacakan.
- Pastikan urutan tab mengikuti urutan visual dan alur penggunaan.

## 10. Responsivitas

- Desktop: dua area input dapat ditampilkan berdampingan.
- Tablet: sesuaikan lebar kolom dan jarak agar textarea tetap nyaman digunakan.
- Mobile: susun input secara vertikal; tombol dan hasil tidak boleh melebar keluar viewport.
- Gunakan unit fleksibel dan media query seperlunya.
- Pastikan daftar hasil, badge, dan nama key panjang tetap dapat dibaca.
- Hindari horizontal scrolling untuk seluruh halaman. Jika teks kode panjang memerlukan scrolling, batasi perilaku tersebut pada area teks yang relevan.

## 11. Ikon dan Aset Visual

- Utamakan CSS sederhana atau SVG lokal.
- Jangan mengambil ikon, ilustrasi, atau gambar dari CDN.
- Jangan menambahkan library ikon eksternal.
- Gunakan ikon hanya jika membantu memperjelas aksi atau status.
- Ikon dekoratif tidak boleh menggantikan label teks.

## 12. Konsistensi Implementasi

- Seluruh token desain didefinisikan di `:root` pada `css/styles.css`.
- Gunakan nama token yang konsisten dengan dokumen ini.
- Hindari hard-coded color dan spacing berulang di banyak tempat jika token yang sesuai sudah tersedia.
- Komponen dengan fungsi sama harus memiliki bentuk dan interaction state yang konsisten.
- Jangan menambahkan animasi yang mengganggu atau memperlambat interaksi.
- Prioritaskan keterbacaan, aksesibilitas, dan kejelasan alur di atas efek visual.

---

**Arah visual akhir:** EnvMoss harus terasa seperti alat developer yang kecil, matang, tenang, dan dapat dipercaya—bukan dashboard besar yang mencoba melakukan semuanya.

## 13. Sistem Navigasi dan Navbar Tetap

### 13.1 Aturan global

Semua halaman (`Landing`, `Tool`, dan `Guide`) menggunakan navbar global dengan isi dan urutan kontrol yang konsisten.

Komponen navbar:

- Sisi kiri: ikon/mark dan wordmark `EnvMoss` sebagai satu tautan menuju Landing (`/`).
- Sisi kanan: tautan `Tool`, tautan `Guide`, kontrol bahasa `EN / ID`, dan kontrol tema.
- Jangan menampilkan tautan khusus `Home` atau `Landing`; logo merupakan satu-satunya item navigasi global yang mengarah ke Landing.
- Tautan aktif (`Tool` atau `Guide`) harus memiliki indikator yang jelas.
- Semua kontrol memiliki label aksesibel dan dapat digunakan melalui keyboard.

### 13.2 Posisi fixed

- Navbar menggunakan `position: fixed` di bagian atas viewport.
- Tetapkan tinggi melalui token `--nav-height`.
- Berikan `z-index` yang cukup untuk tetap terlihat, tetapi jangan menghalangi dialog/modal yang memang harus berada di atasnya.
- Konten halaman harus memiliki offset atas setidaknya sebesar tinggi navbar ditambah spacing yang sesuai.
- Anchor target pada Guide harus menggunakan `scroll-margin-top` agar heading tidak tertutup navbar.
- Focus ring, dropdown, dan kontrol bahasa/tema tidak boleh terpotong oleh container navbar.
- Pada mobile, pertahankan akses ke Tool, Guide, bahasa, dan tema. Jika ruang tidak cukup, gunakan menu ringkas yang aksesibel dan bukan menyembunyikan kontrol tanpa pengganti.

### 13.3 Gaya navbar

- Gunakan latar surface solid atau semi-transparan yang tetap memiliki kontras memadai.
- Tambahkan border bawah atau shadow yang sangat halus bila diperlukan.
- Hindari tagline, deskripsi produk, atau hero copy pada navbar.
- Jangan memasang ilustrasi atau gambar besar pada navbar.
- Pastikan tampilannya konsisten pada Light dan Dark Mode.

## 14. Sistem Bahasa EN/ID

### 14.1 Kontrol bahasa

- Tampilkan kontrol ringkas `EN` dan `ID` pada navbar.
- State bahasa aktif harus terlihat dan tidak hanya dibedakan melalui warna.
- Gunakan label lengkap atau tooltip aksesibel bila singkatan berpotensi tidak jelas.
- Ubah atribut `lang` pada elemen `<html>` sesuai bahasa aktif.

### 14.2 Cakupan terjemahan

Terjemahkan seluruh teks di Landing, Tool, dan Guide, termasuk:

- Heading, deskripsi, label, tombol, tautan, navigasi.
- Empty state, disabled state, toast, error, dan konfirmasi.
- Parsing warning dan status hasil komparasi.
- Tooltip, `aria-label`, dan pesan untuk teknologi bantu.
- Checklist serta komentar buatan EnvMoss pada file hasil jika mengandung kalimat natural.

Nama key environment variable, nama file pengguna, kode, dan value tidak boleh diterjemahkan atau dimodifikasi.

### 14.3 Aturan penulisan terjemahan

- Gunakan bahasa yang natural, ringkas, dan konsisten.
- Hindari terjemahan kata demi kata yang membuat label UI kaku.
- Pertahankan istilah teknis yang umum dipakai developer bila terjemahan justru membingungkan.
- Jangan mencampur English dan Indonesia dalam satu halaman tanpa alasan.
- Jika suatu string belum tersedia dalam bahasa aktif, gunakan fallback yang konsisten dan jangan menampilkan key kamus mentah.

## 15. Light dan Dark Mode

### 15.1 Prinsip tema

Dark Mode harus mempertahankan karakter Moss: tenang, lembut, dan mudah dibaca. Hindari latar hitam murni dan warna neon. Gunakan permukaan gelap kehijauan/arang dengan border yang cukup terlihat.

### 15.2 Token tema

Pertahankan token Light yang sudah ada pada `:root`. Tambahkan token yang ekuivalen untuk Dark, misalnya melalui `[data-theme="dark"]`.

Contoh arah token (nilai akhir harus diuji kontrasnya):

```css
:root {
  color-scheme: light;
  --color-bg: #F7F9F6;
  --color-surface: #FFFFFF;
  --color-text-primary: #1A2E22;
  --color-text-secondary: #4A5C52;
  --color-border: #D8E2DB;
  --color-primary: #3D6B4F;
}

:root[data-theme="dark"] {
  color-scheme: dark;
  --color-bg: #111914;
  --color-surface: #19231D;
  --color-text-primary: #E8F0E9;
  --color-text-secondary: #B3C1B6;
  --color-border: #35443A;
  --color-primary: #8FBE9B;
}
```

Contoh tersebut adalah titik awal, bukan nilai final yang boleh digunakan tanpa uji kontras.

### 15.3 Cakupan tema

Tema harus diterapkan pada:

- Navbar dan menu mobile.
- Landing hero, section, CTA, dan footer.
- Kartu input, dropzone, textarea, dan file state.
- Tombol, link, tooltip, badge, dan status.
- Comparison board, highlight baris, summary, dan parsing warning.
- Guide sidebar, heading, code block, anchor, dan callout.
- Toast, dialog, dan empty state.

Jangan menyisakan area putih terang yang tidak disengaja pada Dark Mode.

### 15.4 Kontrol dan perilaku tema

- Ikon tema boleh menggunakan matahari/bulan, tetapi kontrol harus memiliki accessible name yang menjelaskan tindakan atau state.
- Hormati preferensi sistem melalui `prefers-color-scheme` saat pengguna belum memilih tema.
- Bila pengguna memilih Light/Dark/System secara eksplisit, tampilkan state pilihan dengan jelas.
- Pastikan perubahan tema tidak menghilangkan focus indicator.
- Hormati `prefers-reduced-motion`; jangan memakai transisi warna panjang atau efek yang mengganggu.

## 16. Landing Page

### 16.1 Arah desain

Landing menggunakan PomeloO sebagai referensi untuk kesederhanaan penyampaian, hirarki informasi, urutan manfaat, langkah penggunaan, dan komunikasi privasi. Referensi: `https://pomeloo.netlify.app/`.

Jangan menyalin brand, teks, ilustrasi, ikon, atau layout PomeloO secara persis. EnvMoss harus tetap memiliki identitas Moss sendiri.

### 16.2 Navigasi Landing

- Logo EnvMoss pada navbar mengarah ke `/`.
- Tidak ada item navbar bernama `Home` atau `Landing`.
- Tautan `Tool` mengarah ke `/app/`.
- Tautan `Guide` mengarah ke `/guide/`.
- Kontrol EN/ID dan tema tersedia.

### 16.3 Susunan konten

Urutan konten yang disarankan:

1. **Hero:** headline singkat yang menyampaikan manfaat utama; jangan mengulang wordmark `EnvMoss` sebagai judul besar.
2. **Primary CTA:** tombol untuk membuka Tool; CTA sekunder menuju Guide.
3. **How it works:** tiga langkah ringkas—masukkan dua file, bandingkan, tindak lanjuti hasil.
4. **Four statuses:** penjelasan ringkas Missing, Orphan, Duplicate, dan Mismatch.
5. **Actionable outputs:** tunjukkan Markdown Checklist dan Merged `.env`.
6. **Privacy:** jelaskan bahwa isi file diproses di browser dan tidak diunggah oleh aplikasi.
7. **Guide / FAQ link:** arahkan pengguna yang membutuhkan penjelasan lebih lanjut ke Guide.
8. **Footer:** Live Tool, Guide, Repository, dan License jika relevan.

Landing tidak perlu mengulang seluruh dokumentasi. Tujuannya memperkenalkan produk dan mengantar pengguna ke tindakan berikutnya.

### 16.4 Elemen visual

- Jangan gunakan ilustrasi tanaman atau bukit lumut besar di pojok kanan atas.
- Hindari gambar hero generik yang mengalahkan fungsi produk.
- Prioritaskan screenshot aktual aplikasi atau ilustrasi diagram alur yang dibuat sendiri jika benar-benar membantu.
- Jangan menampilkan angka hasil komparasi palsu seolah berasal dari pengguna.
- Jangan memakai badge `Offline Ready` atau klaim bahwa live site dapat dibuka tanpa internet.

## 17. Guide Page

### 17.1 Prinsip layout

Guide menggunakan pola dokumentasi sederhana: navigasi bagian di sisi kiri pada layar lebar dan konten utama di sisi kanan. Ambil inspirasi dari halaman Guides PomeloO, tetapi sederhanakan sesuai jumlah fitur EnvMoss.

- Navbar tetap berada di bagian atas.
- Sidebar Guide berada di bawah navbar dan boleh menggunakan `position: sticky` dalam area konten.
- Konten utama memiliki lebar baca yang nyaman.
- Daftar isi berisi link anchor ke section.
- Anchor heading tidak tertutup navbar fixed.
- Pada mobile, daftar isi menjadi disclosure/dropdown yang bisa dibuka, bukan sidebar permanen yang memakan ruang.

### 17.2 Hierarki konten

Gunakan section pendek dan mudah dipindai:

- Mulai di sini.
- Memasukkan Base dan Target.
- Menjalankan komparasi.
- Memahami empat status.
- Menyalin Markdown Checklist.
- Mengunduh Merged `.env`.
- Sintaks dan batas parser.
- Privasi dan penghapusan sesi.
- Troubleshooting.

Gunakan contoh konfigurasi fiktif. Jangan pernah menggunakan credential sungguhan.

### 17.3 Komponen dokumentasi

- Heading dengan hierarki konsisten.
- Code block dengan tombol salin bila bermanfaat.
- Callout untuk catatan penting atau batasan.
- Tautan menuju halaman Tool pada konteks yang relevan.
- Tabel hanya untuk informasi yang memang lebih mudah dibandingkan dalam bentuk tabel.

Semua komponen harus berfungsi pada EN/ID serta Light/Dark.

## 18. Responsivitas dan Aksesibilitas Lintas Halaman

Tambahan dari aturan responsivitas halaman Tool:

- Navbar fixed tidak boleh menyebabkan konten tertutup di viewport kecil.
- Kontrol bahasa dan tema harus tetap mudah ditemukan atau dipindahkan ke menu mobile yang aksesibel.
- Landing harus memiliki CTA yang mudah dijangkau tanpa scroll berlebihan.
- Guide sidebar harus berubah menjadi navigasi ringkas pada mobile.
- Bahasa dengan teks lebih panjang tidak boleh membuat navbar atau tombol overflow.
- Semua menu, disclosure, dan toggle harus dapat dioperasikan menggunakan keyboard.
- Pertahankan focus indicator yang terlihat pada kedua tema.
- Jangan menggunakan warna sebagai satu-satunya penanda state bahasa, tema, atau status komparasi.

## 19. Aturan Preferensi Antarmuka dan Privasi

Untuk mendukung bahasa dan tema, aplikasi boleh menyimpan **hanya** preferensi non-sensitif berikut:

- `envmoss:language`: `en` atau `id`.
- `envmoss:theme`: `light`, `dark`, atau `system`.

Tidak boleh menyimpan isi file, key, value, hasil komparasi, atau output Merged `.env`. Jangan menggunakan cookies, IndexedDB, sessionStorage, atau Cache Storage. Jika localStorage diblokir, gunakan fallback dalam memori dan/atau preferensi sistem tanpa menggagalkan aplikasi.

Klaim privasi harus dibedakan secara tepat: isi file tidak disimpan dan tidak diunggah; preferensi UI yang tidak sensitif dapat tersimpan bila pengguna memakai fitur bahasa/tema.

---

**Arah visual roadmap:** EnvMoss berkembang menjadi pengalaman web multi-halaman yang terasa seperti produk kecil, fokus, dan matang—tetap organik, sederhana, aksesibel, dan menjaga privasi. Tool tetap menjadi pusat fungsional; Landing memperkenalkan produk; Guide membantu pengguna belajar.

## 20. Aturan First Paint, Preferensi, dan Pencegahan FOUC

Aturan ini wajib diterapkan pada Landing, Tool, dan Guide.

### 20.1 Bootstrap di dalam `<head>`

- Setiap `index.html` harus memuat skrip bootstrap preferensi yang kecil, inline, sinkron, dan blocking setelah meta charset/viewport serta sebelum stylesheet.
- Skrip tidak boleh memakai `async`, `defer`, `type="module"`, timer, atau request jaringan.
- Skrip membaca dan memvalidasi `envmoss:theme` (`light`, `dark`, `system`) serta `envmoss:language` (`en`, `id`) dengan `try/catch` untuk setiap akses storage.
- Tema aktual harus ditetapkan pada `<html>` sebelum stylesheet diproses. Bila pilihan `system` atau belum ada, gunakan `prefers-color-scheme`; jika `matchMedia` tidak tersedia, gunakan Light.
- Bahasa harus ditetapkan melalui atribut `lang` dan penanda bahasa pada `<html>` sebelum teks halaman ditampilkan. Bila preferensi belum ada, gunakan bahasa browser yang didukung dan fallback ke English.

### 20.2 Mencegah kilatan teks bahasa

Mengatur atribut `lang` tidak menerjemahkan node HTML. Semua teks yang perlu diterjemahkan harus ditandai dengan key i18n. Selama kamus aktif belum diterapkan, tandai dokumen dengan `data-i18n-pending="true"` dan tahan visibilitas elemen berteks terjemahan tanpa menghilangkan ruang layout, misalnya:

```css
html[data-i18n-pending="true"] [data-i18n] {
  visibility: hidden;
}
```

Setelah seluruh teks diterapkan, modul i18n menghapus atribut `data-i18n-pending`. Jika proses kamus gagal, gunakan fallback English dan tetap hapus penanda agar konten tidak tersembunyi selamanya. Teks yang dibuat secara dinamis harus menggunakan fungsi terjemahan aktif dan tidak boleh menampilkan key kamus mentah.

### 20.3 Konsistensi antarhalaman

- Bootstrap pada ketiga halaman harus identik perilakunya.
- Tema harus diterapkan sebelum first paint agar tidak muncul kilatan latar Light ketika preferensi Dark aktif.
- Teks terjemahan tidak boleh sempat menampilkan bahasa default yang berbeda dari preferensi aktif.
- Uji kondisi preferensi valid, nilai storage tidak valid, storage tidak tersedia, dan fallback sistem.
- Preferensi bahasa/tema boleh disimpan; isi file, key, value, hasil komparasi, dan output `.env` tidak boleh disimpan.



## 21. Path Halaman dan Aset Statis

Gunakan relative path untuk resource dan navigasi internal agar halaman berfungsi pada hosting root domain maupun hosting yang menggunakan subpath repository.

### 21.1 Contoh path dari setiap halaman

| Halaman | CSS global | CSS khusus | Navigasi ke Landing | Navigasi ke Tool | Navigasi ke Guide |
|---|---|---|---|---|---|
| Root `index.html` | `./css/styles.css` | `./css/landing.css` | `./` | `./app/` | `./guide/` |
| `app/index.html` | `../css/styles.css` | `../css/tool.css` | `../` | `./` | `../guide/` |
| `guide/index.html` | `../css/styles.css` | `../css/guide.css` | `../` | `../app/` | `./` |

### 21.2 Aturan resource

- Jangan memulai path aset atau tautan internal dengan `/`.
- Jangan menggunakan `<base href="/">`.
- Path `url(...)` di file CSS harus dihitung relatif terhadap file CSS tersebut. Contoh: dari `css/landing.css` ke `assets/leaf.svg` gunakan `../assets/leaf.svg`.
- Path import ES Modules dihitung relatif terhadap file JavaScript yang melakukan import.
- Gunakan trailing slash untuk link ke direktori halaman.
- Hindari path yang bergantung pada nama domain atau environment deployment.
- Setelah perubahan path, uji direct URL, refresh, navigasi antarhalaman, dan pemuatan aset.

### 21.3 Konsistensi

Gunakan path yang sama polanya pada seluruh halaman. Jangan memperbaiki path hanya dengan menambahkan konfigurasi khusus Vercel apabila relative path sudah dapat menyelesaikan kebutuhan Vercel dan GitHub Pages.
