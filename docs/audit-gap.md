# Audit Gap Implementasi vs Spesifikasi (Modul 0)

Dokumen ini membandingkan kondisi aktual repositori terhadap spesifikasi MVP tanpa mengubah kode sumber.

---

## 1. Tabel Status per Item ID

| ID | Status | Bukti (`file:baris`) | Catatan |
| --- | --- | --- | --- |
| **B-01** | Lengkap | `src/components/LinkInBioProfile.astro:1-68`, `src/config/site.config.ts:188-213` | Profil, bio, lokasi, dan daftar tautan bermerek tersedia; foto profil `/images/avatar-placeholder.webp` belum ada di `public/`. |
| **B-02** | Lengkap | `src/components/LinkInBioProfile.astro:34-37`, `src/components/LinkInBioProfile.astro:70-85` | Klik tiap tautan mengirim `ClickButton` (`content_id`, `button_label`, `link_url`) melalui `trackEvent`. |
| **B-03** | Lengkap | `src/components/MediaKitSection.astro:1-54`, `src/config/site.config.ts:214-239` | Statistik utama, demografi audiens, dan rate card terhubung ke `siteConfig.linkInBio.mediaKit`. |
| **B-04** | Lengkap | `src/components/PortfolioGallery.astro:1-42`, `src/config/site.config.ts:240-255` | Galeri portofolio menggunakan `loading="lazy"` dan `decoding="async"`; file gambar dummy belum ada di `public/`. |
| **B-05** | Lengkap | `src/components/BrandInquiryForm.astro:1-156`, `src/config/site.config.ts:256-263` | Form kerja sama brand mendukung pengiriman ke WhatsApp atau email (`mailto:`), validasi `required`, honeypot, dan `SubmitForm`. |
| **F-01** | Lengkap | `src/components/ProductHero.astro:1-66`, `src/config/site.config.ts:266-275` | Headline, badge, subheadline, media 9:16 (gambar/video), dan CTA utama di atas lipatan tersedia. |
| **F-02** | Lengkap | `src/components/ProductSocialProof.astro:1-42`, `src/config/site.config.ts:276-296` | Jumlah terjual, testimoni pembeli, dan tangkapan layar (`loading="lazy"`) tersedia. |
| **F-03** | Lengkap | `src/components/ProductBenefits.astro:1-34`, `src/config/site.config.ts:297-315` | Daftar manfaat produk dan rincian isi paket tersedia. |
| **F-04** | Lengkap | `src/components/ProductOfferFaq.astro:14-110`, `src/config/site.config.ts:316-333` | Kartu penawaran, harga coret/promo, dan FAQ native (`<details>`) tersedia. |
| **F-05** | Lengkap | `src/lib/whatsapp.ts:53-70`, `src/components/ProductOfferFaq.astro:50-68`, `src/components/ProductOfferFaq.astro:99-109` | CTA WhatsApp menyertakan pesan otomatis terisi + parameter UTM. |
| **F-06** | Lengkap | `src/components/StickyMobileCta.astro:1-28`, `src/pages/produk.astro:26` | Bar CTA sticky di mobile (`md:hidden`) dengan target sentuh minimal 44 px. |
| **F-07** | Sebagian | `api/checkout.ts:1-125`, `api/payment-webhook.ts:1-68`, `src/components/ProductOfferFaq.astro:35-48`, `src/pages/terima-kasih.astro:1-46` | Kode Midtrans Snap & Xendit Invoice serta webhook tersedia, namun belum diuji ke sandbox/produksi dan format fungsi memakai Web Request (`POST`) untuk Vercel (butuh adapter jika ke Cloudflare Pages). |
| **F-08** | Lengkap | `src/components/LeadForm.astro:1-124`, `src/pages/produk.astro:23` | Form lead (nama + WhatsApp/email) aktif bila `leadForm.enabled === true`, lengkap dengan honeypot dan `SubmitForm`. |
| **F-09** | Lengkap | `src/lib/whatsapp.ts:1-51`, `src/components/BrandInquiryForm.astro:138-145`, `src/components/LeadForm.astro:111-115` | UTM dibaca dari URL, disimpan sementara di `sessionStorage`, dan diteruskan ke WhatsApp CTA & form. |
| **F-10** | Sebagian | `src/config/site.config.ts:1-342` | Sebagian besar konten sudah terpusat, tetapi masih ada beberapa label UI/judul bagian yang di-hardcode di komponen (lihat bagian Temuan Risiko). |
| **T-01** | Lengkap | `src/lib/tracking.ts:112-130`, `api/tiktok-events.ts:1-101` | TikTok Pixel sisi klien (`ttq`) dan Events API sisi server (`/api/tiktok-events`) terpasang; API token hanya dibaca dari `process.env`. |
| **T-02** | Lengkap | `src/lib/tracking.ts:6-11`, `src/layouts/BaseLayout.astro:66-69`, `src/components/LinkInBioProfile.astro:77`, `src/components/BrandInquiryForm.astro:129`, `src/components/LeadForm.astro:100`, `src/components/ProductOfferFaq.astro:122`, `src/pages/terima-kasih.astro:37` | Kelima event (`ViewContent`, `ClickButton`, `SubmitForm`, `InitiateCheckout`, `CompletePayment`) terpasang di titik pemicu masing-masing. |
| **T-03** | Lengkap | `src/lib/tracking.ts:132-151`, `src/lib/tracking.ts:171-183`, `src/lib/tracking.ts:207-212` | GA4 (`gtag`) dimuat dan dipetakan paralel sebagai pembanding. |
| **T-05** | Lengkap | `src/lib/tracking.ts:47-52`, `src/lib/tracking.ts:198-235`, `api/tiktok-events.ts:74`, `api/payment-webhook.ts:53` | `event_id` unik dipakai bersama antara `ttq.track`, `gtag`, dan Events API server. |
| **T-06** | Lengkap | `src/components/ConsentBanner.astro:1-58`, `src/lib/tracking.ts:57-97`, `src/layouts/BaseLayout.astro:42-71` | Banner muncul bila `requireConsent: true` dan status `unset`; tracking baru aktif setelah user klik "Setuju". |
| **In-App Browser** | Lengkap | `src/components/InAppBrowserHelper.astro:1-77`, `src/layouts/BaseLayout.astro:38` | Deteksi UA TikTok (`BytedanceWebview`, `TikTok`, `musical_ly`, `trill`), tombol "Buka di browser" (`intent://` Android & salin tautan + panduan Safari iOS), serta deteksi deep-link `wa.me` lambat. |
| **README** | Lengkap | `README.md:1-51` | Berisi struktur halaman, cara menjalankan lokal, cara kustomisasi `site.config.ts`, dan checklist uji pra-rilis. |
| **site.config.ts** | Lengkap | `src/config/site.config.ts:1-342` | Tipe TypeScript lengkap dan seluruh placeholder klien ditandai `TODO`. |

---

## 2. Daftar Temuan Risiko (Diurutkan: Kritis / Penting / Kecil)

### Kritis
1. **Direktori aset `public/` belum ada (`Test-Path "public"` = `False`)**
   - Lokasi referensi: `src/config/site.config.ts:165` (`/og-default.webp`), `:192` (`/images/avatar-placeholder.webp`), `:248,254` (`/images/portfolio-1.webp`, `/images/portfolio-2.webp`), `:272` (`/images/hero-9x16.webp`), `:292` (`/images/proof-1.webp`).
   - Dampak: Saat halaman `/bio` dan `/produk` dibuka, seluruh gambar dan Open Graph image mengembalikan `404`, merusak tampilan visual dan berpotensi menurunkan skor LCP/PageSpeed.
2. **Repositori belum diinisialisasi sebagai Git (`.git` tidak ditemukan)**
   - Dampak: Tidak ada riwayat versi atau kemampuan membuat commit per modul sebelum `git init` dilakukan.

### Penting
3. **Teks UI masih di-hardcode di beberapa komponen (seharusnya di `site.config.ts` untuk F-10 penuh)**
   - `src/components/ProductOfferFaq.astro:45` & `:148` (`"Bayar Sekarang (Online)"`), `:74` (`"Pertanyaan yang Sering Diajukan"`).
   - `src/components/StickyMobileCta.astro:19` (`"Pesan Sekarang"`).
   - `src/components/InAppBrowserHelper.astro:15,22,48,68,73` (pesan helper dan label tombol `"Buka di browser"`).
   - `src/components/BrandInquiryForm.astro:38,45,52,59,66,73,80,87,99` & `src/components/LeadForm.astro:37,44,51,58,118` (label field, placeholder, dan pesan status form).
   - `src/pages/terima-kasih.astro:16-26` (teks halaman konfirmasi).
4. **`window.open` pada submit form berisiko diblokir di in-app browser / popup blocker**
   - `src/components/BrandInquiryForm.astro:152` dan `src/components/LeadForm.astro:122` memanggil `window.open(targetUrl, '_blank', ...)`. Di beberapa in-app browser (termasuk TikTok WebView), `window.open` bisa gagal tanpa menampilkan tautan manual cadangan (`<a href=...>`).
5. **Kompatibilitas Serverless Function antara Vercel dan Cloudflare Pages**
   - `api/tiktok-events.ts:19`, `api/checkout.ts:13`, `api/payment-webhook.ts:15` menggunakan `export async function POST(request: Request)` (standar Vercel Functions) dan `Buffer.from` di `api/checkout.ts:53,100`. Untuk Cloudflare Pages Functions, signature yang dibutuhkan adalah `onRequestPost(context)` dan `btoa` (tanpa Node `Buffer` kecuali `nodejs_compat` aktif).
6. **Penanda `TODO` masih tersisa pada data klien dan environment variable**
   - 48 kemunculan `TODO` di `src/config/site.config.ts` (profil, tautan, statistik, rate card, portofolio, produk, FAQ, nomor WhatsApp, Pixel ID, GA4 ID) dan 5 kemunculan di `.env.example` (kunci API server). Ini memang sengaja sebagai placeholder klien, namun wajib diganti sebelum produksi.

### Kecil
7. **Kunci rahasia di kode klien**: **Tidak ditemukan** (`process.env`, `ACCESS_TOKEN`, `SERVER_KEY`, `SECRET_KEY` tidak ada di `src/`). Aman.
8. **Dependency tak terpakai**: **Tidak ditemukan**. Seluruh dependency di `package.json` (`astro`, `tailwindcss`, `@tailwindcss/vite`, `@astrojs/sitemap`, `typescript`) terpakai aktif.
9. **Aksesibilitas & detail UI dari kode**:
   - Seluruh tombol dan tautan utama memakai kelas `.touch-target` (`min-height: 44px; min-width: 44px` di `src/styles/global.css:19-24`), namun tag `<summary>` pada `src/components/ProductOfferFaq.astro:79` sebaiknya juga memiliki `focus-visible:outline` yang jelas.
   - `src/pages/produk.astro:19` memberi `pb-24` agar `StickyMobileCta` tidak menutupi konten bawah, tetapi di layar sangat kecil (`360px`) dengan `ConsentBanner` aktif bersamaan, `ConsentBanner` (`z-50 bottom-4`) menumpuk di atas `StickyMobileCta` (`z-40 bottom-0`).
