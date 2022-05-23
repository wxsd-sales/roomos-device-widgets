import 'dotenv/config';
import type { AuthorizeResponse } from '$lib/types';
import { urlEncodedRequest } from '$lib/shared/urlencoded-request';

const webexOauthHelpServiceUrl: string = process.env.WEBEX_OAUTH_HELP_SERVICE_URL || '';
const webexDeviceAuthorizeEndpoint: string = process.env.WEBEX_DEVICE_AUTHORIZE_ENDPOINT || '';
const webexDeviceTokenEndpoint: string = process.env.WEBEX_DEVICE_TOKEN_ENDPOINT || '';
const webexDeviceValidateEndpoint = process.env.WEBEX_DEVICE_VALIDATE_ENDPOINT || '';
const webexDeviceGrantType: string = process.env.WEBEX_DEVICE_GRANT_TYPE || '';
const webexClientId: string = process.env.WEBEX_CLIENT_ID || '';
const webexClientSecret: string = process.env.WEBEX_CLIENT_SECRET || '';
const webexClientScope: string = process.env.WEBEX_CLIENT_SCOPE || '';

async function authorize() {
  const authorizeRequest = urlEncodedRequest(webexOauthHelpServiceUrl);

  return await authorizeRequest
    .post(webexDeviceAuthorizeEndpoint, {
      client_id: webexClientId,
      scope: webexClientScope
    })
    .then((r) => ({ body: r as AuthorizeResponse }))
    .catch(() => ({ status: 400 }));
}

async function token(deviceCode: string) {
  const credentials = Buffer.from(webexClientId + ':' + webexClientSecret).toString('base64');
  const tokenRequest = urlEncodedRequest(webexOauthHelpServiceUrl, '', 'Basic', credentials);

  return await tokenRequest
    .post(webexDeviceTokenEndpoint, {
      client_id: webexClientId,
      device_code: deviceCode,
      grant_type: webexDeviceGrantType
    })
    .then((r) => ({ body: r as AuthorizeResponse }))
    .catch(() => ({ status: 400 }));
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function get(request) {
  switch (request.params?.endpoint) {
    case 'authorize':
      return authorize();
    case 'token':
      return token(request.url.searchParams.get('deviceCode'));
    case 'validateUrl':
      return { body: { validateUrl: webexOauthHelpServiceUrl + webexDeviceValidateEndpoint } };
    default:
      return { status: 404 };
  }
}
