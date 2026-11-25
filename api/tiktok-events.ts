/**
 * Serverless endpoint for TikTok Events API (T-01, T-02, T-05, Modul 1).
 * Validates HTTP method & payload and avoids leaking upstream details.
 */

const ALLOWED_EVENTS = new Set([
  'ViewContent',
  'ClickButton',
  'SubmitForm',
  'InitiateCheckout',
  'CompletePayment',
]);

interface IncomingEventBody {
  eventName?: unknown;
  eventId?: unknown;
  url?: unknown;
  referrer?: unknown;
  customData?: unknown;
}

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function methodNotAllowed(): Response {
  return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
    status: 405,
    headers: {
      Allow: 'POST',
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return jsonResponse({ ok: false, error: 'Unsupported media type' }, 415);
  }

  const pixelId = process.env.TIKTOK_PIXEL_ID;
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  const testEventCode = process.env.TIKTOK_TEST_EVENT_CODE;

  let body: IncomingEventBody;
  try {
    body = (await request.json()) as IncomingEventBody;
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON payload' }, 400);
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return jsonResponse({ ok: false, error: 'Invalid payload format' }, 400);
  }

  const eventName = typeof body.eventName === 'string' ? body.eventName : '';
  const eventId = typeof body.eventId === 'string' ? body.eventId.trim() : '';
  const url = typeof body.url === 'string' ? body.url.slice(0, 2048) : '';
  const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 2048) : '';
  const customData =
    body.customData && typeof body.customData === 'object' && !Array.isArray(body.customData)
      ? (body.customData as Record<string, unknown>)
      : {};

  if (!ALLOWED_EVENTS.has(eventName) || eventId.length === 0 || eventId.length > 128) {
    return jsonResponse({ ok: false, error: 'Invalid eventName or eventId' }, 400);
  }

  if (!pixelId || pixelId.startsWith('TODO') || !accessToken || accessToken.startsWith('TODO')) {
    return jsonResponse({ ok: true, skipped: true }, 202);
  }

  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('cf-connecting-ip') ||
    undefined;
  const userAgent = request.headers.get('user-agent') || undefined;

  const payload: Record<string, unknown> = {
    event_source: 'web',
    event_source_id: pixelId,
    data: [
      {
        event: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        page: {
          url,
          referrer,
        },
        user: {
          ip: clientIp,
          user_agent: userAgent,
        },
        properties: customData,
      },
    ],
  };

  if (testEventCode) {
    payload.test_event_code = testEventCode;
  }

  try {
    const tiktokResponse = await fetch(
      'https://business-api.tiktok.com/open_api/v1.3/event/track/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': accessToken,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!tiktokResponse.ok) {
      return jsonResponse({ ok: false, error: 'Upstream analytics error' }, 502);
    }

    return jsonResponse({ ok: true }, 200);
  } catch (err) {
    console.error('TikTok Events API error:', err instanceof Error ? err.message : 'unknown');
    return jsonResponse({ ok: false, error: 'Analytics service error' }, 502);
  }
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
