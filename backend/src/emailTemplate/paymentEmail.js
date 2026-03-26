const paymentEmail = ({ payment, clientName, invoice }) => {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#52c41a 0%,#389e0d 100%);padding:32px 40px;">
      <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;">NexaCRM</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Payment Receipt</p>
    </div>

    <!-- Check mark -->
    <div style="text-align:center;padding:32px 40px 16px;">
      <div style="display:inline-block;width:64px;height:64px;background:#f6ffed;border-radius:50%;line-height:64px;font-size:32px;">✓</div>
      <h2 style="margin:16px 0 4px;color:#222;font-size:22px;">Payment Received!</h2>
      <p style="margin:0;color:#666;font-size:14px;">Thank you, ${clientName}. Your payment has been recorded.</p>
    </div>

    <!-- Payment Details -->
    <div style="margin:0 40px;padding:20px;background:#f6ffed;border-radius:8px;border:1px solid #b7eb8f;">
      <table style="width:100%;font-size:14px;">
        <tr>
          <td style="padding:6px 0;color:#666;">Payment #</td>
          <td style="padding:6px 0;text-align:right;font-weight:600;color:#222;">${payment.number}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#666;">Invoice #</td>
          <td style="padding:6px 0;text-align:right;font-weight:600;color:#1890ff;">${invoice?.number || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#666;">Date</td>
          <td style="padding:6px 0;text-align:right;color:#333;">${new Date(payment.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
        </tr>
        ${payment.ref ? `<tr><td style="padding:6px 0;color:#666;">Reference</td><td style="padding:6px 0;text-align:right;color:#333;">${payment.ref}</td></tr>` : ''}
        <tr>
          <td style="padding:12px 0 6px;font-size:16px;font-weight:700;color:#222;">Amount Paid</td>
          <td style="padding:12px 0 6px;text-align:right;font-size:20px;font-weight:700;color:#52c41a;">$${Number(payment.amount).toLocaleString()} ${payment.currency}</td>
        </tr>
      </table>
    </div>

    <div style="padding:24px 40px;text-align:center;">
      <p style="margin:0;font-size:13px;color:#888;">Keep this receipt for your records. If you have questions, reply to this email.</p>
    </div>

    <!-- Footer -->
    <div style="background:#fafafa;padding:20px 40px;text-align:center;border-top:1px solid #f0f0f0;">
      <p style="margin:0;font-size:13px;color:#888;">Sent by <strong>NexaCRM</strong> — your business management platform.</p>
    </div>
  </div>
</body>
</html>`;
};

module.exports = paymentEmail;
