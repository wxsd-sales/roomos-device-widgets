import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { urlEncodedRequest } from '$lib/shared/urlencoded-request';
import env from '$lib/environment';

/**
 * @param requestEvent
 *
 * @returns {Promise<
 *   | {
 *       headers: { 'Cache-Control': 'public, max-age=1800'; 'Expires': string; 'Content-Type': 'application/xml' };
 *       body: string;
 *       status: 200;
 *     }
 *   | { status: 500 }
 * >}
 */
export const GET: RequestHandler = async (requestEvent: RequestEvent) => {
  const query = requestEvent.url.searchParams.get('q') ?? undefined;

  return urlEncodedRequest(env.GOOGLE_NEWS_RSS_URL)
    .get(undefined, query != null ? { q: query } : undefined)
    .then((r) => r.text())
    .then((r) => ({
      status: 200,
      body: r,
      headers: {
        'Cache-Control': 'public, max-age=1800',
        'Content-Type': 'application/xml',
        'Expires': new Date(Date.now() + 30 * 60 * 1000).toUTCString()
      }
    }))
    .catch(() => ({ status: 500 }));
};
