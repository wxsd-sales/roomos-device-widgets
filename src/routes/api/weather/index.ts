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
  class RequestQueryDTO {
    @Expose()
    @IsInt()
    @Type(() => Number)
    public readonly id!: number;

    @Expose()
    @IsIn(['imperial', 'metric', 'standard'])
    public readonly units!: 'imperial' | 'metric' | 'standard';
  }

  class ResponseDTO implements ToJSON {
    @Expose()
    public readonly units!: 'imperial' | 'metric' | 'standard';

    @Expose()
    @Transform(({ obj }) => `${obj.name}, ${obj.sys.country}`, { toClassOnly: true })
    public readonly place!: string;

    @Expose()
    public readonly timezone!: number;

    @Expose()
    @Transform(({ obj }) => obj.main.temp, { toClassOnly: true })
    public readonly temp!: number;

    @Expose()
    @Transform(({ obj }) => obj.main.tempMin ?? obj.main.temp_min, { toClassOnly: true })
    public readonly tempMin!: number;

    @Expose()
    @Transform(({ obj }) => obj.main.tempMax ?? obj.main.temp_max, { toClassOnly: true })
    public readonly tempMax!: number;

    @Expose()
    @Transform(({ obj }) => obj.weather[0].main, { toClassOnly: true })
    public readonly main!: string;

    @Expose()
    @Transform(({ obj }) => obj.weather[0].description, { toClassOnly: true })
    public readonly description!: string;

    @Expose()
    @Transform(({ obj }) => obj.weather[0].icon, { toClassOnly: true })
    public readonly icon!: string;

    toJSON(): Exclude<JSONValue, ToJSON> {
      return instanceToPlain(this);
    }
  }

  // validate request query
  const searchParams = Object.fromEntries(requestEvent.url.searchParams);
  const query = plainToInstance(RequestQueryDTO, searchParams, classTransformOptions);
  const queryValidationErrors = validateSync(query, classValidationOptions);
  if (queryValidationErrors.length > 0) {
    return { status: 400, body: { query: queryValidationErrors } };
  }

  return jsonRequest(env.OPENWEATHERMAP_API_URL)
    .get('weather', { appid: env.OPENWEATHERMAP_API_KEY, ...query })
    .then((r: Response) => r.json())
    .then((r: JSONObject) => ({
      status: 200,
      body: plainToInstance(ResponseDTO, { units: query.units, ...r }, classTransformOptions),
      headers: {
        'Cache-Control': 'public, max-age=600',
        'Expires': new Date(Date.now() + 10 * 60 * 1000).toUTCString()
      }
    }))
    .catch((e) => onFailure(e));
};
