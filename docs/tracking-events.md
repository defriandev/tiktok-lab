# Dokumentasi Tracking Events (TikTok Pixel + Events API + GA4)

Dokumen ini menjelaskan seluruh event tracking yang aktif, pemicunya, parameter yang dikirim, sumber `event_id` untuk deduplikasi (`T-05`), serta cara pengujian di TikTok Events Manager.

---

## 1. Tabel Event

| Event TikTok | Event GA4 Pembanding | Pemicu | Parameter Utama | Sumber `event_id` |
| --- | --- | --- | --- | --- |
| `ViewContent` | `view_item` | Halaman dimuat (`BaseLayout.astro`), atau setelah klik **Setuju** pada `ConsentBanner.astro` bila `requireConsent: true` | `content_name` (`document.title`) | `generateEventId()` di klien (`crypto.randomUUID()`) |
| `ClickButton` | `select_content` | Klik tautan di `LinkInBioProfile.astro`, CTA Hero, CTA Penawaran, atau Sticky CTA Mobile | `content_id`, `button_label`, `link_url`, `content_name` | `generateEventId()` di klien |
| `SubmitForm` | `generate_lead` | Pengiriman form berhasil pada `BrandInquiryForm.astro` atau `LeadForm.astro` | `content_name`, `button_label` | `generateEventId()` di klien (diblokir ulang via `sessionStorage` bila duplikat) |
| `InitiateCheckout` | `begin_checkout` | Klik tombol **Bayar Sekarang (Online)** di `ProductOfferFaq.astro` | `content_name`, `content_id`, `value`, `currency: 'IDR'` | `orderId` hasil `generateEventId()` di klien |
| `CompletePayment` | `purchase` | 1) Klien: halaman `/terima-kasih`<br>2) Server: `POST /api/payment-webhook` saat status lunas | `content_name`, `content_id`, `value`, `currency: 'IDR'` | 1) Klien: `order_id` dari query URL<br>2) Webhook: `complete_payment_${orderId}` (deterministik; dicegah kirim ulang saat refresh/back) |

---

## 2. Atribusi & Deduplikasi

- **Sumber `event_id`**: Dibuat satu kali di sisi klien melalui `generateEventId()` (`src/lib/tracking.ts`), lalu dikirim ke:
  1. TikTok Pixel (`window.ttq.track(eventName, payload, { event_id })`)
  2. GA4 (`window.gtag('event', ga4Name, { ...payload, event_id })`)
  3. Server Events API (`POST /api/tiktok-events` dengan `eventId` yang sama)
- **Atribusi TikTok (`ttclid` & `_ttp`)**:
  - `ttclid` ditangkap dari query URL (`?ttclid=...`) dan disimpan di `sessionStorage` (`tiktok_lp_ttclid`).
  - `_ttp` dibaca dari `document.cookie`.
  - Keduanya diteruskan ke `/api/tiktok-events` dan dimasukkan ke objek `user` pada payload TikTok Events API.
- **Perlindungan Refresh / Back Button**:
  - `CompletePayment` dan `SubmitForm` dicatat di `sessionStorage` (`tiktok_lp_sent_events`) sehingga refresh atau tombol kembali tidak mengirim ulang event yang sama.
- **Consent Gating (`T-06`)**:
  - Jika `siteConfig.tracking.requireConsent === true`, `initTracking()` dan `trackEvent()` tidak memuat script pixel maupun mengirim request ke `/api/tiktok-events` sebelum `localStorage['tiktok_lp_tracking_consent'] === 'granted'`.

---

## 3. Mode Debug Pengembangan (`TRACKING_DEBUG`)

- Hanya aktif di mode pengembangan (`npm run dev` / `import.meta.env.DEV === true`), tidak pernah aktif pada hasil `npm run build` produksi.
- Cara mengaktifkan saat `npm run dev`:
  - Tambahkan `?tracking_debug=1` di URL (contoh: `http://localhost:4321/produk?tracking_debug=1`), **atau**
  - Set `PUBLIC_TRACKING_DEBUG=true` di `.env` lokal.
- Buka DevTools Console untuk melihat log `[TRACKING_DEBUG]`.

---

## 4. Cara Uji di TikTok Events Manager (Test Events)

1. Buka **TikTok Events Manager** → pilih Pixel Anda → buka tab **Test Events**.
2. Salin kode **Test Event Code** (contoh: `TEST12345`).
3. Isi environment variable server di hosting (atau `.env` lokal):
   - `TIKTOK_PIXEL_ID=<pixel_id_anda>`
   - `TIKTOK_ACCESS_TOKEN=<events_api_token_anda>`
   - `TIKTOK_TEST_EVENT_CODE=TEST12345`
4. Buka halaman `/bio` atau `/produk` dengan parameter uji `?ttclid=test_ttclid_123&utm_source=tiktok`.
5. Lakukan aksi: muat halaman (`ViewContent`), klik tautan (`ClickButton`), kirim form (`SubmitForm`).
6. Periksa di tab **Test Events** TikTok Events Manager:
   - Event muncul dari sumber **Browser** dan **Server** dengan `event_id` identik dan status **Deduplicated**.
7. **Penting sebelum rilis produksi**: Kosongkan atau hapus `TIKTOK_TEST_EVENT_CODE` dari environment variable produksi agar event tidak masuk ke kanal test.
