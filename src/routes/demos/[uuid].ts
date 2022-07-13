import type { RequestEvent } from '@sveltejs/kit';
import { MikroORM } from '@mikro-orm/core';
import { Demo, Session, User } from '../../database/entities';
import config from '../../../mikro-orm.config';

export const DELETE = async (requestEvent: RequestEvent) => {
  const orm = await MikroORM.init({ ...config, ...{ entities: [User, Demo, Session] } });
  const em = orm.em.fork();
  const session = requestEvent.locals.session;
  const demoId = requestEvent.params.uuid;

  if (session && session.user && session.user.uuid) {
    await em.findOne(Demo, demoId).then((r) => (r && r.user.uuid === session.user?.uuid ? em.removeAndFlush(r) : null));

    return { status: 302, headers: { Location: '/demos' } };
  }

  return { status: 422 };
};
