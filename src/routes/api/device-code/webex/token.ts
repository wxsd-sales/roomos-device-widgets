import 'reflect-metadata';
import type { RequestEvent } from '@sveltejs/kit';
import type { JSONObject, JSONValue, ToJSON } from '@sveltejs/kit/types/private';
import { urlEncodedRequest } from '$lib/shared/urlencoded-request';
import { Expose, instanceToPlain, plainToInstance, Transform } from 'class-transformer';
import { IsNotEmpty, IsUUID, validateSync } from 'class-validator';
import humps from 'humps';
import env from '$lib/environment';
import { classTransformOptions, classValidationOptions } from '../../../.utils';

/** @typedef {import('class-validator').ValidationError} ValidationError */

const onFailure = async (e: Response | Error) => {
  if (e instanceof Response && e.status !== 401) {
    return e.status === 428
      ? { status: e.status, body: await e.json(), headers: { 'Skip-Reporting': true } }
      : { status: e.status, body: await e.json() };
  } else {
    console.log(e);
    return { status: 500 };
  }
};

/**
 * @param {RequestEvent} requestEvent
 *
 * @returns {Promise<
 *   | { body: { query: ValidationError[] }; status: 400 }
 *   | { body: ResponseDTO; status: 200 }
 *   | { body: any; status: number }
 *   | { status: 500 }
 * >}
 */
export const POST = async (requestEvent: RequestEvent) => {
  class RequestQueryDTO {
    @Expose()
    @IsNotEmpty()
    @IsUUID(4)
    public readonly deviceCode!: string;
  }

  class ResponseDTO implements ToJSON {
    @Expose()
    public readonly scope!: string;

    @Expose()
    @Transform(({ obj, value }) => value ?? obj.expires_in, { toClassOnly: true })
    public readonly expiresIn!: number;

    @Expose()
    @Transform(({ value }) => new Date(value).toUTCString(), { toPlainOnly: true })
    public readonly expiresAt?: number;

    @Expose()
    @Transform(({ obj, value }) => value ?? obj.token_type, { toClassOnly: true })
    public readonly tokenType!: string;

    @Expose()
    @Transform(({ obj, value }) => value ?? obj.access_token, { toClassOnly: true })
    public readonly accessToken!: string;
    @Expose()
    @Transform(({ obj, value }) => value ?? obj.refresh_token, { toClassOnly: true })
    public readonly refreshToken!: string;

    @Expose()
    @Transform(({ obj, value }) => value ?? obj.refresh_token_expires_in, { toClassOnly: true })
    public readonly refreshTokenExpiresIn!: number;

    @Expose()
    @Transform(({ value }) => new Date(value).toUTCString(), { toPlainOnly: true })
    public readonly refreshTokenExpiresAt?: number;

    toJSON(): Exclude<JSONValue, ToJSON> {
      return instanceToPlain(this);
    }
  }

  const data = env.WEBEX_DEVICE_CODE_CLIENT_ID + ':' + env.WEBEX_DEVICE_CODE_CLIENT_SECRET;
  const credentials = Buffer.from(data).toString('base64');

  // validate request query
  const searchParams = Object.fromEntries(requestEvent.url.searchParams);
  const query = plainToInstance(RequestQueryDTO, searchParams, classTransformOptions);
  const queryValidationErrors = validateSync(query, classValidationOptions);
  if (queryValidationErrors.length > 0) {
    return { status: 400, body: { query: queryValidationErrors } };
  }

  const addExpiresAts = (obj: JSONObject, date: number = Date.now()) => ({
    ...obj,
    ...{
      expiresAt: date + (obj.expiresIn as number) * 1000,
      refreshTokenExpiresAt: date + (obj.refreshTokenExpiresIn as number) * 1000
    }
  });

  return urlEncodedRequest(env.WEBEX_OAUTH_HELP_SERVICE_URL, undefined, 'Basic', credentials)
    .post(
      env.WEBEX_DEVICE_CODE_TOKEN_ENDPOINT,
      humps.decamelizeKeys({
        grantType: env.WEBEX_DEVICE_CODE_TYPE,
        clientId: env.WEBEX_DEVICE_CODE_CLIENT_ID,
        deviceCode: query.deviceCode
      }) as JSONObject
    )
    .then((r: Response) =>
      r
        .json()
        .then((s: JSONObject) => humps.camelizeKeys(s) as JSONObject)
        .then((s: JSONObject) => addExpiresAts(s, Date.parse(r.headers.get('date') ?? new Date().toUTCString())))
    )
    .then((r: JSONObject) => ({
      status: 200,
      body: plainToInstance(ResponseDTO, r, classTransformOptions)
    }))
    .catch((e) => onFailure(e));
};
