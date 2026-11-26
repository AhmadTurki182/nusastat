// NusaStat — dataset. Semua angka adalah angka resmi BPS yang dipublikasikan,
// dengan tahun dan sumber dicantumkan di setiap tampilan. Nilai null berarti
// angka tahun itu belum dirilis BPS pada saat situs ini dibuat (Nov 2026).

export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
export const DEFAULT_YEAR = 2024;

// Kapan dataset ini terakhir diperbarui (ditampilkan di kaki halaman).
export const DATA_AS_OF = 'November 2026';

// Setiap indikator: satu deret tahunan. `values` memakai tahun sebagai kunci.
export const INDICATORS = [
  {
    id: 'penduduk',
    name: 'Jumlah Penduduk',
    section: 'penduduk',
    unit: 'juta jiwa',
    decimals: 2,
    source: 'BPS, Sensus Penduduk 2020 & Proyeksi Penduduk 2020–2045',
    note: 'Pertengahan tahun; 2021–2026 adalah proyeksi BPS.',
    values: { 2020: 270.20, 2021: 272.68, 2022: 275.77, 2023: 278.69, 2024: 281.60, 2025: 284.44, 2026: 287.29 },
  },
  {
    id: 'pertumbuhan-ekonomi',
    name: 'Pertumbuhan Ekonomi (PDB)',
    section: 'ekonomi',
    unit: '% (y-on-y)',
    decimals: 2,
    suffix: '%',
    source: 'BPS, Berita Resmi Statistik PDB',
    note: 'Pertumbuhan PDB atas dasar harga konstan 2010 terhadap tahun sebelumnya.',
    values: { 2020: -2.07, 2021: 3.70, 2022: 5.31, 2023: 5.05, 2024: 5.03, 2025: null, 2026: null },
  },
  {
    id: 'pdb-nominal',
    name: 'PDB Harga Berlaku',
    section: 'ekonomi',
    unit: 'Rp triliun',
    decimals: 1,
    source: 'BPS, PDB Indonesia Tahunan',
    note: 'Produk Domestik Bruto atas dasar harga berlaku.',
    values: { 2020: 15443.6, 2021: 16976.7, 2022: 19588.4, 2023: 20892.4, 2024: 22139.0, 2025: null, 2026: null },
  },
  {
    id: 'pdb-per-kapita',
    name: 'PDB per Kapita',
    section: 'ekonomi',
    unit: 'Rp juta',
    decimals: 1,
    source: 'BPS, PDB Indonesia Tahunan',
    note: 'PDB harga berlaku dibagi jumlah penduduk pertengahan tahun.',
    values: { 2020: 57.3, 2021: 62.2, 2022: 71.0, 2023: 75.0, 2024: 78.6, 2025: null, 2026: null },
  },
  {
    id: 'inflasi',
    name: 'Inflasi (IHK, Desember y-on-y)',
    section: 'harga',
    unit: '%',
    decimals: 2,
    suffix: '%',
    source: 'BPS, Berita Resmi Statistik Inflasi',
    note: 'Laju inflasi Indeks Harga Konsumen bulan Desember terhadap Desember tahun sebelumnya.',
    values: { 2020: 1.68, 2021: 1.87, 2022: 5.51, 2023: 2.61, 2024: 1.57, 2025: null, 2026: null },
  },
  {
    id: 'pengangguran',
    name: 'Tingkat Pengangguran Terbuka',
    section: 'tenaga-kerja',
    unit: '%',
    decimals: 2,
    suffix: '%',
    source: 'BPS, Survei Angkatan Kerja Nasional (Sakernas) Agustus',
    note: 'Persentase angkatan kerja yang menganggur, keadaan Agustus tiap tahun.',
    values: { 2020: 7.07, 2021: 6.49, 2022: 5.86, 2023: 5.32, 2024: 4.91, 2025: null, 2026: null },
  },
  {
    id: 'kemiskinan',
    name: 'Tingkat Kemiskinan (Maret)',
    section: 'kemiskinan',
    unit: '% penduduk',
    decimals: 2,
    suffix: '%',
    source: 'BPS, Profil Kemiskinan di Indonesia',
    note: 'Persentase penduduk miskin terhadap total penduduk, keadaan Maret tiap tahun.',
    values: { 2020: 9.78, 2021: 10.14, 2022: 9.54, 2023: 9.36, 2024: 9.03, 2025: 8.47, 2026: null },
  },
  {
    id: 'kemiskinan-september',
    name: 'Tingkat Kemiskinan (September)',
    section: 'kemiskinan',
    unit: '% penduduk',
    decimals: 2,
    suffix: '%',
    source: 'BPS, Profil Kemiskinan di Indonesia',
    note: 'Persentase penduduk miskin, keadaan September tiap tahun.',
    values: { 2020: 10.19, 2021: 9.71, 2022: 9.57, 2023: 9.36, 2024: 8.57, 2025: null, 2026: null },
  },
  {
    id: 'gini',
    name: 'Rasio Gini (Maret)',
    section: 'kemiskinan',
    unit: 'rasio',
    decimals: 3,
    source: 'BPS, Profil Kemiskinan di Indonesia',
    note: 'Ukuran ketimpangan pengeluaran penduduk, 0 = merata sempurna, 1 = timpang sempurna.',
    values: { 2020: 0.381, 2021: 0.381, 2022: 0.379, 2023: 0.379, 2024: 0.379, 2025: null, 2026: null },
  },
  {
    id: 'ipm',
    name: 'Indeks Pembangunan Manusia',
    section: 'pendidikan',
    unit: 'indeks',
    decimals: 2,
    source: 'BPS, Indeks Pembangunan Manusia',
    note: 'Komposit angka harapan hidup, harapan lama sekolah, rata-rata lama sekolah, dan pengeluaran per kapita.',
    values: { 2020: 71.94, 2021: 72.29, 2022: 73.77, 2023: 74.39, 2024: 75.02, 2025: null, 2026: null },
  },
  {
    id: 'lama-sekolah',
    name: 'Rata-rata Lama Sekolah',
    section: 'pendidikan',
    unit: 'tahun',
    decimals: 2,
    source: 'BPS, Indeks Pembangunan Manusia',
    note: 'Rata-rata jumlah tahun yang dihabiskan penduduk usia 25 tahun ke atas untuk menempuh pendidikan.',
    values: { 2020: 8.76, 2021: 8.89, 2022: 8.95, 2023: 8.99, 2024: 9.04, 2025: null, 2026: null },
  },
  {
    id: 'harapan-sekolah',
    name: 'Harapan Lama Sekolah',
    section: 'pendidikan',
    unit: 'tahun',
    decimals: 2,
    source: 'BPS, Indeks Pembangunan Manusia',
    note: 'Lamanya sekolah yang diharapkan dapat dirasakan anak usia 7 tahun ke atas pada masa mendatang.',
    values: { 2020: null, 2021: null, 2022: null, 2023: null, 2024: 14.11, 2025: null, 2026: null },
  },
  {
    id: 'harapan-hidup',
    name: 'Angka Harapan Hidup',
    section: 'kesehatan',
    unit: 'tahun',
    decimals: 2,
    source: 'BPS, Indeks Pembangunan Manusia',
    note: 'Perkiraan rata-rata lama hidup bayi yang baru lahir, dalam tahun.',
    values: { 2020: null, 2021: null, 2022: 73.99, 2023: 74.19, 2024: 74.46, 2025: null, 2026: null },
  },
  {
    id: 'stunting',
    name: 'Prevalensi Stunting Balita',
    section: 'kesehatan',
    unit: '% balita',
    decimals: 1,
    suffix: '%',
    source: 'Kemenkes, Survei Status Gizi Indonesia (SSGI)',
    note: 'Persentase balita dengan tinggi badan di bawah standar usianya.',
    values: { 2020: null, 2021: 24.4, 2022: 21.6, 2023: 21.5, 2024: 19.8, 2025: null, 2026: null },
  },
];

// Nilai indikator pada satu tahun; null bila belum dirilis.
export function valueAt(indicator, year) {
  const v = indicator.values[year];
  return typeof v === 'number' ? v : null;
}

// Tahun terakhir yang punya angka untuk indikator ini.
export function latestYear(indicator) {
  for (let i = YEARS.length - 1; i >= 0; i--) {
    if (typeof indicator.values[YEARS[i]] === 'number') return YEARS[i];
  }
  return null;
}

export function indicatorById(id) {
  return INDICATORS.find((x) => x.id === id) || null;
}

export function indicatorsOf(sectionId) {
  return INDICATORS.filter((x) => x.section === sectionId);
}

// Format angka Indonesia: koma desimal, titik ribuan.
export function formatNumber(value, decimals) {
  return value.toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatIndicatorValue(indicator, value) {
  if (value === null || value === undefined) return '—';
  return formatNumber(value, indicator.decimals) + (indicator.suffix || '');
}

// Sepuluh provinsi berpenduduk terbesar, proyeksi BPS pertengahan 2024.
export const PROVINCES = [
  { id: 'jabar', name: 'Jawa Barat', population2024: 50.35, areaKm2: 37173 },
  { id: 'jatim', name: 'Jawa Timur', population2024: 41.81, areaKm2: 47803 },
  { id: 'jateng', name: 'Jawa Tengah', population2024: 38.09, areaKm2: 32801 },
  { id: 'sumut', name: 'Sumatera Utara', population2024: 16.04, areaKm2: 72981 },
  { id: 'banten', name: 'Banten', population2024: 12.43, areaKm2: 9663 },
  { id: 'dki', name: 'DKI Jakarta', population2024: 10.68, areaKm2: 664 },
  { id: 'sulsel', name: 'Sulawesi Selatan', population2024: 9.51, areaKm2: 46717 },
  { id: 'lampung', name: 'Lampung', population2024: 9.45, areaKm2: 34624 },
  { id: 'sumsel', name: 'Sumatera Selatan', population2024: 9.02, areaKm2: 91592 },
  { id: 'riau', name: 'Riau', population2024: 7.0, areaKm2: 87024 },
];

export function provinceById(id) {
  return PROVINCES.find((p) => p.id === id) || null;
}

export function provinceDensity(province) {
  return (province.population2024 * 1e6) / province.areaKm2;
}

export function provinceShare(province) {
  const total = valueAt(INDICATORS[0], 2024);
  return (province.population2024 / total) * 100;
}

// Pangsa penduduk menurut pulau, Sensus Penduduk 2020 (BPS).
export const ISLAND_SHARE = [
  { name: 'Jawa', share: 56.1 },
  { name: 'Sumatera', share: 21.68 },
  { name: 'Sulawesi', share: 7.36 },
  { name: 'Kalimantan', share: 6.18 },
  { name: 'Bali & Nusa Tenggara', share: 5.51 },
  { name: 'Maluku & Papua', share: 3.17 },
];

export const SECTIONS = [
  { id: 'beranda', title: 'Beranda', path: '#/', blurb: 'Gambaran umum statistik Indonesia.' },
  { id: 'penduduk', title: 'Penduduk', path: '#/penduduk', blurb: 'Jumlah, sebaran, dan kepadatan penduduk.' },
  { id: 'ekonomi', title: 'Ekonomi', path: '#/ekonomi', blurb: 'Pertumbuhan, PDB, dan PDB per kapita.' },
  { id: 'harga', title: 'Harga & Inflasi', path: '#/harga', blurb: 'Perkembangan harga konsumen.' },
  { id: 'tenaga-kerja', title: 'Ketenagakerjaan', path: '#/tenaga-kerja', blurb: 'Pengangguran dan angkatan kerja.' },
  { id: 'kemiskinan', title: 'Kemiskinan', path: '#/kemiskinan', blurb: 'Kemiskinan dan ketimpangan.' },
  { id: 'pendidikan', title: 'Pendidikan', path: '#/pendidikan', blurb: 'Pembangunan manusia dan lama sekolah.' },
  { id: 'kesehatan', title: 'Kesehatan', path: '#/kesehatan', blurb: 'Harapan hidup dan gizi balita.' },
];

export function sectionById(id) {
  return SECTIONS.find((s) => s.id === id) || null;
}
