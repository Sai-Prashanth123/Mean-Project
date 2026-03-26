const mongoose = require('mongoose');
const sendEmail = require('@/helpers/resendMail');
const quoteEmail = require('@/emailTemplate/quoteEmail');

const Quote = mongoose.model('Quote');

const mail = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, result: null, message: 'Quote ID is required' });
  }

  const quote = await Quote.findOne({ _id: id, removed: false }).populate('client').exec();

  if (!quote) {
    return res.status(404).json({ success: false, result: null, message: 'Quote not found' });
  }

  const clientEmail = quote.client?.email;
  const clientName = quote.client?.name || 'Valued Client';

  if (!clientEmail) {
    return res.status(400).json({ success: false, result: null, message: 'Client has no email address' });
  }

  await sendEmail({
    to: clientEmail,
    subject: `Quote #${quote.number} from NexaCRM`,
    html: quoteEmail({ quote, clientName }),
  });

  return res.status(200).json({
    success: true,
    result: null,
    message: `Quote #${quote.number} sent to ${clientEmail}`,
  });
};

module.exports = mail;
