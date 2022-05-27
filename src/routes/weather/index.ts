import 'dotenv/config';
import { jsonRequest } from '../../lib/shared/json-request';

const owmWeatherApiUrl: string = process.env.OPENWEATHERMAP_API_URL || '';
const owmWeatherApiKey: string = process.env.OPENWEATHERMAP_API_KEY || '';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function get(request) {
  const query = request.url.searchParams.get('id')
    ? {
        appid: owmWeatherApiKey,
        id: request.url.searchParams.get('id'),
        units: request.url.searchParams.get('units') || 'imperial'
      }
    : {
        appid: owmWeatherApiKey,
        q: request.url.searchParams.get('city')
      };

  return jsonRequest(owmWeatherApiUrl, 'weather')
    .get(undefined, query)
    .then((r) => ({ body: r }))
    .catch(() => ({ status: 400 }));
}
