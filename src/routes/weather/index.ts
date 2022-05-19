import 'dotenv/config';
import { jsonRequest } from '../../lib/shared/json-request';

const owmWeatherApiUrl: string = process.env.OPENWEATHERMAP_API_URL || '';
const owmWeatherApiKey: string = process.env.OPENWEATHERMAP_API_KEY || '';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function get(request) {
  return jsonRequest(owmWeatherApiUrl, 'weather')
    .get(undefined, {
      appid: owmWeatherApiKey,
      id: request.url.searchParams.get('id'),
      units: request.url.searchParams.get('units') || 'imperial'
    })
    .then((r) => ({ body: r }))
    .catch(() => ({ status: 400 }));
}
