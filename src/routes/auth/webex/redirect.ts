import type { RequestEvent } from '@sveltejs/kit';
import humps from 'humps';
import env from '$lib/environment';

export const GET = async (requestEvent: RequestEvent) => {
  if (requestEvent.locals.session?.user?.uuid) {
    return { status: 302, headers: { Location: '/demos' } };
  }

  const responseType = 'code';
  const redirectUri = requestEvent.url.origin + `/auth/webex/callback`;
  const state = requestEvent.locals.session?.uuid;

  const clientId = env.WEBEX_AUTHORIZATION_CODE_CLIENT_ID;
  const scope = env.WEBEX_AUTHORIZATION_CODE_CLIENT_SCOPE;
  const params = humps.decamelizeKeys({ clientId, redirectUri, responseType, scope, state });

  return {
    status: 302,
    headers: { Location: env.WEBEX_API_URL + '/authorize?' + new URLSearchParams(params as Record<string, string>) }
  };
};
