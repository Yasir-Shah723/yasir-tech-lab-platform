import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html }) => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : null;

  if (!user || !pass) {
    console.error('[EMAIL ERROR] Missing credentials in environment variables.');
    throw new Error('EMAIL_USER or EMAIL_PASS environment variables are not set.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user.trim(),
      pass: pass.trim(),
    },
  });

  const mailOptions = {
    from: `"Yasir Tech Lab" <${user.trim()}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('[EMAIL] Password reset email sent successfully! ID:', info.messageId);
  return info;
};