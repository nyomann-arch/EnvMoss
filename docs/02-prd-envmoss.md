# Dokumen Kebutuhan Produk (PRD) — EnvMoss

**Nama Produk:** EnvMoss  
**Deskripsi positioning (untuk dokumentasi, bukan teks UI):** Alat untuk membandingkan file environment secara lokal dan menjaga isi file tetap berada di browser.  
**Versi dokumen:** 1.1  
**Versi produk baseline:** v1.0.0 (sudah dirilis)  
**Status:** Baseline v1.0.0 dipertahankan; Milestone 7–12 adalah roadmap pengembangan web yang menunggu eksekusi  
**Jenis Produk:** Web utility tool untuk developer  
**Arsitektur:** Aplikasi web statis, pemrosesan 100% di browser

---

## 1. Ringkasan Produk

EnvMoss adalah developer utility tool berbasis browser untuk membandingkan dua file environment: **Base** sebagai file acuan dan **Target** sebagai file yang diperiksa.

Contoh Base adalah `.env.example`, sedangkan Target dapat berupa `.env.local`, `.env.development`, `.env.staging`, atau `.env.production`.

EnvMoss mengidentifikasi empat kondisi:

1. **Missing:** key tersedia di Base tetapi tidak tersedia di Target.
2. **Orphan / Extra:** key tersedia di Target tetapi tidak ditemukan di Base.
3. **Duplicate:** key yang sama ditulis lebih dari satu kali dalam satu file.
4. **Mismatch:** key tersedia di kedua file, tetapi value efektifnya berbeda.

Perbedaan value antar-environment adalah hal yang normal. Karena itu, Mismatch merupakan informasi, bukan error.

Seluruh proses membaca, parsing, membandingkan, dan membuat output dilakukan di browser pengguna. Isi file tidak diunggah ke server, tidak disimpan secara permanen oleh aplikasi, dan tidak dikirim ke layanan pihak ketiga.

Pengguna dapat memasukkan file melalui drag-and-drop, pemilih file, atau copy-paste ke textarea. Setelah menekan tombol **Bandingkan**, pengguna dapat melihat hasil dan menggunakan dua output:

- **Salin Markdown Checklist:** membuat checklist dari key yang Missing.
- **Unduh Merged `.env`:** membuat salinan Target dengan penambahan key yang Missing menggunakan value kosong.

## 2. Masalah yang Diselesaikan

Developer sering mengelola beberapa file environment untuk kebutuhan development, testing, staging, dan production. Perbedaan struktur di antara file-file tersebut dapat menimbulkan beberapa masalah:

- Key baru di `.env.example` belum ditambahkan ke file environment yang digunakan.
- Ada key di Target yang belum tercantum di Base atau dokumentasi proyek.
- Key yang sama tidak sengaja ditulis berulang kali.
- Developer perlu membandingkan file secara manual dan berisiko melewatkan perbedaan.
- Developer enggan menggunakan layanan diff online karena file environment dapat berisi kredensial dan secret.

EnvMoss membantu memeriksa struktur key tanpa mengharuskan developer mengirimkan file sensitif ke server eksternal.

## 3. Tujuan Produk

### 3.1 Tujuan utama

- Mempercepat pemeriksaan struktur environment variable.
- Menemukan key yang hilang sebelum menimbulkan masalah saat aplikasi dijalankan.
- Membantu developer mengenali key tambahan dan deklarasi duplikat.
- Menunjukkan perbedaan value tanpa menganggapnya sebagai kesalahan.
- Menghasilkan output yang dapat langsung digunakan dalam workflow development.
- Menjaga isi file tetap berada di browser pengguna.

### 3.2 Bukan tujuan produk

EnvMoss bukan pengelola secret, bukan editor konfigurasi penuh, bukan layanan sinkronisasi environment, dan bukan pengganti validasi konfigurasi di runtime aplikasi.

EnvMoss tidak menentukan apakah value suatu variabel benar, aman, aktif, atau sesuai untuk production. EnvMoss hanya membandingkan struktur key dan memberikan informasi perbedaan value.

## 4. Pengguna Sasaran

### Pengguna utama

1. **Developer pemula:** sedang belajar menggunakan environment variable dalam proyek.
2. **Frontend developer:** mengelola API URL, public configuration, dan variabel build.
3. **Backend developer:** mengelola konfigurasi aplikasi, database connection, dan kredensial.

### Pengguna sekunder

4. **Full-stack developer:** mengelola beberapa environment dalam satu proyek.
5. **Tim pengembangan kecil:** menjaga agar file `.env.example` tetap mencerminkan key yang dibutuhkan aplikasi.

## 5. Prinsip Produk

### 5.1 Lokal dan menjaga privasi

Seluruh isi file diproses di memori browser. Tidak ada upload, backend, database, penyimpanan permanen, ataupun layanan pemrosesan eksternal.

### 5.2 Hasil yang dapat ditindaklanjuti

EnvMoss tidak berhenti pada daftar perbedaan. Aplikasi menyediakan Markdown Checklist dan Merged `.env` untuk membantu langkah berikutnya.

### 5.3 Perbedaan environment adalah hal wajar

Value yang berbeda tidak otomatis berarti kesalahan. Mismatch hanya memberikan informasi bahwa konfigurasi pada kedua environment tidak sama.

### 5.4 Sederhana dan fokus

MVP hanya menyelesaikan satu pekerjaan utama: membandingkan struktur dua file environment dan menghasilkan dua output yang berguna.

## 6. Ruang Lingkup Baseline v1.0.0

### 6.1 Termasuk dalam scope

- Dua input: Base Environment dan Target Environment.
- Drag-and-drop file.
- Pemilihan file melalui file picker.
- Textarea sebagai alternatif copy-paste dan tempat meninjau atau mengedit isi file.
- Tombol Bandingkan manual.
- Parsing format `.env` dasar yang didefinisikan dalam dokumen ini.
- Deteksi Missing, Orphan, Duplicate, dan Mismatch.
- Parsing warning untuk baris yang tidak didukung atau tidak valid.
- Ringkasan dan daftar hasil komparasi.
- Salin Markdown Checklist.
- Unduh Merged `.env`.
- Hapus Semua untuk mengosongkan input dan hasil.
- Tampilan responsif dan aksesibel.
- Pemrosesan lokal tanpa backend.

### 6.2 Di luar scope baseline v1.0.0

- Backend, API server, database, dan autentikasi.
- Cloud storage dan sinkronisasi file.
- Service Worker, PWA, Cache API, dan offline-caching.
- Klaim bahwa website dapat dibuka tanpa koneksi internet.
- AI integration atau AI-powered suggestions.
- Pembuatan secret otomatis.
- Deployment otomatis atau integrasi CI/CD.
- Riwayat dan versioning file.
- Kolaborasi tim.
- Laporan PDF.
- Dukungan penuh terhadap seluruh variasi parser dotenv.
- Landing page, Guide page, pilihan bahasa EN/ID, dan Dark Mode (direncanakan pada roadmap setelah v1.0.0).
- CLI Tool dan distribusi melalui npm/npx (jalur masa depan yang belum disetujui untuk implementasi).
- Multiline values.
- Variable interpolation seperti `${HOST}:${PORT}`.
- Validasi apakah value sesuai dengan kebutuhan aplikasi.

## 7. Input dan Alur Pengguna

### 7.1 Base Environment

Area untuk memasukkan file acuan, biasanya `.env.example`.

### 7.2 Target Environment

Area untuk memasukkan file yang akan diperiksa, misalnya `.env.local` atau `.env.production`.

### 7.3 Metode input

Setiap area input menyediakan tiga cara:

1. **Drag-and-Drop:** pengguna menarik satu file ke dropzone.
2. **Pilih File:** pengguna membuka file picker dan memilih file dari perangkat.
3. **Textarea:** pengguna dapat melakukan copy-paste atau mengedit teks secara langsung.

File `.env` sering merupakan hidden file di sistem operasi. Karena itu, drag-and-drop bukan satu-satunya cara input dan textarea harus tetap terlihat serta mudah digunakan.

Ketentuan:

- Setelah file dipilih atau di-drop, aplikasi membaca teks dengan Browser File API dan mengisi textarea terkait.
- Textarea menjadi sumber teks terbaru untuk komparasi. Jika pengguna mengedit teks setelah upload, aplikasi membandingkan isi hasil edit tersebut.
- Pengguna dapat mengganti input tanpa harus memuat ulang halaman.
- Pengguna dapat menghapus input dan memasukkan file lain.
- File yang dipilih tidak perlu memiliki ekstensi tertentu untuk dibaca sebagai teks; ekstensi `.env` tidak boleh menjadi satu-satunya dasar validasi file.
- Jika file gagal dibaca, tampilkan pesan yang jelas tanpa menampilkan isi file ke console.

### 7.4 Alur utama

1. Pengguna membuka EnvMoss.
2. Pengguna memasukkan Base Environment.
3. Pengguna memasukkan Target Environment.
4. Pengguna meninjau atau mengedit isi kedua textarea.
5. Pengguna menekan tombol **Bandingkan**.
6. Aplikasi menjalankan parser dan comparison engine secara lokal.
7. Aplikasi menampilkan empat kategori hasil dan parsing warning bila ada.
8. Pengguna menyalin Markdown Checklist atau mengunduh Merged `.env`.
9. Pengguna dapat menekan **Hapus Semua** untuk memulai pemeriksaan baru.

Komparasi berjalan secara manual hanya setelah tombol Bandingkan ditekan. Perubahan teks tidak memicu komparasi otomatis.

Tombol Bandingkan hanya aktif setelah kedua slot input memiliki sumber teks. File kosong yang dipilih secara eksplisit tetap merupakan input yang valid; textarea yang belum pernah diisi atau hanya berisi spasi diperlakukan sebagai input yang belum tersedia.

## 8. Aturan Parsing Environment

Parser harus sederhana, deterministik, dan hanya mendukung subset sintaks yang ditetapkan di bawah. EnvMoss tidak boleh mengklaim kompatibilitas penuh dengan semua implementasi dotenv atau semua shell.

### 8.1 Format dasar yang didukung

```env
APP_NAME=EnvMoss
DATABASE_URL=localhost
API_KEY=
export LOG_LEVEL=info
APP_LABEL="Aplikasi EnvMoss"
APP_MODE='development'
```

### 8.2 Aturan parsing

1. Input berupa string teks.
2. Hilangkan UTF-8 BOM di awal file jika ada.
3. Kenali pemisah baris `LF`, `CRLF`, dan `CR`.
4. Abaikan baris kosong.
5. Abaikan komentar penuh, yaitu baris yang setelah whitespace awalnya dimulai dengan `#`.
6. Dukung format `KEY=value` dan `export KEY=value`.
7. Izinkan whitespace di sekitar key dan tanda `=`; whitespace luar pada key dan value dipangkas.
8. Nama key bersifat case-sensitive. `API_KEY` dan `api_key` dianggap dua key berbeda.
9. Nama key harus diawali huruf atau underscore, kemudian dapat berisi huruf, angka, underscore, titik, atau tanda hubung: `[A-Za-z_][A-Za-z0-9_.-]*`.
10. Value kosong diperbolehkan, misalnya `API_KEY=`.
11. Untuk value berpetik tunggal atau ganda, hilangkan tanda petik pembuka dan penutup dari value hasil parsing. Isi di antara tanda petik diperlakukan secara literal; interpolation dan ekspansi escape tidak dilakukan.
12. Tanda `#` di dalam value berpetik dianggap bagian dari value.
13. Untuk value tanpa tanda petik, inline comment dimulai oleh karakter `#` yang didahului setidaknya satu whitespace. Dengan aturan ini, `https://example.com/#section` tetap dipertahankan sebagai value.
14. Setelah tanda petik penutup, hanya whitespace dan komentar yang diperbolehkan. Teks tambahan yang tidak sesuai menghasilkan parsing warning.
15. Kutipan yang tidak ditutup menghasilkan parsing warning.
16. Multiline values dan variable interpolation tidak didukung.

Contoh:

```env
# Komentar penuh, diabaikan
APP_NAME=EnvMoss
APP_URL=https://example.com/#section
APP_LABEL="EnvMoss Production" # komentar setelah value
EMPTY_VALUE=
```

### 8.3 Parsing warning

Baris yang tidak kosong, bukan komentar, dan tidak sesuai format yang didukung tidak boleh diabaikan diam-diam.

Setiap parsing warning setidaknya berisi:

- Sisi file: Base atau Target.
- Nomor baris.
- Alasan umum, misalnya format assignment tidak dikenali, tanda petik tidak ditutup, atau teks tambahan setelah tanda petik.

Jangan menyertakan isi baris atau value yang mungkin berisi secret pada pesan warning.

Baris yang menghasilkan warning tidak dimasukkan ke analisis key. Hasil komparasi dari baris lain tetap boleh ditampilkan, tetapi UI harus menjelaskan bahwa hasil dapat tidak lengkap karena terdapat parsing warning.

## 9. Aturan Comparison Engine

Comparison engine menerima dua string:

- `baseText`: isi Base Environment.
- `targetText`: isi Target Environment.

Engine memproses kedua string tanpa manipulasi DOM dan menghasilkan struktur data yang dapat digunakan UI.

### 9.1 Missing — Merah

**Kondisi:** key terdaftar di Base tetapi tidak ada di Target.

**Aturan:**

- Gunakan key unik yang ditemukan di Base.
- Urutkan mengikuti kemunculan pertama key di Base.
- Setiap key Missing dimasukkan ke Markdown Checklist.
- Setiap key Missing ditambahkan satu kali ke Merged `.env`.

### 9.2 Orphan / Extra — Kuning

**Kondisi:** key terdaftar di Target tetapi tidak ditemukan di Base.

**Makna:** key tambahan atau key yang belum tercantum dalam Base. Ini dapat berupa konfigurasi khusus environment dan tidak otomatis berarti key usang atau harus dihapus.

**Aturan:**

- Tampilkan sebagai informasi/warning visual.
- Jangan menghapusnya dari Target atau Merged `.env`.

### 9.3 Duplicate — Jingga

**Kondisi:** key yang sama muncul lebih dari satu kali dalam satu file.

**Aturan:**

- Deteksi secara terpisah pada Base dan Target.
- Satu kelompok key yang berulang dihitung sebagai satu duplicate record untuk file tersebut.
- Record memuat nama key, jumlah kemunculan, dan seluruh nomor baris.
- Jika key yang sama duplicate pada Base dan Target, hasilnya menjadi dua record terpisah karena berasal dari dua file.
- Untuk membandingkan value efektif, gunakan deklarasi terakhir dari key tersebut pada masing-masing file.
- Jangan menghapus atau mengubah deklarasi duplicate saat menghasilkan Merged `.env`.

Contoh satu record:

```json
{
  "key": "API_KEY",
  "count": 3,
  "lines": [2, 5, 8]
}
```

Ringkasan Duplicate harus menjelaskan bahwa angka yang ditampilkan adalah jumlah kelompok key duplikat, bukan jumlah baris tambahan.

### 9.4 Mismatch — Biru/Abu-abu

**Kondisi:** key tersedia pada Base dan Target, tetapi value efektifnya berbeda.

**Aturan:**

- Bandingkan value dari deklarasi terakhir pada masing-masing file.
- Jangan menganggap Mismatch sebagai error.
- Jangan menyarankan agar value disamakan secara otomatis.
- Tampilkan nama key dan label seperti `Value berbeda`; jangan tampilkan value aslinya.

### 9.5 Urutan dan bentuk hasil

- Urutan Missing mengikuti urutan kemunculan pertama di Base.
- Urutan Orphan mengikuti urutan kemunculan pertama di Target.
- Urutan Mismatch mengikuti urutan kemunculan pertama di Base.
- Urutan Duplicate mengikuti urutan kemunculan pertama key pada file masing-masing.
- Hasil komparasi yang dirender ke UI tidak boleh mengekspos value environment variable.
- Parser boleh menyimpan value sementara di memori untuk perbandingan, tetapi objek hasil publik untuk UI hanya perlu memuat key, status, jumlah kemunculan, nomor baris, dan metadata warning.

## 10. Hasil Visual Komparasi

### 10.1 Panel ringkasan status

Tampilkan ringkasan empat status dalam panel ringkas:

- Jumlah Missing.
- Jumlah Orphan.
- Jumlah kelompok Duplicate (Base dan Target dihitung secara terpisah).
- Jumlah Mismatch.

Ringkasan boleh menggunakan indikator visual berbentuk cincin atau grafik sederhana, tetapi setiap jumlah harus tetap ditulis dengan label teks. Visualisasi tidak boleh menjadi satu-satunya cara menyampaikan status.

### 10.2 Papan komparasi dua panel (side-by-side diff board)

Pada layar lebar, hasil utama ditampilkan sebagai dua panel yang sejajar:

- Panel kiri mewakili Base Environment.
- Panel kanan mewakili Target Environment.
- Kedua panel menampilkan nomor baris dan nama key yang relevan.
- Baris yang berkaitan diberi highlight sesuai status Missing, Orphan, Duplicate, atau Mismatch.
- Baris Missing ditandai pada sisi Base dan memiliki penanda pasangan yang tidak ditemukan pada Target.
- Baris Orphan ditandai pada sisi Target.
- Semua kemunculan Duplicate dapat ditandai bersama nomor barisnya.
- Mismatch ditandai pada kedua sisi sebagai informasi bahwa value efektif berbeda.

Papan ini adalah visualisasi hasil parsing, bukan editor file dan bukan salinan mentah isi file. **Jangan pernah merender baris `.env` asli atau value environment variable ke papan komparasi.** Tampilkan nama key, nomor baris, label status, dan placeholder seperti `[nilai disembunyikan]` bila dibutuhkan. Aturan ini berlaku juga untuk key yang value-nya tidak terlihat sensitif.

### 10.3 Panel aksi dan privasi

Pada desktop, panel ringkasan dapat ditempatkan di sisi kanan papan komparasi. Panel ini memuat:

- Ringkasan jumlah empat status.
- Indikator privasi singkat seperti `100% Client-Side` atau `Diproses di browser`.
- Tombol Salin Markdown Checklist.
- Tombol Unduh Merged `.env`.

Jangan menampilkan badge `Offline Ready`, karena offline caching dan Service Worker tidak termasuk scope MVP v1.0. Jangan menjanjikan aplikasi dapat dibuka tanpa koneksi internet.

Pada layar kecil, panel ringkasan dan aksi ditempatkan di bawah atau di atas papan komparasi dengan urutan yang tetap mudah dipahami.

### 10.4 Parsing warnings

Tampilkan area peringatan terpisah dari empat status. Jika ada warning, beri penjelasan bahwa baris yang tidak dikenali tidak dimasukkan ke komparasi sehingga hasil mungkin belum lengkap. Tampilkan sisi file dan nomor baris, tetapi jangan tampilkan isi baris.

### 10.5 Empty state

Sebelum komparasi dijalankan, tampilkan empty state yang menjelaskan bahwa hasil akan muncul setelah kedua input dibandingkan.

Jika hasil komparasi tidak menemukan perbedaan, tampilkan pesan bahwa struktur key Base dan Target cocok. Pesan tersebut tidak boleh menyatakan bahwa semua value atau konfigurasi aplikasi sudah benar.

## 11. Actionable Outputs

### 11.1 Salin Markdown Checklist

Tombol ini menghasilkan task list hanya dari key berstatus Missing.

Contoh:

```markdown
## Checklist Environment

- [ ] Tambahkan `API_KEY` ke Target Environment
- [ ] Tambahkan `CACHE_DRIVER` ke Target Environment
```

Aturan:

- Hanya key Missing yang dimasukkan.
- Urutannya mengikuti Base.
- Setiap key ditulis satu kali.
- Tidak boleh menyertakan value.
- Gunakan Clipboard API.
- Tampilkan feedback berhasil atau gagal.
- Jika tidak ada Missing, tampilkan pesan bahwa tidak ada checklist yang perlu dibuat; jangan menyalin checklist kosong yang menyesatkan.

### 11.2 Unduh Merged `.env`

Fungsi ini menghasilkan salinan Target dengan key Missing yang ditambahkan di bagian paling bawah.

**Aturan wajib:**

1. Pertahankan seluruh teks asli Target, termasuk komentar, whitespace, urutan, dan deklarasi duplicate.
2. Jangan mengubah value yang sudah ada.
3. Jangan menghapus key Orphan.
4. Jangan menghapus deklarasi Duplicate.
5. Tambahkan key Missing hanya satu kali per key unik.
6. Ikuti urutan key pada Base.
7. Berikan value kosong untuk setiap key baru, dalam bentuk `KEY=`.
8. Jika terdapat key Missing, tambahkan satu komentar penanda `# Ditambahkan oleh EnvMoss: key yang Missing` sebelum blok key tambahan.
9. Pastikan ada pemisah baris yang benar antara konten Target asli dan blok tambahan. Gunakan gaya line ending Target bila dapat dikenali; jika tidak, gunakan LF.
10. Jangan mengubah satu karakter pun dari teks asli Target. Konten asli harus tetap menjadi prefix yang identik pada hasil.
11. Jika tidak ada Missing, hasil unduhan harus sama persis dengan teks Target asli dan tidak boleh menambahkan komentar penanda.
12. Buat file secara lokal menggunakan Blob API. Jangan mengirim konten ke server.
13. Beri tahu pengguna bahwa key baru memiliki value kosong dan harus dilengkapi sebelum file digunakan.

Nama unduhan default: `envmoss-merged.env`.

Contoh:

Base:

```env
DATABASE_URL=
NODE_ENV=
API_KEY=
CACHE_DRIVER=
```

Target:

```env
DATABASE_URL=production-db
NODE_ENV=production
```

Hasil:

```env
DATABASE_URL=production-db
NODE_ENV=production

# Ditambahkan oleh EnvMoss: key yang Missing
API_KEY=
CACHE_DRIVER=
```

## 12. Hapus Semua dan Pengelolaan State

Tombol **Hapus Semua** harus:

- Mengosongkan Base textarea dan Target textarea.
- Menghapus hasil komparasi dan parsing warning.
- Menghapus status file yang sedang dipilih dari tampilan.
- Menghapus state input dan hasil yang disimpan di memori aplikasi.
- Mengembalikan area hasil ke empty state.

Tidak boleh ada isi file yang tersisa di browser storage. Pada roadmap berikutnya, `localStorage` hanya boleh digunakan untuk preferensi UI non-sensitif yang diizinkan secara eksplisit: `envmoss:language` dan `envmoss:theme`.

## 13. Arsitektur Teknis

### 13.1 Stack

| Bagian | Teknologi |
|---|---|
| Struktur | HTML5 |
| Styling | CSS3 |
| Logika | Vanilla JavaScript ES6+ |
| Pembacaan file | Browser File API |
| Drag-and-Drop | Drag and Drop API |
| Clipboard | Clipboard API |
| Pembuatan unduhan | Blob API |
| Hosting | GitHub Pages atau Vercel sebagai static hosting |

### 13.2 Struktur proyek yang disarankan

```text
envmoss/
├── docs/
│   ├── 01-agent-rules.md
│   ├── 02-prd-envmoss.md
│   └── 03-design-systems.md
├── assets/
│   └── icons/
├── css/
│   └── styles.css
├── js/
│   ├── env-engine.js
│   ├── output-generator.js
│   └── app.js
├── index.html
└── README.md
```

Tanggung jawab modul:

- `index.html`: struktur halaman dan komponen semantik.
- `css/styles.css`: seluruh styling dan responsive layout.
- `js/env-engine.js`: fungsi parsing dan komparasi, tanpa manipulasi DOM.
- `js/output-generator.js`: pembuatan Markdown Checklist dan Merged `.env`.
- `js/app.js`: interaksi pengguna, pembacaan file, pengelolaan state sederhana, dan rendering UI.
- `assets/`: aset lokal jika memang diperlukan.

Struktur dapat disesuaikan jika repository sudah memiliki susunan yang berjalan, tetapi pemisahan tanggung jawab harus dipertahankan.

### 13.2.1 Struktur halaman dan stylesheet setelah roadmap multi-halaman

Struktur statis yang direncanakan setelah Milestone 7:

```text
envmoss/
├── index.html                  # Landing page
├── app/
│   └── index.html              # Comparison Tool
├── guide/
│   └── index.html              # Guide
├── css/
│   ├── styles.css              # Reset, design tokens, tipografi, dan komponen global .site-
│   ├── tool.css                # Style khusus Comparison Tool (.tool-)
│   ├── landing.css             # Style khusus Landing (.landing-)
│   └── guide.css               # Style khusus Guide (.guide-)
├── js/
│   ├── env-engine.js           # Core parsing dan komparasi
│   ├── output-generator.js     # Markdown dan Merged .env
│   ├── app.js                  # Interaksi Comparison Tool
│   ├── i18n.js                 # Kamus dan penerapan EN/ID
│   └── site.js                 # Navigasi, tema, dan perilaku lintas halaman
├── assets/                     # Aset lokal bersama jika diperlukan
├── docs/
├── README.md                   # English
├── README.id.md                # Bahasa Indonesia
└── LICENSE
```

Struktur ini adalah target yang disarankan, bukan alasan untuk memindahkan atau membuat file sebelum milestone terkait. Agent wajib memeriksa repository aktual dan mempertahankan file yang sudah ada bila tanggung jawabnya masih tepat. Nama stylesheet boleh disesuaikan jika repository sudah memiliki struktur setara, tetapi pemisahan scope dan namespacing tetap wajib.

### 13.2.2 Strategi path relatif untuk static hosting

EnvMoss menggunakan halaman HTML statis dan ditargetkan kompatibel dengan Vercel root domain serta GitHub Pages yang mungkin menggunakan subpath repository. Karena itu, gunakan **relative path**, bukan root-absolute path.

Contoh:

| Lokasi dokumen | Resource/navigasi | Path yang digunakan |
|---|---|---|
| `index.html` | CSS global | `./css/styles.css` |
| `index.html` | JS global | `./js/site.js` |
| `index.html` | Tool | `./app/` |
| `index.html` | Guide | `./guide/` |
| `app/index.html` | CSS global | `../css/styles.css` |
| `app/index.html` | JS Tool | `../js/app.js` |
| `app/index.html` | Landing | `../` |
| `app/index.html` | Guide | `../guide/` |
| `guide/index.html` | CSS global | `../css/styles.css` |
| `guide/index.html` | JS global | `../js/site.js` |
| `guide/index.html` | Tool | `../app/` |
| `guide/index.html` | Landing | `../` |

Aturan wajib:

- Hindari path yang diawali `/` untuk CSS, JavaScript, gambar, ikon, dan navigasi internal.
- Jangan menggunakan `<base href="/">`.
- Path `url(...)` pada CSS relatif terhadap lokasi stylesheet. Dari file di `css/` menuju folder `assets/` di root, gunakan `../assets/...`.
- Import ES Modules relatif terhadap file JavaScript pengimpor. Contoh: `import { compareEnvFiles } from './env-engine.js'` di dalam `js/app.js`.
- Gunakan URL direktori dengan trailing slash seperti `./app/` dan `../guide/`.
- Uji direct navigation, refresh, dan pemuatan aset pada setiap route. Bila GitHub Pages project site menjadi target, uji juga dengan base path repository, bukan hanya root domain Vercel.

### 13.2.3 Bootstrap preferensi dan pencegahan FOUC

Setiap halaman (`/`, `/app/`, dan `/guide/`) harus menerapkan preferensi tema dan bahasa sebelum browser menampilkan stylesheet dan teks halaman.

Gunakan skrip inline kecil, sinkron, dan blocking di dalam `<head>`, setelah meta charset/viewport dan sebelum `<link rel="stylesheet">`. Skrip tidak boleh memakai `async`, `defer`, `type="module"`, timer, atau request jaringan.

Skrip harus:

1. Membaca `envmoss:theme`, menerima hanya `light`, `dark`, atau `system`.
2. Jika tema `system` atau belum tersimpan, membaca `prefers-color-scheme` dan menetapkan tema aktual `light` atau `dark` pada `<html>` sebelum CSS dihitung.
3. Membaca `envmoss:language`, menerima hanya `en` atau `id`.
4. Jika bahasa belum tersimpan, memilih `id` atau `en` berdasarkan bahasa browser yang didukung dan fallback ke `en`.
5. Mengatur atribut `<html lang="...">` serta penanda bahasa awal sebelum konten dirender.
6. Menambahkan penanda sementara seperti `data-i18n-pending="true"` sampai modul i18n menerapkan semua teks aktif.
7. Membungkus akses `localStorage` dan `matchMedia` dengan fallback yang aman; kegagalan API tidak boleh membuat aplikasi gagal.

Menetapkan `lang` tidak otomatis menerjemahkan teks. Semua teks yang perlu diterjemahkan harus ditandai dan ditahan dari tampilan selama proses i18n awal, tanpa menghilangkan struktur layout. Setelah kamus diterapkan, modul i18n menghapus penanda pending. Jika penerapan kamus gagal, fallback ke English dan lepaskan penanda agar halaman tidak tersembunyi selamanya.

Skrip bootstrap pada ketiga halaman harus memiliki perilaku identik. Key dan nilai preferensi tetap mengikuti Bagian 14.

### 13.3 Batasan jaringan dan hosting

Aplikasi tidak memerlukan backend. Hosting statis hanya menyajikan berkas aplikasi. Tidak boleh ada request runtime yang mengirim data input atau secret.

## 14. Privasi dan Keamanan Produk

- Tidak ada upload isi file.
- Tidak ada API pemrosesan.
- Tidak ada database atau cloud storage.
- Isi file, key, value, hasil komparasi, dan output tidak boleh disimpan ke localStorage, sessionStorage, IndexedDB, cookies, atau Cache Storage.
- Pengecualian terbatas: hanya preferensi bahasa (`envmoss:language`) dan tema (`envmoss:theme`) yang boleh disimpan di localStorage; bila storage gagal, aplikasi tetap berfungsi.
- Tidak ada analytics atau telemetry pihak ketiga.
- Tidak ada external CDN atau font eksternal.
- Value environment variable tidak boleh ditampilkan dalam hasil.
- Isi file tidak boleh dicatat ke console.
- Isi file hanya digunakan di memori browser selama sesi berlangsung.

Pernyataan privasi yang ditampilkan di dekat area input atau tombol utama:

> File `.env` Anda tetap berada di browser. EnvMoss tidak mengunggahnya ke server.

## 15. Persyaratan Non-Fungsional

### 15.1 Kinerja

- Komparasi dilakukan lokal di browser.
- Hindari pemrosesan ulang yang tidak diperlukan.
- UI tetap memberikan feedback yang jelas selama pembacaan file atau komparasi.

### 15.2 Kemudahan penggunaan

- Alur input harus dapat dipahami tanpa tutorial panjang.
- Drag-and-drop harus memiliki alternatif file picker dan textarea.
- Setiap status harus memiliki label teks selain warna.
- Tombol aksi memiliki label yang jelas.
- Pengguna dapat menghapus input dan memulai ulang dengan mudah.

### 15.3 Keandalan

- Input yang sama harus menghasilkan hasil yang sama.
- Parsing warning tidak boleh disembunyikan.
- Konten Target asli tidak boleh berubah ketika Merged `.env` dibuat.
- Kegagalan membaca file, menyalin clipboard, atau membuat unduhan harus ditangani dengan feedback yang dapat dipahami.

### 15.4 Aksesibilitas dan responsivitas

- Semua kontrol dapat digunakan dengan keyboard.
- Dropzone memiliki alternatif tombol pemilih file.
- Textarea memiliki label yang terlihat.
- Focus indicator harus jelas.
- Warna bukan satu-satunya penanda status.
- Tampilan tetap dapat digunakan pada desktop dan perangkat mobile.

## 16. Milestone Pengembangan

### Milestone 1 — Fondasi UI

- Siapkan `index.html`.
- Siapkan `css/styles.css`.
- Buat navbar minimal berisi ikon/mark dan nama `EnvMoss` saja.
- Jangan buat tagline, hero heading, atau ilustrasi tanaman besar di area header.
- Buat layout utama dan dua area input.
- Buat komponen empty state.
- Terapkan design tokens dan responsive layout.

**Hasil:** Kerangka UI dapat dibuka dan ditampilkan dengan benar.

### Milestone 2 — Sistem Input

- Buat file picker untuk Base dan Target.
- Implementasikan drag-and-drop.
- Implementasikan pembacaan file dengan File API.
- Sinkronkan teks file ke textarea.
- Pastikan textarea dapat diedit dan menjadi sumber komparasi.
- Buat pengelolaan replace dan clear input.

**Hasil:** Pengguna dapat memasukkan kedua teks melalui file atau copy-paste.

### Milestone 3 — Core Comparison Engine

- Implementasikan `parseEnv(text)`.
- Implementasikan `compareEnvFiles(baseText, targetText)`.
- Terapkan empat status.
- Terapkan duplicate counting dan last declaration wins.
- Terapkan parsing warnings.
- Uji fungsi secara terpisah dari DOM.

**Hasil:** Engine menghasilkan data komparasi sesuai aturan PRD.

### Milestone 4 — Rendering Hasil

- Buat panel ringkasan untuk empat status.
- Buat papan komparasi dua panel (Base dan Target) dengan nomor baris.
- Tandai baris berdasarkan Missing, Orphan, Duplicate, dan Mismatch.
- Render hanya nama key, nomor baris, serta metadata status; jangan render value atau baris `.env` mentah.
- Tampilkan parsing warnings secara terpisah.
- Buat empty state dan no-difference state.
- Susun panel ringkasan dan tombol output sebagai panel samping pada layar lebar dan layout bertumpuk pada layar kecil.

**Hasil:** Pengguna dapat memahami hasil komparasi melalui UI.

### Milestone 5 — Actionable Outputs

- Implementasikan Markdown Checklist.
- Implementasikan Clipboard API dan feedback.
- Implementasikan Merged `.env`.
- Implementasikan Blob API dan unduhan.
- Uji bahwa teks Target asli tetap identik.

**Hasil:** Kedua output dapat digunakan.

### Milestone 6 — Pengujian dan Publikasi

- Uji skenario parser dan komparasi.
- Uji file picker, drag-and-drop, dan textarea.
- Uji kedua output.
- Uji Hapus Semua.
- Periksa Console dan Network untuk memastikan tidak ada pengiriman data input.
- Uji responsivitas dan aksesibilitas dasar.
- Publikasikan ke static hosting.

**Hasil:** Baseline web EnvMoss v1.0.0 siap digunakan secara publik. Milestone 1–6 merupakan catatan baseline dan tidak perlu diulang kecuali ada bug atau regresi.

## 17. Acceptance Criteria

MVP dianggap memenuhi kebutuhan jika seluruh kriteria berikut terpenuhi:

1. Pengguna dapat memasukkan Base dan Target melalui file picker.
2. Pengguna dapat memasukkan file melalui drag-and-drop.
3. Pengguna dapat melakukan copy-paste dan mengedit kedua textarea.
4. Komparasi hanya dijalankan ketika tombol Bandingkan ditekan.
5. Baris kosong dan komentar penuh tidak dianggap sebagai key.
6. Format `KEY=value` dan `export KEY=value` diproses.
7. Key bersifat case-sensitive.
8. Key yang ada di Base tetapi tidak di Target terdeteksi sebagai Missing.
9. Key yang ada di Target tetapi tidak di Base terdeteksi sebagai Orphan.
10. Satu key yang muncul tiga kali dalam satu file menghasilkan satu duplicate record dengan count 3 dan seluruh nomor baris.
11. Duplicate Base dan Duplicate Target dicatat terpisah.
12. Perbandingan key duplicate menggunakan deklarasi terakhir.
13. Key bersama dengan value efektif berbeda terdeteksi sebagai Mismatch, bukan error.
14. Value tidak ditampilkan pada hasil komparasi atau parsing warning.
15. Format yang tidak didukung menghasilkan parsing warning dengan nomor baris.
16. Markdown Checklist hanya berisi key Missing, tanpa value.
17. Merged `.env` mempertahankan teks Target asli dan menambahkan setiap key Missing satu kali dengan value kosong.
18. Jika tidak ada Missing, hasil Merged `.env` identik dengan teks Target asli.
19. Hapus Semua membersihkan input, hasil, dan state aplikasi.
20. Tidak ada isi file yang dikirim melalui network request atau disimpan ke browser storage.
21. Aplikasi dapat dipublikasikan sebagai website statis tanpa backend.
22. Navbar hanya menampilkan ikon/mark EnvMoss dan nama `EnvMoss`; tidak menampilkan tagline atau deskripsi pemasaran.
23. Tidak ada ilustrasi tanaman besar di pojok kanan atas atau hero section dekoratif pada area header.
24. Hasil utama menggunakan papan komparasi Base dan Target berdampingan pada layar lebar, dengan panel ringkasan dan aksi yang ringkas.
25. Papan komparasi hanya menampilkan nama key dan metadata; tidak pernah menampilkan value atau baris `.env` asli.
26. Tidak ada badge atau klaim `Offline Ready` pada MVP v1.0.

## 18. Skenario Uji Minimum

### Skenario A — Missing

Base:

```env
APP_NAME=EnvMoss
API_KEY=
```

Target:

```env
APP_NAME=EnvMoss
```

Ekspektasi: `API_KEY` muncul sebagai Missing.

### Skenario B — Orphan

Base:

```env
APP_NAME=EnvMoss
```

Target:

```env
APP_NAME=EnvMoss
CUSTOM_FLAG=true
```

Ekspektasi: `CUSTOM_FLAG` muncul sebagai Orphan dan tidak dihapus dari Merged `.env`.

### Skenario C — Duplicate

Target:

```env
API_KEY=first
API_KEY=second
API_KEY=third
```

Ekspektasi: satu duplicate record untuk `API_KEY`, count 3, line numbers `[1, 2, 3]`; value efektif adalah deklarasi terakhir.

### Skenario D — Mismatch

Base:

```env
DATABASE_URL=localhost
```

Target:

```env
DATABASE_URL=production-db
```

Ekspektasi: `DATABASE_URL` muncul sebagai Mismatch, bukan Missing atau error.

### Skenario E — Parsing warning

Input:

```env
APP_NAME=EnvMoss
THIS IS NOT VALID
```

Ekspektasi: baris kedua menghasilkan parsing warning dan tidak dimasukkan sebagai key.

### Skenario F — Tidak ada Missing

Base dan Target memiliki struktur key yang sama.

Ekspektasi: Merged `.env` mempertahankan teks Target persis tanpa komentar atau baris tambahan.

## 19. Ukuran Keberhasilan

Keberhasilan MVP dinilai berdasarkan:

- Empat status komparasi bekerja sesuai aturan.
- Parsing warning terlihat dan informatif.
- Dua output menghasilkan konten yang benar.
- Tidak ada pengiriman isi file ke server.
- Pengguna dapat menyelesaikan komparasi tanpa membuat akun.
- Alur input dan hasil dapat dipahami tanpa penjelasan panjang.
- Aplikasi dapat dijalankan sebagai static web application.

## 20. Risiko dan Mitigasi

| Risiko | Mitigasi |
|---|---|
| Perilaku parser dotenv berbeda antar-runtime | Dokumentasikan subset sintaks EnvMoss dan jangan mengklaim kompatibilitas penuh. |
| Duplicate dapat ditafsirkan berbeda | Gunakan aturan satu record per kelompok key duplikat per file; deklarasi terakhir menjadi value efektif. |
| Secret terlihat pada UI atau console | Jangan tampilkan value pada hasil dan jangan mencatat isi file ke console. |
| Parsing warning menyebabkan hasil tidak lengkap | Tampilkan peringatan dan jelaskan bahwa baris tersebut tidak dianalisis. |
| Key baru memiliki value kosong | Beri peringatan agar pengguna melengkapi value sebelum menggunakan file. |
| Target berubah ketika file digabung | Uji bahwa teks Target asli tetap menjadi prefix identik pada output. |

---

## 21. Roadmap Pengembangan Setelah v1.0.0

Bagian ini merencanakan pengembangan website setelah rilis stabil v1.0.0. Fitur-fitur di bawah **belum dianggap tersedia** sampai milestone terkait benar-benar diimplementasikan dan diverifikasi.

### 21.1 Tujuan roadmap

Mengembangkan EnvMoss dari satu halaman utility menjadi pengalaman produk web yang lebih lengkap tanpa mengubah fondasi utamanya:

- Tetap berupa website statis tanpa backend.
- Tetap menggunakan HTML, CSS, dan Vanilla JavaScript.
- Isi file `.env` tetap diproses sepenuhnya di browser.
- Tidak menambahkan framework, package manager, bundler, CDN, analytics, atau layanan pihak ketiga.
- Memperbaiki navigasi, aksesibilitas, kemudahan belajar, dan jangkauan pengguna melalui halaman Landing, Tool, Guide, bahasa EN/ID, dan tema gelap.

### 21.2 Informasi arsitektur halaman yang direncanakan

Rute statis yang direkomendasikan:

| URL | Halaman | Tujuan |
|---|---|---|
| `/` | Landing | Memperkenalkan EnvMoss dan mengarahkan pengguna ke Tool atau Guide |
| `/app/` | Tool | Menjalankan perbandingan file environment; merupakan rumah bagi fungsi v1.0.0 yang sudah ada |
| `/guide/` | Guide | Menyediakan petunjuk penggunaan, penjelasan status, batas parser, dan troubleshooting |

Gunakan static HTML dan navigasi tautan biasa. Tidak perlu SPA router. Jika struktur hosting atau repository membuat rute di atas tidak praktis, agent harus memeriksa konfigurasi Vercel terlebih dahulu dan mengajukan alternatif URL statis yang setara sebelum mengubah rute.

**Aturan navigasi:** logo/mark dan wordmark EnvMoss selalu mengarah ke `/`. Tidak boleh ada menu khusus bernama Home atau Landing. Navbar boleh menyediakan tautan ke Tool dan Guide.

### Milestone 7 — Fondasi Multi-Halaman dan Navbar Tetap

**Tujuan:** Menyediakan struktur statis multi-halaman dan navigasi global sebelum membuat konten Landing dan Guide.

**Prasyarat:** Baseline v1.0.0 sudah berjalan. Agent wajib menginspeksi struktur repository, URL Vercel, dan path aset sebelum memindahkan halaman Tool.

**Pekerjaan:**

1. Dokumentasikan struktur rute statis: `/`, `/app/`, dan `/guide/`.
2. Pindahkan atau adaptasikan halaman Tool yang sekarang berada di root ke `/app/` tanpa mengubah core comparison engine.
3. Jadikan `/` sebagai Landing page awal; konten lengkap Landing diselesaikan pada Milestone 10.
4. Buat kerangka `/guide/`; isi panduan diselesaikan pada Milestone 11.
5. Buat navbar global dengan logo/mark dan wordmark `EnvMoss`, tautan `Tool`, tautan `Guide`, kontrol bahasa EN/ID, dan kontrol tema.
6. Logo EnvMoss menjadi satu-satunya navigasi global yang mengarah ke Landing. Jangan tambahkan menu `Home` atau `Landing`.
7. Terapkan navbar `position: fixed`, tinggi navbar yang konsisten, `z-index` yang wajar, dan offset konten agar tidak tertutup.
8. Terapkan strategi relative path sesuai Bagian 13.2.2 pada semua HTML, navigasi, stylesheet, script, gambar, dan ikon. Jangan memakai root-absolute path atau `<base href="/">`.
9. Pastikan import ES Modules dan `url(...)` CSS tetap mengarah ke resource yang benar sesuai lokasi file pengimpor/stylesheet.
10. Tambahkan class konteks halaman pada `<body>`: `page--landing`, `page--tool`, dan `page--guide`.
11. Terapkan pemisahan stylesheet dan namespacing sesuai Design System; jangan membiarkan style halaman baru memengaruhi Tool.
12. Buat kerangka head bootstrap sesuai Bagian 13.2.3 agar atribut preferensi tersedia sebelum stylesheet; penyelesaian terjemahan awal ditangani pada Milestone 8.
13. Gunakan navigasi halaman statis biasa; jangan menambahkan router atau framework.
14. Pertahankan seluruh fungsi Tool v1.0.0, termasuk input, komparasi, output, dan Hapus Semua.

**Hasil yang diharapkan:** ketiga URL statis dapat dibuka langsung, navbar konsisten, dan fungsi Tool tidak mengalami regresi.

**Acceptance Criteria:**
- `/`, `/app/`, dan `/guide/` dapat dibuka langsung melalui hosting target.
- Refresh pada `/app/` dan `/guide/` tidak menghasilkan 404.
- Logo EnvMoss dari setiap halaman mengarah ke `/`.
- Tidak terdapat tautan navbar yang secara eksplisit bernama Home atau Landing.
- Tautan Tool dan Guide bekerja.
- Navbar tetap berada di bagian atas ketika halaman digulir.
- Navbar tidak menutupi konten, target anchor, atau elemen yang sedang difokuskan.
- Seluruh aset dan ES Modules berhasil dimuat di ketiga rute.
- Navigasi dan aset menggunakan relative path dan tidak bergantung pada root domain.
- Tidak ada stylesheet Landing/Guide yang mengubah komponen Tool.
- Fitur komparasi v1.0.0 tetap berfungsi.

### Milestone 8 — Internasionalisasi Bahasa Inggris dan Bahasa Indonesia

**Tujuan:** Membuat seluruh pengalaman EnvMoss tersedia dalam English dan Bahasa Indonesia.

**Pekerjaan:**

1. Buat kamus terjemahan lokal, misalnya `js/i18n.js`, tanpa API terjemahan atau request jaringan.
2. Terapkan kontrol EN/ID di navbar semua halaman.
3. Terjemahkan seluruh teks pada halaman Tool, termasuk label input, tombol, status, parsing warning, empty state, toast, error, konfirmasi, tooltip, dan aria-label.
4. Terjemahkan seluruh konten Landing dan Guide.
5. Pastikan teks yang dihasilkan oleh Markdown Checklist dan komentar tambahan pada Merged `.env` mengikuti bahasa aktif, jika output tersebut memang menampilkan kalimat natural.
6. Pertahankan nama teknis dan nama key apa adanya; jangan menerjemahkan isi key environment variable.
7. Perbarui `document.documentElement.lang` menjadi `en` atau `id` sesuai bahasa aktif.
8. Bahasa awal mengikuti preferensi tersimpan. Jika belum ada, deteksi bahasa browser yang didukung (`id` atau `en`), lalu gunakan English sebagai fallback.
9. Simpan hanya kode bahasa ke `localStorage` dengan key `envmoss:language`.
10. Jika `localStorage` tidak tersedia atau gagal diakses, kontrol bahasa tetap berfungsi dalam memori.
11. Buat `README.md` berbahasa Inggris dan `README.id.md` berbahasa Indonesia. Letakkan tautan silang bahasa di dekat bagian atas kedua README.
12. Pastikan kedua README memuat informasi inti yang sepadan dan tidak mengklaim fitur yang belum dirilis.
13. Terapkan skrip bootstrap bahasa inline, sinkron, dan blocking pada `<head>` setiap halaman sebelum stylesheet. Gunakan key `envmoss:language`, validasi nilai `en`/`id`, dan fallback bahasa browser/English sesuai Bagian 13.2.3.
14. Terapkan penanda `data-i18n-pending` pada first paint. Pastikan teks yang diterjemahkan tidak menampilkan bahasa fallback sebelum kamus aktif diterapkan.
15. Setelah penerjemahan selesai, lepaskan penanda pending. Jika penerjemahan gagal, gunakan fallback English dan lepaskan penanda agar konten tidak tersembunyi selamanya.

**Hasil yang diharapkan:** pengguna dapat berpindah bahasa dari halaman mana pun tanpa reload yang tidak perlu dan tanpa teks antarmuka yang tertinggal dalam bahasa lain.

**Acceptance Criteria:**
- EN dan ID tersedia di Landing, Tool, dan Guide.
- Semua teks UI statis dan dinamis memiliki terjemahan.
- Perubahan bahasa memperbarui atribut `lang` pada HTML.
- Bahasa yang dipilih bertahan setelah refresh jika storage tersedia.
- Aplikasi tetap berfungsi jika localStorage diblokir.
- Isi file `.env` tidak pernah disimpan sebagai bagian dari preferensi bahasa.
- `README.md` berbahasa Inggris dan `README.id.md` berbahasa Indonesia tersedia serta saling tertaut.
- Pada first paint, atribut `lang` dan bahasa pilihan sudah ditetapkan oleh skrip blocking di `<head>` sebelum konten terlihat.
- Tidak ada teks bahasa default yang sempat terlihat sebelum terjemahan aktif diterapkan.
- Jika inisialisasi i18n gagal, fallback English ditampilkan dan halaman tidak tertahan dalam keadaan tersembunyi.

### Milestone 9 — Dark Mode dan Preferensi Tema

**Tujuan:** Menyediakan tema terang dan gelap yang konsisten di seluruh halaman.

**Pekerjaan:**

1. Perluas design tokens agar setiap warna inti memiliki pasangan Light dan Dark.
2. Implementasikan tema menggunakan atribut seperti `data-theme="light"` dan `data-theme="dark"` pada elemen `<html>`.
3. Sediakan kontrol tema yang mudah ditemukan pada navbar.
4. Jika belum ada preferensi tersimpan, ikuti `prefers-color-scheme` dari sistem operasi.
5. Beri pengguna pilihan eksplisit Light, Dark, atau System bila desain kontrol memungkinkan; jika UI hanya berupa toggle, setidaknya tetap sediakan mekanisme kembali ke System.
6. Simpan hanya preferensi tema ke `localStorage` dengan key `envmoss:theme` dan nilai `light`, `dark`, atau `system`.
7. Tangani kondisi storage tidak tersedia dengan fallback sistem.
8. Terapkan tema pada Landing, Tool, Guide, navbar fixed, input, diff board, summary, badge, tombol, link, tooltip, dialog, dan feedback.
9. Periksa kontras warna status dan focus indicator pada kedua tema.
10. Terapkan skrip bootstrap tema inline, sinkron, dan blocking pada `<head>` setiap halaman sebelum stylesheet. Skrip membaca `envmoss:theme`, memvalidasi `light`/`dark`/`system`, dan menerapkan tema aktual sebelum first paint.
11. Jika preferensi tidak tersedia atau bernilai `system`, gunakan `prefers-color-scheme` melalui `matchMedia`. Jika API tidak tersedia, fallback ke Light.
12. Bungkus akses `localStorage` dan `matchMedia` dengan fallback aman. Jangan biarkan kegagalan salah satu API menggagalkan rendering.
13. Pastikan skrip bootstrap tema pada Landing, Tool, dan Guide memiliki perilaku identik.

**Hasil yang diharapkan:** tema gelap dan terang dapat digunakan pada seluruh halaman tanpa komponen yang kehilangan keterbacaan.

**Acceptance Criteria:**
- Dark Mode tersedia di Landing, Tool, dan Guide.
- Pilihan Light/Dark/System bekerja sesuai desain yang disetujui.
- Preferensi tema bertahan setelah refresh jika storage tersedia.
- Fallback sistem bekerja jika belum ada preferensi.
- Aplikasi tidak gagal ketika localStorage tidak tersedia.
- Badge status, teks, border, input, dan focus state terbaca pada kedua tema.
- Tidak ada isi file atau hasil komparasi yang disimpan bersama preferensi tema.
- Tidak terlihat kilatan tema yang salah sebelum CSS pertama kali dirender pada ketiga halaman.
- Nilai tema tidak valid dan kegagalan localStorage/matchMedia menghasilkan fallback yang aman.

### Milestone 10 — Verifikasi Landing Page

**Tujuan:** Memastikan Landing Page sederhana yang sudah ada dan dipertahankan setelah pembatalan redesign Milestone 10 berfungsi benar dalam arsitektur multi-halaman. Milestone ini berfokus pada pengujian, verifikasi, dan perbaikan bug integrasi yang terbukti; bukan pembangunan ulang, redesign, atau penambahan section.

**Keputusan scope:**

- Gunakan Landing Page yang saat ini ada di route `/` sebagai baseline desain dan konten.
- Pertahankan struktur sederhana yang disukai: headline dan deskripsi singkat, CTA menuju Tool dan Guide, empat status EnvMoss, serta penjelasan privasi.
- Jangan mengembalikan layout Landing yang lebih panjang/padat dari eksperimen Milestone 10 sebelumnya.
- Jangan menambahkan section baru seperti testimonial/social proof, storytelling, pricing, FAQ, feature grid tambahan, atau dekorasi hanya untuk membuat halaman lebih panjang.
- Jangan mengganti desain hanya karena preferensi estetika agent. Perubahan visual hanya boleh dilakukan untuk memperbaiki bug, aksesibilitas, responsivitas, konsistensi Design System, atau ketidaksesuaian terhadap keputusan produk yang terdokumentasi.
- Jangan mengubah perilaku atau source code Tool, comparison engine, parser, maupun output generator kecuali ditemukan regresi yang secara langsung disebabkan integrasi halaman; setiap perubahan semacam itu harus sekecil mungkin dan dilaporkan.

**Pekerjaan:**

1. Periksa route `/` dan pastikan halaman yang ditampilkan adalah Landing sederhana yang sudah ada, bukan halaman Tool dan bukan versi redesign yang dibatalkan.
2. Verifikasi navbar global dari Milestone 7: logo/wordmark EnvMoss mengarah ke `/`, tautan Tool mengarah ke `/app/`, tautan Guide mengarah ke `/guide/`, serta kontrol bahasa dan tema tersedia sesuai implementasi Milestone 8 dan 9.
3. Verifikasi CTA utama pada Landing mengarah ke `/app/` dan CTA sekunder mengarah ke `/guide/`. Pastikan tautan Repository, jika ditampilkan, menuju repository resmi yang benar.
4. Verifikasi konten inti tetap ringkas dan akurat: tujuan EnvMoss, empat status (Missing, Orphan, Duplicate, Mismatch), dan privasi client-side. Jangan menambahkan klaim bahwa Mismatch adalah error, Orphan pasti usang, atau website dapat digunakan offline tanpa koneksi.
5. Verifikasi tidak ada value `.env`, secret, kredensial, atau data pengguna pada teks, screenshot, metadata, maupun contoh visual Landing.
6. Verifikasi seluruh teks Landing tersedia dalam EN dan ID, termasuk headline, deskripsi, CTA, heading section, label status, privacy statement, footer, tooltip, dan accessible labels yang relevan.
7. Verifikasi Light, Dark, dan System (sesuai kontrol tema yang telah disetujui) pada Landing. Pastikan warna teks, background, border, link, tombol, badge status, hover, dan focus tetap terbaca.
8. Verifikasi bootstrap preferensi pada `<head>` berjalan sebelum stylesheet dan tidak menimbulkan flash tema atau bahasa yang salah pada first paint. Uji juga fallback jika `localStorage` tidak tersedia atau nilainya tidak valid.
9. Verifikasi relative path seluruh CSS, JavaScript, gambar, ikon, link internal, dan aset Landing. Uji route pada deployment root dan simulasi base path subdirectory yang digunakan untuk memeriksa kompatibilitas GitHub Pages project site.
10. Verifikasi CSS Landing terisolasi menggunakan namespace yang ditetapkan dalam Design System. Pastikan stylesheet Landing tidak mengubah tampilan atau layout Tool dan Guide.
11. Uji responsivitas pada desktop, tablet, dan mobile. Pastikan headline tidak terpotong, CTA mudah digunakan, empat status tetap terbaca, navbar tidak menutupi konten, dan tidak muncul horizontal overflow yang tidak disengaja.
12. Uji aksesibilitas dasar: navigasi keyboard, urutan focus, focus indicator, semantic heading, accessible name pada kontrol, kontras warna, dan reduced motion jika terdapat animasi.
13. Periksa browser console dan Network untuk error, resource 404, request pihak ketiga yang tidak disetujui, atau indikasi pengiriman isi `.env`. Landing tidak boleh memuat analytics, CDN, external font, atau dependency baru.
14. Perbaiki hanya masalah yang ditemukan dalam verifikasi. Hindari refactor atau perubahan visual yang tidak diperlukan.
15. Simpan bukti pengujian di `scratch/verify-m10`, mengikuti pola artefak verifikasi milestone sebelumnya.
16. Jangan menghapus, menimpa, atau mengubah artefak `scratch/verify-m3` sampai atau dan `scratch/verify-m11` yang sudah ada. Periksa pola penamaan dan isi folder `scratch/` terlebih dahulu; buat hanya file baru yang diperlukan di `scratch/verify-m10`.
17. Jangan melakukan commit, push, release, atau deployment production tanpa persetujuan pengguna.

**Hasil yang diharapkan:** Landing sederhana tetap dipertahankan, seluruh integrasi halaman bekerja, tidak ada regresi visual/fungsional yang diketahui, dan hasil verifikasi terdokumentasi di `scratch/verify-m10`.

**Acceptance Criteria:**

- Route `/` menampilkan Landing sederhana yang telah dipilih sebagai baseline.
- Tidak ada pembangunan ulang atau penambahan section yang tidak diminta.
- CTA utama menuju `/app/` dan CTA sekunder menuju `/guide/`.
- Logo EnvMoss mengarah ke `/`; navbar tidak memiliki item bernama `Home` atau `Landing`.
- Link Repository, jika ada, mengarah ke repository resmi.
- Informasi empat status dan privasi akurat serta tidak menampilkan value atau secret.
- Seluruh konten Landing tersedia dalam EN dan ID.
- Light/Dark/System bekerja sesuai preferensi dan tidak menimbulkan FOUC yang terlihat.
- Relative path aset dan navigasi bekerja pada root path serta base path subdirectory yang diuji.
- CSS Landing terisolasi dan tidak merusak Tool atau Guide.
- Layout dapat digunakan pada desktop, tablet, dan mobile tanpa overflow yang tidak disengaja.
- Pemeriksaan keyboard, focus, semantic structure, dan kontras dasar selesai.
- Tidak ada error console atau resource 404 yang belum dijelaskan pada alur Landing.
- Tidak ada request analitik/CDN/dependency pihak ketiga yang tidak disetujui dan tidak ada pengiriman isi `.env`.
- Bukti dan laporan pengujian tersedia di `scratch/verify-m10`.
- Artefak verifikasi milestone lain tidak dihapus atau ditimpa.
- Tidak ada commit, push, release, atau deployment production tanpa persetujuan pengguna.

### Milestone 11 — Guide Page

**Tujuan:** Menyediakan panduan praktis yang membantu pengguna memahami dan menggunakan EnvMoss tanpa membaca source code.

**Arah referensi:** gunakan struktur Guide PomeloO yang mudah dipindai, tetapi buat versi EnvMoss lebih sederhana karena jumlah fitur jauh lebih sedikit.

**Pekerjaan:**

1. Bangun halaman pada route `/guide/`.
2. Gunakan navbar global dan dukungan bahasa/tema dari milestone sebelumnya.
3. Buat navigasi bagian (table of contents) yang sederhana di sisi kiri pada layar lebar dan dapat diringkas menjadi menu pada mobile.
4. Susun konten dalam bagian:
   - Memulai: apa yang dibutuhkan sebelum membandingkan file.
   - Memasukkan Base dan Target: drag-and-drop, file picker, dan textarea.
   - Menjalankan komparasi: kapan hasil diperbarui dan arti tombol Bandingkan.
   - Memahami hasil: Missing, Orphan, Duplicate, dan Mismatch.
   - Menggunakan output: Markdown Checklist dan Merged `.env`.
   - Sintaks yang didukung: aturan parsing dan contoh yang aman.
   - Privasi: data lokal, batasan klaim, dan cara menghapus sesi.
   - Troubleshooting: file gagal dibaca, parsing warning, clipboard tidak tersedia, dan unduhan.
5. Gunakan contoh `.env` fiktif; jangan pernah memasukkan secret sungguhan.
6. Tambahkan tautan yang kontekstual menuju `/app/` ketika pengguna siap mencoba fitur.
7. Pastikan setiap section memiliki heading yang jelas dan anchor yang bisa dibagikan.
8. Pada mobile, navigasi bagian tidak boleh mengambil terlalu banyak ruang atau menutupi konten.
9. Seluruh isi Guide diterjemahkan ke EN/ID dan memiliki tema Light/Dark.

**Hasil yang diharapkan:** pengguna dapat menemukan jawaban atas pertanyaan penggunaan umum secara mandiri.

**Acceptance Criteria:**
- `/guide/` dapat dibuka langsung dan di-refresh.
- Semua section utama tersedia dan ditautkan melalui daftar isi.
- Anchor menuju section bekerja tanpa tertutup navbar fixed.
- Daftar isi responsif di mobile.
- Semua konten tersedia dalam EN dan ID.
- Tema Light/Dark berfungsi.
- Contoh file sepenuhnya fiktif dan tidak berisi secret nyata.
- CTA menuju Tool berfungsi.

### Milestone 12 — Integrasi, QA, Dokumentasi, dan Rilis Web Berikutnya

**Tujuan:** Memastikan perubahan multi-halaman, bilingual, dan tema tidak merusak fitur inti serta siap dipublikasikan.

**Pekerjaan:**

1. Jalankan regression test seluruh fungsi v1.0.0: input, parsing, empat status, Markdown Checklist, Merged `.env`, dan Hapus Semua.
2. Uji semua rute melalui direct URL, refresh, dan navigasi antarhalaman.
3. Uji EN/ID pada semua halaman dan seluruh state dinamis.
4. Uji Light/Dark, preferensi tersimpan, fallback browser, dan kegagalan localStorage.
5. Uji navbar fixed pada desktop, tablet, dan mobile; pastikan tidak menutupi konten dan keyboard focus.
6. Uji Guide table of contents dan anchor.
7. Uji layout dengan teks terjemahan yang lebih panjang.
8. Uji aksesibilitas dasar: keyboard-only, focus visibility, label, nama aksesibel, kontras, dan reduced motion.
9. Periksa Network untuk memastikan tidak ada isi `.env` yang dikirim.
10. Pastikan hanya preferensi UI yang diizinkan yang masuk localStorage; pastikan tidak ada file content atau comparison result yang tersimpan.
11. Periksa bahwa tidak ada CDN, external font, analytics, atau dependency baru yang tidak disetujui.
12. Perbarui `README.md` menjadi English dan buat/selaraskan `README.id.md` berbahasa Indonesia.
13. Pastikan README menjelaskan perbedaan Landing, Tool, dan Guide; cara menjalankan lokal; privasi; keterbatasan parser; dan lisensi.
14. Verifikasi preview/deployment Vercel, termasuk URL halaman dan asset path.
15. Uji seluruh route dan asset path pada deployment root Vercel serta simulasi base path subdirectory yang merepresentasikan GitHub Pages project site bila GitHub Pages tetap menjadi target.
16. Periksa urutan HTML head: bootstrap preferensi bersifat inline dan blocking serta muncul sebelum stylesheet.
17. Uji first paint untuk tema dan bahasa: preferensi yang tersimpan harus diterapkan sebelum tampilan terlihat; tidak boleh ada flash tema atau teks bahasa yang salah.
18. Uji nilai localStorage yang tidak valid, localStorage yang melempar error, dan ketiadaan `matchMedia`.
19. Uji isolasi CSS dengan membuka Landing, Tool, dan Guide satu per satu serta memeriksa tidak ada komponen yang berubah akibat stylesheet halaman lain.
20. Catat regresi, keterbatasan, dan pengujian yang belum dapat dilakukan.

**Hasil yang diharapkan:** website multi-halaman yang stabil, bilingual, memiliki Light/Dark Mode, dan mempertahankan seluruh kemampuan v1.0.0.

**Acceptance Criteria:**
- Semua acceptance criteria Milestone 7–11 terpenuhi.
- Semua test case baseline v1.0.0 tetap lolos.
- Tidak ada 404 pada route atau asset yang diperlukan.
- Tidak ada console error yang berasal dari aplikasi pada alur utama.
- Tidak ada data `.env` yang dikirim atau disimpan secara persisten.
- README English dan Indonesian saling tertaut dan sesuai implementasi.
- Deployment preview telah diperiksa.
- Tidak ada path asset yang rusak saat aplikasi berada pada base path root maupun subdirectory yang diuji.
- Tidak ada FOUC tema/bahasa yang terlihat pada first paint di pengujian.
- CSS antarhalaman terisolasi sesuai namespacing.
- Tidak ada release, tag, commit, atau push tanpa persetujuan pengguna.

## 22. Jalur Masa Depan: EnvMoss CLI (Belum Masuk Roadmap Web Aktif)

CLI adalah ide produk lanjutan yang menarik, tetapi secara sengaja ditunda agar tidak memperbesar kompleksitas web roadmap. Bagian ini adalah catatan arah eksplorasi, bukan izin untuk mulai mengimplementasikan CLI.

### 22.1 Prinsip yang harus dipertahankan

- CLI membaca file langsung dari filesystem lokal pengguna.
- Tidak ada upload, telemetry, atau pengiriman isi file ke jaringan.
- Jangan mencetak value secret secara default.
- Jangan menimpa Target Environment secara otomatis.
- Output merged harus dibuat sebagai file baru atau memerlukan konfirmasi eksplisit sebelum overwrite.
- Comparison rules dan parsing behavior harus konsisten dengan web tool.
- CLI tidak boleh menambahkan dependency atau runtime Node.js ke aplikasi web.

### 22.2 Tahapan eksplorasi CLI jika disetujui nanti

**CLI Discovery:** tentukan pengguna sasaran, command design, versi Node.js yang didukung, ketersediaan nama paket npm, kebutuhan distribusi `npx`, dan model file output.

**CLI Core:** pastikan comparison engine dapat digunakan di Node.js tanpa ketergantungan DOM dan memiliki test yang sama dengan web engine.

**CLI Interaction:** buat alur terminal yang interaktif dan ramah pengguna. Bandingkan `@clack/prompts`, Enquirer, dan Ink berdasarkan kompleksitas UX, aksesibilitas terminal, ukuran dependency, dan kebutuhan tampilan. Jangan memilih library sebelum kebutuhan UI CLI ditetapkan.

**CLI Packaging:** tentukan executable `bin`, metadata package, dukungan Windows/macOS/Linux, dokumentasi, versioning, dan proses publish npm. Verifikasi dahulu nama paket tersedia dan aman digunakan.

**CLI Release:** uji jalur `npx` pada lingkungan bersih, pengelolaan file, konfirmasi overwrite, error handling, dan konsistensi hasil dengan web tool.

Tidak ada kode CLI, `package.json`, dependency CLI, atau publikasi npm yang boleh dibuat sampai pengguna menyetujui dimulainya jalur ini.

## 23. Status Produk dan Definisi Versi

- **v1.0.0:** baseline web tool yang sudah dirilis dan menjadi fondasi yang harus dipertahankan.
- **Milestone 7–12:** rencana pengembangan website setelah v1.0.0; belum dianggap selesai atau tersedia sebelum implementasi dan verifikasi.
- **CLI:** arah produk masa depan yang belum masuk scope aktif.

Nomor versi rilis berikutnya ditentukan setelah ruang lingkup milestone diselesaikan dan diuji. Jangan mengubah versi produk hanya karena dokumen roadmap diperbarui.

**Prinsip produk:** pertahankan tool inti yang dapat dipercaya, lalu perluas pengalaman di sekelilingnya secara bertahap tanpa mengorbankan privasi atau kesederhanaan.
