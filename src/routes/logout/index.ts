import type { RequestEvent } from '@sveltejs/kit';
import { MikroORM, wrap } from '@mikro-orm/core';
import { Session, User } from '../../database/entities';
import config from '../../../mikro-orm.config';
import * as cookie from 'cookie';

export const POST = async (requestEvent: RequestEvent) => {
  if (requestEvent.locals.session?.uuid && requestEvent.locals.session.user?.uuid) {
    const orm = await MikroORM.init({ ...config, ...{ entities: [User, Session] } });
    const em = orm.em.fork();
    const session = cookie.serialize('sessionId', '', { path: '/', maxAge: -1, sameSite: 'strict' });

    return await em
      .persistAndFlush(wrap(requestEvent.locals.session).assign({ isExpired: true }))
      .then(() => ({
        status: 302,
        headers: { 'Location': '/auth', 'Set-Cookie': session }
      }))
      .catch(() => ({ status: 422 }));
  }

  return { status: 422 };
};
