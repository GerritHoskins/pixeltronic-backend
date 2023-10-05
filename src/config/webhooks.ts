import type { Request } from 'express';
import crypto from 'crypto';
import { Env, getEnv } from './env';

const WEBHOOK_SECRET: string = getEnv(Env.WEBHOOK_GITHUB_SYNC_SECRET);

export const verify_signature = (req: Request) => {
  const signature = crypto.createHmac('sha256', WEBHOOK_SECRET).update(JSON.stringify(req.body)).digest('hex');
  const trusted = Buffer.from(`sha256=${signature}`, 'ascii');
  const xHub = req.get('x-hub-signature-256') || '';
  const untrusted = Buffer.from(xHub, 'ascii');
  return crypto.timingSafeEqual(trusted, untrusted);
};
