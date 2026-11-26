# DompetKita — Anggaran Rumah Tangga Keluarga Mahesa

[![Best Household Budget Site](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/chiidaichii1-boop/best-household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/chiidaichii1-boop/best-household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

DompetKita adalah situs anggaran rumah tangga yang berjalan sepenuhnya offline dari
berkas statis. Situs ini dibuat untuk **Keluarga Mahesa** (keluarga fiktif di Batang,
Jawa Tengah): memantau pemasukan dan pengeluaran bulanan, mengatur batas belanja tiap
kategori, menabung untuk tujuan keluarga, dan membandingkan keuangan antar bulan —
semuanya tersimpan hanya di peramban pengguna (localStorage), tanpa akun dan tanpa
jaringan.

## Fitur

- **Beranda** — ringkasan bulan berjalan: pemasukan, pengeluaran, sisa uang, tingkat
  tabungan; diagram lingkaran pengeluaran per kategori (canvas); transaksi terakhir;
  anggaran yang paling banyak terpakai; tagihan rutin dan status lunasnya.
- **Transaksi** — tambah, ubah, dan hapus pemasukan/pengeluaran; cari berdasarkan
  keterangan; saring berdasarkan kategori dan jenis; navigasi bulan
  (September–November 2026).
- **Anggaran** — batas belanja bulanan tiap kategori dengan bilah progres, peringatan
  saat melewati 80% atau 100%, dan batas yang bisa diubah langsung dari halaman.
- **Tabungan** — empat tujuan keluarga (Dana Darurat, Liburan Keluarga, Motor Baru,
  Renovasi Dapur) dengan progres dan setoran tambahan.
- **Laporan** — diagram batang pemasukan vs pengeluaran tiga bulan terakhir,
  perbandingan tiap kategori dengan bulan lalu, dan catatan otomatis dari data.

## Menjalankan

```sh
node serve.ts        # lalu buka http://localhost:8080
```

Tidak ada langkah build dan tidak ada dependensi. Semua berkas yang dimuat situs
tinggal di bawah `app/`; tidak ada permintaan jaringan (tanpa CDN, tanpa font
eksternal).

## Tata letak berkas

- `app/index.html` — kerangka halaman dan navigasi
- `app/style.css` — seluruh tampilan (teal dalam, krem hangat, aksen amber)
- `app/main.js` — state, rute hash, penyimpanan lokal, aksi pengguna
- `app/views.js` — tampilan kelima halaman dan gambar diagram (canvas)
- `app/data.js` — data awal keluarga: transaksi, kategori, anggaran, tujuan
- `main.ts` — program penyerah (menyalin `app/` + `screenshots/`, menulis dossier)
- `serve.ts` — server statis lokal untuk pengujian
- `screenshots/` — 4 tangkapan layar situs ini (termasuk satu tampilan ponsel)
- `shots.json` — daftar tampilan yang ditangkap tiap tangkapan layar
