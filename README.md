# Stringtools

Stringtools adalah aplikasi berbasis web yang menyediakan berbagai alat untuk pengembang, seperti formatter JSON, generator hash, encoder/decoder, dan lainnya. Semua alat berjalan sepenuhnya di sisi klien (browser), sehingga data Anda tetap aman.

## Fitur Utama

- **JSON Formatter**: Format dan validasi JSON dengan cepat.
- **REST API Tool**: Membuat dan memformat cURL dengan mudah.
- **Encoder & Decoder**: Mendukung Base64, URL encode/decode, HTML Entity, dan Hex.
- **Hash Generator**: Buat hash MD5, SHA-1, SHA-256, SHA-512, dan bcrypt.
- **String Diff**: Bandingkan dua teks dan lihat perbedaannya secara visual.

## Cara Menjalankan Aplikasi

### 1. Persiapan
Pastikan Anda telah menginstal Node.js dan Angular CLI di komputer Anda.

### 2. Instalasi Dependensi
Jalankan perintah berikut untuk menginstal semua dependensi yang diperlukan:

```bash
npm install
```

### 3. Menjalankan Server Pengembangan
Untuk menjalankan server pengembangan, gunakan perintah:

```bash
ng serve
```

Setelah server berjalan, buka browser Anda dan akses aplikasi di `http://localhost:4200/`. Aplikasi akan otomatis memuat ulang jika ada perubahan pada kode sumber.

### 4. Membuat Build Produksi
Untuk membuat build produksi yang dioptimalkan, gunakan perintah:

```bash
ng build --configuration=production
```

Hasil build akan disimpan di direktori `dist/`.

### 5. Menjalankan Unit Test
Untuk menjalankan unit test menggunakan Karma, gunakan perintah:

```bash
ng test
```

### 6. Menjalankan End-to-End Test
Untuk menjalankan pengujian end-to-end (e2e), gunakan perintah:

```bash
ng e2e
```

## Cara Menggunakan Aplikasi

1. **Buka Aplikasi**: Akses aplikasi melalui browser di `http://localhost:4200/`.
2. **Pilih Alat**: Gunakan tab navigasi untuk memilih alat yang Anda butuhkan, seperti JSON Formatter, Encoder, atau Hash Generator.
3. **Masukkan Input**: Masukkan teks atau data yang ingin Anda proses di area input.
4. **Lihat Hasil**: Hasil akan ditampilkan langsung di bawah form input.
5. **Salin atau Hapus**: Gunakan tombol "Copy" untuk menyalin hasil atau "Clear" untuk menghapus input.

## Keamanan Data

Semua proses dilakukan di sisi klien (browser). Data Anda tidak pernah dikirim ke server, sehingga privasi Anda tetap terjaga.

## Lisensi

Aplikasi ini dilisensikan di bawah [MIT License](LICENSE).

## Kontribusi

Kami menerima kontribusi dari siapa saja. Silakan buat pull request atau buka issue di repository ini.

## Informasi Tambahan

Untuk informasi lebih lanjut tentang Angular CLI, kunjungi [Angular CLI Overview and Command Reference](https://angular.dev/tools/