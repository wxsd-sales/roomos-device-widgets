import 'reflect-metadata';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import type { JSONObject, JSONValue, ToJSON } from '@sveltejs/kit/types/private';
import { Expose, instanceToPlain, plainToInstance } from 'class-transformer';
import {
  ArrayNotContains,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsString,
  validateSync
} from 'class-validator';
import { jsonRequest } from '$lib/shared/json-request';
import { classTransformOptions, classValidationOptions, onFailure } from '../../.utils';
import env from '$lib/environment';

/** @typedef {import('class-validator').ValidationError} ValidationError */

class RequestParamsDTO {
  @Expose()
  @IsNotEmpty()
  public readonly id!: string;
}

/**
 * @param {RequestEvent} requestEvent
 *
 * @returns {Promise<
 *   | { body: { param: ValidationError[] }; status: 400 }
 *   | { body: ResponseDTO; status: 200 }
 *   | { body: any; status: number }
 *   | { status: 500 }
 * >}
 */
export const GET: RequestHandler = async (requestEvent: RequestEvent) => {
  class ResponseDTO implements ToJSON {
    @Expose()
    public readonly result!: Set<string>;

    toJSON(): Exclude<JSONValue, ToJSON> {
      return instanceToPlain(this);
    }
  }

  // validate request params
  const params = plainToInstance(RequestParamsDTO, requestEvent.params, classTransformOptions);
  const paramsValidationErrors = validateSync(params, classValidationOptions);
  if (paramsValidationErrors.length > 0) {
    return { status: 400, body: { param: paramsValidationErrors } };
  }

  return jsonRequest(env.UPSTASH_REDIS_REST_URL, 'smembers', 'Bearer', env.UPSTASH_REDIS_REST_TOKEN)
    .get('favourite-contacts-' + params.id)
    .then((r: Response) => r.json())
    .then((r: JSONObject) => ({
      status: 200,
      body: plainToInstance(ResponseDTO, r, classTransformOptions)
    }))
    .catch((e) => onFailure(e));
};

/**
 * @param {RequestEvent} requestEvent
 *
 * @returns {Promise<
 *   | { body: { param: ValidationError[] }; status: 400 }
 *   | { body: { body: ValidationError[] }; status: 400 }
 *   | { body: ResponseDTO; status: 200 }
 *   | { body: any; status: number }
 *   | { status: number }
 * >}
 */
export const POST: RequestHandler = async (requestEvent: RequestEvent) => {
  class RequestBodyDTO {
    @Expose()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @ArrayNotContains([requestEvent.params.id])
    @IsString({ each: true })
    public readonly ids!: Set<string>;
  }

  class ResponseDTO implements ToJSON {
    @Expose()
    public readonly result!: JSONValue;

    toJSON(): Exclude<JSONValue, ToJSON> {
      return instanceToPlain(this);
    }
  }

  // validate request params
  const params = plainToInstance(RequestParamsDTO, requestEvent.params, classTransformOptions);
  const paramsValidationErrors = validateSync(params, classValidationOptions);
  if (paramsValidationErrors.length > 0) {
    return { status: 400, body: { param: paramsValidationErrors } };
  }

  // validate request body
  const json = ((await requestEvent.request.json()) || undefined) as JSONObject;
  const body = plainToInstance(RequestBodyDTO, json, classTransformOptions);
  const bodyValidationErrors = validateSync(body, classValidationOptions);
  if (bodyValidationErrors.length > 0) {
    return { status: 400, body: { body: bodyValidationErrors } };
  }

  return jsonRequest(env.UPSTASH_REDIS_REST_URL, undefined, 'Bearer', env.UPSTASH_REDIS_REST_TOKEN)
    .post(undefined, undefined, ['sadd', 'favourite-contacts-' + params.id, ...Array.from(body.ids)])
    .then((r: Response) => r.json())
    .then((r: JSONObject) => ({
      status: 200,
      body: plainToInstance(ResponseDTO, r, classTransformOptions)
    }))
    .catch((e) => onFailure(e));
};
