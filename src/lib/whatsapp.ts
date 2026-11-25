/**
 * WhatsApp deep-link builder, UTM parameter helper, and form validators (F-05, F-08, F-09, Modul 2).
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WHATSAPP_REGEX = /^(08|62)[0-9]{7,13}$/;

export interface ContactValidationResult {
  valid: boolean;
  type?: 'whatsapp' | 'email';
  error?: string;
}

/**
 * Validates Indonesian WhatsApp numbers (08.. or 62..) or email addresses.
 */
export function validateWhatsAppOrEmail(rawValue: string): ContactValidationResult {
  const value = rawValue.trim();
  if (!value) {
    return {
      valid: false,
      error: 'Nomor WhatsApp atau email wajib diisi.',
    };
  }

  if (value.includes('@')) {
    if (!EMAIL_REGEX.test(value)) {
      return {
        valid: false,
        error: 'Format email tidak valid (contoh: nama@domain.com).',
      };
    }
    return { valid: true, type: 'email' };
  }

  const normalizedPhone = value.replace(/[\s\-()+]/g, '');
  if (!WHATSAPP_REGEX.test(normalizedPhone)) {
    return {
      valid: false,
      error: 'Masukkan nomor WhatsApp valid (diawali 08 atau 62) atau email yang benar.',
    };
  }

  return { valid: true, type: 'whatsapp' };
}

/**
 * Validates required text fields with Indonesian error messages.
 */
export function validateRequiredText(
  rawValue: string,
  fieldLabel: string,
  minLength = 2
): string | null {
  const value = rawValue.trim();
  if (!value) {
    return `${fieldLabel} wajib diisi.`;
  }
  if (value.length < minLength) {
    return `${fieldLabel} minimal ${minLength} karakter.`;
  }
  return null;
}

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
