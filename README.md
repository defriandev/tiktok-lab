# Template Landing Page Kreator TikTok Indonesia

Paket template landing page berbasis Astro (output statis), Tailwind CSS, dan TypeScript yang dioptimalkan untuk trafik TikTok (mobile-first mulai 360 px) dengan tracking TikTok Pixel + Events API, GA4, dan dukungan checkout opsional.

## Struktur Halaman
- `/` — Halaman indeks pratinjau template
- `/bio` — **Template 1**: Link-in-bio + Media Kit (`B-01` s.d. `B-05`)
- `/produk` — **Template 2**: Landing Produk Digital (`F-01` s.d. `F-10`)
- `/terima-kasih` — Halaman konfirmasi pasca-pembayaran (`CompletePayment`, `noindex`)
- `/privasi` — Halaman kebijakan privasi template (perlu ditinjau pemilik sebelum dipakai)
- `/404` — Halaman 404 bermerek dengan tautan kembali

---

## Klien Baru dalam 10 Langkah

1. **Pasang dependency**:
   ```bash
   npm install
   ```
2. **Pilih konfigurasi aktif** di `src/config/active.config.ts`:
   - Gunakan `./site.config` untuk klien baru (atau `./demo-edukasi.config` / `./demo-gadget.config` untuk pratinjau demo).
3. **Isi data klien** di `src/config/site.config.ts`:
   - Ganti seluruh penanda `TODO` (profil, tautan, media kit, portofolio, produk, harga, FAQ, nomor WhatsApp `628...`, dan metadata SEO per halaman).
4. **Siapkan gambar WebP/AVIF** (< 200 KB) di `public/images/` dan sesuaikan path-nya di `site.config.ts`.
5. **Atur fitur opsional** di `src/config/site.config.ts`:
   - `[OPSIONAL]` `tracking.requireConsent`: ubah ke `true` untuk menampilkan banner persetujuan privasi (`T-06`).
   - `[OPSIONAL]` `checkout.enabled` & `checkout.provider`: ubah ke `true` (`'midtrans'` atau `'xendit'`) jika memakai checkout online (`F-07`).
   - `[OPSIONAL]` `leadDestination`: pilih `'whatsapp'` (default), `'email'`, atau `'webhook'`.
6. **Siapkan environment variable** dengan menyalin `.env.example` menjadi `.env` (lokal) atau mengisi di dashboard Vercel/Cloudflare:
   - **Wajib**: `TIKTOK_PIXEL_ID`, `TIKTOK_ACCESS_TOKEN`, `SITE_URL`.
   - **Opsional**: `GA4_MEASUREMENT_ID`, `MIDTRANS_SERVER_KEY` / `XENDIT_SECRET_KEY`, `LEAD_WEBHOOK_URL`, `TIKTOK_TEST_EVENT_CODE`.
7. **Uji lokal**:
   ```bash
   npm run dev
   ```
   Periksa tampilan pada lebar `360 px` di `/bio` dan `/produk`.
8. **Jalankan validasi tipe & build produksi ketat**:
   ```bash
   npm run typecheck
   npm run build:prod
   ```
   *(Build produksi otomatis gagal bila masih ada `TODO` atau kolom wajib kosong di config aktif).*
9. **Jalankan pre-deploy check**:
   ```bash
   npm run predeploy
   ```
10. **Deploy ke Vercel / Cloudflare Pages (HTTPS)**, lalu selesaikan verifikasi di `docs/checklist-deploy.md`.

---

## Cara Uji di TikTok Test Events
1. Buka **TikTok Events Manager** → pilih Pixel → tab **Test Events**, lalu salin **Test Event Code**.
2. Isi `TIKTOK_TEST_EVENT_CODE` pada environment variable server (jangan di kode klien).
3. Buka URL situs dengan parameter `?ttclid=test_123&utm_source=tiktok`, lalu muat halaman, klik tautan, dan kirim form.
4. Pastikan event (`ViewContent`, `ClickButton`, `SubmitForm`, `InitiateCheckout`, `CompletePayment`) muncul dari sumber **Browser** dan **Server** dengan `event_id` yang sama (**Deduplicated**).
5. **Kosongkan `TIKTOK_TEST_EVENT_CODE`** setelah selesai uji coba sebelum trafik iklan berjalan.

Detail lengkap tabel event tersedia di [docs/tracking-events.md](docs/tracking-events.md).
