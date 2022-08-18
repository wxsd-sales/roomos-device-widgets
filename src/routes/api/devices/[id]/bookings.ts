import 'reflect-metadata';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import type { JSONObject, JSONValue, ToJSON } from '@sveltejs/kit/types/private';
import { Expose, instanceToPlain, plainToInstance, Transform } from 'class-transformer';
import { IsNotEmpty, Matches, validateSync } from 'class-validator';
import { webexHttp } from '$lib/webex/http-wrapper';
import { VALID_ACCESS_TOKEN } from '$lib/constants';
import { classTransformOptions, classValidationOptions, onFailure } from '../../../.utils';
import humps from 'humps';

/** @typedef {import('class-validator').ValidationError} ValidationError */

export const GET: RequestHandler = async (requestEvent: RequestEvent) => {
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

  class BookingDTO implements ToJSON {
    @Expose()
    @Transform(({ obj }) => obj.id, { toClassOnly: true })
    public readonly id!: string;

    @Expose()
    @Transform(({ obj }) => obj.dialInfo.calls.call[0].number, { toClassOnly: true })
    public readonly number!: string;

    @Expose()
    @Transform(
      ({ obj }) => ({
        name: [obj.organizer.firstName, obj.organizer.lastName].filter((r) => r !== '').join(', '),
        email: obj.organizer.email !== '' ? obj.organizer.email : undefined
      }),
      { toClassOnly: true }
    )
    public readonly organizer!: { name: string; email?: string };

    @Expose()
    @Transform(({ obj }) => obj.dialInfo.calls.call[0].protocol, { toClassOnly: true })
    public readonly protocol!: 'SIP' | 'H323' | 'ISDN' | 'IP' | 'Spark' | 'WebRTC';

    @Expose()
    @Transform(({ obj }) => obj.meetingPlatform || undefined, { toClassOnly: true })
    public readonly platform?: 'GoogleMeet' | 'MicrosoftTeams';

    @Expose()
    @Transform(
      ({ obj }) => ({
        start: new Date(obj.time.startTime),
        end: new Date(obj.time.endTime),
        startBuffer: obj.time.startTimeBuffer
      }),
      { toClassOnly: true }
    )
    public readonly time!: { start: Date; end: Date; startBuffer: number };

    @Expose()
    @Transform(({ obj }) => obj.title || undefined, { toClassOnly: true })
    public readonly title?: string;

    @Expose()
    @Transform(({ obj }) => obj.privacy || undefined, { toClassOnly: true })
    public readonly privacy?: 'Private' | 'Public';

    toJSON(): Exclude<JSONValue, ToJSON> {
      return instanceToPlain(this);
    }
  }

  type ResponseDTO = BookingDTO[];

  // validate request params
  const params = plainToInstance(RequestParamsDTO, requestEvent.params, classTransformOptions);
  const paramsValidationErrors = validateSync(params, classValidationOptions);
  if (paramsValidationErrors.length > 0) {
    return { status: 404 };
  }

  // validate request header
  const json = humps.camelizeKeys(Object.fromEntries(requestEvent.request.headers.entries()));
  const header = plainToInstance(RequestHeaderDTO, json, classTransformOptions);
  const headerValidationErrors = validateSync(header, classValidationOptions);
  if (headerValidationErrors.length > 0) {
    return { status: 401 };
  }

  return webexHttp(header.authorization, 'xapi')
    .post('command/Bookings.List', undefined, {
      deviceId: params.id,
      arguments: humps.camelizeKeys({ dayOffset: 0 })
    } as JSONObject)
    .then((r: Response) => r.json() as Promise<JSONObject>)
    .then((r: JSONObject) => r?.result as JSONObject)
    .then((r: JSONObject) => r?.Booking as JSONObject[])
    .then((r: JSONObject[]) => r?.map(({ id, ...booking }) => humps.camelizeKeys(booking) as JSONObject))
    .then((r: JSONObject[]) => r ?? [])
    .then((r: JSONObject[]) => ({
      status: 200,
      body: r.map((r) => plainToInstance(BookingDTO, r, classTransformOptions)) as ResponseDTO
    }))
    .catch((e) => onFailure(e));
};
