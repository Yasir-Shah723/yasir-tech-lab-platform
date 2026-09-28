import Message from '../models/Message.js';
import { sendEmail } from '../utils/sendEmail.js';

// POST /api/v1/contact
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message.',
      });
    }

    // 1. Save message to MongoDB using your existing Message model
    const newMessage = await Message.create({
      name,
      email,
      subject: subject || 'New Inquiry from Yasir Tech Lab',
      message,
    });

    // 2. Dispatch real-time alert email to mrsyed640@gmail.com
    const alertHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
          New Client Contact Message
        </h2>
        <p style="color: #475569; font-size: 15px;">You received a new inquiry on Yasir Tech Lab:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #334155; width: 100px;">Sender:</td>
            <td style="padding: 8px; color: #0f172a;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #334155;">Email:</td>
            <td style="padding: 8px; color: #2563eb;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #334155;">Subject:</td>
            <td style="padding: 8px; color: #0f172a;">${subject || 'General Inquiry'}</td>
          </tr>
        </table>
        <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; margin: 16px 0; border-radius: 4px;">
          <p style="margin: 0; color: #1e293b; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${message}</p>
        </div>
        <div style="text-align: center; margin-top: 24px;">
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Inquiry')}" style="background-color: #2563eb; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Reply Directly to ${name}
          </a>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: 'mrsyed640@gmail.com',
        subject: `[Yasir Tech Lab] New Inquiry from ${name}`,
        html: alertHtml,
      });
    } catch (mailError) {
      console.error('Contact alert email failed to send:', mailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. Yasir will get back to you shortly!',
      data: newMessage,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, message: 'Server error while sending message.' });
  }
};

// GET /api/v1/contact (Admin protected)
export const getContactMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};