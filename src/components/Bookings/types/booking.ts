import type { Platform } from './platform';
import type { Protocol } from './protocol';
import type { Privacy } from './privacy';

export type Booking = {
  id: string;
  number: string;
  organizer: { name: string; email?: string };
  protocol: Protocol;
  platform?: Platform;
  time: { start: string; end: string; startBuffer: number };
  title?: string;
  privacy?: Privacy;
};
