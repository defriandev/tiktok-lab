/**
 * Optional serverless checkout endpoint for Midtrans Snap or Xendit Invoice (F-07, Modul 1).
 * Enforces HTTP method, payload validation, and non-leaking error responses.
 */

interface CheckoutRequestBody {
  provider?: unknown;
  productName?: unknown;
  amount?: unknown;
  orderId?: unknown;
  returnUrl?: unknown;
}

const MAX_AMOUNT_IDR = 100_000_000;
const ORDER_ID_PATTERN = /^[A-Za-z0-9_-]{4,64}$/;

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

function isValidReturnUrl(value: string): boolean {
  if (value.startsWith('/') && value.length <= 512) {
    return true;
  }
  try {
    const parsed = new URL(value);
    return (parsed.protocol === 'https:' || parsed.protocol === 'http:') && value.length <= 512;
  } catch {
    return false;
  }
}

export async function POST(request: Request): Promise<Response> {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return jsonResponse({ ok: false, error: 'Unsupported media type' }, 415);
  }

  let body: CheckoutRequestBody;
  try {
    body = (await request.json()) as CheckoutRequestBody;
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON payload' }, 400);
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return jsonResponse({ ok: false, error: 'Invalid payload format' }, 400);
  }

  const provider = body.provider;
  const productName = typeof body.productName === 'string' ? body.productName.trim() : '';
  const amount = typeof body.amount === 'number' ? Math.round(body.amount) : NaN;
  const orderId =
    typeof body.orderId === 'string' && body.orderId.trim()
      ? body.orderId.trim()
      : `ORD-${Date.now()}`;
  const returnUrl =
    typeof body.returnUrl === 'string' && body.returnUrl.trim() ? body.returnUrl.trim() : '/';

  if (
    (provider !== 'midtrans' && provider !== 'xendit') ||
    productName.length === 0 ||
    productName.length > 120 ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > MAX_AMOUNT_IDR ||
    !ORDER_ID_PATTERN.test(orderId) ||
    !isValidReturnUrl(returnUrl)
  ) {
    return jsonResponse({ ok: false, error: 'Invalid checkout parameters' }, 400);
  }

  if (provider === 'midtrans') {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey || serverKey.startsWith('TODO')) {
      return jsonResponse({ ok: false, error: 'Payment gateway unavailable' }, 503);
    }

    const isProd = process.env.MIDTRANS_IS_PRODUCTION === 'true';
    const endpoint = isProd
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    const auth = Buffer.from(`${serverKey}:`).toString('base64');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          transaction_details: {
            order_id: orderId,
            gross_amount: amount,
          },
          item_details: [
            {
              id: 'digital-product',
              price: amount,
              quantity: 1,
              name: productName.slice(0, 50),
            },
          ],
          callbacks: {
            finish: returnUrl,
          },
        }),
      });

      const data = (await res.json()) as { redirect_url?: string };
      if (!res.ok || !data.redirect_url) {
        return jsonResponse({ ok: false, error: 'Unable to create payment session' }, 502);
      }

      return jsonResponse({ ok: true, orderId, checkoutUrl: data.redirect_url }, 200);
    } catch (err) {
      console.error('Midtrans checkout error:', err instanceof Error ? err.message : 'unknown');
      return jsonResponse({ ok: false, error: 'Payment service error' }, 502);
    }
  }

  const xenditKey = process.env.XENDIT_SECRET_KEY;
  if (!xenditKey || xenditKey.startsWith('TODO')) {
    return jsonResponse({ ok: false, error: 'Payment gateway unavailable' }, 503);
  }

  const auth = Buffer.from(`${xenditKey}:`).toString('base64');
  try {
    const res = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        external_id: orderId,
        amount,
        currency: 'IDR',
        description: productName,
        success_redirect_url: returnUrl,
      }),
    });

    const data = (await res.json()) as { invoice_url?: string };
    if (!res.ok || !data.invoice_url) {
      return jsonResponse({ ok: false, error: 'Unable to create payment session' }, 502);
    }

    return jsonResponse({ ok: true, orderId, checkoutUrl: data.invoice_url }, 200);
  } catch (err) {
    console.error('Xendit checkout error:', err instanceof Error ? err.message : 'unknown');
    return jsonResponse({ ok: false, error: 'Payment service error' }, 502);
  }
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
