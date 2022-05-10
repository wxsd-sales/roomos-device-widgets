import { JsonRequest } from '../../shared/json-request';
import { WEBEX_API_ENDPOINT } from '../../constants';
import { WebexHttpErrorPrefix } from '../../types';

export class WebexHttp extends JsonRequest {
  /**
   * Creates a Webex HTTP API request wrapper instance.
   *
   * @param resource
   * @param accessToken
   */
  constructor(resource: string, accessToken: string) {
    super(WEBEX_API_ENDPOINT, resource, 'UTF-8', 'Bearer', accessToken);
  }

  /**
   * Returns JSON if successful else rejects the Promise with the HTTP error enclosed.
   *
   * @param response
   *
   * @return {Promise<any>}
   */
  protected handleResponse(response: Response) {
    const onFailure = (r: Response) => {
      if (r?.status === 401) {
        return WebexHttpErrorPrefix.INVALID_EXPIRED_ACCESS_TOKEN;
      } else if (r?.status >= 500) {
        return WebexHttpErrorPrefix.UNEXPECTED_SERVER_ERROR;
      } else if (r?.status >= 400) {
        return WebexHttpErrorPrefix.UNEXPECTED_CLIENT_ERROR;
      } else {
        return WebexHttpErrorPrefix.UNEXPECTED_ERROR;
      }
    };

    return response.ok
      ? response.json()
      : Promise.reject(response).catch(async (r) => `${onFailure(r)}: ${await r.json()}`);
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
 * Instantiates the Webex HTTP API request wrapper.
 *
 * @param accessToken
 * @param resource
 *
 * @return {WebexHttp}
 */
export const webexHttp = (accessToken: string, resource = '') => new WebexHttp(resource, accessToken);
