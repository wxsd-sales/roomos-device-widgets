import 'reflect-metadata';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import type { JSONObject } from '@sveltejs/kit/types/private';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, Matches, validateSync } from 'class-validator';
import { VALID_ACCESS_TOKEN } from '$lib/constants';
import { webexHttp } from '$lib/webex/http-wrapper';
import { classTransformOptions, classValidationOptions, onFailure } from '../../../.utils';
import humps from 'humps';

/** @typedef {import('class-validator').ValidationError} ValidationError */

export const POST: RequestHandler = async (requestEvent: RequestEvent) => {
  class RequestParamsDTO {
    @Expose()
    @IsNotEmpty()
    public readonly id!: string;
  }

  class RequestHeaderDTO {
    @Expose()
    @Matches(VALID_ACCESS_TOKEN)
    @Transform(({ obj }) => obj?.authorization?.toString()?.replace(/^Bearer /i, ''))
    public readonly authorization!: string;
  }

  class RequestBodyDTO {
    @Expose()
    @IsInt()
    public readonly callId!: number;
  }

  // validate request params
  const params = plainToInstance(RequestParamsDTO, requestEvent.params, classTransformOptions);
  const paramsValidationErrors = validateSync(params, classValidationOptions);
  if (paramsValidationErrors.length > 0) {
    return { status: 404 };
  }

  // validate request header
  const obj = humps.camelizeKeys(Object.fromEntries(requestEvent.request.headers.entries()));
  const header = plainToInstance(RequestHeaderDTO, obj, classTransformOptions);
  const headerValidationErrors = validateSync(header, classValidationOptions);
  if (headerValidationErrors.length > 0) {
    return { status: 401 };
  }

  // validate request body
  const body = plainToInstance(RequestBodyDTO, await requestEvent.request.json());
  const bodyValidationErrors = validateSync(body, classValidationOptions);
  if (bodyValidationErrors.length > 0) {
    return { status: 400 };
  }

  return webexHttp(header.authorization, 'xapi')
    .post('command/Call.Disconnect', undefined, {
      deviceId: params.id,
      arguments: humps.camelizeKeys({ callId: body.callId })
    } as JSONObject)
    .then(() => ({ status: 200 }))
    .catch((e) => onFailure(e));
};
