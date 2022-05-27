import { jsonRequest } from '../../../lib/shared/json-request';

const upstashRedisRestUrl: string = process.env.UPSTASH_REDIS_REST_URL || '';
const upstashRedisRestToken: string = process.env.UPSTASH_REDIS_REST_TOKEN || '';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function get(request) {
  const {
    url: { searchParams }
  } = request;
  const redis = jsonRequest(upstashRedisRestUrl, 'get', undefined, 'Bearer', upstashRedisRestToken);

  const data = await redis.get(searchParams.get('userID'));
  return { body: data.result };
}

export async function post(request) {
  const { userID, contacts } = await request.request.json();
  const redis = jsonRequest(upstashRedisRestUrl, 'set', undefined, 'Bearer', upstashRedisRestToken);
  const data = await redis.post(userID, undefined, contacts);

  return data;
}
