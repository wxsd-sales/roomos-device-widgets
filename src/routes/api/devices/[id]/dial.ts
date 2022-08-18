import 'reflect-metadata';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import type { JSONObject, JSONValue, ToJSON } from '@sveltejs/kit/types/private';
import { Expose, instanceToPlain, plainToInstance, Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsOptional, Matches, MaxLength, MinLength, validateSync } from 'class-validator';
import { webexHttp } from '$lib/webex/http-wrapper';
import { VALID_ACCESS_TOKEN } from '$lib/constants';
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
    @IsOptional()
    @MinLength(0)
    @MaxLength(255)
    public readonly bookingId?: string;

    @Expose()
    @IsOptional()
    @IsIn(['Auto', 'Audio', 'Video'])
    public readonly callType?: 'Auto' | 'Audio' | 'Video';

    @Expose()
    @IsOptional()
    @MinLength(0)
    @MaxLength(255)
    public readonly displayName?: string;

    @Expose()
    @IsNotEmpty()
    @MinLength(0)
    @MaxLength(255)
    public readonly number!: string;

    @Expose()
    @IsOptional()
    @IsIn(['H320', 'H323', 'Sip', 'Spark'])
    public readonly protocol?: 'H320' | 'H323' | 'Sip' | 'Spark';
  }

  class ResponseDTO implements ToJSON {
    @Expose()
    @Transform(({ value, obj }) => value ?? obj?.result?.CallId)
    public readonly callId!: number;

    @Expose()
    @Transform(({ value, obj }) => value ?? obj?.result?.ConferenceId)
    public readonly conferenceId!: number;

    toJSON(): Exclude<JSONValue, ToJSON> {
      return instanceToPlain(this);
    }
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
    .post('command/Dial', undefined, {
      deviceId: params.id,
      arguments: humps.camelizeKeys(body)
    } as JSONObject)
    .then((r: Response) => r.json())
    .then((r: JSONObject) => ({ status: 200, body: plainToInstance(ResponseDTO, r, classTransformOptions) }))
    .catch((e) => onFailure(e));
};
