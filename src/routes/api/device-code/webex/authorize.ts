import 'reflect-metadata';
import type { RequestHandler } from '@sveltejs/kit';
import type { JSONObject, JSONValue, ToJSON } from '@sveltejs/kit/types/private';
import type { QRCodeRenderersOptions } from 'qrcode';
import { urlEncodedRequest } from '$lib/shared/urlencoded-request';
import { Expose, instanceToPlain, plainToInstance, Transform } from 'class-transformer';
import { sha3 } from 'hash-wasm';
import { toDataURL as qrCodeToDataUrl } from 'qrcode';
import { classTransformOptions, onFailure } from '../../../.utils';
import humps from 'humps';
import env from '$lib/environment';

/** @typedef {import('class-validator').ValidationError} ValidationError */

/** @returns {Promise<{ body: ResponseDTO; status: 200 } | { body: any; status: number } | { status: 500 }>} */
export const POST: RequestHandler = async () => {
  class ResponseDTO implements ToJSON {
    @Expose()
    @Transform(({ obj, value }) => value ?? obj.device_code, { toClassOnly: true })
    public readonly deviceCode!: string;

    @Expose()
    @Transform(({ obj, value }) => value ?? obj.expires_in, { toClassOnly: true })
    public readonly expiresIn!: number;

    @Expose()
    @Transform(({ value }) => new Date(value).toUTCString(), { toPlainOnly: true })
    public readonly expiresAt?: number;

    @Expose()
    @Transform(({ obj, value }) => value ?? obj.user_code, { toClassOnly: true })
    public readonly userCode!: string;

    @Expose()
    @Transform(({ obj, value }) => value ?? obj.verification_uri, { toClassOnly: true })
    public readonly verificationUri!: string;

    @Expose()
    @Transform(({ obj, value }) => value ?? obj.verification_uri_complete, { toClassOnly: true })
    public readonly verificationUriComplete?: string;

    @Expose()
    public readonly interval!: number;

    @Expose()
    public readonly qrImage!: string;

    toJSON(): Exclude<JSONValue, ToJSON> {
      return instanceToPlain(this);
    }
  }

  const addVerificationUriComplete = (obj: JSONObject) =>
    obj?.verificationUriComplete != null
      ? Promise.resolve(obj)
      : sha3(obj.userCode as string, 256).then((r) => {
          const url = new URL(env.WEBEX_OAUTH_HELP_SERVICE_URL + '/' + env.WEBEX_DEVICE_CODE_VALIDATE_ENDPOINT);
          url.searchParams.get('userCode') || url.searchParams.set('userCode', r);
          return { ...obj, verificationUriComplete: url.toString() };
        });

  const addQrImage = (obj: JSONObject, options: QRCodeRenderersOptions = { width: 500 }) =>
    qrCodeToDataUrl(obj.verificationUriComplete as string, options).then((r) => ({ ...obj, qrImage: r }));

  const addExpiresAt = (obj: JSONObject, date: number = Date.now()) => ({
    ...obj,
    expiresAt: date + (obj.expiresIn as number) * 1000
  });

  return urlEncodedRequest(env.WEBEX_OAUTH_HELP_SERVICE_URL)
    .post(
      env.WEBEX_DEVICE_CODE_AUTHORIZE_ENDPOINT,
      undefined,
      humps.decamelizeKeys({
        clientId: env.WEBEX_DEVICE_CODE_CLIENT_ID,
        scope: env.WEBEX_DEVICE_CODE_CLIENT_SCOPE
      }) as JSONObject
    )
    .then((r: Response) =>
      r
        .json()
        .then((s: JSONObject) => humps.camelizeKeys(s) as JSONObject)
        .then((s: JSONObject) => addVerificationUriComplete(s))
        .then((s: JSONObject) => addQrImage(s, { width: 240 }))
        .then((s: JSONObject) => addExpiresAt(s, Date.parse(r.headers.get('date') ?? new Date().toUTCString())))
    )
    .then((r: JSONObject) => ({
      status: 200,
      body: plainToInstance(ResponseDTO, r, classTransformOptions)
    }))
    .catch((e) => onFailure(e));
};
