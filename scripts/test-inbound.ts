import crypto from 'crypto';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SIGNING_KEY = process.env.MAILGUN_SIGNING_KEY || 'test-key';
const API_URL = 'http://localhost:3000/api/inbound';

async function simulateInbound() {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const token = crypto.randomBytes(16).toString('hex');
  const signature = crypto
    .createHmac('sha256', SIGNING_KEY)
    .update(timestamp + token)
    .digest('hex');

  const formData = new URLSearchParams();
  formData.append('from', 'sender@example.com');
  formData.append('recipient', 'mariobalca@supamail.mariobalca.com');
  formData.append('subject', 'Test Email');
  formData.append(
    'body-plain',
    'This is a test email body for AI summarization.'
  );
  formData.append('timestamp', timestamp);
  formData.append('token', token);
  formData.append('signature', signature);

  console.log('Sending mock email to:', API_URL);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error sending request:', error);
  }
}

simulateInbound();
