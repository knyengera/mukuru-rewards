// backend/src/lib/email.ts
import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey ? new Resend(apiKey) : null;

function getFrom(): string {
  // Fallback to Resend sandbox sender for dev
  return process.env.RESEND_FROM || 'onboarding@resend.dev';
}

export async function sendEmail(params: { to: string; subject: string; html: string }) {
  if (!resend) throw new Error('RESEND_API_KEY not set');
  try {
    const result = await resend.emails.send({ from: getFrom(), ...params });
    // eslint-disable-next-line no-console
    console.log('Resend email sent:', result);
    return result;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Resend email failed:', e);
    throw e;
  }
}