# Template Landing Page Kreator TikTok Indonesia

Paket template landing page berbasis Astro (output statis), Tailwind CSS, dan TypeScript yang dioptimalkan untuk trafik TikTok (mobile-first mulai 360 px) dengan tracking TikTok Pixel + Events API, GA4, dan dukungan checkout opsional.

## Struktur Halaman
- `/` — Halaman indeks pratinjau template
- `/bio` — **Template 1**: Link-in-bio + Media Kit (`B-01` s.d. `B-05`)
- `/produk` — **Template 2**: Landing Produk Digital (`F-01` s.d. `F-10`)
- `/terima-kasih` — Halaman konfirmasi pasca-pembayaran (`CompletePayment`)

## Cara Menjalankan Lokal
1. Salin `.env.example` menjadi `.env` dan isi environment variable server:
   - `TIKTOK_PIXEL_ID`, `TIKTOK_ACCESS_TOKEN` (wajib untuk Events API sisi server)
   - `GA4_MEASUREMENT_ID` (pembanding GA4)
   - `MIDTRANS_SERVER_KEY` atau `XENDIT_SECRET_KEY` (hanya jika `checkout.enabled = true`)
   - `SITE_URL` (URL produksi HTTPS untuk canonical & sitemap)
2. Pasang dependency dan jalankan:
   ```bash
   npm install
   npm run dev
   ```
3. Build output statis & cek tipe TypeScript:
   ```bash
   npm run build
   npm run typecheck
   ```

## Kustomisasi untuk Klien Baru
Seluruh teks, tautan, gambar, harga, nomor WhatsApp, dan toggle fitur dikelola dari **satu file**:
- `src/config/site.config.ts`

Langkah kustomisasi:
1. Cari semua penanda `TODO` di `src/config/site.config.ts` dan ganti dengan data klien.
2. Letakkan aset gambar format WebP/AVIF di `public/images/` sesuai path di `site.config.ts`.
3. Untuk mengaktifkan banner persetujuan privasi (`T-06`), ubah `tracking.requireConsent` menjadi `true`.
4. Untuk mengaktifkan checkout online (`F-07`), ubah `checkout.enabled` menjadi `true` dan `checkout.provider` menjadi `'midtrans'` atau `'xendit'`, lalu isi API key di `.env` hosting (Vercel/Cloudflare).

## Checklist Uji Pra-Rilis (Setelah Deploy HTTPS)
- [ ] Uji PageSpeed Insights mobile pada `/bio` dan `/produk` (target skor 90+, LCP < 2,5 detik di 4G).
- [ ] Uji di TikTok In-App Browser (Android & iOS): pastikan tautan WhatsApp, form, dan tombol **"Buka di browser"** berfungsi.
- [ ] Verifikasi di TikTok Events Manager bahwa `ViewContent`, `ClickButton`, `SubmitForm`, `InitiateCheckout`, dan `CompletePayment` terkirim dengan `event_id` terdeduplikasi.
