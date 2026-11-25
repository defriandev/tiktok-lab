/**
 * Client-side tracking module (T-01, T-02, T-03, T-05, T-06, Modul 3).
 * Handles TikTok Pixel, GA4, consent gating, ttclid/_ttp attribution,
 * refresh/back-button dedup for SubmitForm & CompletePayment, and dev debug mode.
 */

export type TrackableEventName =
  | 'ViewContent'
  | 'ClickButton'
  | 'SubmitForm'
  | 'InitiateCheckout'
  | 'CompletePayment';

export interface TrackingPayload {
  content_name?: string;
  content_id?: string;
  value?: number;
  currency?: string;
  button_label?: string;
  link_url?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface TrackingConfig {
  tiktokPixelId: string;
  ga4MeasurementId: string;
  eventsApiEndpoint: string;
  requireConsent: boolean;
}

declare global {
  interface Window {
    ttq?: {
      load?: (pixelId: string) => void;
      page?: () => void;
      track: (
        event: string,
        data?: Record<string, unknown>,
        options?: { event_id?: string }
      ) => void;
    };
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_STORAGE_KEY = 'tiktok_lp_tracking_consent';
const TTCLID_STORAGE_KEY = 'tiktok_lp_ttclid';
const SENT_EVENTS_STORAGE_KEY = 'tiktok_lp_sent_events';
const MAX_SENT_HISTORY = 50;

let activeConfig: TrackingConfig | null = null;
let scriptsInitialized = false;

/**
 * Generates a unique event ID shared between TikTok Pixel and Events API (T-05).
 */
export function generateEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function isDebugMode(): boolean {
  if (typeof window === 'undefined' || !import.meta.env?.DEV) {
    return false;
  }
  const envFlag = import.meta.env?.PUBLIC_TRACKING_DEBUG === 'true';
  const queryFlag = new URLSearchParams(window.location.search).get('tracking_debug') === '1';
  return envFlag || queryFlag;
}

function debugLog(message: string, details?: unknown): void {
  if (isDebugMode()) {
    console.debug(`[TRACKING_DEBUG] ${message}`, details ?? '');
  }
}

/**
 * Captures ttclid from URL and caches it in sessionStorage for attribution.
 */
export function getTtclid(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const fromUrl = new URLSearchParams(window.location.search).get('ttclid')?.trim();
  if (fromUrl) {
    try {
      window.sessionStorage.setItem(TTCLID_STORAGE_KEY, fromUrl);
    } catch {
      // Ignore storage errors in restricted in-app browsers
    }
    return fromUrl;
  }

  try {
    return window.sessionStorage.getItem(TTCLID_STORAGE_KEY) || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Reads TikTok's _ttp browser cookie when available.
 */
export function getTtpCookie(): string | undefined {
  if (typeof document === 'undefined' || !document.cookie) {
    return undefined;
  }
  const match = document.cookie.match(/(?:^|;\s*)_ttp=([^;]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

function getDedupeKey(eventName: TrackableEventName, providedEventId?: string): string | null {
  if (eventName !== 'CompletePayment' && eventName !== 'SubmitForm') {
    return null;
  }
  if (providedEventId) {
    return `${eventName}:${providedEventId}`;
  }
  if (eventName === 'CompletePayment' && typeof window !== 'undefined') {
    return `${eventName}:${window.location.pathname}${window.location.search}`;
  }
  return null;
}

function hasAlreadySent(key: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    const raw = window.sessionStorage.getItem(SENT_EVENTS_STORAGE_KEY);
    if (!raw) return false;
    const list = JSON.parse(raw) as string[];
    return Array.isArray(list) && list.includes(key);
  } catch {
    return false;
  }
}

function markAsSent(key: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const raw = window.sessionStorage.getItem(SENT_EVENTS_STORAGE_KEY);
    const list = raw ? (JSON.parse(raw) as string[]) : [];
    const next = Array.isArray(list) ? list : [];
    if (!next.includes(key)) {
      next.push(key);
      if (next.length > MAX_SENT_HISTORY) {
        next.shift();
      }
      window.sessionStorage.setItem(SENT_EVENTS_STORAGE_KEY, JSON.stringify(next));
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Checks whether tracking is allowed under T-06 consent rules.
 */
export function isTrackingAllowed(requireConsent: boolean): boolean {
  if (!requireConsent) {
    return true;
  }
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY) === 'granted';
  } catch {
    return false;
  }
}

export function getConsentStatus(): 'granted' | 'denied' | 'unset' {
  if (typeof window === 'undefined') {
    return 'unset';
  }
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (value === 'granted' || value === 'denied') {
      return value;
    }
    return 'unset';
  } catch {
    return 'unset';
  }
}

export function setConsentStatus(status: 'granted' | 'denied'): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, status);
  } catch {
    // Ignore storage errors in restricted in-app browsers
  }

  if (status === 'granted' && activeConfig && !scriptsInitialized) {
    getTtclid();
    loadTrackingScripts(activeConfig);
  }
}

function isConfiguredId(id: string | undefined): boolean {
  return Boolean(id && !id.startsWith('TODO'));
}

function loadTikTokPixel(pixelId: string): void {
  if (!isConfiguredId(pixelId) || typeof document === 'undefined') {
    return;
  }

  if (!window.ttq) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${encodeURIComponent(pixelId)}&lib=ttq`;
    document.head.appendChild(script);
  }

  window.ttq?.load?.(pixelId);
  window.ttq?.page?.();
}

function loadGa4(measurementId: string): void {
  if (!isConfiguredId(measurementId) || typeof document === 'undefined') {
    return;
  }

  if (!window.dataLayer) {
    window.dataLayer = [];
  }
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }

  window.gtag('js', new Date());
  window.gtag('config', measurementId);
}

function loadTrackingScripts(config: TrackingConfig): void {
  if (scriptsInitialized) {
    return;
  }
  scriptsInitialized = true;
  loadTikTokPixel(config.tiktokPixelId);
  loadGa4(config.ga4MeasurementId);
  debugLog('Tracking scripts initialized', {
    tiktokPixelConfigured: isConfiguredId(config.tiktokPixelId),
    ga4Configured: isConfiguredId(config.ga4MeasurementId),
  });
}

/**
 * Initializes tracking configuration and loads pixels if consent is satisfied.
 */
export function initTracking(config: TrackingConfig): void {
  activeConfig = config;
  if (isTrackingAllowed(config.requireConsent)) {
    getTtclid();
    loadTrackingScripts(config);
  } else {
    debugLog('Tracking deferred until user grants consent');
  }
}

function mapToGa4EventName(eventName: TrackableEventName): string {
  switch (eventName) {
    case 'ViewContent':
      return 'view_item';
    case 'ClickButton':
      return 'select_content';
    case 'SubmitForm':
      return 'generate_lead';
    case 'InitiateCheckout':
      return 'begin_checkout';
    case 'CompletePayment':
      return 'purchase';
  }
}

/**
 * Fires a deduplicated event to TikTok Pixel, GA4, and the server Events API.
 */
export function trackEvent(
  eventName: TrackableEventName,
  payload: TrackingPayload = {},
  providedEventId?: string
): string | null {
  if (!activeConfig || !isTrackingAllowed(activeConfig.requireConsent)) {
    debugLog(`Blocked ${eventName}: consent not granted`);
    return null;
  }

  const dedupeKey = getDedupeKey(eventName, providedEventId);
  if (dedupeKey && hasAlreadySent(dedupeKey)) {
    debugLog(`Skipped duplicate ${eventName} on refresh/back`, { dedupeKey });
    return null;
  }

  const eventId = providedEventId || generateEventId();
  const ttclid = getTtclid();
  const ttp = getTtpCookie();

  debugLog(`Dispatching ${eventName}`, { eventId, ttclid, ttp, payload });

  // 1. Client-side TikTok Pixel (T-01, T-05)
  if (isConfiguredId(activeConfig.tiktokPixelId)) {
    window.ttq?.track?.(eventName, payload, { event_id: eventId });
  }

  // 2. Client-side GA4 comparison event (T-03)
  if (isConfiguredId(activeConfig.ga4MeasurementId)) {
    window.gtag?.('event', mapToGa4EventName(eventName), {
      ...payload,
      event_id: eventId,
    });
  }

  // 3. Server-side TikTok Events API relay (T-01, T-05)
  if (activeConfig.eventsApiEndpoint) {
    const body = JSON.stringify({
      eventName,
      eventId,
      ttclid,
      ttp,
      url: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      customData: payload,
    });

    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(activeConfig.eventsApiEndpoint, blob);
    } else if (typeof fetch === 'function') {
      fetch(activeConfig.eventsApiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {
        // Non-blocking analytics failure
      });
    }
  }

  if (dedupeKey) {
    markAsSent(dedupeKey);
  }

  return eventId;
}
