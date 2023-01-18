import 'reflect-metadata';
import { IsEmail, IsNotEmpty, IsString, IsUrl, Matches, MinLength, validateSync } from 'class-validator';
import { VALID_ACCESS_TOKEN } from './constants';
import { dev } from '$app/env';
import humps from 'humps';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

export class Environment {
  private static readonly appUrlConfig = humps.decamelizeKeys({
    protocols: dev ? ['http', 'https'] : ['https'],
    requireProtocol: true,
    requireTld: false,
    allowQueryComponents: false,
    allowFragments: false
  });

  @IsUrl(Environment.appUrlConfig)
  public readonly APP_URL: string;

  @IsEmail()
  public readonly APP_PREVIEW_EMAIL: string;

  @IsString()
  @MinLength(8)
  public readonly APP_PREVIEW_PASSWORD: string;

  @IsUrl()
  public readonly GOOGLE_API_URL: string;

  @IsUrl()
  public readonly GOOGLE_OAUTH_URL: string;

  @IsNotEmpty()
  public readonly GOOGLE_OAUTH_TOKEN_ENDPOINT: string;

  @IsNotEmpty()
  public readonly GOOGLE_CLIENT_CREDENTIALS_SCOPE: string;

  @IsNotEmpty()
  public readonly GOOGLE_CLIENT_CREDENTIALS_TYPE: string;

  @IsUrl()
  public readonly GOOGLE_NEWS_RSS_URL: string;

  @IsUrl()
  public readonly GUEST_DEMO_API_URL: string;

  @IsNotEmpty()
  public readonly GUEST_DEMO_CREATE_ENDPOINT: string;

  @IsUrl()
  public readonly IMI_WEBHOOK_URL: string;

  @IsNotEmpty()
  public readonly IMI_SMS_ENDPOINT: string;

  @IsUrl()
  public readonly OPENWEATHERMAP_API_URL: string;

  @IsNotEmpty()
  public readonly OPENWEATHERMAP_API_KEY: string;

  @IsNotEmpty()
  public readonly WEBEX_API_URL: string;

  @IsNotEmpty()
  public readonly WEBEX_REDIRECT_URI: string;

  @IsUrl()
  public readonly WEBEX_OAUTH_HELP_SERVICE_URL: string;

  @IsNotEmpty()
  public readonly WEBEX_AUTHORIZATION_CODE_CLIENT_ID: string;

  @IsNotEmpty()
  public readonly WEBEX_AUTHORIZATION_CODE_CLIENT_SECRET: string;

  @IsNotEmpty()
  public readonly WEBEX_AUTHORIZATION_CODE_CLIENT_SCOPE: string;

  @IsNotEmpty()
  public readonly WEBEX_DEVICE_CODE_AUTHORIZE_ENDPOINT: string;

  @IsNotEmpty()
  public readonly WEBEX_DEVICE_CODE_TOKEN_ENDPOINT: string;

  @IsNotEmpty()
  public readonly WEBEX_DEVICE_CODE_VALIDATE_ENDPOINT: string;

  @IsNotEmpty()
  public readonly WEBEX_DEVICE_CODE_TYPE: string;

  @IsNotEmpty()
  public readonly WEBEX_DEVICE_CODE_CLIENT_ID: string;

  @IsNotEmpty()
  public readonly WEBEX_DEVICE_CODE_CLIENT_SECRET: string;

  @IsNotEmpty()
  public readonly WEBEX_DEVICE_CODE_CLIENT_SCOPE: string;

  @IsEmail()
  public readonly WEBEX_BOT_EMAIL: string;

  @IsNotEmpty()
  public readonly WEBEX_BOT_ID: string;

  @IsNotEmpty()
  @Matches(VALID_ACCESS_TOKEN)
  public readonly WEBEX_BOT_TOKEN: string;

  @IsNotEmpty()
  public readonly WEBEX_NOTIFICATION_CHANNEL_ID: string;

  @IsNotEmpty()
  @Matches(VALID_ACCESS_TOKEN)
  public readonly WEBEX_NOTIFICATION_CHANNEL_TOKEN: string;

  @IsUrl()
  public readonly UPSTASH_REDIS_REST_URL: string;

  @IsNotEmpty()
  public readonly UPSTASH_REDIS_REST_TOKEN: string;

  constructor() {
    dotenvExpand.expand(dotenv.config());
    this.APP_URL = process.env.APP_URL || dev ? 'https://localhost:5173' : 'https://localhost:4173';
    this.APP_PREVIEW_EMAIL = process.env.APP_PREVIEW_EMAIL as string;
    this.APP_PREVIEW_PASSWORD = process.env.APP_PREVIEW_PASSWORD as string;
    this.GOOGLE_API_URL = process.env.GOOGLE_API_URL as string;
    this.GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL as string;
    this.GOOGLE_OAUTH_TOKEN_ENDPOINT = process.env.GOOGLE_OAUTH_TOKEN_ENDPOINT as string;
    this.GOOGLE_CLIENT_CREDENTIALS_SCOPE = process.env.GOOGLE_CLIENT_CREDENTIALS_SCOPE as string;
    this.GOOGLE_CLIENT_CREDENTIALS_TYPE = process.env.GOOGLE_CLIENT_CREDENTIALS_TYPE as string;
    this.GOOGLE_NEWS_RSS_URL = process.env.GOOGLE_NEWS_RSS_URL as string;
    this.GUEST_DEMO_API_URL = process.env.GUEST_DEMO_API_URL as string;
    this.GUEST_DEMO_CREATE_ENDPOINT = process.env.GUEST_DEMO_CREATE_ENDPOINT as string;
    this.IMI_WEBHOOK_URL = process.env.IMI_WEBHOOK_URL as string;
    this.IMI_SMS_ENDPOINT = process.env.IMI_SMS_ENDPOINT as string;
    this.OPENWEATHERMAP_API_URL = process.env.OPENWEATHERMAP_API_URL as string;
    this.OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY as string;
    this.WEBEX_API_URL = process.env.WEBEX_API_URL as string;
    this.WEBEX_REDIRECT_URI = process.env.WEBEX_REDIRECT_URI as string;
    this.WEBEX_OAUTH_HELP_SERVICE_URL = process.env.WEBEX_OAUTH_HELP_SERVICE_URL as string;
    this.WEBEX_AUTHORIZATION_CODE_CLIENT_ID = process.env.WEBEX_AUTHORIZATION_CODE_CLIENT_ID as string;
    this.WEBEX_AUTHORIZATION_CODE_CLIENT_SECRET = process.env.WEBEX_AUTHORIZATION_CODE_CLIENT_SECRET as string;
    this.WEBEX_AUTHORIZATION_CODE_CLIENT_SCOPE = process.env.WEBEX_AUTHORIZATION_CODE_CLIENT_SCOPE as string;
    this.WEBEX_DEVICE_CODE_AUTHORIZE_ENDPOINT = process.env.WEBEX_DEVICE_CODE_AUTHORIZE_ENDPOINT as string;
    this.WEBEX_DEVICE_CODE_TOKEN_ENDPOINT = process.env.WEBEX_DEVICE_CODE_TOKEN_ENDPOINT as string;
    this.WEBEX_DEVICE_CODE_VALIDATE_ENDPOINT = process.env.WEBEX_DEVICE_CODE_VALIDATE_ENDPOINT as string;
    this.WEBEX_DEVICE_CODE_TYPE = process.env.WEBEX_DEVICE_CODE_TYPE as string;
    this.WEBEX_DEVICE_CODE_CLIENT_ID = process.env.WEBEX_DEVICE_CODE_CLIENT_ID as string;
    this.WEBEX_DEVICE_CODE_CLIENT_SECRET = process.env.WEBEX_DEVICE_CODE_CLIENT_SECRET as string;
    this.WEBEX_DEVICE_CODE_CLIENT_SCOPE = process.env.WEBEX_DEVICE_CODE_CLIENT_SCOPE as string;
    this.WEBEX_BOT_EMAIL = process.env.WEBEX_BOT_EMAIL as string;
    this.WEBEX_BOT_ID = process.env.WEBEX_BOT_ID as string;
    this.WEBEX_BOT_TOKEN = process.env.WEBEX_BOT_TOKEN as string;
    this.WEBEX_NOTIFICATION_CHANNEL_ID = process.env.WEBEX_NOTIFICATION_CHANNEL_ID as string;
    this.WEBEX_NOTIFICATION_CHANNEL_TOKEN = process.env.WEBEX_NOTIFICATION_CHANNEL_TOKEN as string;
    this.UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL as string;
    this.UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN as string;
  }
}

const environment = new Environment();
const environmentValidationErrors = validateSync(environment);

if (environmentValidationErrors.length > 0) {
  if (dev || import.meta.env.PUBLIC_APP_DEBUG === 'true') console.error(environmentValidationErrors);
  throw Error('Invalid .env configuration.');
}

export default environment;
