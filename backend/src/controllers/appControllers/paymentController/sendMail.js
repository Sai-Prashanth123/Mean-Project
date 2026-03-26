const mongoose = require('mongoose');
const sendEmail = require('@/helpers/resendMail');
const paymentEmail = require('@/emailTemplate/paymentEmail');

const Payment = mongoose.model('Payment');
const Invoice = mongoose.model('Invoice');

const mail = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, result: null, message: 'Payment ID is required' });
  }

  const payment = await Payment.findOne({ _id: id, removed: false }).populate('client').exec();

  if (!payment) {
    return res.status(404).json({ success: false, result: null, message: 'Payment not found' });
  }

  const clientEmail = payment.client?.email;
  const clientName = payment.client?.name || 'Valued Client';

  if (!clientEmail) {
    return res.status(400).json({ success: false, result: null, message: 'Client has no email address' });
  }

  const invoice = payment.invoice
    ? await Invoice.findById(payment.invoice).select('number').lean()
    : null;

  await sendEmail({
    to: clientEmail,
    subject: `Payment Receipt #${payment.number} — NexaCRM`,
    html: paymentEmail({ payment, clientName, invoice }),
  });

  return res.status(200).json({
    success: true,
    result: null,
    message: `Payment receipt sent to ${clientEmail}`,
  });
};

module.exports = mail;
