import type { JSONObject, HttpMethod } from '@sveltejs/kit/types/private';

export abstract class FetchWrapper<T> {
  public resourceUrl = '';
  protected headers: Headers = new Headers();

  /**
   * Creates the Request helper for an HTTP API.
   *
   * @param baseUrl
   * @param resource
   * @param authScheme
   * @param credentials
   */
  protected constructor(baseUrl = '/', resource?: string, authScheme?: string, credentials?: string) {
    this.resourceUrl = baseUrl + (resource ? '/' + resource : '');
    authScheme ? this.headers.set('Authorization', authScheme + ' ' + credentials) : null;
  }

  /**
   * Creates the endpoint URL.
   *
   * @param endpoint
   * @param parameters
   *
   * @returns {string}
   */
  protected formUrl(endpoint?: string, parameters?: JSONObject) {
    const query = parameters ? `?${new URLSearchParams(parameters as Record<string, string>)}` : '';

    return endpoint ? `${this.resourceUrl}/${endpoint}${query}` : `${this.resourceUrl}${query}`;
  }

  /**
   * Returns JSON if successful else rejects the Promise with the failed response enclosed.
   *
   * @param response
   *
   * @returns {Promise<Response>}
   */
  protected handleResponse(response: Response) {
    return response.ok ? Promise.resolve(response) : Promise.reject(response);
  }

  /**
   * Makes a resource request.
   *
   * @param method
   * @param url
   * @param body
   *
   * @returns {Promise<Response>}
   */
  protected makeRequest(method: HttpMethod, url: string, body?: unknown) {
    return body
      ? fetch(url, { method: method, headers: this.headers, body: body as string })
      : fetch(url, { method: method, headers: this.headers });
  }

  /**
   * Makes a HTTP DELETE request.
   *
   * @param endpoint
   * @param parameters
   *
   * @returns {Promise<Response>}
   */
  delete(endpoint?: string, parameters?: JSONObject) {
    const url = this.formUrl(endpoint, parameters);

    return this.makeRequest('DELETE', url).then((r) => this.handleResponse(r));
  }

  /**
   * Makes a HTTP GET request.
   *
   * @param endpoint
   * @param parameters
   *
   * @returns {Promise<Response>}
   */
  get(endpoint?: string, parameters?: JSONObject) {
    const url = this.formUrl(endpoint, parameters);

    return this.makeRequest('GET', url).then((r) => this.handleResponse(r));
  }

  /**
   * Makes a HTTP PATCH request.
   *
   * @param endpoint
   * @param parameters
   * @param body
   *
   * @returns {Promise<Response>}
   */
  patch(endpoint?: string, parameters?: JSONObject, body?: T) {
    const url = this.formUrl(endpoint, parameters);

    return this.makeRequest('PATCH', url, body).then((r) => this.handleResponse(r));
  }

  /**
   * Makes a HTTP POST request.
   *
   * @param endpoint
   * @param parameters
   * @param body
   *
   * @returns {Promise<Response>}
   */
  post(endpoint?: string, parameters?: JSONObject, body?: T) {
    const url = this.formUrl(endpoint, parameters);

    return this.makeRequest('POST', url, body).then((r) => this.handleResponse(r));
  }

  /**
   * Makes a HTTP PUT request.
   *
   * @param endpoint
   * @param parameters
   * @param body
   *
   * @returns {Promise<Response>}
   */
  put(endpoint?: string, parameters?: JSONObject, body?: T) {
    const url = this.formUrl(endpoint, parameters);

    return this.makeRequest('PUT', url, body).then((r) => this.handleResponse(r));
  }
}
