import 'reflect-metadata';
import type { RequestEvent } from '@sveltejs/kit';
import { Expose, plainToInstance } from 'class-transformer';
import { IsNotEmpty, validateSync } from 'class-validator';
import { classTransformOptions, classValidationOptions } from '../../.utils';

/** @typedef {import('class-validator').ValidationError} ValidationError */

export const GET = async (requestEvent: RequestEvent) => {
  class RequestQueryDTO {
    @Expose()
    @IsNotEmpty()
    public readonly initials!: string;
  }

  // validate request query
  const searchParams = Object.fromEntries(requestEvent.url.searchParams);
  const query = plainToInstance(RequestQueryDTO, searchParams, classTransformOptions);
  const queryValidationErrors = validateSync(query, classValidationOptions);
  if (queryValidationErrors.length > 0) {
    return { status: 400, body: { query: queryValidationErrors } };
  }

  const avatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="640px" height="640px" viewBox="0 0 640 640" version="1.1">
  <rect fill="#ddd" cx="320" width="640" height="640" cy="320" r="320"/>
  <text x="50%" y="50%"
        style="color: #222; line-height: 1;font-family: 'CiscoSansTT', BlinkMacSystemFont, -apple-system, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
  'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;"
        alignment-baseline="middle" text-anchor="middle" font-size="280" font-weight="400" dy=".1em"
        dominant-baseline="middle" fill="hsl(0deg, 0%, 21%)">${query.initials}
  </text>
</svg>`;

  return {
    status: 200,
    body: avatarSvg,
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'Expires': '2100-12-31T23:59:59.999Z',
      'Content-Type': 'image/svg+xml'
    }
  };
};
