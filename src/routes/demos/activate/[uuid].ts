import type { RequestEvent } from '@sveltejs/kit';
import { Activation } from '../../../database/entities';
import { LoadStrategy } from '@mikro-orm/core';

export const DELETE = async (requestEvent: RequestEvent) => {
  const activationId = requestEvent.params.uuid;
  const db = requestEvent.locals.db;
  const session = requestEvent.locals.session;

  if (db && session && session.user && session.user.uuid) {
    await db
      .findOne(Activation, activationId, { fields: ['demo.user.uuid'], strategy: LoadStrategy.JOINED })
      .then((r) => (r && r.demo.user.uuid === session.user?.uuid ? db.removeAndFlush(r) : null));

    return { status: 302, headers: { Location: '/demos' } };
  }

  return { status: 422 };
};
