const mongoose = require('mongoose');

const globalSearch = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(200).json({ success: true, result: [], message: 'Query too short' });
  }

  const regex = new RegExp(q.trim(), 'i');

  const Client = mongoose.model('Client');
  const Invoice = mongoose.model('Invoice');
  const Quote = mongoose.model('Quote');
  const Payment = mongoose.model('Payment');

  const [clients, invoices, quotes, payments] = await Promise.all([
    Client.find({ removed: false, $or: [{ name: regex }, { email: regex }, { phone: regex }] })
      .limit(5)
      .select('name email phone country')
      .lean(),
    Invoice.find({ removed: false })
      .populate('client', 'name')
      .limit(5)
      .select('number total paymentStatus currency client date')
      .lean()
      .then((docs) => docs.filter((d) => regex.test(String(d.number)) || regex.test(d.client?.name || ''))),
    Quote.find({ removed: false })
      .populate('client', 'name')
      .limit(5)
      .select('number total status currency client date')
      .lean()
      .then((docs) => docs.filter((d) => regex.test(String(d.number)) || regex.test(d.client?.name || ''))),
    Payment.find({ removed: false })
      .populate('client', 'name')
      .limit(5)
      .select('number amount currency client date ref')
      .lean()
      .then((docs) => docs.filter((d) => regex.test(String(d.number)) || regex.test(d.client?.name || '') || regex.test(d.ref || ''))),
  ]);

  const result = [
    ...clients.map((c) => ({ type: 'client', id: c._id, title: c.name, subtitle: c.email, path: '/customer' })),
    ...invoices.map((i) => ({ type: 'invoice', id: i._id, title: `Invoice #${i.number}`, subtitle: i.client?.name, amount: i.total, currency: i.currency, status: i.paymentStatus, path: `/invoice/read/${i._id}` })),
    ...quotes.map((q) => ({ type: 'quote', id: q._id, title: `Quote #${q.number}`, subtitle: q.client?.name, amount: q.total, currency: q.currency, status: q.status, path: `/quote/read/${q._id}` })),
    ...payments.map((p) => ({ type: 'payment', id: p._id, title: `Payment #${p.number}`, subtitle: p.client?.name, amount: p.amount, currency: p.currency, path: `/payment/read/${p._id}` })),
  ];

  return res.status(200).json({ success: true, result, message: `Found ${result.length} results` });
};

module.exports = { globalSearch };
