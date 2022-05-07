import type { Json, RequestMethod } from '../types';
import { FetchWrapper } from './fetch-wrapper';

export class UrlEncodedRequest extends FetchWrapper {
  public resourceUrl = '/';
  protected headers: Headers = new Headers({ 'Content-type': 'application/x-www-form-urlencoded' });

  /**
   * Creates the URL Encoded Request helper for an HTTP API.
   *
   * @param baseUrl
   * @param resource
   * @param authScheme
   * @param credentials
   */
  constructor(baseUrl = '/', resource = '', authScheme = 'Bearer', credentials?: string) {
    super(baseUrl, resource, authScheme, credentials);
    this.resourceUrl = baseUrl + (resource ? '/' + resource : '');
    credentials ? this.headers.set('Authorization', authScheme + ' ' + credentials) : null;
  }

  /**
   *  @inheritDoc
   */
  protected makeRequest(method: RequestMethod, url: string, body?: Json) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const requestBody = body ? new URLSearchParams(body) : '';
    const request = body
      ? new Request(url, { method: method, headers: this.headers, body: requestBody })
      : new Request(url, { method: method, headers: this.headers });

    return fetch(request);
  }
}

/**
 * Instantiate a URL Encoded request helper for an HTTP API.
 *
 * @type {UrlEncodedRequest}
 */
export const urlEncodedRequest = (baseUrl = '/', resource = '', authScheme = 'Bearer', credentials?: string) =>
  new UrlEncodedRequest(baseUrl, resource, authScheme, credentials);
