import type { RequestEvent } from '@sveltejs/kit';
import { Demo } from '../../database/entities';

export const DELETE = async (requestEvent: RequestEvent) => {
  const demoId = requestEvent.params.uuid;
  const db = requestEvent.locals.db;
  const session = requestEvent.locals.session;

  if (db && session && session.user && session.user.uuid) {
    await db.findOne(Demo, demoId).then((r) => (r && r.user.uuid === session.user?.uuid ? db.removeAndFlush(r) : null));

    return { status: 302, headers: { Location: '/demos' } };
  }

  return { status: 422 };
};
