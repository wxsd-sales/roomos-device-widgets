import type { RequestEvent } from '@sveltejs/kit';
import type { JSONObject } from '@sveltejs/kit/types/private';
import type { PersonResponse, TokenResponse } from '$lib/types';
import { urlEncodedRequest } from '$lib/shared/urlencoded-request';
import { webexHttpPeopleResource } from '$lib/webex/http-wrapper';
import { Session, User } from '../../../database/entities';
import { prerendering } from '$app/env';
import humps from 'humps';
import env from '$lib/environment';
import * as cookie from 'cookie';
import { getUserUUID } from '$lib/webex/common';

export const GET = async (requestEvent: RequestEvent) => {
  if (requestEvent.locals.session?.user?.uuid) {
    return { status: 302, headers: { Location: '/demos' } };
  }

  const grantType = 'authorization_code';
  const code = requestEvent.url.searchParams.get('code');
  const redirectUri = requestEvent.url.origin + requestEvent.url.pathname;
  const state = requestEvent.url.searchParams.get('state');

  if (state !== requestEvent.locals.session?.uuid) {
    return { status: 403 };
  }

  const addExpiresAts = (obj: JSONObject, date: number = Date.now()) => ({
    ...obj,
    ...{
      expiresAt: date + (obj.expiresIn as number) * 1000,
      refreshTokenExpiresAt: date + (obj.refreshTokenExpiresIn as number) * 1000
    }
  });

  const db = requestEvent.locals.db;
  const params = humps.decamelizeKeys({
    grantType,
    clientId: env.WEBEX_AUTHORIZATION_CODE_CLIENT_ID,
    clientSecret: env.WEBEX_AUTHORIZATION_CODE_CLIENT_SECRET,
    code,
    redirectUri
  });
  const tokenResponse = urlEncodedRequest(env.WEBEX_API_URL)
    .post('access_token', params as Record<string, string>)
    .then((r) =>
      r
        .json()
        .then((s: JSONObject) => humps.camelizeKeys(s) as JSONObject)
        .then((s: JSONObject) => addExpiresAts(s, Date.parse(r.headers.get('date') ?? new Date().toUTCString())))
    ) as Promise<TokenResponse>;

  return await tokenResponse
    .then((r: TokenResponse) =>
      webexHttpPeopleResource(r.accessToken)
        .getMyOwnDetails()
        .then((s: Response) => s.json() as Promise<PersonResponse>)
        .then((s: PersonResponse) =>
          db != null
            ? db.findOne(User, { uuid: getUserUUID(s.id) }).then(async (t) => {
                const session = new Session({
                  user: t ?? new User(getUserUUID(s.id), s.emails[0]),
                  ipAddress: prerendering ? 'unknown' : requestEvent.clientAddress,
                  userAgent: requestEvent.request.headers.get('User-Agent') ?? undefined,
                  lastActivityAt: Date.now(),
                  payload: { webex: { ...r, orgId: s.orgId } }
                });
                const sessionCookie = cookie.serialize('sessionId', session.uuid, {
                  path: '/',
                  maxAge: 60 * 60 * 24 * 7,
                  sameSite: 'lax'
                });
                await db.persistAndFlush(session);

                return {
                  status: 302,
                  headers: { 'Location': '/demos', 'Set-Cookie': sessionCookie }
                };
              })
            : { status: 403 }
        )
    )
    .catch((e) => {
      console.log(e);
      return { status: 403 };
    });
};
