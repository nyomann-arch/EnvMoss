# Design System dan Identitas Visual — EnvMoss

**Berkas:** `03-design-systems.md`  
**Produk:** EnvMoss  
**Versi:** 1.0  
**Tujuan:** Menjadi acuan visual dan interaksi UI untuk MVP v1.0

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

### 3.3 Ukuran tipografi

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

## 5. Struktur dan Tata Letak UI

### 5.1 Arah visual berdasarkan referensi mockup

Gunakan mockup referensi EnvMoss terbaru sebagai acuan komposisi dan hierarki visual, bukan sebagai instruksi untuk menyalin setiap detail secara harfiah. Pertahankan karakter Moss Theme: bersih, organik, ringan, presisi, dan menenangkan.

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

### 5.2 Kerangka halaman desktop

Gunakan halaman kerja yang ringkas dan langsung membawa pengguna ke fungsi utama. Susunan yang direkomendasikan:

1. **Navbar ringkas:** ikon/mark dan nama `EnvMoss`; tanpa tagline atau hero copy.
2. **Area input:** dua kartu Base Environment dan Target Environment yang sejajar.
3. **Aksi komparasi:** tombol utama `Bandingkan` ditempatkan dekat kedua input dan mudah ditemukan; tombol `Hapus Semua` menjadi aksi sekunder.
4. **Area hasil:** papan komparasi dua panel sebagai area utama di sebelah kiri/tengah.
5. **Panel samping:** ringkasan empat status, indikator pemrosesan lokal, dan dua tombol output.
6. **Parsing warnings:** area terpisah yang muncul bila diperlukan.

Papan komparasi dan panel samping harus memiliki hierarki yang jelas. Papan komparasi merupakan fokus utama; panel samping mendukung pemahaman hasil dan tindakan lanjutan.

Jangan membuat sidebar navigasi permanen, dashboard analitik, hero banner, atau modul yang tidak diperlukan oleh PRD.

### 5.3 Navbar dan identitas merek

- Gunakan satu ikon/mark lokal yang sederhana, terinspirasi bentuk daun atau lumut.
- Letakkan ikon di sebelah kiri wordmark `EnvMoss`.
- Tampilkan nama produk dengan ukuran dan bobot yang cukup untuk dikenali, tetapi jangan terlalu dominan.
- Jangan menampilkan tagline atau deskripsi produk pada navbar.
- Jangan mengulang logo dan nama produk sebagai judul hero di bawah navbar.
- Jika dibutuhkan, gunakan indikator privasi ringkas di sisi kanan navbar; teksnya harus menjelaskan pemrosesan lokal, bukan mengklaim offline.
- Ikon harus menggunakan SVG lokal atau CSS sederhana, bukan library atau CDN eksternal.

### 5.4 Kartu input Base dan Target

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

### 5.5 Papan komparasi dua panel

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

### 5.6 Panel ringkasan, privasi, dan aksi

Pada desktop, tempatkan panel ringkasan di sisi kanan papan komparasi jika ruang layar mencukupi. Panel ini memuat:

1. Ringkasan jumlah Missing, Orphan, Duplicate, dan Mismatch.
2. Indikator visual ringkas seperti cincin/donut boleh digunakan, tetapi setiap jumlah wajib disertai label teks.
3. Pesan privasi seperti `100% Client-Side` atau `File diproses di browser — tidak diunggah`.
4. Tombol `Salin Markdown Checklist`.
5. Tombol `Unduh Merged .env`.

Gunakan hitungan dari comparison engine; jangan membuat angka ilustratif atau angka hard-coded. Jangan memberi kesan bahwa semua temuan adalah error. Mismatch adalah informasi, Orphan bukan otomatis variabel usang, dan Duplicate dihitung berdasarkan aturan PRD.

Tombol output harus mudah ditemukan dan memiliki hierarki visual yang jelas. Jangan menambahkan tombol ekspor PDF atau fitur output lain yang berada di luar scope.

### 5.7 Dekorasi dan penggunaan ruang

- Jangan gunakan ilustrasi tanaman besar atau bukit lumut di pojok kanan atas.
- Jangan gunakan foto atau ilustrasi hero sebagai latar utama.
- Hindari ruang hero kosong yang hanya diisi tagline atau deskripsi pemasaran.
- Gunakan whitespace untuk memisahkan kelompok input, hasil, dan aksi.
- Gunakan dekorasi botani hanya sebagai detail kecil pada logo atau ikon jika diperlukan.
- Pastikan visual tidak membuat komponen utama terdorong jauh ke bawah halaman.

### 5.8 Responsivitas komposisi

- **Desktop:** dua kartu input sejajar; papan komparasi dua panel; panel ringkasan/aksi di sisi kanan.
- **Tablet:** pertahankan dua input sejajar hanya jika masih nyaman; jika terlalu sempit, susun input secara vertikal. Panel ringkasan dapat berpindah ke bawah papan komparasi.
- **Mobile:** susun Base dan Target secara vertikal. Tampilkan panel Base dan Target dalam susunan bertumpuk atau tab yang jelas; jangan memaksa dua kolom sempit yang membuat nama key sulit dibaca. Panel ringkasan dan aksi ditempatkan dalam urutan yang logis.
- Hindari horizontal scrolling pada seluruh halaman. Jika area kode membutuhkan lebar lebih, batasi scrolling pada area papan komparasi saja.

## 6. Komponen UI dan Interaction States

### 6.1 Dropzone

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

### 6.2 Textarea

- Gunakan font monospace.
- Berikan label yang terlihat.
- Pastikan teks dapat dibaca dan diedit.
- Gunakan ukuran minimum yang memadai untuk file `.env` kecil.
- Berikan focus state yang jelas.
- Hindari memotong isi teks secara horizontal jika memungkinkan; gunakan perilaku wrapping yang sesuai untuk menjaga keterbacaan.

### 6.3 Tombol

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

### 6.4 Panel ringkasan status

- Tampilkan empat jumlah status secara ringkas pada panel samping.
- Setiap status harus memiliki label dan angka.
- Indikator cincin/donut bersifat opsional dan hanya pendukung; jangan menggantikan label dan angka.
- Gunakan warna status sebagai aksen, bukan sebagai satu-satunya penanda.
- Jangan menampilkan value environment variable.

### 6.5 Papan komparasi dan detail hasil

- Gunakan dua panel sejajar untuk Base dan Target pada layar lebar.
- Nama key menggunakan font monospace.
- Tampilkan nomor baris, badge status, dan jumlah kemunculan bila relevan.
- Gunakan highlight baris yang lembut dan tetap sertakan teks status.
- Jangan merender baris `.env` asli atau value apa pun; tampilkan representasi key yang sudah disanitasi.
- Mismatch hanya menampilkan informasi seperti `Value berbeda`, bukan kedua value.

### 6.6 Parsing warnings

- Pisahkan parsing warnings dari empat kategori komparasi.
- Gunakan tampilan peringatan yang jelas tetapi tidak agresif.
- Tampilkan sisi file dan nomor baris.
- Jangan menampilkan isi baris yang mungkin mengandung secret.

### 6.7 Empty state dan no-difference state

- Sebelum komparasi: jelaskan bahwa hasil akan muncul setelah pengguna menekan Bandingkan.
- Jika tidak ditemukan perbedaan key: tampilkan pesan bahwa struktur key cocok.
- Jangan menyatakan bahwa value atau konfigurasi aplikasi sudah pasti benar.

### 6.8 Feedback aksi

Berikan feedback yang jelas untuk:

- File berhasil dibaca.
- File gagal dibaca.
- Komparasi selesai.
- Markdown berhasil disalin.
- Clipboard tidak dapat diakses.
- File Merged berhasil dibuat atau diunduh.
- Input dan hasil berhasil dihapus.

Feedback tidak boleh menyertakan value secret.

## 7. Micro-copy dan Pesan Privasi

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

## 8. Aksesibilitas

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

## 9. Responsivitas

- Desktop: dua area input dapat ditampilkan berdampingan.
- Tablet: sesuaikan lebar kolom dan jarak agar textarea tetap nyaman digunakan.
- Mobile: susun input secara vertikal; tombol dan hasil tidak boleh melebar keluar viewport.
- Gunakan unit fleksibel dan media query seperlunya.
- Pastikan daftar hasil, badge, dan nama key panjang tetap dapat dibaca.
- Hindari horizontal scrolling untuk seluruh halaman. Jika teks kode panjang memerlukan scrolling, batasi perilaku tersebut pada area teks yang relevan.

## 10. Ikon dan Aset Visual

- Utamakan CSS sederhana atau SVG lokal.
- Jangan mengambil ikon, ilustrasi, atau gambar dari CDN.
- Jangan menambahkan library ikon eksternal.
- Gunakan ikon hanya jika membantu memperjelas aksi atau status.
- Ikon dekoratif tidak boleh menggantikan label teks.

## 11. Konsistensi Implementasi

- Seluruh token desain didefinisikan di `:root` pada `css/styles.css`.
- Gunakan nama token yang konsisten dengan dokumen ini.
- Hindari hard-coded color dan spacing berulang di banyak tempat jika token yang sesuai sudah tersedia.
- Komponen dengan fungsi sama harus memiliki bentuk dan interaction state yang konsisten.
- Jangan menambahkan animasi yang mengganggu atau memperlambat interaksi.
- Prioritaskan keterbacaan, aksesibilitas, dan kejelasan alur di atas efek visual.

---

**Arah visual akhir:** EnvMoss harus terasa seperti alat developer yang kecil, matang, tenang, dan dapat dipercaya—bukan dashboard besar yang mencoba melakukan semuanya.
