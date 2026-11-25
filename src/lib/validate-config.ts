import { siteConfig } from '../config/active.config';

/**
 * Validates active site configuration at build time (Modul 7 - Task 1).
 * Fails on empty required fields, and fails on TODO markers when PRODUCTION_CHECK=true.
 */
export function validateSiteConfig(): void {
  const requiredFields: Array<[string, string]> = [
    ['site.siteName', siteConfig.site.siteName],
    ['site.title', siteConfig.site.title],
    ['site.description', siteConfig.site.description],
    ['site.canonicalUrl', siteConfig.site.canonicalUrl],
    ['site.pages.bio.title', siteConfig.site.pages.bio.title],
    ['site.pages.produk.title', siteConfig.site.pages.produk.title],
    ['whatsapp.phoneNumber', siteConfig.whatsapp.phoneNumber],
    ['linkInBio.profile.name', siteConfig.linkInBio.profile.name],
    ['linkInBio.profile.handle', siteConfig.linkInBio.profile.handle],
    ['digitalProduct.hero.headline', siteConfig.digitalProduct.hero.headline],
    ['digitalProduct.offer.productName', siteConfig.digitalProduct.offer.productName],
    ['digitalProduct.offer.promoPrice', siteConfig.digitalProduct.offer.promoPrice],
  ];

  const emptyFields: string[] = [];
  const todoFields: string[] = [];

  for (const [path, value] of requiredFields) {
    const trimmed = typeof value === 'string' ? value.trim() : '';
    if (!trimmed) {
      emptyFields.push(path);
    } else if (trimmed.includes('TODO')) {
      todoFields.push(path);
    }
  }

  if (siteConfig.tracking.tiktokPixelId.trim().startsWith('TODO')) {
    todoFields.push('tracking.tiktokPixelId');
  }

  if (emptyFields.length > 0) {
    throw new Error(
      `Konfigurasi tidak valid — kolom wajib kosong:\n- ${emptyFields.join('\n- ')}`
    );
  }

  try {
    const url = new URL(siteConfig.site.canonicalUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('Invalid protocol');
    }
  } catch {
    throw new Error(
      `Konfigurasi tidak valid — site.canonicalUrl harus berupa URL http/https yang valid: "${siteConfig.site.canonicalUrl}"`
    );
  }

  if (process.env.PRODUCTION_CHECK === 'true' && todoFields.length > 0) {
    throw new Error(
      `Build produksi gagal — masih ada penanda TODO di konfigurasi aktif:\n- ${todoFields.join('\n- ')}`
    );
  }

  if (todoFields.length > 0) {
    console.warn(
      `[validate-config] Peringatan: ${todoFields.length} kolom masih bertanda TODO (jalankan npm run build:prod untuk validasi produksi ketat).`
    );
  }
}
