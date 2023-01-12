import type { GetSession, Handle, HandleError } from '@sveltejs/kit';
import { webexHttpMessagesResource } from '$lib/webex/http-wrapper';
import { prerendering } from '$app/env';
import { LoadStrategy, MikroORM } from '@mikro-orm/core';
import config from '../mikro-orm.config';
import env from '$lib/environment';
import * as entity from './database/entities';
import * as cookie from 'cookie';

const loginRoute = '/auth';

function createLoginRedirect(uuid?: string, maxAge = 2147483648) {
  const response = new Response(undefined, { status: 302, headers: { Location: loginRoute } });
  if (uuid != null) {
    const session = cookie.serialize('sessionId', uuid, { path: '/', maxAge: maxAge, sameSite: 'lax' });
    response.headers.set('Set-Cookie', session);
  }

  return response;
}

function createSession(userAgent?: string, ipAddress = 'unknown', lastActivityAt = Date.now()) {
  return new entity.Session({ userAgent, ipAddress, lastActivityAt });
}

export const handle: Handle = async ({ event, resolve }) => {
  const d1 = new Date();
  const ipAddress = prerendering ? 'unknown' : event.clientAddress;
  const userAgent = event.request.headers.get('User-Agent') ?? undefined;
  const isProtectedRoute = event.url.pathname !== '/' && !event.url.pathname.startsWith('/api');

  let response: Response;

  if (isProtectedRoute) {
    const db = await MikroORM.init({
      ...config,
      ...{ entities: [entity.Session, entity.User, entity.Data, entity.Demo] }
    }).then((r) => r.em.fork());
    const cookies = cookie.parse(event.request.headers.get('Cookie') ?? '');
    const session = cookies.sessionId
      ? await db.findOne(
          entity.Session,
          { uuid: cookies.sessionId, isExpired: null },
          {
            fields: ['uuid', 'isExpired', 'lastActivityAt', 'payload', 'user.uuid', 'user.email'],
            strategy: LoadStrategy.JOINED
          }
        )
      : null;
    const isSessionInvalid =
      session?.uuid == null ||
      session?.isExpired === true ||
      (session.user?.uuid != null && session.lastActivityAt < d1.getTime() - 60 * 60 * 1000 * 2);

    if (isSessionInvalid) {
      const session = createSession(userAgent, ipAddress, d1.getTime());
      await db.persistAndFlush(session).then(() => (event.locals.session = session) && (event.locals.db = db));
      response = createLoginRedirect(session.uuid);
    } else {
      session.ipAddress = ipAddress;
      session.userAgent = userAgent;
      session.lastActivityAt = d1.getTime();
      await db.persistAndFlush(session).then(() => (event.locals.session = session) && (event.locals.db = db));
      response = await resolve(event);
    }
  } else {
    response = await resolve(event);
  }

  const fileType = new RegExp(/^.*\.(webm|mp4|jpg|jpeg|png|gif|ico|svg|eot|otf|ttf|woff|woff2)$/i);
  const isStatic = event.url.pathname.match(fileType);
  const isSkipReporting = !!response.headers.get('Skip-Reporting');
  const message = [
    d1.toISOString(),
    'INFO',
    ipAddress,
    event.request.method,
    event.url.href,
    isStatic ? '' : response.status, // static assets not handled by svelte-kit
    isStatic ? '' : Date.now() - d1.getTime() + ' ms' // static assets not handled by svelte-kit
  ].join(' ');

  if (import.meta.env.PROD && !isStatic && !isSkipReporting && response.status >= 400) {
    webexHttpMessagesResource(env.WEBEX_NOTIFICATION_CHANNEL_TOKEN)
      .createMessage({
        roomId: env.WEBEX_NOTIFICATION_CHANNEL_ID,
        markdown: ['```text', message, '```'].join('\n')
      })
      .catch()
      .finally();
  }

  console.info('\x1b[34m' + message + '\x1b[0m');

  return response;
};

export const handleError: HandleError = async ({ error, event }) => {
  const date = new Date();
  const ipAddress = prerendering ? 'unknown' : event.clientAddress;
  const message = [
    [date.toISOString(), 'ERROR', ipAddress, event.request.method, event.url.href, error.name, error.message].join(' '),
    error.stack || '\b',
    error.frame || '\b',
    error.cause || '\b'
  ].join('\n');

  if (import.meta.env.PROD) {
    webexHttpMessagesResource(env.WEBEX_NOTIFICATION_CHANNEL_TOKEN)
      .createMessage({
        roomId: env.WEBEX_NOTIFICATION_CHANNEL_ID,
        markdown: ['```text', message, '```'].join('\n')
      })
      .catch()
      .finally();
  }

  console.error('\x1b[31m' + message + '\x1b[0m');
};

export const getSession: GetSession = async (event) => {
  const email = event.locals.session?.user?.email;

  return { email };
};
