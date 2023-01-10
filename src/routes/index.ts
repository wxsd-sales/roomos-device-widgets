import 'reflect-metadata';
import type { RequestEvent } from '@sveltejs/kit';
import type { JSONObject } from '@sveltejs/kit/types/private';
import { Expose, plainToInstance } from 'class-transformer';
import { IsUUID, validateSync } from 'class-validator';
import { LoadStrategy, MikroORM } from '@mikro-orm/core';
import { User, Demo, Data, Activation } from '../database/entities';
import { classTransformOptions, classValidationOptions } from './.utils';
import config from '../../mikro-orm.config';

/** @typedef {import('class-validator').ValidationError} ValidationError */

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
    return { status: 302, headers: { Location: '/auth' } };
  }

  const orm = await MikroORM.init({ ...config, ...{ entities: [User, Demo] } });
  const em = orm.em.fork();

  return await em
    .findOne(Activation, query.activationId, {
      fields: [
        'demo.uuid',
        'demo.backgroundBrightness',
        'demo.backgroundPoster.bits',
        'demo.backgroundPoster.name',
        'demo.backgroundPoster.type',
        'demo.brandTitle',
        'demo.brandSubtitle',
        'demo.brandLogo.bits',
        'demo.brandLogo.name',
        'demo.brandLogo.type',
        'demo.weatherUnits',
        'demo.weatherCityId'
      ],
      strategy: LoadStrategy.JOINED
    })
    .then((r) => {
      if (r) {
        const { backgroundPoster, brandLogo, ...demoJson }: { backgroundPoster: Data; brandLogo: Data } = r.demo;
        (demoJson as JSONObject)['brandLogo'] =
          'data:' + brandLogo.type + ';base64,' + brandLogo.bits.toString('base64');
        (demoJson as JSONObject)['backgroundPoster'] =
          'data:' + backgroundPoster.type + ';base64,' + backgroundPoster.bits.toString('base64');

        return { status: 200 };
      }

      return { status: 404 };
    });
};
