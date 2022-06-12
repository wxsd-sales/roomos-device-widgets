import type { HttpMethod, JSONValue } from '@sveltejs/kit/types/private';
import { FetchWrapper } from './fetch-wrapper';

export class JsonRequest extends FetchWrapper<JSONValue> {
  protected headers: Headers = new Headers({ 'Content-type': 'application/json' });

  /**
   * Creates the JSON Request helper for an HTTP API.
   *
   * @param baseUrl
   * @param resource
   * @param authScheme
   * @param credentials
   */
  constructor(baseUrl = '/', resource?: string, authScheme?: string, credentials?: string) {
    super(baseUrl, resource, authScheme, credentials);
    authScheme ? this.headers.set('Authorization', authScheme + ' ' + credentials) : null;
    this.headers.set('Accept', 'application/json');
  }

  /** @inheritDoc */
  protected makeRequest(method: HttpMethod, url: string, body?: JSONValue) {
    return body
      ? fetch(url, { method: method, headers: this.headers, body: JSON.stringify(body) })
      : fetch(url, { method: method, headers: this.headers });
  }
}

/**
 * Instantiate a JSON request helper for an HTTP API.
 *
 * @type {JsonRequest}
 */
export const jsonRequest = (baseUrl = '/', resource?: string, authScheme?: string, credentials?: string) =>
  new JsonRequest(baseUrl, resource, authScheme, credentials);
