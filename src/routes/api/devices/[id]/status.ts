import 'reflect-metadata';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import type { JSONObject, JSONValue, ToJSON } from '@sveltejs/kit/types/private';
import { Expose, instanceToPlain, plainToInstance, Transform, Type } from 'class-transformer';
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
    @Transform(({ obj }) => obj?.authorization.toString().replace(/^Bearer /i, ''))
    public readonly authorization!: string;
  }

  class RoomAnalyticsDTO implements ToJSON {
    private static exp = /^\s*(true|on)\s*$/i;

    @Expose()
    @Transform(({ obj }) => (obj?.ambientNoise?.level?.a != null ? Number(obj.ambientNoise.level.a) : undefined), {
      toClassOnly: true
    })
    public readonly ambientNoiseLevelA?: number;

    @Expose()
    @Transform(({ obj }) => (obj?.ambientTemperature != null ? Number(obj.ambientTemperature) : undefined), {
      toClassOnly: true
    })
    public readonly ambientTemperature?: number;

    @Expose()
    @Transform(({ obj }) => (obj?.airQuality?.index != null ? Number(obj.airQuality.index) : undefined), {
      toClassOnly: true
    })
    public readonly airQualityIndex?: number;

    @Expose()
    @Transform(({ obj }) => obj?.peopleCount?.capacity, { toClassOnly: true })
    public readonly peopleCountCapacity?: number;

    @Expose()
    @Transform(({ obj }) => obj?.peopleCount?.current, { toClassOnly: true })
    public readonly peopleCountCurrent?: number;

    @Expose()
    @Transform(({ obj }) => obj?.sound?.level?.a, { toClassOnly: true })
    public readonly soundLevelA?: number;

    @Expose()
    @Transform(({ obj }) => (obj?.relativeHumidity != null ? Number(obj.relativeHumidity) : undefined), {
      toClassOnly: true
    })
    public readonly relativeHumidity?: number;

    @Expose()
    @Transform(({ obj }) => (obj?.peoplePresence != null ? RoomAnalyticsDTO.exp.test(obj.peoplePresence) : undefined), {
      toClassOnly: true
    })
    public readonly peoplePresence?: boolean;

    @Expose()
    @Transform(
      ({ obj }) => (obj?.t3Alarm?.detected != null ? RoomAnalyticsDTO.exp.test(obj.t3Alarm.detected) : undefined),
      { toClassOnly: true }
    )
    public readonly t3AlarmDetected?: boolean;

    @Expose()
    @Transform(
      ({ obj }) =>
        obj?.engagement?.closeProximity != null ? RoomAnalyticsDTO.exp.test(obj.engagement.closeProximity) : undefined,
      { toClassOnly: true }
    )
    public readonly engagementCloseProximity?: boolean;

    toJSON(): Exclude<JSONValue, ToJSON> {
      return instanceToPlain(this);
    }
  }

  class PeripheralDTO {
    @Expose()
    public readonly id!: number;

    @Expose()
    public readonly status!: number;

    @Expose()
    @Type(() => RoomAnalyticsDTO)
    public readonly roomAnalytics?: RoomAnalyticsDTO;

    @Expose()
    public readonly networkAddress?: string;

    @Expose()
    public readonly softwareInfo?: string;

    @Expose()
    public readonly hardwareInfo?: string;

    @Expose()
    public readonly serialNumber?: string;

    @Expose()
    public readonly type?:
      | 'AudioAmplifier'
      | 'AudioMicrophone'
      | 'Byod'
      | 'Camera'
      | 'ControlSystem'
      | 'InputDevice'
      | 'ISDNLink'
      | 'Other'
      | 'SpeakerTracker'
      | 'TouchPanel'
      | 'Headset'
      | 'RoomScheduler'
      | 'PersistentWebApp';

    @Expose()
    public readonly name?: string;

    @Expose()
    public readonly location?: 'OutsideRoom' | 'InsideRoom';
  }

  class CallDTO implements ToJSON {
    @Expose()
    public readonly id!: number;

    @Expose()
    @Transform(
      ({ obj }) =>
        obj.duration > 0
          ? Date.parse(requestEvent.request.headers.get('date') ?? new Date().toUTCString()) - obj.duration * 1000
          : undefined,
      { toClassOnly: true }
    )
    public readonly connectedAt!: number;

    @Expose()
    public readonly callbackNumber!: string;

    @Expose()
    public readonly status!:
      | 'Connected'
      | 'Connecting'
      | 'Dialling'
      | 'Disconnecting'
      | 'EarlyMedia'
      | 'Idle'
      | 'OnHold'
      | 'Preserved'
      | 'RemotePreserved'
      | 'Ringing';

    @Expose()
    public readonly remoteNumber!: string;

    @Expose()
    public readonly displayName!: string;

    @Expose()
    public readonly callType!: 'Audio' | 'AudioCanEscalate' | 'ForwardAllCall' | 'Unknown' | 'Video';

    @Expose()
    public readonly direction!: 'Incoming' | 'Outgoing';

    @Expose()
    public readonly answerState!: 'Answered' | 'Autoanswered' | 'Ignored' | 'Unanswered';

    @Expose()
    public readonly protocol!: 'Unknown' | 'H320' | 'H323' | 'SIP' | 'Spark' | 'WebRTC';

    @Expose()
    public readonly capabilities!: JSONObject;

    @Expose()
    @Transform(({ value }) => (value === '' ? undefined : value), { toClassOnly: true })
    public readonly bookingId?: string;

    toJSON(): Exclude<JSONValue, ToJSON> {
      return instanceToPlain(this);
    }
  }

  type ResponseDTO = { roomAnalytics: RoomAnalyticsDTO; peripherals?: PeripheralDTO[]; calls?: CallDTO[] };

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

  const mergeById = (i: JSONObject[], j: JSONObject[]) =>
    i?.map((ix) => ({
      ...j?.find((jx) => jx.id === ix.id && jx),
      ...ix
    }));

  const status = webexHttp(header.authorization, 'xapi')
    .get('status', { deviceId: params.id, name: '*' })
    .then((r) => r.json() as Promise<JSONObject>)
    .then((r) => r.result as JSONObject)
    .then((r) => ({
      roomAnalytics: r?.RoomAnalytics as JSONObject,
      calls: mergeById(r?.Call as JSONObject[], (r?.Conference as JSONObject)?.Call as JSONObject[]),
      peripherals: (r?.Peripherals as JSONObject)?.ConnectedDevice as JSONObject[]
    }))
    .then((r) => humps.camelizeKeys(r) as JSONObject);

  const roomAnalyticsStatus = status
    .then((r) => r?.roomAnalytics as JSONObject)
    .then((r) => plainToInstance(RoomAnalyticsDTO, r, classTransformOptions));
  const peripheralsStatus = status
    .then((r) => r?.peripherals as JSONObject[])
    .then((r) => r?.map((r) => plainToInstance(PeripheralDTO, r, classTransformOptions)));
  const callsStatus = status
    .then((r) => r.calls as JSONObject[])
    .then((r) => r?.map((r) => plainToInstance(CallDTO, r, classTransformOptions)));

  return Promise.all([roomAnalyticsStatus, peripheralsStatus, callsStatus])
    .then(([r, s, t]) => ({ roomAnalytics: r, peripherals: s, calls: t }))
    .then((r) => ({ status: 200, body: r as ResponseDTO }))
    .catch((e) => onFailure(e));
};
