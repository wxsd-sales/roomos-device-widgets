import { jsonRequest } from '../../../lib/shared/json-request';

const upstashRedisRestUrl: string = process.env.UPSTASH_REDIS_REST_URL || '';
const upstashRedisRestToken: string = process.env.UPSTASH_REDIS_REST_TOKEN || '';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function get(request) {
  const uuid = await request.params.uuid;
  console.log(uuid);
  const redis = jsonRequest(upstashRedisRestUrl, 'get', undefined, 'Bearer', upstashRedisRestToken);
  const data = await redis.get(uuid);

  return { body: data.result };
}
