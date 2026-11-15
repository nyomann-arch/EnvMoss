# Dokumen Kebutuhan Produk (PRD) — EnvMoss

**Nama Produk:** EnvMoss  
**Deskripsi positioning (untuk dokumentasi, bukan teks UI):** Alat untuk membandingkan file environment secara lokal dan menjaga isi file tetap berada di browser.  
**Versi:** MVP v1.0  
**Status:** Siap menjadi acuan implementasi setelah disetujui pemilik proyek  
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

## 6. Ruang Lingkup MVP v1.0

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

### 6.2 Di luar scope

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

Tidak boleh ada isi file yang tersisa di browser storage karena aplikasi memang tidak menggunakan penyimpanan tersebut.

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

### 13.3 Batasan jaringan dan hosting

Aplikasi tidak memerlukan backend. Hosting statis hanya menyajikan berkas aplikasi. Tidak boleh ada request runtime yang mengirim data input atau secret.

## 14. Privasi dan Keamanan Produk

- Tidak ada upload isi file.
- Tidak ada API pemrosesan.
- Tidak ada database atau cloud storage.
- Tidak ada localStorage, sessionStorage, IndexedDB, cookies, atau Cache Storage untuk isi file.
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

**Hasil:** MVP v1.0 siap digunakan secara publik.

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

## Definisi Akhir MVP

EnvMoss v1.0 adalah web utility tool statis yang membandingkan dua file environment secara lokal di browser, mendeteksi Missing, Orphan, Duplicate, dan Mismatch, serta menghasilkan Markdown Checklist dan Merged `.env` tanpa mengunggah isi file ke server.

**Prinsip produk:** Satu masalah yang spesifik, solusi yang dapat dipercaya, privasi yang jelas, dan kompleksitas minimum.
