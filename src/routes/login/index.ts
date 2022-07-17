import 'reflect-metadata';
import type { RequestEvent } from '@sveltejs/kit';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import { Equals, IsEmail, IsNotEmpty, validateSync } from 'class-validator';
import { MikroORM } from '@mikro-orm/core';
import { Session, User } from '../../database/entities';
import { dev, prerendering } from '$app/env';
import { classTransformOptions, classValidationOptions } from '../.utils';
import config from '../../../mikro-orm.config';
import env from '$lib/environment';
import * as cookie from 'cookie';

/** @typedef {import('class-validator').ValidationError} ValidationError */

export const GET = async (requestEvent: RequestEvent) => {
  if (requestEvent.locals.session?.user?.uuid) {
    return { status: 302, headers: { Location: '/demos' } };
  }

  return { status: 200 };
};

export const POST = async (requestEvent: RequestEvent) => {
  class RequestFormDataDTO {
    @Expose()
    @IsEmail()
    @Equals(env.APP_PREVIEW_EMAIL)
    @Transform(({ obj }: { obj: FormData }) => obj.get('email'), { toClassOnly: true })
    public readonly email!: string;

    @Expose()
    @IsNotEmpty()
    @Equals(env.APP_PREVIEW_PASSWORD)
    @Transform(({ obj }: { obj: FormData }) => obj.get('password'), { toClassOnly: true })
    public readonly password!: string;
  }

  const formData = plainToInstance(RequestFormDataDTO, await requestEvent.request.formData(), classTransformOptions);
  const formDataValidationErrors = validateSync(formData, classValidationOptions);
  if (formDataValidationErrors.length > 0) {
    return { status: 422, body: { form: 'Invalid email and/or password.' }, headers: { Location: '/login' } };
  }

  const orm = await MikroORM.init({ ...config, ...{ entities: [User, Session] } });
  const em = orm.em.fork();

  const user = await em.findOne(User, { email: formData.email });

  const session = new Session({
    user: user ?? new User(formData.email),
    ipAddress: prerendering || dev ? 'UNKNOWN' : requestEvent.clientAddress,
    userAgent: requestEvent.request.headers.get('User-Agent') || undefined,
    lastActivityAt: Date.now()
  });
  const sessionCookie = cookie.serialize('sessionId', session.uuid, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'strict'
  });
  await em.persistAndFlush(session);

  return {
    status: 302,
    headers: { 'Location': '/demos', 'Set-Cookie': sessionCookie }
  };
};
