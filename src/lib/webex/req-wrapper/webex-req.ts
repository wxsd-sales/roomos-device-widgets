import { JsonRequest } from '../../shared/json-request';
import { WEBEX_API_ENDPOINT } from '../../constants';
import { WebexReqErrorPrefix } from '../../types';

export class WebexReq extends JsonRequest {
  /**
   * Creates a Webex request wrapper instance for the HTTP API.
   *
   * @param resource
   * @param accessToken
   */
  constructor(resource: string, accessToken: string) {
    super(WEBEX_API_ENDPOINT, resource, 'UTF-8', accessToken);
  }

  protected handleResponse(r: Response) {
    const onFailure = (r: Response) => {
      if (r?.status === 401) {
        return WebexReqErrorPrefix.INVALID_EXPIRED_ACCESS_TOKEN;
      } else if (r?.status >= 500) {
        return WebexReqErrorPrefix.UNEXPECTED_SERVER_ERROR;
      } else if (r?.status >= 400) {
        return WebexReqErrorPrefix.UNEXPECTED_CLIENT_ERROR;
      } else {
        return WebexReqErrorPrefix.UNEXPECTED_ERROR;
      }
    };

    return r.ok ? r.json() : Promise.reject(r).catch((r) => `${onFailure(r)}: ${r}`);
  }

  /**
   * Paginates the response.
   *
   * @param response
   */
  paginate(response: Response) {
    throw Error('Not Implemented');
  }
}

/**
 * Instantiates the Webex request wrapper.
 *
 * @param accessToken
 * @param resource
 *
 * @return {WebexReq}
 */
export const webexReq = (accessToken: string, resource = '') => new WebexReq(resource, accessToken);
