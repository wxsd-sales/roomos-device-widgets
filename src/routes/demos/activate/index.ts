import 'reflect-metadata';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { Expose, Transform, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsUUID, Matches, validateSync } from 'class-validator';
import { VALID_ACCESS_TOKEN } from '$lib/constants';
import { Activation, Demo } from '../../../database/entities';
import { classTransformOptions, classValidationOptions } from '../../.utils';

/** @typedef {import('class-validator').ValidationError} ValidationError */

export const GET: RequestHandler = async (requestEvent: RequestEvent) => {
  return { status: 200, body: { orgId: requestEvent.locals?.session?.payload?.webex?.orgId } };
};

export const POST = async (requestEvent: RequestEvent) => {
  class RequestFormDataDTO {
    @Expose()
    @Matches(VALID_ACCESS_TOKEN)
    @Transform(({ obj }: { obj: FormData }) => obj.get('botToken'), { toClassOnly: true })
    public readonly botToken!: string;

    @Expose()
    @IsNotEmpty()
    @Transform(({ obj }: { obj: FormData }) => obj.get('deviceId'), { toClassOnly: true })
    public readonly deviceId!: string;

    @Expose()
    @IsNotEmpty()
    @IsUUID(4)
    @Transform(({ obj }: { obj: FormData }) => obj.get('demoUuid'), { toClassOnly: true })
    public readonly demoUuid!: string;
  }

  const formData = plainToInstance(RequestFormDataDTO, await requestEvent.request.formData(), classTransformOptions);
  const formDataValidationErrors = validateSync(formData, classValidationOptions);
  if (formDataValidationErrors.length > 0) {
    return { status: 422, body: { form: 'Invalid submission.' }, headers: { Location: '/demos/activate' } };
  }

  const db = requestEvent.locals.db;
  const session = requestEvent.locals.session;
  const demo = db?.getReference(Demo, formData.demoUuid);

  if (db && session?.uuid && session?.user?.uuid && demo?.uuid) {
    const activation = new Activation(formData.botToken, formData.deviceId, demo);
    await db.persistAndFlush(activation);

    return { status: 302, headers: { Location: '/demos/activate/done?activationId=' + activation.uuid } };
  }

  return { status: 422 };
};
