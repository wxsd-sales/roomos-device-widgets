import 'reflect-metadata';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import type { JSONObject, JSONValue, ToJSON } from '@sveltejs/kit/types/private';
import { urlEncodedRequest } from '$lib/shared/urlencoded-request';
import { Expose, instanceToPlain, plainToInstance, Transform } from 'class-transformer';
import { IsJWT, IsNotEmpty, IsUUID, Matches, validateSync } from 'class-validator';
import { classTransformOptions, classValidationOptions } from '../../../.utils';
import { VALID_ACCESS_TOKEN } from '$lib/constants';
import { webexHttpPeopleResource } from '$lib/webex/http-wrapper';
import { MikroORM } from '@mikro-orm/core';
import { Activation } from '../../../../database/entities';
import config from '../../../../../mikro-orm.config';
import humps from 'humps';
import env from '$lib/environment';
import * as jose from 'jose';
import { base } from '$app/paths';

/** @typedef {import('class-validator').ValidationError} ValidationError */

const onFailure = async (e: Response | Error) => {
  if (e instanceof Response && e.status !== 401) {
    return e.status === 428
      ? { status: e.status, body: await e.json(), headers: { 'Skip-Reporting': true } }
      : { status: e.status, body: await e.json() };
  } else {
    console.log(e);
    return { status: 500 };
  }
};

/**
 * @param {RequestEvent} requestEvent
 *
 * @returns {Promise<
 *   | { body: { query: ValidationError[] }; status: 400 }
 *   | { body: ResponseDTO; status: 200 }
 *   | { body: any; status: number }
 *   | { status: 500 }
 * >}
 */
export const POST = async (requestEvent: RequestEvent) => {
  class RequestQueryDTO {
    @Expose()
    @IsNotEmpty()
    @IsUUID(4)
    public readonly activationId!: string;
  }

  class RequestHeaderDTO {
    @Expose()
    @IsNotEmpty()
    @Transform(({ obj }) => obj?.authorization?.toString()?.replace(/^Bearer /i, ''))
    public readonly authorization!: string;
  }

  class ResponseDTO implements ToJSON {
    @Expose()
    @Transform(({ obj, value }) => value ?? obj.expires_in, { toClassOnly: true })
    public readonly expiresIn!: number;

    @Expose()
    @Transform(({ value }) => new Date(value).toUTCString(), { toPlainOnly: true })
    public readonly expiresAt?: string;

    @Expose()
    @Transform(({ obj, value }) => value ?? obj.token_type, { toClassOnly: true })
    public readonly tokenType!: string;

    @Expose()
    @Transform(({ obj, value }) => value ?? obj.access_token, { toClassOnly: true })
    public readonly accessToken!: string;

    toJSON(): Exclude<JSONValue, ToJSON> {
      return instanceToPlain(this);
    }
  }

  // validate request query
  const searchParams = Object.fromEntries(requestEvent.url.searchParams);
  const query = plainToInstance(RequestQueryDTO, searchParams, classTransformOptions);
  const queryValidationErrors = validateSync(query, classValidationOptions);
  if (queryValidationErrors.length > 0) {
    return { status: 400, body: { query: queryValidationErrors } };
  }

  // validate request header
  const obj = humps.camelizeKeys(Object.fromEntries(requestEvent.request.headers.entries()));
  const header = plainToInstance(RequestHeaderDTO, obj, classTransformOptions);
  const headerValidationErrors = validateSync(header, classValidationOptions);
  if (headerValidationErrors.length > 0) {
    return { status: 401 };
  }

  const orm = await MikroORM.init({ ...config, ...{ entities: [Activation] } });
  const em = orm.em.fork();

  const subject = webexHttpPeopleResource(header.authorization)
    .getMyOwnDetails()
    .then((r) => r.json())
    .then((r) => r.emails[0]);

  const account = em.findOneOrFail(Activation, query.activationId, {
    fields: ['microsoftTenantId', 'microsoftClientId', 'microsoftPrivateKey', 'microsoftClientCertificate']
  });

  const formJwt = (audience: string, subject: string, issuer: string, pkcs8: string, x509: string, expiry = '1h') => {
    const alg = 'RS256';
    const data = x509
      .replaceAll('\n', '')
      ?.match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm)
      ?.join('');
    const sha1 = crypto.subtle.digest('SHA-1', Buffer.from(data as string, 'base64'));
    const hex = sha1.then((r) => Buffer.from(r).toString('hex'));
    const x5t = hex.then((r) => Buffer.from(r, 'hex').toString('base64url'));

    return Promise.all([x5t, jose.importPKCS8(pkcs8, alg)]).then(([r1, r2]) =>
      new jose.SignJWT({})
        .setProtectedHeader({ alg, x5t: r1 })
        .setIssuer(issuer)
        .setAudience(audience)
        .setSubject(subject)
        .setIssuedAt()
        .setExpirationTime(expiry)
        .sign(r2)
    );
  };

  const addExpiresAt = (obj: JSONObject, date: number = Date.now()) => ({
    ...obj,
    ...{ expiresAt: date + (obj.expiresIn as number) * 1000 }
  });

  return Promise.all([subject, account])
    .then(([, r2]) =>
      formJwt(
        env.MICROSOFT_OAUTH_URL + `/${r2.microsoftTenantId}/` + env.MICROSOFT_OAUTH_TOKEN_ENDPOINT,
        r2.microsoftClientId as string,
        r2.microsoftClientId as string,
        r2.microsoftPrivateKey as string,
        r2.microsoftClientCertificate as string
      ).then((r) =>
        urlEncodedRequest(env.MICROSOFT_OAUTH_URL).post(
          r2.microsoftTenantId + '/' + env.MICROSOFT_OAUTH_TOKEN_ENDPOINT,
          undefined,
          humps.decamelizeKeys({
            scope: env.MICROSOFT_CLIENT_CREDENTIALS_SCOPE,
            clientId: r2.microsoftClientId,
            clientAssertionType: env.MICROSOFT_CLIENT_CREDENTIALS_TYPE,
            clientAssertion: r,
            grantType: 'client_credentials'
          }) as JSONObject
        )
      )
    )
    .then((r) =>
      r
        .json()
        .then((s: JSONObject) => humps.camelizeKeys(s) as JSONObject)
        .then((s: JSONObject) => addExpiresAt(s, Date.parse(r.headers.get('date') ?? new Date().toUTCString())))
    )
    .then((r) => ({ status: 200, body: plainToInstance(ResponseDTO, r, classTransformOptions) }))
    .catch((e) => onFailure(e));
};
