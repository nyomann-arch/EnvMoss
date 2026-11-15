# EnvMoss

**EnvMoss** adalah developer utility tool berbasis web statis untuk membandingkan dua file environment (`.env`) secara lokal langsung di memori browser pengguna, tanpa mengunggah file ke server.

> **Pernyataan Privasi:**  
> File `.env` Anda tetap berada di browser. EnvMoss tidak mengunggahnya ke server mana pun, tidak menggunakan analitik/telemetri pihak ketiga, dan tidak menyimpan data ke dalam browser storage.

---

## Fitur Utama

EnvMoss membandingkan dua slot file environment: **Base** (misal `.env.example`) dan **Target** (misal `.env.local`, `.env.staging`, `.env.production`), dan mengidentifikasi empat kondisi konfigurasi:

1. 🔴 **Missing**: Key tersedia di Base tetapi belum ditemukan di Target.
2. 🟡 **Orphan / Extra**: Key tambahan yang ada di Target tetapi tidak tercantum di Base.
3. 🟠 **Duplicate**: Key yang sama ditulis berulang kali dalam satu file. Dihitung per kelompok per file, dengan aturan *last declaration wins* untuk nilai efektif.
4. 🔵 **Mismatch**: Key tersedia di kedua file namun memiliki nilai efektif yang berbeda. EnvMoss memperlakukannya sebagai informasi perbedaan konfigurasi, bukan error.

---

## Actionable Outputs

Setelah melakukan perbandingan, EnvMoss menyediakan dua aksi lanjutan yang siap pakai:

- **Salin Markdown Checklist**: Menghasilkan task list Markdown hanya dari key yang berstatus *Missing* (tanpa menyertakan nilai rahasia), siap ditempel ke PR atau issue tracker.
- **Unduh Merged `.env`**: Mengunduh salinan Target yang secara utuh mempertahankan format, komentar, dan baris asli sebagai prefix, ditambah dengan penambahan key *Missing* satu kali dengan nilai kosong di bagian paling bawah.

---

## Menjalankan Secara Lokal

EnvMoss dibangun sebagai aplikasi web statis murni tanpa proses build (*no build step*), tanpa package manager, dan tanpa backend.

### Opsi 1: Menggunakan Local HTTP Server (Direkomendasikan untuk ES Modules)

Karena `index.html` memuat JavaScript dengan `type="module"`, disarankan menggunakan web server lokal sederhana:

**Menggunakan Node.js:**
```bash
npx serve .
```

**Menggunakan Python 3:**
```bash
python -m http.server 3000
```

Buka peramban pada alamat `http://localhost:3000`.

### Opsi 2: Langsung Buka Berkas

Anda juga dapat membuka berkas `index.html` langsung di peramban yang mendukung pemuatan ES Modules lokal.

---

## Struktur Berkas Proyek

```text
envmoss/
├── assets/
│   └── icons/
├── css/
│   └── styles.css          # Design tokens & responsive styling
├── docs/
│   ├── 01-agent-rules.md   # Pedoman teknis & batasan arsitektur
│   ├── 02-prd-envmoss.md   # Spesifikasi kebutuhan produk (PRD)
│   └── 03-design-systems.md# Panduan identitas visual & tokens
├── js/
│   ├── env-engine.js       # Logika parsing & perbandingan (tanpa DOM)
│   ├── output-generator.js # Pembuat Markdown Checklist & Merged .env
│   └── app.js              # Integrasi interaksi pengguna & rendering UI
├── index.html              # Antarmuka semantik utama
└── README.md               # Dokumentasi proyek
```

---

## Panduan Publikasi (Deployment)

Aplikasi ini dapat langsung dideploy ke berbagai static hosting tanpa konfigurasi server:

- **GitHub Pages**: Cukup arahkan deployment branch ke root repository.
- **Vercel**: Hubungkan repository, biarkan framework preset sebagai *Other*, dan publish folder root.
- **Netlify**: Drag-and-drop folder proyek atau sambungkan ke Git repository (Publish directory: root `.`).

---

## Lisensi & Keamanan

Seluruh pemrosesan berjalan di memori lokal peramban (*client-side only*). Tidak ada dependensi CDN eksternal, library JavaScript pihak ketiga, atau pelacakan pengguna.
