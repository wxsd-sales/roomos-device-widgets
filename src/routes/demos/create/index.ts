import 'reflect-metadata';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { Expose, Transform, plainToInstance } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  validateSync
} from 'class-validator';
import { MikroORM } from '@mikro-orm/core';
import { Data, User, Demo, Session } from '../../../database/entities';
import { jsonRequest } from '$lib/shared/json-request';
import { classTransformOptions, classValidationOptions } from '../../.utils';
import config from '../../../../mikro-orm.config';
import env from '$lib/environment';

/** @typedef {import('class-validator').ValidationError} ValidationError */

export const GET: RequestHandler = async (requestEvent: RequestEvent) => {
  return {
    status: 200,
    body: {
      brightness: 55,
      title: 'Cisco',
      subtitle: 'Bridge to Possible',
      units: 'imperial',
      cityId: 4887398
    }
  };
};

export const POST = async (requestEvent: RequestEvent) => {
  class RequestFormDataDTO {
    @Expose()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(64)
    @Transform(({ obj }: { obj: FormData }) => obj.get('name'), { toClassOnly: true })
    public readonly name!: string;

    @Expose()
    @MaxLength(256)
    @ValidateIf(({ obj }) => obj?.description)
    @Transform(({ obj }: { obj: FormData }) => obj.get('description'), { toClassOnly: true })
    public readonly description?: string;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('poster'), { toClassOnly: true })
    public readonly poster!: File;

    @Expose()
    @IsInt()
    @Min(0)
    @Max(100)
    @Transform(({ obj }: { obj: FormData }) => Number(obj.get('brightness')), { toClassOnly: true })
    public readonly brightness!: number;

    @Expose()
    @Transform(({ obj }: { obj: FormData }) => obj.get('logo'), { toClassOnly: true })
    public readonly logo!: File;

    @Expose()
    @IsNotEmpty()
    @MaxLength(16)
    @Transform(({ obj }: { obj: FormData }) => obj.get('title'), { toClassOnly: true })
    public readonly title!: string;

    @Expose()
    @IsNotEmpty()
    @MaxLength(64)
    @Transform(({ obj }: { obj: FormData }) => obj.get('subtitle'), { toClassOnly: true })
    public readonly subtitle!: string;

    @Expose()
    @MaxLength(24)
    @ValidateIf(({ obj }) => obj?.aText || obj?.aLink)
    @Transform(({ obj }: { obj: FormData }) => obj.get('aText') || undefined, { toClassOnly: true })
    public readonly aText?: string;

    @Expose()
    @IsUrl()
    @MaxLength(1024)
    @ValidateIf(({ obj }) => obj?.aLink || obj?.aText)
    @Transform(({ obj }: { obj: FormData }) => obj.get('aLink') || undefined, { toClassOnly: true })
    public readonly aLink?: string;

    @Expose()
    @MaxLength(24)
    @ValidateIf(({ obj }) => obj?.bText || obj?.bLink)
    @Transform(({ obj }: { obj: FormData }) => obj.get('bText') || undefined, { toClassOnly: true })
    public readonly bText?: string;

    @Expose()
    @IsUrl()
    @MaxLength(1024)
    @ValidateIf(({ obj }) => obj?.bLink || obj?.bText)
    @Transform(({ obj }: { obj: FormData }) => obj.get('bLink') || undefined, { toClassOnly: true })
    public readonly bLink?: string;

    @Expose()
    @MaxLength(24)
    @ValidateIf(({ obj }) => obj?.cText || obj?.cLink)
    @Transform(({ obj }: { obj: FormData }) => obj.get('cText') || undefined, { toClassOnly: true })
    public readonly cText?: string;

    @Expose()
    @IsUrl()
    @MaxLength(1024)
    @ValidateIf(({ obj }) => obj?.cLink || obj?.cText)
    @Transform(({ obj }: { obj: FormData }) => obj.get('cLink') || undefined, { toClassOnly: true })
    public readonly cLink?: string;

    @Expose()
    @IsEmail()
    @ValidateIf(({ obj }) => obj?.destination)
    @Transform(({ obj }: { obj: FormData }) => obj.get('destination') || undefined, { toClassOnly: true })
    public readonly destination?: string;

    @Expose()
    @IsUrl()
    @Matches(/^https:\/\/news\.google\.com\/rss\/search\?q=.+$/)
    @MaxLength(256)
    @ValidateIf(({ obj }) => obj?.url)
    @Transform(({ obj }: { obj: FormData }) => obj.get('url') || undefined, { toClassOnly: true })
    public readonly url?: string;

    @Expose()
    @IsIn(['imperial', 'metric', 'standard'])
    @Transform(({ obj }: { obj: FormData }) => obj.get('units'), { toClassOnly: true })
    public readonly units!: 'imperial' | 'metric' | 'standard';

    @Expose()
    @IsInt()
    @Transform(({ obj }: { obj: FormData }) => Number(obj.get('cityId')), { toClassOnly: true })
    public readonly cityId!: number;
  }

  const formData = plainToInstance(RequestFormDataDTO, await requestEvent.request.formData(), classTransformOptions);
  const formDataValidationErrors = validateSync(formData, classValidationOptions);
  if (formDataValidationErrors.length > 0) {
    return { status: 422, body: { form: 'Invalid submission.' }, headers: { Location: '/demos/create' } };
  }

  const isCityIdValid = await jsonRequest(env.OPENWEATHERMAP_API_URL)
    .get('weather', { appid: env.OPENWEATHERMAP_API_KEY, id: formData.cityId })
    .then(() => true)
    .catch(() => false);
  if (isCityIdValid === false) {
    return { status: 422, body: { form: 'Invalid submission.' }, headers: { Location: '/demos/create' } };
  }

  const orm = await MikroORM.init({ ...config, ...{ entities: [User, Demo, Session] } });
  const em = orm.em.fork();
  const session = requestEvent.locals.session;
  if (session?.uuid && session?.user?.uuid) {
    const demo = new Demo({
      user: session.user,
      name: formData.name,
      description: formData?.description,
      backgroundBrightness: formData.brightness,
      backgroundPoster: new Data({
        bits: Buffer.from(await formData.poster.arrayBuffer()),
        type: formData.poster.type,
        name: formData.poster.name,
        lastModified: formData.poster.lastModified
      }),
      brandLogo: new Data({
        bits: Buffer.from(await formData.logo.arrayBuffer()),
        type: formData.logo.type,
        name: formData.logo.name,
        lastModified: formData.logo.lastModified
      }),
      brandSubtitle: formData.subtitle,
      brandTitle: formData.title,
      buttonAText: formData.aText,
      buttonALink: formData.aLink,
      buttonBText: formData.bText,
      buttonBLink: formData.bLink,
      buttonCText: formData.cText,
      buttonCLink: formData.cLink,
      guestInviteDestination: formData.destination,
      newsUrl: formData.url,
      weatherCityId: formData.cityId,
      weatherUnits: formData.units
    });
    await em.persistAndFlush(demo);

    return { status: 302, headers: { Location: '/demos' } };
  }

  return { status: 422 };
};
