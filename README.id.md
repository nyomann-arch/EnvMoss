# EnvMoss

> **Bandingkan. Validasi. Rahasia Tetap Lokal.**

EnvMoss adalah developer utility tool berbasis web statis yang membantu developer membandingkan dua file environment (`.env`) secara lokal langsung di memori browser. EnvMoss mendeteksi ketidaksesuaian struktur konfigurasi, deklarasi duplikat, serta perbedaan nilai antar-environment tanpa pernah mengirimkan isi file atau kredensial Anda ke server.

[![Live Demo](https://img.shields.io/badge/demo-envmoss.vercel.app-3D6B4F?style=flat-square)](https://envmoss.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/github-nyomann--arch%2FEnvMoss-1A2E22?style=flat-square&logo=github)](https://github.com/nyomann-arch/EnvMoss)
[![License: MIT](https://img.shields.io/badge/License-MIT-6B9B7A?style=flat-square)](LICENSE)

🌐 **Bahasa:** [Bahasa Indonesia](README.id.md) · [English](README.md)

---

## Tautan Cepat

- **Live Application:** [https://envmoss.vercel.app/](https://envmoss.vercel.app/)
- **Source Code:** [https://github.com/nyomann-arch/EnvMoss](https://github.com/nyomann-arch/EnvMoss)
- **Lisensi:** [MIT License](LICENSE)

---

## Masalah yang Diselesaikan

Dalam pengembangan perangkat lunak, developer sering mengelola beberapa file environment (seperti `.env.example`, `.env.local`, `.env.staging`, dan `.env.production`). Perbedaan struktur di antara file-file tersebut kerap memicu kendala:

- Key baru yang ditambahkan di `.env.example` terlewat dan belum didefinisikan di environment lokal atau staging.
- Terdapat key tambahan di server target yang tidak terdokumentasi di repository.
- Variabel yang sama tidak sengaja dideklarasikan berulang kali dalam satu file.
- Menggunakan diff tool online konvensional berisiko tinggi membocorkan API key, password database, dan kredensial rahasia ke server pihak ketiga.

EnvMoss menyelesaikan masalah tersebut dengan menyediakan sarana inspeksi struktur yang cepat, informatif, dan sepenuhnya berjalan di sisi klien (*client-side*).

---

## Fitur Utama

### 1. Dual Environment Input
Mendukung perbandingan dua file environment secara berdampingan:
- **Base Environment:** Berkas acuan, umumnya `.env.example`.
- **Target Environment:** Berkas yang diperiksa, misalnya `.env.local` atau `.env.production`.

Setiap slot input menyediakan tiga metode input fleksibel:
- **Drag-and-Drop:** Tarik dan lepas file langsung ke area dropzone.
- **File Picker:** Pilih file dari direktori perangkat melalui tombol pemilih berkas.
- **Textarea Editor:** Salin-tempel atau edit teks secara langsung. Textarea berfungsi sebagai *single source of truth* untuk proses komparasi.

### 2. Four-State Comparison Engine
Engine komparasi EnvMoss memproses struktur variabel dan mengelompokkan temuan ke dalam empat status utama:

| Status | Indikator | Arti & Penjelasan Teknis |
|---|---|---|
| **Missing** | 🔴 Merah | Key terdaftar di Base tetapi tidak ditemukan di Target. Perlu ditambahkan ke environment Target. |
| **Orphan / Extra** | 🟡 Kuning | Key ada di Target tetapi tidak ditemukan di Base. Menandakan konfigurasi spesifik environment dan tidak otomatis berarti key usang. |
| **Duplicate** | 🟠 Jingga | Key yang sama dideklarasikan lebih dari satu kali dalam file yang sama. Duplikasi dicatat per kelompok key per file, dengan aturan *last declaration wins* untuk penentuan nilai efektif. |
| **Mismatch** | 🔵 Biru | Key tersedia di kedua file, namun nilai efektifnya berbeda. Kondisi ini adalah informasi perbedaan konfigurasi yang wajar antar-environment, bukan sebuah error. |
| **Match** | ⚪ Netral | Key dan nilai efektif sama persis di kedua file. |

### 3. Side-by-Side Diff Board
Hasil komparasi ditampilkan dalam dua panel sejajar (Base di kiri, Target di kanan) dengan baris yang saling dipetakan (*aligned rows*):
- Dilengkapi penomoran baris kemunculan asli (`L${baris}`) dan badge status berwarna.
- Jika suatu key berstatus Missing, sisi Target menampilkan penanda slot kosong `— Tidak ditemukan di Target —`.
- Jika suatu key berstatus Orphan, sisi Base menampilkan penanda slot kosong `— Tidak terdaftar di Base —`.
- **Privasi Nilai:** Nilai asli variabel **tidak pernah ditampilkan** pada papan komparasi. Seluruh nilai disamarkan menggunakan placeholder penyamaran `= [nilai disembunyikan]`.

### 4. Parsing Warnings Terisolasi
Jika file memuat baris yang tidak memenuhi standar format `.env` yang didukung, EnvMoss tidak mengabaikannya diam-diam:
- Menampilkan kotak peringatan terpisah yang memuat sisi file dan nomor baris terkait.
- Tidak menyertakan isi teks mentah baris pada pesan peringatan agar rahasia tidak bocor.
- Baris yang menghasilkan peringatan diisolasi dan tidak diikutsertakan ke dalam analisis key.

---

## Actionable Outputs

Setelah melakukan komparasi, EnvMoss menyediakan dua aksi lanjutan yang dapat langsung digunakan dalam alur kerja developer:

### 1. Salin Markdown Checklist
Menghasilkan daftar tugas Markdown yang hanya memuat key berstatus **Missing** tanpa menyertakan nilai rahasia:

```markdown
## Checklist Environment

- [ ] Tambahkan `API_KEY` ke Target Environment
- [ ] Tambahkan `DATABASE_URL` ke Target Environment
```

- Disalin langsung ke clipboard perangkat via Clipboard API.
- Tombol otomatis dinonaktifkan jika tidak ada key Missing untuk mencegah penyalinan daftar kosong.
- Bahasa checklist mengikuti bahasa antarmuka yang aktif (English atau Bahasa Indonesia).

### 2. Unduh Merged `.env`
Menghasilkan file konfigurasi baru bernama `envmoss-merged.env` secara lokal melalui Blob API:
- **Menjaga Keaslian Target:** Seluruh konten asli Target dipertahankan 100% tanpa perubahan sebagai prefix (termasuk komentar, spasi kosong, dan duplikasi yang sudah ada).
- **Penambahan Key Missing:** Setiap key Missing ditambahkan satu kali di bagian paling bawah dengan nilai kosong (`KEY=`), diawali komentar penanda.
- **Konsistensi Format:** Mengikuti gaya pemisah baris asli Target (`CRLF` atau `LF`).
- **Tanpa Missing:** Jika tidak ada key Missing, hasil unduhan identik persis dengan file Target asli tanpa penambahan komentar penanda.
- *Pengingat:* Developer disarankan melengkapi nilai variabel kosong tersebut sebelum file digunakan pada aplikasi.

---

## Cara Menggunakan (Quick Usage)

1. Buka [https://envmoss.vercel.app/](https://envmoss.vercel.app/) pada browser Anda.
2. Masukkan file acuan (misalnya `.env.example`) pada kartu **Base Environment** via drag-and-drop, tombol **Pilih File**, atau paste ke textarea.
3. Masukkan file target (misalnya `.env.local` atau `.env.production`) pada kartu **Target Environment**.
4. Klik tombol **Bandingkan** untuk menjalankan komparasi lokal.
5. Periksa ringkasan status dan telusuri perbedaan pada **Papan Komparasi**.
6. Gunakan tombol **Salin Markdown Checklist** untuk mencatat to-do list, atau klik **Unduh Merged .env** untuk mendapatkan file target yang telah dilengkapi.
7. Gunakan tombol **Hapus Semua** untuk membersihkan seluruh input, hasil, dan state dari memori halaman.

Antarmuka tersedia dalam Bahasa Indonesia dan English — beralih kapan saja melalui kontrol EN/ID pada navbar; pilihan Anda diingat di perangkat ini.

---

## Batasan & Kompatibilitas Parsing

EnvMoss menggunakan parser internal sederhana dan deterministik yang dirancang khusus untuk kebutuhan komparasi struktur. Parser mendukung:

- Format penugasan standar `KEY=value` dan `export KEY=value`.
- Baris kosong dan komentar penuh yang diawali karakter `#`.
- Karakter whitespace di sekitar tanda `=` (dipangkas otomatis).
- Validasi nama key: harus diawali huruf atau underscore, dan hanya berisi karakter alfanumerik, underscore, titik, atau tanda hubung (`^[A-Za-z_][A-Za-z0-9_.-]*$`).
- Nama key bersifat *case-sensitive* (`API_KEY` berbeda dengan `api_key`).
- Nilai kosong (`API_KEY=`).
- Nilai berpetik tunggal (`'...'`) dan ganda (`"..."`). Tanda kutip dilepas dan isi di dalamnya diperlakukan secara literal (tanda `#` di dalam kutipan dianggap bagian dari nilai).
- Inline comment pada nilai tanpa tanda petik yang didahului spasi (`\s+#`). Karakter `#` pada URL (seperti `https://example.com/#section`) tetap dipertahankan sebagai nilai.
- Pembersihan karakter UTF-8 BOM (`\uFEFF`) di awal file.
- Normalisasi pemisah baris LF (`\n`), CRLF (`\r\n`), dan CR (`\r`).

**Batasan (Belum Didukung di MVP v1.0):**
- Multiline values (nilai yang membentang di beberapa baris).
- Variable interpolation (ekspansi variabel seperti `${HOST}:${PORT}`).
- *Catatan:* EnvMoss tidak mengklaim kompatibilitas penuh dengan seluruh variasi implementasi pustaka `dotenv` atau shell parser eksternal. Baris yang tidak memenuhi format di atas akan menghasilkan *Parsing Warning*.

---

## Privasi dan Keamanan

EnvMoss memegang prinsip *privacy-first* secara ketat:

- **Pemrosesan 100% Client-Side:** File dibaca menggunakan Browser File API (`FileReader`). Seluruh proses parsing, kalkulasi komparasi, dan pembuatan file output dieksekusi di memori browser pengguna.
- **Tanpa Backend & API:** Tidak ada server backend, endpoint API pemrosesan, database, atau layanan analitik/telemetri pihak ketiga.
- **Bebas Penyimpanan Permanen:** Isi file, nama key, dan nilai tidak pernah disimpan ke dalam `localStorage`, `sessionStorage`, `IndexedDB`, maupun cookies. Data hanya berada di memori tab aktif dan akan terhapus saat tab ditutup, di-refresh, atau saat tombol **Hapus Semua** ditekan. Satu-satunya preferensi yang disimpan hanyalah kode bahasa antarmuka (`envmoss:language`) dan tema (`envmoss:theme`).
- **Proteksi Nilai Variabel:** Nilai environment variable tidak pernah dicetak ke antarmuka komparasi, tidak dicatat ke `console.log`, dan tidak dimasukkan ke dalam Markdown Checklist.
- **Pernyataan Privasi:**
  > *"File `.env` Anda diproses secara lokal di browser. EnvMoss tidak mengunggah isi file konfigurasi Anda ke server aplikasi."*
- *Catatan Transparansi:* Saat Anda pertama kali membuka website EnvMoss, browser Anda mengunduh aset statis (HTML, CSS, JS) dari hosting Vercel. Pemuatan aset statis website ini sepenuhnya terpisah dari file `.env` Anda yang tidak pernah meninggalkan browser.

---

## Teknologi yang Digunakan

EnvMoss dibangun dengan arsitektur web modern yang ramping tanpa framework, tanpa bundler, dan tanpa dependensi runtime:

| Komponen | Teknologi | Kegunaan |
|---|---|---|
| **Struktur Markup** | HTML5 Semantik | Kerangka antarmuka yang aksesibel dan terstruktur |
| **Styling** | CSS3 Murni (Custom Properties) | Design tokens, komponen UI bertema Moss, dan tata letak responsif |
| **Logika Aplikasi** | Vanilla JavaScript (ES6+) | Manajemen interaksi pengguna dan manipulasi DOM |
| **Arsitektur Kode** | JavaScript ES Modules bawaan | Pemisahan modul tanggung jawab kode yang rapi |
| **Pembacaan Berkas** | Browser File API / FileReader | Membaca file lokal pengguna secara asinkron |
| **Penyalinan Data** | Clipboard API | Menyalin Markdown Checklist ke clipboard |
| **Pembuatan Berkas** | Blob API & Object URL | Menghasilkan file unduhan `envmoss-merged.env` secara lokal |
| **Internasionalisasi** | Kamus lokal `js/i18n.js` | Terjemahan English/Indonesia tanpa request jaringan |
| **Hosting Publik** | Vercel | Penyedia static web hosting untuk file web publik |

---

## Menjalankan Proyek Secara Lokal

Karena proyek menggunakan modul JavaScript bawaan browser (`<script type="module">`), disarankan menjalankan EnvMoss melalui local static HTTP server agar browser tidak membatasi pemuatan modul lokal karena kebijakan CORS.

### Prasyarat
- Git
- Python 3 **atau** Node.js

### 1. Clone Repository
```bash
git clone https://github.com/nyomann-arch/EnvMoss.git
cd EnvMoss
```

### 2. Jalankan Local Server

**Opsi A — Menggunakan Python 3 (Direkomendasikan):**
```bash
python -m http.server 3000
```

**Opsi B — Menggunakan npx serve (Jika Node.js terpasang):**
```bash
npx serve .
```
*(Catatan: `npx serve` hanya bertindak sebagai server berkas statis lokal sederhana, bukan dependensi aplikasi atau build step).*

### 3. Buka di Browser
Akses alamat berikut pada peramban Anda:
```text
http://localhost:3000
```

> **Catatan Pengembang:** Proyek ini adalah aplikasi web statis murni tanpa build step. Tidak memerlukan instalasi package manager atau build runner eksternal.

---

## Struktur Repository

```text
EnvMoss/
├── css/
│   ├── styles.css          # Design tokens, komponen global .site-, dan dark theme
│   ├── tool.css            # Style khusus Comparison Tool
│   ├── landing.css         # Style khusus Landing page
│   └── guide.css           # Style khusus Guide page
├── docs/
│   ├── 01-agent-rules.md   # Panduan teknis arsitektur dan batasan proyek
│   ├── 02-prd-envmoss.md   # Dokumen Kebutuhan Produk (PRD) EnvMoss
│   └── 03-design-systems.md# Acuan design system visual dan tokens
├── js/
│   ├── app.js              # Interaksi antarmuka Tool, input, dan rendering DOM
│   ├── env-engine.js       # Core comparison engine dan parser (independen dari DOM)
│   ├── output-generator.js # Logika pembuat Markdown Checklist dan Merged .env
│   ├── i18n.js             # Kamus terjemahan EN/ID dan penerapannya ke DOM
│   └── site.js             # Perilaku global: navbar, bahasa, tema
├── index.html              # Landing page
├── app/
│   └── index.html          # Comparison Tool
├── guide/
│   └── index.html          # Guide
├── LICENSE                 # Berkas lisensi open-source MIT
├── README.md               # Dokumentasi bahasa Inggris
└── README.id.md            # Dokumentasi bahasa Indonesia
```

---

## Deployment

EnvMoss dapat dideploy secara instan ke platform static web hosting mana pun tanpa pengaturan server khusus:

- **Live Demo Vercel:** [https://envmoss.vercel.app/](https://envmoss.vercel.app/)
- **GitHub Pages:** Cukup arahkan sumber publikasi ke branch `main` pada root direktori `/`.
- **Netlify:** Hubungkan repositori dengan direktori publik root (`.`).

---

## Kontribusi dan Feedback

Kontribusi untuk perbaikan bug, penambahan skenario pengujian, dan penyempurnaan dokumentasi sangat diterima!

1. Laporkan masalah atau diskusikan ide fitur baru melalui [GitHub Issues](https://github.com/nyomann-arch/EnvMoss/issues).
2. Kirimkan perbaikan kode atau dokumentasi melalui [Pull Request](https://github.com/nyomann-arch/EnvMoss/pulls).

---

## Lisensi

Proyek ini dilisensikan di bawah lisensi terbuka [MIT License](LICENSE) © 2026 nyomann-arch.
