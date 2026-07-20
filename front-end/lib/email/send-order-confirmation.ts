import 'server-only'
import { Resend } from 'resend'
import { formatPrice, type OrderDetail } from '@ordi/shared'

/**
 * Best-effort transactional email. A failure here must never fail the Stripe
 * webhook — the payment already succeeded, and Stripe would keep retrying a
 * non-2xx response and re-run the whole handler.
 */
export async function sendOrderConfirmation(order: OrderDetail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL

  if (!apiKey || !from) {
    console.warn('[email] RESEND_API_KEY / RESEND_FROM_EMAIL not set — skipping')
    return
  }

  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: `ORDI <${from}>`,
      to: order.email,
      subject: `Your ORDI order ${order.id}`,
      text: plainText(order),
      html: html(order),
    })
  } catch (err) {
    console.error('[email] order confirmation failed', err)
  }
}

function plainText(order: OrderDetail): string {
  const lines = order.items.map(
    (it) => `  ${it.qty} × ${it.product_name} ${it.size_ml}ml — ${formatPrice(it.unit_price * it.qty)} THB`
  )
  const a = order.shipping_address

  return [
    `Thank you.`,
    ``,
    `Order ${order.id}`,
    ``,
    ...lines,
    ``,
    `Subtotal   ${formatPrice(order.subtotal)} THB`,
    `Shipping   ${formatPrice(order.shipping_cost)} THB`,
    `Total      ${formatPrice(order.total)} THB`,
    ``,
    a ? `Shipping to:\n${a.first_name} ${a.last_name}\n${a.address}\n${a.city} ${a.postcode}\n${a.country}\n${a.phone}` : '',
    ``,
    `We hand-bottle every order in the studio. Estimated arrival 3–5 business days.`,
    ``,
    `— ORDI, Bangkok`,
  ].join('\n')
}

function html(order: OrderDetail): string {
  const rows = order.items
    .map(
      (it) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #E4DFD5">
            ${escapeHtml(it.product_name)}
            <span style="color:#8A857C"> · ${it.size_ml}ml × ${it.qty}</span>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #E4DFD5;text-align:right;white-space:nowrap">
            ${formatPrice(it.unit_price * it.qty)} THB
          </td>
        </tr>`
    )
    .join('')

  const a = order.shipping_address

  return `<!doctype html>
<html><body style="margin:0;background:#F5F2EC;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;color:#0A0A0A">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F2EC;padding:40px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFFFF;padding:32px">
        <tr><td>
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8A857C">Order ${escapeHtml(order.id)}</p>
          <h1 style="margin:0 0 24px;font-size:28px;font-weight:400">Thank you.</h1>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
            ${rows}
            <tr><td style="padding:12px 0 0;color:#8A857C">Subtotal</td><td style="padding:12px 0 0;text-align:right">${formatPrice(order.subtotal)} THB</td></tr>
            <tr><td style="color:#8A857C">Shipping</td><td style="text-align:right">${formatPrice(order.shipping_cost)} THB</td></tr>
            <tr><td style="padding-top:8px;font-weight:600">Total</td><td style="padding-top:8px;text-align:right;font-weight:600">${formatPrice(order.total)} THB</td></tr>
          </table>

          ${
            a
              ? `<p style="margin:28px 0 0;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8A857C">Shipping to</p>
                 <p style="margin:6px 0 0;font-size:14px;line-height:1.6">
                   ${escapeHtml(a.first_name)} ${escapeHtml(a.last_name)}<br>
                   ${escapeHtml(a.address)}<br>
                   ${escapeHtml(a.city)} ${escapeHtml(a.postcode)} ${escapeHtml(a.country)}<br>
                   ${escapeHtml(a.phone)}
                 </p>`
              : ''
          }

          <p style="margin:28px 0 0;font-size:14px;line-height:1.6;color:#4A463F">
            We hand-bottle every order in the studio. Estimated arrival 3–5 business days.
          </p>
          <p style="margin:24px 0 0;font-size:12px;color:#8A857C">— ORDI, Bangkok</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
