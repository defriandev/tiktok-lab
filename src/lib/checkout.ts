/**
 * Client-side checkout helper (Modul 1 - Tasks 3 & 6).
 * Validates input locally and handles server errors without exposing internal details.
 */

export interface CheckoutInput {
  provider: 'midtrans' | 'xendit';
  productName: string;
  amount: number;
  orderId: string;
  returnUrl: string;
}

export interface CheckoutResult {
  ok: boolean;
  checkoutUrl?: string;
  error?: string;
}

export async function startOnlineCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  const productName = input.productName.trim().slice(0, 120);
  const amount = Math.round(Number(input.amount));

  if (!productName || !Number.isFinite(amount) || amount <= 0) {
    return {
      ok: false,
      error: 'Data produk atau nominal pembayaran tidak valid.',
    };
  }

  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: input.provider,
        productName,
        amount,
        orderId: input.orderId,
        returnUrl: input.returnUrl,
      }),
    });

    const data = (await response.json()) as {
      ok?: boolean;
      checkoutUrl?: string;
      error?: string;
    };

    if (!response.ok || !data.checkoutUrl) {
      return {
        ok: false,
        error: data.error || 'Pembayaran online sedang tidak tersedia. Silakan pesan via WhatsApp.',
      };
    }

    return {
      ok: true,
      checkoutUrl: data.checkoutUrl,
    };
  } catch {
    return {
      ok: false,
      error: 'Gagal terhubung ke layanan pembayaran. Silakan coba lagi.',
    };
  }
}
