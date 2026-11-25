/**
 * Build/startup environment variable validation (Modul 1 - Task 5).
 * Fails fast with a clear message when a defined env var is empty or invalid.
 */

const CHECKED_ENV_KEYS = [
  'TIKTOK_PIXEL_ID',
  'TIKTOK_ACCESS_TOKEN',
  'GA4_MEASUREMENT_ID',
  'MIDTRANS_SERVER_KEY',
  'XENDIT_SECRET_KEY',
  'XENDIT_CALLBACK_TOKEN',
] as const;

export function validateBuildEnv(): string {
  const rawSiteUrl = process.env.SITE_URL;

  if (rawSiteUrl !== undefined && rawSiteUrl.trim() === '') {
    throw new Error('Environment variable SITE_URL is defined but empty.');
  }

  const siteUrl = (rawSiteUrl || 'https://example.com').trim();
  let parsed: URL;
  try {
    parsed = new URL(siteUrl);
  } catch {
    throw new Error(`Invalid SITE_URL "${siteUrl}": must be a valid http/https URL.`);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Invalid SITE_URL protocol "${parsed.protocol}": use http or https.`);
  }

  for (const key of CHECKED_ENV_KEYS) {
    const value = process.env[key];
    if (value !== undefined && value.trim() === '') {
      throw new Error(`Environment variable ${key} is defined but empty.`);
    }
  }

  if (process.env.STRICT_ENV_CHECK === 'true') {
    for (const requiredKey of ['TIKTOK_PIXEL_ID', 'TIKTOK_ACCESS_TOKEN'] as const) {
      const val = process.env[requiredKey];
      if (!val || val.startsWith('TODO')) {
        throw new Error(
          `STRICT_ENV_CHECK failed: ${requiredKey} must be configured with a real value.`
        );
      }
    }
  }

  return siteUrl;
}
