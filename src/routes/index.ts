import type { RequestEvent } from '@sveltejs/kit';

export const GET = async (requestEvent: RequestEvent) => {
  return { status: 302, headers: { Location: '/auth' } };
};
