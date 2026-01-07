import crypto from 'crypto';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SIGNING_KEY = process.env.MAILGUN_SIGNING_KEY || 'test-key';
const API_URL = 'http://localhost:3000/api/inbound';

const SCENARIOS = {
  personal: {
    from: `friend@${process.env.MAILGUN_DOMAIN}`,
    subject: 'Catching up',
    body: 'Hey John, let us grab coffee soon!',
  },
  spam: {
    from: `lottery@${process.env.MAILGUN_DOMAIN}`,
    subject: 'YOU WON $1,000,000!!!',
    body: 'Click here to claim your prize now. Unsubscribe from this mailing list.',
  },
  promotion: {
    from: `news@${process.env.MAILGUN_DOMAIN}`,
    subject: 'Flash Sale: 50% Off Everything',
    body: 'Do not miss out on our biggest sale of the year. Shop now!',
  },
  transactional: {
    from: `receipts@${process.env.MAILGUN_DOMAIN}`,
    subject: 'Your order #12345 has shipped',
    body: 'Your package is on its way. Track it here.',
  },
};

async function simulateInbound() {
  const args = process.argv.slice(2);
  const scenarioKey = args[0] as keyof typeof SCENARIOS;
  const customRecipient = args[1];

  let config = SCENARIOS.personal;
  if (scenarioKey && SCENARIOS[scenarioKey]) {
    config = SCENARIOS[scenarioKey];
    console.log(`Using scenario: ${scenarioKey}`);
  } else if (scenarioKey) {
    console.log(`Scenario "${scenarioKey}" not found. Using personal.`);
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const token = crypto.randomBytes(16).toString('hex');
  const signature = crypto
    .createHmac('sha256', SIGNING_KEY)
    .update(timestamp + token)
    .digest('hex');

  const formData = new URLSearchParams();
  formData.append('from', config.from);
  formData.append(
    'recipient',
    customRecipient || 'username@supamail-domain.com'
  );
  formData.append('subject', config.subject);
  formData.append('body-plain', config.body);
  formData.append('timestamp', timestamp);
  formData.append('token', token);
  formData.append('signature', signature);

  console.log('Sending mock email to:', API_URL);
  console.log('From:', config.from);
  console.log('To:', customRecipient || 'username@supamail-domain.com');
  console.log('Subject:', config.subject);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    console.log('\nStatus:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error sending request:', error);
  }
}

simulateInbound();
