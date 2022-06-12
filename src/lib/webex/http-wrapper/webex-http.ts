import { JsonRequest } from '../../shared/json-request';
import { WEBEX_API_ENDPOINT } from '../../constants';

export class WebexHttp extends JsonRequest {
  /**
   * Creates a Webex HTTP API request wrapper instance.
   *
   * @param resource
   * @param accessToken
   */
  constructor(resource: string, accessToken: string) {
    super(WEBEX_API_ENDPOINT, resource, 'Bearer', accessToken);
  }

  /**
   * Returns JSON if successful else rejects the Promise with the HTTP error enclosed.
   *
   * @param response
   *
   * @returns {Promise<any>}
   */
  protected handleResponse(response: Response) {
    return response.ok ? Promise.resolve(response) : Promise.reject(response);
  }

  /**
   * Paginates the response.
   *
   * @param response
   */
  paginate() {
    throw Error('Not implemented.');
  }
}

/**
 * Instantiates the Webex HTTP API request wrapper.
 *
 * @param accessToken
 * @param resource
 *
 * @returns {WebexHttp}
 */
export const webexHttp = (accessToken: string, resource = '') => new WebexHttp(resource, accessToken);
