import 'reflect-metadata';
import type { RequestEvent } from '@sveltejs/kit';
import { Expose, plainToInstance } from 'class-transformer';
import { IsUUID, validateSync } from 'class-validator';
import { LoadStrategy, MikroORM } from '@mikro-orm/core';
import { User, Demo, Activation } from '../../../../database/entities';
import config from '../../../../../mikro-orm.config';

/** @typedef {import('class-validator').ValidationError} ValidationError */

const classTransformOptions = { excludeExtraneousValues: true };
const classValidationOptions = { validationError: { target: false } };

export const GET = async (requestEvent: RequestEvent) => {
  class RequestQueryDTO {
    @Expose()
    @IsUUID(4)
    public readonly activationId!: string;
  }

  const searchParams = Object.fromEntries(requestEvent.url.searchParams);
  const query = plainToInstance(RequestQueryDTO, searchParams, classTransformOptions);
  const queryValidationErrors = validateSync(query, classValidationOptions);
  if (queryValidationErrors.length > 0) {
    return { status: 422 };
  }

  const orm = await MikroORM.init({ ...config, ...{ entities: [User, Demo, Activation] } });
  const em = orm.em.fork();

  return await em
    .findOne(Activation, query.activationId, {
      fields: ['uuid', 'botToken', 'deviceId', 'demo.uuid', 'demo.name', 'demo.user.uuid'],
      strategy: LoadStrategy.JOINED
    })
    .then((r) => {
      if (r && r.demo.user.uuid === requestEvent.locals.session?.user?.uuid) {
        const activation = { id: r.uuid, botToken: r.botToken, deviceId: r.deviceId, demoId: r.demo.uuid };

        return { status: 200, body: { activation } };
      }

      return { status: 404 };
    });
};
