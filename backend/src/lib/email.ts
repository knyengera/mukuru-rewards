// backend/src/lib/email.ts
import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey ? new Resend(apiKey) : null;

function getFrom(): string {
  const v = process.env.RESEND_FROM;
  if (!v) throw new Error('RESEND_FROM not set');
  return v;
}

export async function sendEmail(params: { to: string; subject: string; html: string }) {
  if (!resend) throw new Error('RESEND_API_KEY not set');
  return resend.emails.send({ from: getFrom(), ...params });
}