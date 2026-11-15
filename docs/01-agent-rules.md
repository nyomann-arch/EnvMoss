# Aturan AI Agent dan Batasan Proyek — EnvMoss

**Berkas:** `01-agent-rules.md`  
**Berlaku untuk:** seluruh pekerjaan AI Agent di repositori EnvMoss  
**Versi dokumen:** 1.0  
**Status:** Acuan kerja utama

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

### 3.1 Arsitektur MVP v1.0

EnvMoss adalah **aplikasi web statis yang seluruh logika pemrosesan file-nya berjalan di browser pengguna**.

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
- Package manager atau bundler sebagai kebutuhan runtime proyek.
- Library eksternal, CDN, font eksternal, analytics, atau script pihak ketiga.
- Service Worker, PWA, Cache API untuk penyimpanan aplikasi, atau mekanisme offline-caching.

Jangan membuat fitur tambahan di luar scope hanya karena teknologi tersebut tersedia.

### 3.3 Penjelasan penting tentang koneksi internet

Tidak adanya backend berarti **isi file `.env` tidak dikirim ke server**. Namun, ketika website statis dibuka dari GitHub Pages, Vercel, atau hosting lain, browser tetap perlu mengunduh HTML, CSS, dan JavaScript dari hosting tersebut.

MVP v1.0 **tidak menjanjikan aplikasi dapat dibuka tanpa koneksi internet**. Dukungan offline setelah kunjungan pertama, Service Worker, dan PWA berada di luar scope.

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

Jangan menyimpan isi file, key, atau value environment variable ke:

- `localStorage`.
- `sessionStorage`.
- `IndexedDB`.
- Cookies.
- Cache Storage.
- Sistem penyimpanan atau layanan eksternal lainnya.

Data input hanya boleh berada di memori selama halaman digunakan. Tombol **Hapus Semua** harus menghapus input, hasil komparasi, dan referensi file dari state aplikasi. Data juga hilang saat halaman di-refresh atau ditutup.

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

- Simpan warna, tipografi, spacing, radius, dan token desain lain sebagai CSS custom properties di `:root`.
- Ikuti token dan panduan visual pada `03-design-systems.md`.
- Gunakan nama class yang deskriptif dan konsisten; pendekatan BEM boleh digunakan jika membantu.
- Hindari selector yang terlalu bergantung pada struktur DOM, misalnya selector bertingkat panjang, jika class khusus lebih jelas.
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
