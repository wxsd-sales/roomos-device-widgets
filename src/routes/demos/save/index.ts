import 'reflect-metadata';
import type { RequestEvent } from '@sveltejs/kit';
import { Expose, Transform, plainToInstance } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsUrl,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  validateSync
} from 'class-validator';
import { Data, Demo } from '../../../database/entities';
import { jsonRequest } from '$lib/shared/json-request';
import { classTransformOptions, classValidationOptions } from '../../.utils';
import env from '$lib/environment';
import { LoadStrategy } from '@mikro-orm/core';

/** @typedef {import('class-validator').ValidationError} ValidationError */

export const GET = async (requestEvent: RequestEvent) => {
  const demoId = requestEvent.url.searchParams.get('id');
  const db = requestEvent.locals.db;
  const session = requestEvent.locals.session;

  return demoId != null
    ? await db
        ?.findOneOrFail(
          Demo,
          { uuid: demoId, user: { uuid: session?.user?.uuid } },
          {
            fields: [
              'uuid',
              'name',
              'description',
              'backgroundBrightness',
              'backgroundPoster.bits',
              'backgroundPoster.name',
              'backgroundPoster.type',
              'backgroundPoster.lastModified',
              'brandTitle',
              'brandSubtitle',
              'brandLogo.bits',
              'brandLogo.name',
              'brandLogo.type',
              'brandLogo.lastModified',
              'buttonAText',
              'buttonALink',
              'buttonBText',
              'buttonBLink',
              'buttonCText',
              'buttonCLink',
              'guestInviteDestination',
              'newsUrl',
              'weatherUnits',
              'weatherCityId',
              'iframeUrl'
            ],
            strategy: LoadStrategy.JOINED
          }
        )
        .then((r) => ({
          status: 200,
          body: {
            name: r.name,
            description: r.description,
            poster: {
              bits: 'data:' + r.backgroundPoster.type + ';base64,' + r.backgroundPoster.bits.toString('base64'),
              name: r.backgroundPoster.name,
              lastModified: r.backgroundPoster.lastModified,
              type: r.backgroundPoster.type
            },
            brightness: r.backgroundBrightness,
            logo: {
              bits: 'data:' + r.brandLogo.type + ';base64,' + r.brandLogo.bits.toString('base64'),
              name: r.brandLogo.name,
              lastModified: r.brandLogo.lastModified,
              type: r.brandLogo.type
            },
            title: r.brandTitle,
            subtitle: r.brandSubtitle,
            aText: r.buttonAText,
            aLink: r.buttonALink,
            bText: r.buttonBText,
            bLink: r.buttonBLink,
            cText: r.buttonCText,
            cLink: r.buttonCLink,
            destination: r.guestInviteDestination,
            url: r.newsUrl,
            cityId: r.weatherCityId,
            units: r.weatherUnits,
            iframeUrl: r.iframeUrl
          }
        }))
        .catch(() => ({
          status: 200,
          body: { brightness: 55, title: 'Cisco', subtitle: 'Bridge to Possible', units: 'imperial', cityId: 4887398 }
        }))
    : {
        status: 200,
        body: { brightness: 55, title: 'Cisco', subtitle: 'Bridge to Possible', units: 'imperial', cityId: 4887398 }
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

    @Expose()
    @IsUrl()
    @MaxLength(2048)
    @ValidateIf(({ obj }) => obj?.iframeUrl)
    @Transform(({ obj }: { obj: FormData }) => obj.get('iframeUrl') || undefined, { toClassOnly: true })
    public readonly iframeUrl?: string;
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

  const db = requestEvent.locals.db;
  const session = requestEvent.locals.session;
  if (db && session?.uuid && session?.user?.uuid) {
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
      weatherUnits: formData.units,
      iframeUrl: formData.iframeUrl
    });
    await db.persistAndFlush(demo);

    return { status: 302, headers: { Location: '/demos' } };
  }

  return { status: 422 };
};

export const PATCH = async (requestEvent: RequestEvent) => {
  class RequestFormDataDTO {
    @Expose()
    @IsNotEmpty()
    @IsUUID(4)
    @Transform(({ obj }: { obj: FormData }) => obj.get('id'), { toClassOnly: true })
    public readonly id!: string;

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

    @Expose()
    @IsUrl()
    @MaxLength(2048)
    @ValidateIf(({ obj }) => obj?.iframeUrl)
    @Transform(({ obj }: { obj: FormData }) => obj.get('iframeUrl') || undefined, { toClassOnly: true })
    public readonly iframeUrl?: string;
  }

  const formData = plainToInstance(RequestFormDataDTO, await requestEvent.request.formData(), classTransformOptions);
  const formDataValidationErrors = validateSync(formData, classValidationOptions);
  if (formDataValidationErrors.length > 0) {
    console.log(formDataValidationErrors);
    return { status: 422, body: { form: 'Invalid submission.' }, headers: { Location: '/demos/create' } };
  }

  const isCityIdValid = await jsonRequest(env.OPENWEATHERMAP_API_URL)
    .get('weather', { appid: env.OPENWEATHERMAP_API_KEY, id: formData.cityId })
    .then(() => true)
    .catch(() => false);
  if (isCityIdValid === false) {
    return { status: 422, body: { form: 'Invalid submission.' }, headers: { Location: '/demos/create' } };
  }

  const db = requestEvent.locals.db;
  const session = requestEvent.locals.session;

  const demoId = formData.id;
  return demoId != null
    ? await db
        ?.findOneOrFail(
          Demo,
          { uuid: demoId, user: { uuid: session?.user?.uuid } },
          {
            fields: [
              'uuid',
              'name',
              'description',
              'backgroundBrightness',
              'backgroundPoster.bits',
              'backgroundPoster.name',
              'backgroundPoster.type',
              'backgroundPoster.lastModified',
              'brandTitle',
              'brandSubtitle',
              'brandLogo.bits',
              'brandLogo.name',
              'brandLogo.type',
              'brandLogo.lastModified',
              'buttonAText',
              'buttonALink',
              'buttonBText',
              'buttonBLink',
              'buttonCText',
              'buttonCLink',
              'guestInviteDestination',
              'newsUrl',
              'weatherUnits',
              'weatherCityId',
              'iframeUrl'
            ],
            strategy: LoadStrategy.JOINED
          }
        )
        .then(async (r) => {
          r.name = formData.name;
          r.description = formData.description;
          r.backgroundBrightness = formData.brightness;
          r.backgroundPoster.bits = Buffer.from(await formData.poster.arrayBuffer());
          r.backgroundPoster.type = formData.poster.type;
          r.backgroundPoster.name = formData.poster.name;
          r.backgroundPoster.lastModified = formData.poster.lastModified;
          r.brandTitle = formData.title;
          r.brandSubtitle = formData.subtitle;
          r.brandLogo.bits = Buffer.from(await formData.logo.arrayBuffer());
          r.brandLogo.type = formData.logo.type;
          r.brandLogo.name = formData.logo.name;
          r.brandLogo.lastModified = formData.logo.lastModified;
          r.buttonAText = formData.aText;
          r.buttonALink = formData.aLink;
          r.buttonBText = formData.bText;
          r.buttonBLink = formData.bLink;
          r.buttonCText = formData.cText;
          r.buttonCLink = formData.cLink;
          r.guestInviteDestination = formData.destination;
          r.newsUrl = formData.url;
          r.weatherCityId = formData.cityId;
          r.weatherUnits = formData.units;
          r.iframeUrl = formData.iframeUrl;
          await db.persistAndFlush(r);

          return { status: 302, headers: { Location: '/demos' } };
        })
        .catch(() => ({ status: 422 }))
    : { status: 422 };
};
