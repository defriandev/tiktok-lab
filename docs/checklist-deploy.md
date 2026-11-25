# Checklist Verifikasi Pra-Deploy & Pasca-Deploy

Gunakan daftar periksa ini sebelum dan sesudah merilis situs klien ke produksi.

## 1. Konfigurasi & Konten
- [ ] `src/config/active.config.ts` menunjuk ke konfigurasi klien (`./site.config`).
- [ ] Tidak ada penanda `TODO` tersisa pada `site.config.ts`.
- [ ] Halaman `/privasi` sudah ditinjau oleh pemilik situs.
- [ ] Seluruh gambar di `public/images/` berformat `.webp` atau `.avif` dan berukuran `< 200 KB`.

## 2. Build, Keamanan & Pre-Deploy
- [ ] `npm run typecheck` lulus tanpa error.
- [ ] `npm run build:prod` lulus tanpa error (validasi config ketat aktif).
- [ ] `npm run predeploy` (`scripts/predeploy-check.sh`) lulus.
- [ ] Environment variable server (`TIKTOK_PIXEL_ID`, `TIKTOK_ACCESS_TOKEN`, `SITE_URL`) sudah diisi di dashboard hosting.
- [ ] `TIKTOK_TEST_EVENT_CODE` sudah dikosongkan untuk trafik produksi.

## 3. Uji Pasca-Deploy (URL HTTPS Publik)
- [ ] **SEO & Share**: `robots.txt` dan `sitemap-index.xml` dapat diakses; `/terima-kasih` memiliki meta `noindex`; pratinjau share (WhatsApp/TikTok) menampilkan gambar OG yang benar.
- [ ] **Tracking (`T-02`, `T-05`, `T-06`)**: Seluruh event tercatat dan berstatus **Deduplicated** di TikTok Events Manager; jika `requireConsent: true`, tidak ada event terkirim sebelum tombol **Setuju** diklik.
- [ ] **Performa**: Skor mobile PageSpeed Insights mencapai target `90+` dan LCP `< 2,5 detik` pada `/bio` dan `/produk`.
- [ ] **TikTok In-App Browser (Android & iOS)**: Tautan, form, dan tombol **"Buka di browser"** berfungsi normal.
