const mongoose = require('mongoose');
const sendEmail = require('@/helpers/resendMail');
const invoiceEmail = require('@/emailTemplate/invoiceEmail');

const Invoice = mongoose.model('Invoice');

const mail = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, result: null, message: 'Invoice ID is required' });
  }

  const invoice = await Invoice.findOne({ _id: id, removed: false }).populate('client').exec();

  if (!invoice) {
    return res.status(404).json({ success: false, result: null, message: 'Invoice not found' });
  }

  const clientEmail = invoice.client?.email;
  const clientName = invoice.client?.name || 'Valued Client';

  if (!clientEmail) {
    return res.status(400).json({ success: false, result: null, message: 'Client has no email address' });
  }

  await sendEmail({
    to: clientEmail,
    subject: `Invoice #${invoice.number} from NexaCRM`,
    html: invoiceEmail({ invoice, clientName }),
  });

  return res.status(200).json({
    success: true,
    result: null,
    message: `Invoice #${invoice.number} sent to ${clientEmail}`,
  });
};

module.exports = mail;
