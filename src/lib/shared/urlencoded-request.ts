import type { JSONObject, HttpMethod } from '@sveltejs/kit/types/private';
import { FetchWrapper } from './fetch-wrapper';

export class UrlEncodedRequest<T> extends FetchWrapper<T> {
  protected headers: Headers = new Headers({ 'Content-type': 'application/x-www-form-urlencoded' });

  /**
   * Creates the URL Encoded Request helper for an HTTP API.
   *
   * @param baseUrl
   * @param resource
   * @param authScheme
   * @param credentials
   */
  constructor(baseUrl = '/', resource = '', authScheme?: string, credentials?: string) {
    super(baseUrl, resource, authScheme, credentials);
    authScheme ? this.headers.set('Authorization', authScheme + ' ' + credentials) : null;
  }

  /** @inheritDoc */
  protected makeRequest(method: HttpMethod, url: string, body?: JSONObject) {
    const requestBody = body ? new URLSearchParams(body as Record<string, string>).toString() : '';

    return body
      ? fetch(url, { method: 'POST', headers: this.headers, body: requestBody })
      : fetch(url, { method: method, headers: this.headers });
  }
}

/**
 * Instantiate a URL Encoded request helper for an HTTP API.
 *
 * @type {UrlEncodedRequest}
 */
export const urlEncodedRequest = (baseUrl = '/', resource?: string, authScheme?: string, credentials?: string) =>
  new UrlEncodedRequest(baseUrl, resource, authScheme, credentials);
