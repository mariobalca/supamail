import crypto from 'crypto';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { ForwardEmailResult } from '@/types/mailgun';

let mgInstance: any = null;

const getMailgunClient = () => {
  if (!mgInstance) {
    const mailgun = new Mailgun(FormData);
    mgInstance = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY || 'dummy-key',
      url: process.env.MAILGUN_URL || 'https://api.eu.mailgun.net', // Support EU region
    });
  }
  return mgInstance;
};

export const verifySignature = (timestamp: string, token: string, signature: string) => {
  const secret = process.env.MAILGUN_SIGNING_KEY || '';
  const encodedToken = crypto
    .createHmac('sha256', secret)
    .update(timestamp + token)
    .digest('hex');

  return encodedToken === signature;
};

export const forwardEmail = async (to: string, from: string, subject: string, html: string, text: string): Promise<ForwardEmailResult> => {
  const domain = process.env.MAILGUN_DOMAIN || '';
  const mg = getMailgunClient();

  return mg.messages.create(domain, {
    from: from,
    to: [to],
    subject: subject,
    html: html,
    text: text,
  });
};
