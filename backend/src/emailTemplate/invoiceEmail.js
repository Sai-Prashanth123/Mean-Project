const invoiceEmail = ({ invoice, clientName }) => {
  const statusColor = {
    paid: '#52c41a',
    unpaid: '#ff4d4f',
    partially: '#faad14',
  };

  const itemsRows = invoice.items
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

  const paymentBadge = `<span style="display:inline-block;padding:3px 10px;border-radius:20px;background:${statusColor[invoice.paymentStatus] || '#999'};color:#fff;font-size:12px;font-weight:600;text-transform:uppercase;">${invoice.paymentStatus}</span>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1890ff 0%,#096dd9 100%);padding:32px 40px;">
      <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">NexaCRM</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Invoice from NexaCRM</p>
    </div>

    <!-- Invoice Meta -->
    <div style="padding:28px 40px;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;">
      <div>
        <p style="margin:0;font-size:13px;color:#888;">Billed to</p>
        <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#222;">${clientName}</p>
      </div>
      <div style="text-align:right;">
        <p style="margin:0;font-size:22px;font-weight:700;color:#1890ff;">Invoice #${invoice.number}</p>
        <p style="margin:4px 0 0;font-size:13px;color:#888;">Date: ${new Date(invoice.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
        <p style="margin:4px 0 0;">${paymentBadge}</p>
      </div>
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

      <!-- Totals -->
      <div style="margin-top:16px;padding-top:16px;border-top:2px solid #f0f0f0;">
        <table style="width:100%;font-size:14px;">
          <tr>
            <td style="padding:4px 12px;color:#666;">Subtotal</td>
            <td style="padding:4px 12px;text-align:right;color:#333;">$${Number(invoice.subTotal).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding:4px 12px;color:#666;">Tax (${invoice.taxRate}%)</td>
            <td style="padding:4px 12px;text-align:right;color:#333;">$${Number(invoice.taxTotal).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;font-size:17px;font-weight:700;color:#222;">Total</td>
            <td style="padding:10px 12px;text-align:right;font-size:17px;font-weight:700;color:#1890ff;">$${Number(invoice.total).toLocaleString()} ${invoice.currency}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Notes -->
    ${invoice.notes ? `<div style="padding:0 40px 24px;"><p style="margin:0;padding:14px 16px;background:#f6ffed;border-left:3px solid #52c41a;border-radius:4px;font-size:13px;color:#555;">${invoice.notes}</p></div>` : ''}

    <!-- Footer -->
    <div style="background:#fafafa;padding:20px 40px;text-align:center;border-top:1px solid #f0f0f0;">
      <p style="margin:0;font-size:13px;color:#888;">This invoice was sent by <strong>NexaCRM</strong>. Please reply to this email if you have any questions.</p>
    </div>
  </div>
</body>
</html>`;
};

module.exports = invoiceEmail;
