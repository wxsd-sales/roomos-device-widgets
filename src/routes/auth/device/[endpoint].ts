import 'dotenv/config';
import type { AuthorizeResponse } from '../../../lib/types';
import { RequestMethod } from '../../../lib/types';

const webexOauthHelpServiceUrl: string = process.env.WEBEX_OAUTH_HELP_SERVICE_URL || '';
const webexDeviceAuthorizeEndpoint: string = process.env.WEBEX_DEVICE_AUTHORIZE_ENDPOINT || '';
const webexDeviceTokenEndpoint: string = process.env.WEBEX_DEVICE_TOKEN_ENDPOINT || '';
const webexDeviceValidateEndpoint = process.env.WEBEX_DEVICE_VALIDATE_ENDPOINT || '';
const webexDeviceGrantType: string = process.env.WEBEX_DEVICE_GRANT_TYPE || '';
const webexClientId: string = process.env.WEBEX_CLIENT_ID || '';
const webexClientSecret: string = process.env.WEBEX_CLIENT_SECRET || '';
const webexClientScope: string = process.env.WEBEX_CLIENT_SCOPE || '';

async function authorize() {
  const authorizeUrl = webexOauthHelpServiceUrl + webexDeviceAuthorizeEndpoint;
  const authorizeRequest = new Request(authorizeUrl, {
    method: RequestMethod.POST,
    body: new URLSearchParams({ client_id: webexClientId, scope: webexClientScope })
  });
  const r = await fetch(authorizeRequest);

  return r.ok ? { body: (await r.json()) as AuthorizeResponse } : { status: r.status };
}

async function token(deviceCode: string) {
  const tokenUrl = webexOauthHelpServiceUrl + webexDeviceTokenEndpoint;
  const tokenHeaders = new Headers({
    Authorization: 'Basic ' + Buffer.from(webexClientId + ':' + webexClientSecret).toString('base64')
  });
  const tokenRequest = new Request(tokenUrl, {
    method: RequestMethod.POST,
    headers: tokenHeaders,
    body: new URLSearchParams({ grant_type: webexDeviceGrantType, client_id: webexClientId, device_code: deviceCode })
  });

  const r = await fetch(tokenRequest);

  return r.ok ? { body: await r.json() } : { status: r.status };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function get(request) {
  switch (request.params?.endpoint) {
    case 'authorize':
      return await authorize();
    case 'token':
      return await token(request.url.searchParams.get('deviceCode'));
    case 'validateUrl':
      return { body: { validateUrl: webexOauthHelpServiceUrl + webexDeviceValidateEndpoint } };
    default:
      return { status: 404 };
  }
}
