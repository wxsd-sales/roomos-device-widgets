import type { RequestEvent } from '@sveltejs/kit';
import { LoadStrategy } from '@mikro-orm/core';
import { User } from '../../database/entities';

export const GET = async (requestEvent: RequestEvent) => {
  const db = requestEvent.locals.db;
  const session = requestEvent.locals.session;

  if (db && session?.uuid && session?.user?.uuid) {
    const demos = await db
      .findOne(User, session.user.uuid, {
        fields: ['demos.uuid', 'demos.name', 'demos.createdAt', 'demos.updatedAt'],
        strategy: LoadStrategy.JOINED
      })
      .then((r) => r?.demos.toJSON())
      .then((r) => r?.map(({ ...demo }) => demo));

    return { status: 200, body: { demos } };
  }

  return { status: 302, headers: { Location: '/auth' } };
};
