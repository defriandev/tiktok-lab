/**
 * Optional serverless checkout endpoint for Midtrans Snap or Xendit Invoice (F-07).
 * Reads MIDTRANS_SERVER_KEY or XENDIT_SECRET_KEY exclusively from server env vars.
 */

interface CheckoutRequestBody {
  provider?: 'midtrans' | 'xendit';
  productName?: string;
  amount?: number;
  orderId?: string;
  returnUrl?: string;
}

export async function POST(request: Request): Promise<Response> {
  let body: CheckoutRequestBody;
  try {
    body = (await request.json()) as CheckoutRequestBody;
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const provider = body.provider;
  const productName = body.productName?.trim() || 'Produk Digital';
  const amount = Number(body.amount || 0);
  const orderId = body.orderId?.trim() || `ORD-${Date.now()}`;
  const returnUrl = body.returnUrl?.trim() || '/';

  if (!provider || (provider !== 'midtrans' && provider !== 'xendit') || amount <= 0) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Invalid provider or amount' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (provider === 'midtrans') {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey || serverKey.startsWith('TODO')) {
      return new Response(
        JSON.stringify({ ok: false, error: 'MIDTRANS_SERVER_KEY is not configured' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const isProd = process.env.MIDTRANS_IS_PRODUCTION === 'true';
    const endpoint = isProd
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    const auth = Buffer.from(`${serverKey}:`).toString('base64');
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: Math.round(amount),
        },
        item_details: [
          {
            id: 'digital-product',
            price: Math.round(amount),
            quantity: 1,
            name: productName.slice(0, 50),
          },
        ],
        callbacks: {
          finish: returnUrl,
        },
      }),
    });

    const data = (await res.json()) as { redirect_url?: string; error_messages?: string[] };
    if (!res.ok || !data.redirect_url) {
      return new Response(
        JSON.stringify({ ok: false, error: data.error_messages?.[0] || 'Midtrans error' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, orderId, checkoutUrl: data.redirect_url }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Xendit Invoice API
  const xenditKey = process.env.XENDIT_SECRET_KEY;
  if (!xenditKey || xenditKey.startsWith('TODO')) {
    return new Response(
      JSON.stringify({ ok: false, error: 'XENDIT_SECRET_KEY is not configured' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const auth = Buffer.from(`${xenditKey}:`).toString('base64');
  const res = await fetch('https://api.xendit.co/v2/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      external_id: orderId,
      amount: Math.round(amount),
      currency: 'IDR',
      description: productName,
      success_redirect_url: returnUrl,
    }),
  });

  const data = (await res.json()) as { invoice_url?: string; message?: string };
  if (!res.ok || !data.invoice_url) {
    return new Response(
      JSON.stringify({ ok: false, error: data.message || 'Xendit error' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ ok: true, orderId, checkoutUrl: data.invoice_url }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
