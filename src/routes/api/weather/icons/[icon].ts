import type { RequestEvent } from '@sveltejs/kit';
import type { OwmIcon } from './.utils';
import { Expose, plainToInstance } from 'class-transformer';
import { IsIn, validateSync } from 'class-validator';
import { getWeatherIconSvg, newWeatherIcon, owm } from './.utils';
import { classTransformOptions, classValidationOptions } from '../../../.utils';

/** @typedef {import('class-validator').ValidationError} ValidationError */

class RequestParamDTO {
  @Expose()
  @IsIn([
    ...Object.values(owm),
    ...Object.keys(owm),
    ...Object.keys(newWeatherIcon.line),
    ...Object.keys(newWeatherIcon.fill)
  ])
  public readonly icon!: string;
}

/**
 * @param {RequestEvent} requestEvent
 *
 * @returns {Promise<
 *   | { body: { query: ValidationError[] }; status: 400 }
 *   | { body: { param: ValidationError[] }; status: 400 }
 *   | {
 *       body: string;
 *       status: 200;
 *       headers: {
 *         'Cache-Control': 'public, max-age=31536000';
 *         'Expires': '2100-12-31T23:59:59.999Z';
 *         'Content-Type': 'image/svg+xml';
 *       };
 *     }
 *   | { status: 500 }
 * >}
 */
export const GET = async (requestEvent: RequestEvent) => {
  class RequestQueryDTO {
    @Expose()
    @IsIn(['line', 'fill'])
    public readonly iconVariant!: 'line' | 'fill';
  }

  // validate request params
  const param = plainToInstance(RequestParamDTO, requestEvent.params, classTransformOptions);
  const paramValidationErrors = validateSync(param, classValidationOptions);
  if (paramValidationErrors.length > 0) {
    return { status: 400, body: { param: paramValidationErrors } };
  }

  // validate request query
  const searchParams = Object.fromEntries(requestEvent.url.searchParams);
  const query = plainToInstance(RequestQueryDTO, searchParams, classTransformOptions);
  const queryValidationErrors = validateSync(query, classValidationOptions);
  if (queryValidationErrors.length > 0) {
    return { status: 400, body: { query: queryValidationErrors } };
  }

  const weatherIconSvg = getWeatherIconSvg(param.icon as OwmIcon, query.iconVariant);
  if (weatherIconSvg) {
    return {
      status: 200,
      body: weatherIconSvg,
      headers: {
        'Cache-Control': 'public, max-age=31536000',
        'Expires': '2100-12-31T23:59:59.999Z',
        'Content-Type': 'image/svg+xml'
      }
    };
  }

  return { status: 500 };
};
