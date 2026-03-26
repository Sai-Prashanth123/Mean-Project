const quoteEmail = ({ quote, clientName }) => {
  const statusColor = {
    pending: '#faad14',
    sent: '#1890ff',
    accepted: '#52c41a',
    declined: '#ff4d4f',
    draft: '#999',
  };

  const itemsRows = quote.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">${item.itemName}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#666;">${item.description || ''}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">$${Number(item.price).toLocaleString()}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;">$${Number(item.total).toLocaleString()}</td>
      </tr>`
    )
    .join('');

  const expiry = new Date(quote.expiredDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#13c2c2 0%,#006d75 100%);padding:32px 40px;">
      <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;">NexaCRM</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Quotation for Your Review</p>
    </div>

    <!-- Quote Meta -->
    <div style="padding:28px 40px;border-bottom:1px solid #f0f0f0;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <p style="margin:0;font-size:13px;color:#888;">Prepared for</p>
          <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#222;">${clientName}</p>
        </div>
        <div style="text-align:right;">
          <p style="margin:0;font-size:22px;font-weight:700;color:#13c2c2;">Quote #${quote.number}</p>
          <p style="margin:4px 0 0;font-size:12px;color:#ff4d4f;font-weight:600;">Valid until: ${expiry}</p>
        </div>
      </div>
      <p style="margin:16px 0 0;font-size:14px;color:#555;">Dear <strong>${clientName}</strong>, please find attached our quotation. We look forward to working with you.</p>
    </div>

    <!-- Items Table -->
    <div style="padding:24px 40px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#fafafa;">
            <th style="padding:10px 12px;text-align:left;color:#888;font-weight:600;border-bottom:2px solid #f0f0f0;">Item</th>
            <th style="padding:10px 12px;text-align:left;color:#888;font-weight:600;border-bottom:2px solid #f0f0f0;">Description</th>
            <th style="padding:10px 12px;text-align:center;color:#888;font-weight:600;border-bottom:2px solid #f0f0f0;">Qty</th>
            <th style="padding:10px 12px;text-align:right;color:#888;font-weight:600;border-bottom:2px solid #f0f0f0;">Price</th>
            <th style="padding:10px 12px;text-align:right;color:#888;font-weight:600;border-bottom:2px solid #f0f0f0;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsRows}</tbody>
      </table>

      <div style="margin-top:16px;padding-top:16px;border-top:2px solid #f0f0f0;">
        <table style="width:100%;font-size:14px;">
          <tr>
            <td style="padding:4px 12px;color:#666;">Subtotal</td>
            <td style="padding:4px 12px;text-align:right;color:#333;">$${Number(quote.subTotal).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding:4px 12px;color:#666;">Tax (${quote.taxRate}%)</td>
            <td style="padding:4px 12px;text-align:right;color:#333;">$${Number(quote.taxTotal).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;font-size:17px;font-weight:700;color:#222;">Total</td>
            <td style="padding:10px 12px;text-align:right;font-size:17px;font-weight:700;color:#13c2c2;">$${Number(quote.total).toLocaleString()} ${quote.currency}</td>
          </tr>
        </table>
      </div>
    </div>

    ${quote.notes ? `<div style="padding:0 40px 24px;"><p style="margin:0;padding:14px 16px;background:#e6fffb;border-left:3px solid #13c2c2;border-radius:4px;font-size:13px;color:#555;">${quote.notes}</p></div>` : ''}

    <div style="background:#fafafa;padding:20px 40px;text-align:center;border-top:1px solid #f0f0f0;">
      <p style="margin:0;font-size:13px;color:#888;">To accept this quote, simply reply to this email. Sent by <strong>NexaCRM</strong>.</p>
    </div>
  </div>
</body>
</html>`;
};

module.exports = quoteEmail;
