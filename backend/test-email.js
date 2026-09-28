import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

console.log('Testing with:');
console.log('User:', process.env.EMAIL_USER);
console.log('Pass:', process.env.EMAIL_PASS ? 'FOUND (Length: ' + process.env.EMAIL_PASS.length + ')' : 'MISSING');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function run() {
  try {
    console.log('Connecting to Gmail...');
    await transporter.verify();
    console.log('SUCCESS: Gmail credentials and network are working!');

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Test Email from Yasir Tech Lab',
      text: 'If you read this, email sending works!',
    });
    console.log('SUCCESS: Email actually sent to your inbox!');
  } catch (err) {
    console.error('\n--- EXACT FAILURE REASON ---');
    console.error('Error Code:', err.code);
    console.error('Error Message:', err.message);
    console.error('----------------------------\n');
  }
}

run();