import 'reflect-metadata';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import type { JSONObject, JSONValue, ToJSON } from '@sveltejs/kit/types/private';
import { Expose, instanceToPlain, plainToInstance, Transform, Type } from 'class-transformer';
import { IsIn, IsInt, validateSync } from 'class-validator';
import { jsonRequest } from '$lib/shared/json-request';
import { classTransformOptions, classValidationOptions, onFailure } from '../../.utils';
import env from '$lib/environment';

/** @typedef {import('class-validator').ValidationError} ValidationError */

/**
 * @param {RequestEvent} requestEvent
 *
 * @returns {Promise<
 *   | { body: { query: ValidationError[] }; status: 400 }
 *   | { body: ResponseDTO; status: 200; headers: { 'Cache-Control': 'public, max-age=600'; 'Expires': string } }
 *   | { body: any; status: number }
 *   | { status: 500 }
 * >}
 */
export const GET: RequestHandler = async (requestEvent: RequestEvent) => {
  class ResponseDTO implements ToJSON {
    @Expose()
    public readonly guest!: Array<string>;

    @Expose()
    public readonly host!: Array<string>;

    toJSON(): Exclude<JSONValue, ToJSON> {
      return instanceToPlain(this);
    }
  }

  return jsonRequest(env.INSTANT_CONNECT_REST_URL, 'Bearer', env.INSTANT_CONNECT_USER_TOKEN)
    .get('joseencrypt', { aud: env.INSTANT_CONNECT_AUD, sub: 'video-queue' })
    .then((r: Response) => r.json())
    .then((r: JSONObject) => ({
      status: 200,
      body: plainToInstance(ResponseDTO, r, classTransformOptions)
    }))
    .catch((e) => onFailure(e));
};
