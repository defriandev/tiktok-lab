/**
 * Serverless endpoint for TikTok Events API (T-01, T-02, T-05).
 * Reads TIKTOK_PIXEL_ID and TIKTOK_ACCESS_TOKEN exclusively from server env vars.
 */

const ALLOWED_EVENTS = new Set([
  'ViewContent',
  'ClickButton',
  'SubmitForm',
  'InitiateCheckout',
  'CompletePayment',
]);

interface IncomingEventBody {
  eventName?: string;
  eventId?: string;
  url?: string;
  referrer?: string;
  customData?: Record<string, unknown>;
}

export async function POST(request: Request): Promise<Response> {
  const pixelId = process.env.TIKTOK_PIXEL_ID;
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  const testEventCode = process.env.TIKTOK_TEST_EVENT_CODE;

  let body: IncomingEventBody;
  try {
    body = (await request.json()) as IncomingEventBody;
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { eventName, eventId, url, referrer, customData } = body;

  if (!eventName || !ALLOWED_EVENTS.has(eventName) || !eventId) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Missing or invalid eventName/eventId' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  if (!pixelId || pixelId.startsWith('TODO') || !accessToken || accessToken.startsWith('TODO')) {
    return new Response(
      JSON.stringify({
        ok: true,
        skipped: true,
        reason: 'Server TikTok credentials are not configured yet',
      }),
      {
        status: 202,
        headers: { 'Content-Type': 'application/json' },
      }
    );
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
          url: url || '',
          referrer: referrer || '',
        },
        user: {
          ip: clientIp,
          user_agent: userAgent,
        },
        properties: customData || {},
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

    const result = await tiktokResponse.json();
    return new Response(JSON.stringify({ ok: tiktokResponse.ok, result }), {
      status: tiktokResponse.ok ? 200 : 502,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Upstream TikTok API error' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
