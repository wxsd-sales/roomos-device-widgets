export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export enum RequestMethod {
  DELETE = 'DELETE',
  GET = 'GET',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT'
}

export enum StateKey {
  WEBEX_OAUTH = 'webexOauth',
  WEBEX_USER = 'webexUser',
  EXAMPLE_LOCAL_WRITABLE = 'exampleLocalWritable',
  EXAMPLE_SESSION_WRITABLE = 'exampleSessionWritable',
  EXAMPLE_WRITABLE = 'exampleWritable',
  WEBEX = 'webex'
}

export enum WebexHttpErrorPrefix {
  INVALID_EXPIRED_ACCESS_TOKEN = 'Invalid or expired access token',
  UNEXPECTED_CLIENT_ERROR = 'Unexpected client error',
  UNEXPECTED_ERROR = 'Unexpected error',
  UNEXPECTED_SERVER_ERROR = 'Unexpected server error'
}

export enum WebexSdkErrorPrefix {
  INITIALIZATION = 'Could not initialize Webex',
  INITIALIZE_MEETINGS = 'Could not initialize meetings plugin',
  LISTEN_MESSAGES = 'Could not listen for messages',
  START_MEETING = 'Could not start meeting'
}

export enum RoomosJsxapiErrorPrefix {
  INITIALIZATION = 'Could not initialize RoomOS JSXAPI'
}

export interface AuthorizeResponse {
  device_code: string;
  expires_in: number;
  user_code: string;
  verification_uri: string;
  interval: number;
}
