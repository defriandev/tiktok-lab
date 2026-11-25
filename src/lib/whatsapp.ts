/**
 * WhatsApp deep-link builder and UTM parameter helper (F-05, F-09).
 */

const UTM_STORAGE_KEY = 'tiktok_lp_utm_params';
const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

/**
 * Reads UTM parameters from the current URL and caches them in sessionStorage
 * so attribution survives navigation between /bio and /produk.
 */
export function getUtmParams(): UtmParams {
  if (typeof window === 'undefined') {
    return {};
  }

  const searchParams = new URLSearchParams(window.location.search);
  const fromUrl: UtmParams = {};
  let hasUrlUtm = false;

  for (const key of UTM_KEYS) {
    const val = searchParams.get(key)?.trim();
    if (val) {
      fromUrl[key] = val;
      hasUrlUtm = true;
    }
  }

  if (hasUrlUtm) {
    try {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fromUrl));
    } catch {
      // Ignore storage errors in restricted in-app browsers
    }
    return fromUrl;
  }

  try {
    const cached = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached) as UtmParams;
    }
  } catch {
    // Ignore parse/storage errors
  }

  return {};
}

export function formatUtmSummary(utms: UtmParams): string {
  const entries = Object.entries(utms).filter(([, value]) => Boolean(value));
  if (entries.length === 0) {
    return '';
  }
  const summary = entries.map(([key, value]) => `${key}=${value}`).join(' | ');
  return `\n\n[Sumber: ${summary}]`;
}

export interface BuildWhatsAppUrlOptions {
  phoneNumber: string;
  message: string;
  includeUtm?: boolean;
}

/**
 * Builds a wa.me URL with pre-filled message and optional UTM attribution.
 */
export function buildWhatsAppUrl({
  phoneNumber,
  message,
  includeUtm = true,
}: BuildWhatsAppUrlOptions): string {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const utmSuffix = includeUtm ? formatUtmSummary(getUtmParams()) : '';
  const fullMessage = `${message}${utmSuffix}`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullMessage)}`;
}
