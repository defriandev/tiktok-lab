/**
 * Serverless lead webhook relay endpoint (Modul 2 - Task 1).
 * Forwards validated lead submissions to LEAD_WEBHOOK_URL when configured.
 */

interface LeadRequestBody {
  name?: unknown;
  contact?: unknown;
  brand?: unknown;
  message?: unknown;
  source?: unknown;
  utms?: unknown;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WHATSAPP_REGEX = /^(08|62)[0-9]{7,13}$/;

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

function isValidContact(value: string): boolean {
  if (value.includes('@')) {
    return EMAIL_REGEX.test(value);
  }
  return WHATSAPP_REGEX.test(value.replace(/[\s\-()+]/g, ''));
}

export async function POST(request: Request): Promise<Response> {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return jsonResponse({ ok: false, error: 'Unsupported media type' }, 415);
  }

  let body: LeadRequestBody;
  try {
    body = (await request.json()) as LeadRequestBody;
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON payload' }, 400);
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return jsonResponse({ ok: false, error: 'Invalid payload format' }, 400);
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const contact = typeof body.contact === 'string' ? body.contact.trim() : '';
  const brand = typeof body.brand === 'string' ? body.brand.trim().slice(0, 120) : '';
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 1000) : '';
  const source = typeof body.source === 'string' ? body.source.trim().slice(0, 64) : 'lead';
  const utms =
    body.utms && typeof body.utms === 'object' && !Array.isArray(body.utms) ? body.utms : {};

  if (
    name.length < 2 ||
    name.length > 120 ||
    contact.length === 0 ||
    contact.length > 120 ||
    !isValidContact(contact)
  ) {
    return jsonResponse({ ok: false, error: 'Data kontak atau nama tidak valid.' }, 400);
  }

  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (!webhookUrl || webhookUrl.startsWith('TODO')) {
    return jsonResponse(
      { ok: false, error: 'Tujuan webhook lead belum dikonfigurasi.' },
      503
    );
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submittedAt: new Date().toISOString(),
        source,
        name,
        contact,
        brand: brand || undefined,
        message: message || undefined,
        utms,
      }),
    });

    if (!upstream.ok) {
      return jsonResponse({ ok: false, error: 'Gagal meneruskan data ke webhook.' }, 502);
    }

    return jsonResponse({ ok: true }, 200);
  } catch (err) {
    console.error('Lead webhook error:', err instanceof Error ? err.message : 'unknown');
    return jsonResponse({ ok: false, error: 'Layanan webhook sedang tidak tersedia.' }, 502);
  }
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
