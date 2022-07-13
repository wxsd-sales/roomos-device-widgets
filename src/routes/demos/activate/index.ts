import 'reflect-metadata';
import type { RequestEvent } from '@sveltejs/kit';
import { Expose, Transform, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsUUID, Matches, validateSync } from 'class-validator';
import { VALID_ACCESS_TOKEN } from '$lib/constants';
import { MikroORM } from '@mikro-orm/core';
import { Activation, Demo, Session, User } from '../../../database/entities';
import { classTransformOptions, classValidationOptions } from '../../.utils';
import config from '../../../../mikro-orm.config';

/** @typedef {import('class-validator').ValidationError} ValidationError */

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

  const orm = await MikroORM.init({ ...config, ...{ entities: [User, Demo, Activation, Session] } });
  const em = orm.em.fork();
  const session = requestEvent.locals.session;
  const demo = em.getReference(Demo, formData.demoUuid);

  if (session?.uuid && session?.user?.uuid && demo?.uuid) {
    const activation = new Activation(formData.botToken, formData.deviceId, demo);
    em.persistAndFlush(activation);

    return { status: 302, headers: { Location: '/demos/activate/done?activationId=' + activation.uuid } };
  }

  return { status: 422 };
};
