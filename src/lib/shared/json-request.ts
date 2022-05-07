import type { Json, RequestMethod } from '../types';
import { FetchWrapper } from './fetch-wrapper';

export class JsonRequest extends FetchWrapper {
  public resourceUrl = '/';
  protected headers: Headers = new Headers({ 'Content-type': 'application/json' });

  /**
   * Creates the JSON Request helper for an HTTP API.
   *
   * @param baseUrl
   * @param resource
   * @param charset
   * @param authScheme
   * @param credentials
   */
  constructor(baseUrl = '/', resource = '', charset = 'UTF-8', authScheme = 'Bearer', credentials?: string) {
    super(baseUrl, resource, authScheme, credentials);
    this.resourceUrl = baseUrl + (resource ? '/' + resource : '');
    charset ? this.headers.set('Content-type', 'application/json; ' + charset) : null;
    credentials ? this.headers.set('Authorization', authScheme + ' ' + credentials) : null;
  }

  /**
   *  Makes a resource request.
   *
   * @param method
   * @param url
   * @param body
   *
   * @return {Promise<Response>}
   */
  protected makeRequest(method: RequestMethod, url: string, body?: Json) {
    const request = body
      ? new Request(url, { method: method, headers: this.headers, body: JSON.stringify(body) })
      : new Request(url, { method: method, headers: this.headers });

    return fetch(request);
  }
}

/**
 * Instantiate a JSON request helper for an HTTP API.
 *
 * @type {JsonRequest}
 */
export const jsonRequest = (
  baseUrl = '/',
  resource = '',
  charset = 'UTF-8',
  authScheme = 'Bearer',
  credentials?: string
) => new JsonRequest(baseUrl, resource, charset, authScheme, credentials);
