const BRAND_EMAIL = 'ritualcakes2019@gmail.com';
const DEFAULT_FRONTEND_URL = 'https://ritualcakes.vercel.app';

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getFrontendUrl = () => {
  const rawUrl = process.env.FRONTEND_URL || DEFAULT_FRONTEND_URL;
  if (rawUrl.includes('ritualcakes.vercel.app') || rawUrl.includes('ritual-cakes.vercel.app')) {
    return DEFAULT_FRONTEND_URL;
  }

  const validUrl = (rawUrl.match(/https?:\/\/[^\s|]+/g) || [])
    .find((url) => !/localhost|127\.0\.0\.1/i.test(url)) || DEFAULT_FRONTEND_URL;

  try {
    const url = new URL(validUrl);
    return url.origin;
  } catch {
    return DEFAULT_FRONTEND_URL;
  }
};

const formatDate = (date) => {
  if (!date) return 'Not provided';
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return 'Not provided';
  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatCurrency = (amount) => {
  const value = Number(amount || 0);
  if (!Number.isFinite(value)) return 'Not priced';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const detailRows = (rows = []) =>
  rows
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 14px;border-bottom:1px solid #f4dedf;color:#48250b;font-weight:700;width:38%;">${escapeHtml(label)}</td>
          <td style="padding:12px 14px;border-bottom:1px solid #f4dedf;color:#4d4d4d;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join('');

const itemRows = (items = []) =>
  items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 14px;border-bottom:1px solid #f4dedf;color:#48250b;font-weight:700;">${escapeHtml(item.name || 'Cake')}</td>
          <td style="padding:12px 14px;border-bottom:1px solid #f4dedf;color:#4d4d4d;">${escapeHtml(item.quantity || 1)}</td>
          <td style="padding:12px 14px;border-bottom:1px solid #f4dedf;color:#4d4d4d;">${escapeHtml(item.weight || 'Custom')}</td>
          <td style="padding:12px 14px;border-bottom:1px solid #f4dedf;color:#4d4d4d;">${formatCurrency(item.price)}</td>
        </tr>`
    )
    .join('');

const renderBrandedEmail = ({
  preview,
  title,
  eyebrow = 'Ritual Cakes',
  intro,
  body = '',
  cta,
  details,
  items,
  footerNote = 'Thank you for choosing Ritual Cakes for your celebrations.',
}) => `
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#fdf8f5;font-family:Arial,Helvetica,sans-serif;color:#2d1606;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preview || title)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fdf8f5;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #f4dedf;">
            <tr>
              <td style="padding:28px 28px 18px;text-align:center;background:#48250b;color:#fdf8f5;">
                <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#e5989b;font-weight:700;">${escapeHtml(eyebrow)}</div>
                <h1 style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.15;color:#fdf8f5;">${escapeHtml(title)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                ${intro ? `<p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#4d4d4d;">${escapeHtml(intro)}</p>` : ''}
                ${body ? `<div style="font-size:15px;line-height:1.7;color:#4d4d4d;">${body}</div>` : ''}
                ${cta ? `
                  <p style="margin:26px 0;text-align:center;">
                    <a href="${escapeHtml(cta.href)}" style="display:inline-block;background:#48250b;color:#fdf8f5;text-decoration:none;padding:13px 24px;border-radius:999px;font-weight:700;">${escapeHtml(cta.label)}</a>
                  </p>
                ` : ''}
                ${details ? `
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:22px 0;border:1px solid #f4dedf;background:#fffafa;">
                    ${detailRows(details)}
                  </table>
                ` : ''}
                ${items ? `
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:22px 0;border:1px solid #f4dedf;background:#fffafa;">
                    <tr>
                      <th align="left" style="padding:12px 14px;background:#fce7e9;color:#48250b;">Item</th>
                      <th align="left" style="padding:12px 14px;background:#fce7e9;color:#48250b;">Qty</th>
                      <th align="left" style="padding:12px 14px;background:#fce7e9;color:#48250b;">Size</th>
                      <th align="left" style="padding:12px 14px;background:#fce7e9;color:#48250b;">Price</th>
                    </tr>
                    ${itemRows(items)}
                  </table>
                ` : ''}
                <p style="margin:22px 0 0;font-size:14px;line-height:1.7;color:#4d4d4d;">${escapeHtml(footerNote)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px;text-align:center;background:#fce7e9;color:#48250b;font-size:13px;line-height:1.6;">
                Ritual Cakes<br>
                <a href="mailto:${BRAND_EMAIL}" style="color:#48250b;font-weight:700;">${BRAND_EMAIL}</a><br>
                &copy; ${new Date().getFullYear()} Ritual Cakes. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

module.exports = {
  BRAND_EMAIL,
  getFrontendUrl,
  formatDate,
  formatCurrency,
  renderBrandedEmail,
};
