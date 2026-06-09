import { Resend }  from 'resend';

export const ResendClient = new Resend(process.env.RESEND_API_KEY);