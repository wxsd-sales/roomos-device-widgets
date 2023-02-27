import 'reflect-metadata';
import type { RequestEvent } from '@sveltejs/kit';
import { Expose, Transform, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsUUID, Matches, ValidateIf, validateSync } from 'class-validator';
import { VALID_ACCESS_TOKEN } from '$lib/constants';
import { Activation, Demo } from '../../../database/entities';
import { classTransformOptions, classValidationOptions } from '../../.utils';
import { LoadStrategy } from '@mikro-orm/core';

/** @typedef {import('class-validator').ValidationError} ValidationError */

export const GET = async (requestEvent: RequestEvent) => {
  const activationId = requestEvent.url.searchParams.get('id');
  const db = requestEvent.locals.db;
  const session = requestEvent.locals.session;

  return activationId != null
    ? await db
        ?.findOneOrFail(
          Activation,
          { uuid: activationId, demo: { user: { uuid: session?.user?.uuid } } },
          {
            fields: [
              'uuid',
              'demo.uuid',
              'demo.user.uuid',
              'botToken',
              'deviceId',
              'googleClientEmail',
              'googlePrivateKey',
              'googleClientCertificate',
              'microsoftTenantId',
              'microsoftClientId',
              'microsoftPrivateKey',
              'microsoftClientCertificate'
            ],
            strategy: LoadStrategy.JOINED
          }
        )
        .then((r) => ({
          status: 200,
          body: {
            demoUuid: r.demo.uuid,
            botToken: r.botToken,
            deviceId: r.deviceId,
            google: {
              clientEmail: r.googleClientEmail,
              privateKey: r.googlePrivateKey,
              clientCertificate: r.googleClientCertificate
            },
            microsoft: {
              tenantId: r.microsoftTenantId,
              clientId: r.microsoftClientId,
              privateKey: r.microsoftPrivateKey,
              clientCertificate: r.microsoftClientCertificate
            },
            orgId: requestEvent.locals?.session?.payload?.webex?.orgId
          }
        }))
    : { status: 200, body: { orgId: requestEvent.locals?.session?.payload?.webex?.orgId } };
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

    @Expose()
    @ValidateIf(({ obj }) => obj?.googlePrivateKey ?? obj?.googleClientCertificate)
    @IsNotEmpty()
    @Transform(({ obj }: { obj: FormData }) => obj.get('googleClientEmail') || undefined, { toClassOnly: true })
    public readonly googleClientEmail?: string;

    @Expose()
    @ValidateIf(({ obj }) => obj?.googleClientEmail ?? obj?.googleClientCertificate)
    @IsNotEmpty()
    @Transform(({ obj }: { obj: FormData }) => obj.get('googlePrivateKey') || undefined, { toClassOnly: true })
    public readonly googlePrivateKey?: string;

    @Expose()
    @ValidateIf(({ obj }) => obj?.googleClientEmail ?? obj?.googlePrivateKey)
    @IsNotEmpty()
    @Transform(({ obj }: { obj: FormData }) => obj.get('googleClientCertificate') || undefined, { toClassOnly: true })
    public readonly googleClientCertificate?: string;

    @Expose()
    @ValidateIf(({ obj }) => obj?.microsoftClientId ?? obj?.microsoftPrivateKey ?? obj?.microsoftClientCertificate)
    @IsNotEmpty()
    @Transform(({ obj }: { obj: FormData }) => obj.get('microsoftTenantId') || undefined, { toClassOnly: true })
    public readonly microsoftTenantId?: string;

    @Expose()
    @ValidateIf(({ obj }) => obj?.microsoftTenantId ?? obj?.microsoftPrivateKey ?? obj?.microsoftClientCertificate)
    @IsNotEmpty()
    @Transform(({ obj }: { obj: FormData }) => obj.get('microsoftClientId') || undefined, { toClassOnly: true })
    public readonly microsoftClientId?: string;

    @Expose()
    @ValidateIf(({ obj }) => obj?.microsoftTenantId ?? obj?.microsoftClientId ?? obj?.microsoftClientCertificate)
    @IsNotEmpty()
    @Transform(({ obj }: { obj: FormData }) => obj.get('microsoftPrivateKey') || undefined, { toClassOnly: true })
    public readonly microsoftPrivateKey?: string;

    @Expose()
    @ValidateIf(({ obj }) => obj?.microsoftTenantId ?? obj?.microsoftClientId ?? obj?.microsoftPrivateKey)
    @IsNotEmpty()
    @Transform(({ obj }: { obj: FormData }) => obj.get('microsoftClientCertificate') || undefined, {
      toClassOnly: true
    })
    public readonly microsoftClientCertificate?: string;
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
    const activation = new Activation({
      botToken: formData.botToken,
      deviceId: formData.deviceId,
      demo: demo,
      googleClientEmail: formData.googleClientEmail,
      googlePrivateKey: formData.googlePrivateKey,
      googleClientCertificate: formData.googleClientCertificate,
      microsoftTenantId: formData.microsoftTenantId,
      microsoftClientId: formData.microsoftClientId,
      microsoftPrivateKey: formData.microsoftPrivateKey,
      microsoftClientCertificate: formData.microsoftClientCertificate
    });
    await db.persistAndFlush(activation);

    return { status: 302, headers: { Location: '/demos/activate/done?activationId=' + activation.uuid } };
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

    @Expose()
    @ValidateIf(({ obj }) => obj?.googlePrivateKey ?? obj?.googleClientCertificate)
    @IsNotEmpty()
    @Transform(({ obj }: { obj: FormData }) => obj.get('googleClientEmail') || undefined, { toClassOnly: true })
    public readonly googleClientEmail?: string;

    @Expose()
    @ValidateIf(({ obj }) => obj?.googleClientEmail ?? obj?.googleClientCertificate)
    @IsNotEmpty()
    @Transform(({ obj }: { obj: FormData }) => obj.get('googlePrivateKey') || undefined, { toClassOnly: true })
    public readonly googlePrivateKey?: string;

    @Expose()
    @ValidateIf(({ obj }) => obj?.googleClientEmail ?? obj?.googlePrivateKey)
    @IsNotEmpty()
    @Transform(({ obj }: { obj: FormData }) => obj.get('googleClientCertificate') || undefined, { toClassOnly: true })
    public readonly googleClientCertificate?: string;

    @Expose()
    @ValidateIf(({ obj }) => obj?.microsoftClientId ?? obj?.microsoftPrivateKey ?? obj?.microsoftClientCertificate)
    @IsNotEmpty()
    @Transform(({ obj }: { obj: FormData }) => obj.get('microsoftTenantId') || undefined, { toClassOnly: true })
    public readonly microsoftTenantId?: string;

    @Expose()
    @ValidateIf(({ obj }) => obj?.microsoftTenantId ?? obj?.microsoftPrivateKey ?? obj?.microsoftClientCertificate)
    @IsNotEmpty()
    @Transform(({ obj }: { obj: FormData }) => obj.get('microsoftClientId') || undefined, { toClassOnly: true })
    public readonly microsoftClientId?: string;

    @Expose()
    @ValidateIf(({ obj }) => obj?.microsoftTenantId ?? obj?.microsoftClientId ?? obj?.microsoftClientCertificate)
    @IsNotEmpty()
    @Transform(({ obj }: { obj: FormData }) => obj.get('microsoftPrivateKey') || undefined, { toClassOnly: true })
    public readonly microsoftPrivateKey?: string;

    @Expose()
    @ValidateIf(({ obj }) => obj?.microsoftTenantId ?? obj?.microsoftClientId ?? obj?.microsoftPrivateKey)
    @IsNotEmpty()
    @Transform(({ obj }: { obj: FormData }) => obj.get('microsoftClientCertificate') || undefined, {
      toClassOnly: true
    })
    public readonly microsoftClientCertificate?: string;
  }

  const formData = plainToInstance(RequestFormDataDTO, await requestEvent.request.formData(), classTransformOptions);
  const formDataValidationErrors = validateSync(formData, classValidationOptions);
  if (formDataValidationErrors.length > 0) {
    return { status: 422, body: { form: 'Invalid submission.' }, headers: { Location: '/demos/activate' } };
  }

  const db = requestEvent.locals.db;
  const session = requestEvent.locals.session;

  const activationId = formData.id;
  return activationId != null
    ? await db
        ?.findOneOrFail(
          Activation,
          { uuid: activationId, demo: { user: { uuid: session?.user?.uuid } } },
          {
            fields: [
              'uuid',
              'demo.uuid',
              'demo.user.uuid',
              'botToken',
              'deviceId',
              'googleClientEmail',
              'googlePrivateKey',
              'googleClientCertificate',
              'microsoftTenantId',
              'microsoftClientId',
              'microsoftPrivateKey',
              'microsoftClientCertificate'
            ],
            strategy: LoadStrategy.JOINED
          }
        )
        .then(async (r) => {
          r.botToken = formData.botToken;
          r.deviceId = formData.deviceId;
          r.demo = db?.getReference(Demo, formData.demoUuid);
          r.googleClientEmail = formData.googleClientEmail;
          r.googlePrivateKey = formData.googlePrivateKey;
          r.googleClientCertificate = formData.googleClientCertificate;
          r.microsoftTenantId = formData.microsoftTenantId;
          r.microsoftClientId = formData.microsoftClientId;
          r.microsoftPrivateKey = formData.microsoftPrivateKey;
          r.microsoftClientCertificate = formData.microsoftClientCertificate;
          await db.persistAndFlush(r);

          return { status: 302, headers: { Location: '/demos/activate/done?activationId=' + activationId } };
        })
        .catch(() => ({ status: 422 }))
    : { status: 422 };
};
