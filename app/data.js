// Data awal Keluarga Mahesa — keluarga fiktif untuk demo situs anggaran rumah tangga.
// Semua angka dalam Rupiah. Data ini hanya benih awal: pengguna dapat mengubah
// semuanya dari situs, dan perubahan tersimpan di localStorage peramban.
export const FAMILY = {
  name: 'Keluarga Mahesa',
  members: ['Mahesa (Ayah)', 'Ratna (Ibu)', 'Kirana (12 thn)', 'Bimo (8 thn)'],
  city: 'Batang, Jawa Tengah',
  currency: 'IDR',
};

export const MONTHS = ['2026-09', '2026-10', '2026-11'];

export const INCOME_SOURCES = [
  { id: 'gaji-mahesa', label: 'Gaji Mahesa', monthly: 8500000 },
  { id: 'gaji-ratna', label: 'Gaji Ratna', monthly: 6200000 },
  { id: 'usaha-sampingan', label: 'Usaha sampingan', monthly: 1450000 },
];

export const CATEGORIES = [
  { id: 'belanja', label: 'Belanja Harian', icon: '🛒', budget: 3200000, color: '#0f766e' },
  { id: 'makan-luar', label: 'Makan di Luar', icon: '🍽️', budget: 900000, color: '#b45309' },
  { id: 'transport', label: 'Transportasi', icon: '🛵', budget: 1100000, color: '#1d4ed8' },
  { id: 'tagihan', label: 'Tagihan & Utilitas', icon: '💡', budget: 1650000, color: '#7c3aed' },
  { id: 'pendidikan', label: 'Pendidikan', icon: '📚', budget: 1800000, color: '#be185d' },
  { id: 'kesehatan', label: 'Kesehatan', icon: '🩺', budget: 600000, color: '#15803d' },
  { id: 'hiburan', label: 'Hiburan', icon: '🎬', budget: 700000, color: '#c2410c' },
  { id: 'lainnya', label: 'Lainnya', icon: '🧺', budget: 500000, color: '#64748b' },
];

// Setiap transaksi: id unik, tanggal ISO, jenis 'pemasukan' | 'pengeluaran',
// kategori (atau sumber pemasukan), keterangan, jumlah (Rp).
export const SEED_TRANSACTIONS = [
  // --- November 2026 ---
  { id: 't-nov-01', date: '2026-11-01', kind: 'pemasukan', category: 'gaji-mahesa', note: 'Gaji Mahesa — November', amount: 8500000 },
  { id: 't-nov-02', date: '2026-11-01', kind: 'pemasukan', category: 'gaji-ratna', note: 'Gaji Ratna — November', amount: 6200000 },
  { id: 't-nov-03', date: '2026-11-02', kind: 'pengeluaran', category: 'belanja', note: 'Belanja mingguan Pasar Batang', amount: 486000 },
  { id: 't-nov-04', date: '2026-11-02', kind: 'pengeluaran', category: 'transport', note: 'Bensin motor (Pertalite)', amount: 50000 },
  { id: 't-nov-05', date: '2026-11-03', kind: 'pengeluaran', category: 'tagihan', note: 'Internet rumah — November', amount: 350000 },
  { id: 't-nov-06', date: '2026-11-04', kind: 'pengeluaran', category: 'pendidikan', note: 'SPP Kirana & Bimo', amount: 950000 },
  { id: 't-nov-07', date: '2026-11-05', kind: 'pengeluaran', category: 'makan-luar', note: 'Makan malam keluarga — Soto Ayam Pak Slamet', amount: 168000 },
  { id: 't-nov-08', date: '2026-11-06', kind: 'pengeluaran', category: 'belanja', note: 'Sayur & lauk — tukang sayur keliling', amount: 124000 },
  { id: 't-nov-09', date: '2026-11-07', kind: 'pengeluaran', category: 'hiburan', note: 'Tiket bioskop keluarga (4 orang)', amount: 200000 },
  { id: 't-nov-10', date: '2026-11-08', kind: 'pemasukan', category: 'usaha-sampingan', note: 'Jualan kue — pesanan arisan', amount: 420000 },
  { id: 't-nov-11', date: '2026-11-09', kind: 'pengeluaran', category: 'belanja', note: 'Belanja mingguan — beras 10 kg & minyak', amount: 512000 },
  { id: 't-nov-12', date: '2026-11-10', kind: 'pengeluaran', category: 'tagihan', note: 'BPJS Kesehatan keluarga', amount: 280000 },
  { id: 't-nov-13', date: '2026-11-11', kind: 'pengeluaran', category: 'kesehatan', note: 'Periksa gigi Bimo — Puskesmas', amount: 85000 },
  { id: 't-nov-14', date: '2026-11-12', kind: 'pengeluaran', category: 'transport', note: 'Servis motor — ganti oli', amount: 135000 },
  { id: 't-nov-15', date: '2026-11-13', kind: 'pengeluaran', category: 'pendidikan', note: 'Buku latihan & alat tulis Kirana', amount: 212000 },
  { id: 't-nov-16', date: '2026-11-14', kind: 'pengeluaran', category: 'makan-luar', note: 'Jajan siang Bimo & Kirana', amount: 64000 },
  { id: 't-nov-17', date: '2026-11-15', kind: 'pengeluaran', category: 'belanja', note: 'Belanja mingguan — buah & susu', amount: 438000 },
  { id: 't-nov-18', date: '2026-11-16', kind: 'pengeluaran', category: 'tagihan', note: 'Listrik PLN — November', amount: 418000 },
  { id: 't-nov-19', date: '2026-11-17', kind: 'pengeluaran', category: 'lainnya', note: 'Iuran RT & kebersihan', amount: 75000 },
  { id: 't-nov-20', date: '2026-11-18', kind: 'pengeluaran', category: 'hiburan', note: 'Langganan streaming keluarga', amount: 79000 },
  { id: 't-nov-21', date: '2026-11-19', kind: 'pengeluaran', category: 'transport', note: 'Bensin motor + parkir', amount: 62000 },
  { id: 't-nov-22', date: '2026-11-20', kind: 'pemasukan', category: 'usaha-sampingan', note: 'Jualan kue — pesanan kantor', amount: 380000 },
  { id: 't-nov-23', date: '2026-11-21', kind: 'pengeluaran', category: 'belanja', note: 'Belanja mingguan — daging & telur', amount: 465000 },
  { id: 't-nov-24', date: '2026-11-22', kind: 'pengeluaran', category: 'pendidikan', note: 'Les renang Bimo', amount: 250000 },
  { id: 't-nov-25', date: '2026-11-23', kind: 'pengeluaran', category: 'makan-luar', note: 'Bakso & es teh — sepulang sekolah', amount: 92000 },
  { id: 't-nov-26', date: '2026-11-24', kind: 'pengeluaran', category: 'kesehatan', note: 'Vitamin & obat flu Kirana', amount: 118000 },
  { id: 't-nov-27', date: '2026-11-25', kind: 'pengeluaran', category: 'tagihan', note: 'Air PDAM — November', amount: 176000 },
  { id: 't-nov-28', date: '2026-11-26', kind: 'pengeluaran', category: 'belanja', note: 'Belanja mingguan — kebutuhan dapur', amount: 391000 },
  // --- Oktober 2026 (untuk perbandingan bulan) ---
  { id: 't-okt-01', date: '2026-10-01', kind: 'pemasukan', category: 'gaji-mahesa', note: 'Gaji Mahesa — Oktober', amount: 8500000 },
  { id: 't-okt-02', date: '2026-10-01', kind: 'pemasukan', category: 'gaji-ratna', note: 'Gaji Ratna — Oktober', amount: 6200000 },
  { id: 't-okt-03', date: '2026-10-03', kind: 'pengeluaran', category: 'belanja', note: 'Belanja mingguan Pasar Batang', amount: 498000 },
  { id: 't-okt-04', date: '2026-10-05', kind: 'pengeluaran', category: 'tagihan', note: 'Internet rumah — Oktober', amount: 350000 },
  { id: 't-okt-05', date: '2026-10-06', kind: 'pengeluaran', category: 'pendidikan', note: 'SPP Kirana & Bimo', amount: 950000 },
  { id: 't-okt-06', date: '2026-10-08', kind: 'pengeluaran', category: 'transport', note: 'Bensin motor', amount: 112000 },
  { id: 't-okt-07', date: '2026-10-10', kind: 'pengeluaran', category: 'belanja', note: 'Belanja mingguan — beras & lauk', amount: 521000 },
  { id: 't-okt-08', date: '2026-10-12', kind: 'pengeluaran', category: 'makan-luar', note: 'Makan siang keluarga', amount: 214000 },
  { id: 't-okt-09', date: '2026-10-15', kind: 'pengeluaran', category: 'tagihan', note: 'Listrik PLN — Oktober', amount: 402000 },
  { id: 't-okt-10', date: '2026-10-17', kind: 'pengeluaran', category: 'belanja', note: 'Belanja mingguan — buah & susu', amount: 447000 },
  { id: 't-okt-11', date: '2026-10-20', kind: 'pengeluaran', category: 'pendidikan', note: 'Seragam olahraga Bimo', amount: 285000 },
  { id: 't-okt-12', date: '2026-10-22', kind: 'pengeluaran', category: 'hiburan', note: 'Tiket bioskop keluarga', amount: 200000 },
  { id: 't-okt-13', date: '2026-10-24', kind: 'pengeluaran', category: 'belanja', note: 'Belanja mingguan — kebutuhan dapur', amount: 463000 },
  { id: 't-okt-14', date: '2026-10-26', kind: 'pengeluaran', category: 'kesehatan', note: 'Periksa kesehatan Ratna', amount: 156000 },
  { id: 't-okt-15', date: '2026-10-28', kind: 'pengeluaran', category: 'transport', note: 'Bensin motor + servis ringan', amount: 178000 },
  { id: 't-okt-16', date: '2026-10-29', kind: 'pemasukan', category: 'usaha-sampingan', note: 'Jualan kue — pesanan tetangga', amount: 650000 },
  // --- September 2026 (ringkas, untuk grafik tren) ---
  { id: 't-sep-01', date: '2026-09-01', kind: 'pemasukan', category: 'gaji-mahesa', note: 'Gaji Mahesa — September', amount: 8500000 },
  { id: 't-sep-02', date: '2026-09-01', kind: 'pemasukan', category: 'gaji-ratna', note: 'Gaji Ratna — September', amount: 6200000 },
  { id: 't-sep-03', date: '2026-09-05', kind: 'pengeluaran', category: 'belanja', note: 'Belanja bulanan September', amount: 1980000 },
  { id: 't-sep-04', date: '2026-09-06', kind: 'pengeluaran', category: 'pendidikan', note: 'SPP Kirana & Bimo', amount: 950000 },
  { id: 't-sep-05', date: '2026-09-10', kind: 'pengeluaran', category: 'tagihan', note: 'Listrik + internet + air', amount: 912000 },
  { id: 't-sep-06', date: '2026-09-15', kind: 'pengeluaran', category: 'transport', note: 'Bensin & servis motor', amount: 340000 },
  { id: 't-sep-07', date: '2026-09-20', kind: 'pengeluaran', category: 'makan-luar', note: 'Makan di luar (beberapa kali)', amount: 388000 },
  { id: 't-sep-08', date: '2026-09-25', kind: 'pengeluaran', category: 'hiburan', note: 'Hiburan keluarga', amount: 262000 },
  { id: 't-sep-09', date: '2026-09-28', kind: 'pengeluaran', category: 'lainnya', note: 'Keperluan rumah tangga', amount: 214000 },
];

export const SEED_GOALS = [
  { id: 'g-darurat', name: 'Dana Darurat', target: 20000000, saved: 12750000, note: 'Cadangan 3 bulan pengeluaran pokok keluarga.' },
  { id: 'g-liburan', name: 'Liburan Keluarga', target: 8000000, saved: 3400000, note: 'Liburan ke Dieng akhir tahun bersama anak-anak.' },
  { id: 'g-motor', name: 'Motor Baru', target: 18000000, saved: 6200000, note: 'Ganti motor lama yang sudah sering mogok.' },
  { id: 'g-dapur', name: 'Renovasi Dapur', target: 12000000, saved: 1850000, note: 'Perbaiki atap dapur yang bocor saat hujan.' },
];

export const MONTHLY_SAVING_TARGET = 3000000;

export const BILLS = [
  { label: 'SPP Kirana & Bimo', dueDay: 5, amount: 950000, category: 'pendidikan' },
  { label: 'Internet rumah', dueDay: 10, amount: 350000, category: 'tagihan' },
  { label: 'BPJS Kesehatan', dueDay: 10, amount: 280000, category: 'tagihan' },
  { label: 'Listrik PLN', dueDay: 20, amount: 418000, category: 'tagihan' },
  { label: 'Air PDAM', dueDay: 25, amount: 176000, category: 'tagihan' },
];

export const TIPS = [
  'Belanja mingguan di pasar tradisional menghemat sekitar Rp 120 ribu dibanding belanja harian di minimarket.',
  'Makan di luar turun 18% dari bulan lalu — pertahankan dengan masak bekal dua kali seminggu.',
  'Tagihan listrik stabil di kisaran Rp 400 ribu; matikan AC satu jam lebih awal tiap malam.',
  'Sisihkan tabungan di awal gajian, bukan dari sisa belanja — target bulan ini Rp 3.000.000.',
];
