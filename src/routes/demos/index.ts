import type { RequestEvent } from '@sveltejs/kit';
import { LoadStrategy, MikroORM } from '@mikro-orm/core';
import { User, Demo, Session } from '../../database/entities';
import config from '../../../mikro-orm.config';

export const GET = async (requestEvent: RequestEvent) => {
  const orm = await MikroORM.init({ ...config, ...{ entities: [User, Demo, Session] } });
  const em = orm.em.fork();
  const session = requestEvent.locals.session;

  if (session?.uuid && session?.user?.uuid) {
    const demos = await em
      .findOne(User, session.user.uuid, {
        fields: ['demos.uuid', 'demos.name', 'demos.createdAt', 'demos.updatedAt'],
        strategy: LoadStrategy.JOINED
      })
      .then((r) => r?.demos.toJSON())
      .then((r) => r?.map(({ user, ...demo }) => demo));

    return { status: 200, body: { demos } };
  }

  return { status: 422 };
};
