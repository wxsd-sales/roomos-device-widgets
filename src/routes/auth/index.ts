import 'reflect-metadata';
import type { RequestEvent } from '@sveltejs/kit';

/** @typedef {import('class-validator').ValidationError} ValidationError */

export const GET = async (requestEvent: RequestEvent) => {
  if (requestEvent.locals.session?.user?.uuid) {
    return { status: 302, headers: { Location: '/demos' } };
  }

  return { status: 200 };
};
