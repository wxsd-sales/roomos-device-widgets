import type { Json } from '../types';
import { RequestMethod } from '../types';

export class JsonRequest {
  public resourceUrl = '/';
  protected headers: Headers = new Headers({ 'Content-type': 'application/json' });

  /**
   * Creates the JSON Request helper for an HTTP API.
   *
   * @param baseUrl
   * @param resource
   * @param charset
   * @param accessToken
   */
  constructor(baseUrl = '/', resource = '', charset?: string, accessToken?: string) {
    this.resourceUrl = baseUrl + resource ? '/' + resource : '';
    charset ? this.headers.set('Content-type', 'application/json; ' + charset) : null;
    accessToken ? this.headers.set('Authorization', 'Bearer ' + accessToken) : null;
  }

  /**
   * Creates the endpoint URL.
   *
   * @param endpoint
   * @param parameters
   *
   * @return {string}
   */
  protected formUrl(endpoint?: string, parameters?: Json) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const query = parameters ? `?${new URLSearchParams(parameters)}` : '';

    return endpoint ? `${this.resourceUrl}/${endpoint}${query}` : `${this.resourceUrl}${query}`;
  }

  /**
   * Returns JSON if successful else rejects the Promise with the failed response enclosed.
   *
   * @param r
   *
   * @return {Promise<any>}
   */
  protected handleResponse(r: Response) {
    return r.ok ? r.json() : Promise.reject(r);
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

  /**
   * Makes a HTTP DELETE request.
   *
   * @param endpoint
   * @param parameters
   *
   * @return {Promise<any>}
   */
  delete(endpoint?: string, parameters?: Json) {
    const url = this.formUrl(endpoint, parameters);

    return this.makeRequest(RequestMethod.DELETE, url).then((r) => this.handleResponse(r));
  }

  /**
   * Makes a HTTP GET request.
   *
   * @param endpoint
   * @param parameters
   *
   * @return {Promise<any>}
   */
  get(endpoint?: string, parameters?: Json) {
    const url = this.formUrl(endpoint, parameters);

    return this.makeRequest(RequestMethod.GET, url).then((r) => this.handleResponse(r));
  }

  /**
   * Makes a HTTP PATCH request.
   *
   * @param endpoint
   * @param parameters
   * @param body
   *
   * @return {Promise<any>}
   */
  patch(endpoint?: string, parameters?: Json, body?: Json) {
    const url = this.formUrl(endpoint, parameters);

    return this.makeRequest(RequestMethod.PATCH, url, body).then((r) => this.handleResponse(r));
  }

  /**
   * Makes a HTTP POST request.
   *
   * @param endpoint
   * @param parameters
   * @param body
   *
   * @return {Promise<any>}
   */
  post(endpoint?: string, parameters?: Json, body?: Json) {
    const url = this.formUrl(endpoint, parameters);

    return this.makeRequest(RequestMethod.POST, url, body).then((r) => this.handleResponse(r));
  }

  /**
   * Makes a HTTP PUT request.
   *
   * @param endpoint
   * @param parameters
   * @param body
   *
   * @return {Promise<any>}
   */
  put(endpoint?: string, parameters?: Json, body?: Json) {
    const url = this.formUrl(endpoint, parameters);

    return this.makeRequest(RequestMethod.PUT, url, body).then((r) => this.handleResponse(r));
  }
}

/**
 * Instantiate a JSON request helper for an HTTP API.
 *
 * @type {JsonRequest}
 */
export const jsonRequest = new JsonRequest();
