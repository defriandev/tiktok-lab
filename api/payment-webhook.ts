/**
 * Payment webhook handler for Midtrans/Xendit (Modul 1 - Tasks 1, 2, 3, 6).
 * Verifies provider signature, enforces idempotency, and avoids leaking internals.
 */

import { createHash, timingSafeEqual } from 'node:crypto';

interface WebhookPayload {
  order_id?: string;
  status_code?: string;
  gross_amount?: string | number;
  signature_key?: string;
  transaction_status?: string;
  external_id?: string;
  status?: string;
  amount?: number;
}

const MAX_CACHE_SIZE = 5000;
const processedOrderIds = new Set<string>();

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

function safeEqualHexOrText(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) {
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

function verifyMidtransSignature(body: WebhookPayload, serverKey: string): boolean {
  if (
    typeof body.order_id !== 'string' ||
    typeof body.status_code !== 'string' ||
    (typeof body.gross_amount !== 'string' && typeof body.gross_amount !== 'number') ||
    typeof body.signature_key !== 'string'
  ) {
    return false;
  }

  const raw = `${body.order_id}${body.status_code}${String(body.gross_amount)}${serverKey}`;
  const expected = createHash('sha512').update(raw).digest('hex');
  return safeEqualHexOrText(expected.toLowerCase(), body.signature_key.toLowerCase());
}

export async function POST(request: Request): Promise<Response> {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return jsonResponse({ ok: false, error: 'Unsupported media type' }, 415);
  }

  let body: WebhookPayload;
  try {
    body = (await request.json()) as WebhookPayload;
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON payload' }, 400);
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return jsonResponse({ ok: false, error: 'Invalid payload format' }, 400);
  }

  const midtransKey = process.env.MIDTRANS_SERVER_KEY;
  const xenditToken = process.env.XENDIT_CALLBACK_TOKEN;
  const hasMidtrans = Boolean(midtransKey && !midtransKey.startsWith('TODO'));
  const hasXendit = Boolean(xenditToken && !xenditToken.startsWith('TODO'));

  if (!hasMidtrans && !hasXendit) {
    return jsonResponse({ ok: false, error: 'Webhook verification not configured' }, 503);
  }

  // Detect provider and verify signature
  const incomingXenditToken = request.headers.get('x-callback-token');
  let verified = false;

  if (incomingXenditToken && hasXendit && xenditToken) {
    verified = safeEqualHexOrText(incomingXenditToken, xenditToken);
  } else if (body.signature_key && hasMidtrans && midtransKey) {
    verified = verifyMidtransSignature(body, midtransKey);
  }

  if (!verified) {
    return jsonResponse({ ok: false, error: 'Unauthorized webhook signature' }, 401);
  }

  const isMidtransPaid =
    body.transaction_status === 'settlement' || body.transaction_status === 'capture';
  const isXenditPaid = body.status === 'PAID' || body.status === 'SETTLED';

  if (!isMidtransPaid && !isXenditPaid) {
    return jsonResponse({ ok: true, ignored: true }, 200);
  }

  const rawOrderId =
    typeof body.order_id === 'string'
      ? body.order_id
      : typeof body.external_id === 'string'
        ? body.external_id
        : '';

  if (!rawOrderId || rawOrderId.length > 128) {
    return jsonResponse({ ok: false, error: 'Invalid order identifier' }, 400);
  }

  // Deterministic event ID prevents duplicate CompletePayment in TikTok Events API
  const deterministicEventId = `complete_payment_${rawOrderId}`;

  if (processedOrderIds.has(deterministicEventId)) {
    return jsonResponse({ ok: true, duplicate: true, eventId: deterministicEventId }, 200);
  }

  if (processedOrderIds.size >= MAX_CACHE_SIZE) {
    processedOrderIds.clear();
  }
  processedOrderIds.add(deterministicEventId);

  const value = Number(body.gross_amount || body.amount || 0);
  const safeValue = Number.isFinite(value) && value >= 0 ? value : 0;

  const pixelId = process.env.TIKTOK_PIXEL_ID;
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (pixelId && !pixelId.startsWith('TODO') && accessToken && !accessToken.startsWith('TODO')) {
    try {
      await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': accessToken,
        },
        body: JSON.stringify({
          event_source: 'web',
          event_source_id: pixelId,
          data: [
            {
              event: 'CompletePayment',
              event_time: Math.floor(Date.now() / 1000),
              event_id: deterministicEventId,
              properties: {
                value: safeValue,
                currency: 'IDR',
                content_id: rawOrderId,
              },
            },
          ],
        }),
      });
    } catch (err) {
      console.error('TikTok CompletePayment relay failed:', err instanceof Error ? err.message : 'unknown');
    }
  }

  return jsonResponse({ ok: true, eventId: deterministicEventId }, 200);
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
