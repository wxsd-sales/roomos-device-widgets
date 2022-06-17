import 'reflect-metadata';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import type { JSONObject, JSONValue, ToJSON } from '@sveltejs/kit/types/private';
import { Expose, instanceToPlain, plainToInstance, Transform } from 'class-transformer';
import { IsDivisibleBy, IsEmail, IsMobilePhone, Min, validateSync } from 'class-validator';
import { jsonRequest } from '$lib/shared/json-request';
import humps from 'humps';
import env from '$lib/environment';
import { classTransformOptions, classValidationOptions, onFailure } from '../../.utils';

/** @typedef {import('class-validator').ValidationError} ValidationError */

/**
 * @param {RequestEvent} requestEvent
 *
 * @returns {Promise<
 *   | { body: { body: ValidationError[] }; status: 400 }
 *   | { body: ResponseDTO; status: 200 }
 *   | { body: any; status: number }
 *   | { status: 500 }
 * >}
 */
export const POST: RequestHandler = async (requestEvent: RequestEvent) => {
  class RequestBodyDTO {
    @Expose()
    @IsEmail()
    public readonly sipTarget!: string;

    @Expose()
    @Min(3600)
    @IsDivisibleBy(3600)
    public readonly expiresIn!: number;

    @Expose()
    @IsMobilePhone(
      ['en-AU', 'en-GB', 'en-IE', 'en-US'],
      { strictMode: true },
      { message: 'number must be a AU (+61), GB (+44), IE (+353) or US (+1) phone number' }
    )
    public readonly number!: string;
  }

  class ResponseDTO implements ToJSON {
    @Expose()
    @Transform(({ obj, value }) => value ?? obj.urls?.guest[0], { toClassOnly: true })
    public readonly guestUrl!: string;

    @Expose()
    @Transform(({ value }) => new Date(value).toUTCString(), { toPlainOnly: true })
    public readonly expiresAt?: number;

    @Expose()
    @Transform(({ obj, value }) => value ?? obj.sipTarget, { toClassOnly: true })
    public readonly sipTarget!: string;

    @Expose()
    @Transform(({ obj, value }) => value ?? obj.transId, { toClassOnly: true })
    public readonly uuid!: string;

    toJSON(): Exclude<JSONValue, ToJSON> {
      return instanceToPlain(this);
    }
  }

  // validate request body
  const json = ((await requestEvent.request.json()) || undefined) as JSONObject;
  const body = plainToInstance(RequestBodyDTO, json, classTransformOptions);
  const bodyValidationErrors = validateSync(body, classValidationOptions);
  if (bodyValidationErrors.length > 0) {
    return { status: 400, body: { body: bodyValidationErrors } };
  }

  const addExpiresAt = (obj: JSONObject, date: number = Date.now()) => ({
    expiresAt: date + (obj.expiresIn as number) * 1000,
    ...obj
  });

  return jsonRequest(env.GUEST_DEMO_API_URL)
    .post(
      env.GUEST_DEMO_CREATE_ENDPOINT,
      undefined,
      humps.decamelizeKeys({
        sipTarget: body.sipTarget,
        expireHours: Number(body.expiresIn / 3600).toFixed(0),
        headerToggle: false,
        autoDial: true,
        version: 2
      }) as JSONObject
    )
    .then((r: Response) =>
      r
        .json()
        .then((s: JSONObject) => humps.camelizeKeys(s) as JSONObject)
        .then((s: JSONObject) => ({ ...s, expiresIn: body.expiresIn }))
        .then((s: JSONObject) => addExpiresAt(s, Date.parse(r.headers.get('date') ?? new Date().toUTCString())))
    )
    .then((r: JSONObject) =>
      jsonRequest(env.IMI_WEBHOOK_URL)
        .post(env.IMI_SMS_ENDPOINT, undefined, {
          number: parseInt(body.number.match(/\d/g)?.join('') as string),
          message: 'Your guest invite meeting link is: ' + ((r.urls as JSONObject).guest as string[])[0]
        })
        .then((s: Response) => s.json() as Promise<JSONObject>)
        .then((s: JSONObject) => s.response as JSONObject[])
        .then((s: JSONObject[]) => ({ ...r, transId: s[0].transid, sipTarget: body.sipTarget }))
    )
    .then((r: JSONObject) => ({
      status: 200,
      body: plainToInstance(ResponseDTO, r, classTransformOptions)
    }))
    .catch((e) => onFailure(e));
};
