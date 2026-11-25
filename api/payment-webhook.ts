/**
 * Payment webhook handler for Midtrans/Xendit (F-07, T-02, T-05).
 * Fires server-side CompletePayment to TikTok Events API upon paid status.
 */

interface WebhookPayload {
  order_id?: string;
  transaction_status?: string;
  gross_amount?: string | number;
  external_id?: string;
  status?: string;
  amount?: number;
}

export async function POST(request: Request): Promise<Response> {
  let body: WebhookPayload;
  try {
    body = (await request.json()) as WebhookPayload;
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const isMidtransPaid =
    body.transaction_status === 'settlement' || body.transaction_status === 'capture';
  const isXenditPaid = body.status === 'PAID' || body.status === 'SETTLED';

  if (!isMidtransPaid && !isXenditPaid) {
    return new Response(JSON.stringify({ ok: true, ignored: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const orderId = body.order_id || body.external_id || `pay_${Date.now()}`;
  const value = Number(body.gross_amount || body.amount || 0);

  const pixelId = process.env.TIKTOK_PIXEL_ID;
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (pixelId && !pixelId.startsWith('TODO') && accessToken && !accessToken.startsWith('TODO')) {
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
            event_id: orderId,
            properties: {
              value,
              currency: 'IDR',
              content_id: orderId,
            },
          },
        ],
      }),
    }).catch(() => {
      // Non-fatal upstream error
    });
  }

  return new Response(JSON.stringify({ ok: true, orderId }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
