import type { Json } from '../types';

export class JsonRequest {
  public resourceUrl = '/';
  protected headers: Headers = new Headers({ 'Content-type': 'application/json' });

  constructor(baseUrl = '/', resource = '', charset?: string, accessToken?: string) {
    this.resourceUrl = baseUrl + resource ? '/' + resource : '';
    charset ? this.headers.set('Content-type', 'application/json; ' + charset) : null;
    accessToken ? this.headers.set('Authorization', 'Bearer ' + accessToken) : null;
  }

  protected formUrl(endpoint?: string, parameters?: Json) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const query = parameters ? `?${new URLSearchParams(parameters)}` : '';

    return endpoint ? `${this.resourceUrl}/${endpoint}${query}` : `${this.resourceUrl}${query}`;
  }

  protected handleResponse(r: Response) {
    return r.ok ? r.json() : Promise.reject(r);
  }

  protected makeRequest(method: 'GET' | 'PATCH' | 'POST' | 'PUT' | 'DELETE', url: string, body?: Json) {
    const request = body
      ? new Request(url, { method: method, headers: this.headers, body: JSON.stringify(body) })
      : new Request(url, { method: method, headers: this.headers });

    return fetch(request);
  }

  delete(endpoint?: string, parameters?: Json) {
    return this.makeRequest('DELETE', this.formUrl(endpoint, parameters)).then((r) => this.handleResponse(r));
  }

  get(endpoint?: string, parameters?: Json) {
    return this.makeRequest('GET', this.formUrl(endpoint, parameters)).then((r) => this.handleResponse(r));
  }

  patch(endpoint?: string, parameters?: Json, body?: Json) {
    return this.makeRequest('PATCH', this.formUrl(endpoint, parameters), body).then((r) => this.handleResponse(r));
  }

  post(endpoint?: string, parameters?: Json, body?: Json) {
    return this.makeRequest('POST', this.formUrl(endpoint, parameters), body).then((r) => this.handleResponse(r));
  }

  put(endpoint?: string, parameters?: Json, body?: Json) {
    return this.makeRequest('PUT', this.formUrl(endpoint, parameters), body).then((r) => this.handleResponse(r));
  }
}

export const jsonRequest = new JsonRequest();
