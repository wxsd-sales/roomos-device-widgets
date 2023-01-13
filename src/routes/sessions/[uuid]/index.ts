import type { RequestEvent } from '@sveltejs/kit';
import type { JSONObject } from '@sveltejs/kit/types/private';
import { Expose, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsUUID, validateSync } from 'class-validator';
import { LoadStrategy, MikroORM } from '@mikro-orm/core';
import { classTransformOptions, classValidationOptions } from '../../.utils';
import { User, Demo, Data } from '../../../database/entities';
import config from '../../../../mikro-orm.config';

export const GET = async (requestEvent: RequestEvent) => {
  class RequestQueryDTO {
    @Expose()
    @IsUUID(4)
    public readonly uuid!: string;

    @Expose()
    @IsNotEmpty()
    public readonly role!: 'responder' | 'requester';
  }

  const searchParams = Object.fromEntries(requestEvent.url.searchParams);
  const query = plainToInstance(RequestQueryDTO, { ...requestEvent.params, ...searchParams }, classTransformOptions);
  const queryValidationErrors = validateSync(query, classValidationOptions);
  if (queryValidationErrors.length > 0) {
    return { status: 302, headers: { Location: `/auth` } };
  }

  const orm = await MikroORM.init({ ...config, ...{ entities: [User, Demo] } });
  const em = orm.em.fork();

  return await em
    .findOne(
      Demo,
      { uuid: query.uuid },
      {
        fields: [
          'uuid',
          'backgroundBrightness',
          'backgroundPoster.bits',
          'backgroundPoster.name',
          'backgroundPoster.type',
          'brandTitle',
          'brandSubtitle',
          'brandLogo.bits',
          'brandLogo.name',
          'brandLogo.type',
          'weatherUnits',
          'weatherCityId',
          'responderAuthIsRequired',
          'meetingTypeOptions'
        ],
        strategy: LoadStrategy.JOINED
      }
    )
    .then((r) => {
      if (r) {
        const { backgroundPoster, brandLogo, ...demo }: { backgroundPoster: Data; brandLogo: Data } = r;
        (demo as JSONObject)['brandLogo'] = 'data:' + brandLogo.type + ';base64,' + brandLogo.bits.toString('base64');
        (demo as JSONObject)['backgroundPoster'] =
          'data:' + backgroundPoster.type + ';base64,' + backgroundPoster.bits.toString('base64');

        (demo as JSONObject)['responderAuthIsRequired'] = demo.responderAuthIsRequired === 1;
        return { status: 200, body: { demo, role: query.role } };
      }

      return { status: 404 };
    });
};
