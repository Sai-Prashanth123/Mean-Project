const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API);

/**
 * Send an email via Resend.
 * @param {object} opts
 * @param {string} opts.to        - Recipient email
 * @param {string} opts.subject   - Email subject
 * @param {string} opts.html      - HTML body
 */
const sendEmail = async ({ to, subject, html }) => {
  const { data, error } = await resend.emails.send({
    from: 'NexaCRM <onboarding@resend.dev>',
    to,
    subject,
    html,
  });

  if (error) throw new Error(error.message);
  return data;
};

module.exports = sendEmail;
