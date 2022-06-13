import owmLine01d from '@bybas/weather-icons/production/line/openweathermap/01d.svg?raw';
import owmLine01n from '@bybas/weather-icons/production/line/openweathermap/01n.svg?raw';
import owmLine02d from '@bybas/weather-icons/production/line/openweathermap/02d.svg?raw';
import owmLine02n from '@bybas/weather-icons/production/line/openweathermap/02n.svg?raw';
import owmLine03d from '@bybas/weather-icons/production/line/openweathermap/03d.svg?raw';
import owmLine03n from '@bybas/weather-icons/production/line/openweathermap/03n.svg?raw';
import owmLine04d from '@bybas/weather-icons/production/line/openweathermap/04d.svg?raw';
import owmLine04n from '@bybas/weather-icons/production/line/openweathermap/04n.svg?raw';
import owmLine09d from '@bybas/weather-icons/production/line/openweathermap/09d.svg?raw';
import owmLine09n from '@bybas/weather-icons/production/line/openweathermap/09n.svg?raw';
import owmLine10d from '@bybas/weather-icons/production/line/openweathermap/10d.svg?raw';
import owmLine10n from '@bybas/weather-icons/production/line/openweathermap/10n.svg?raw';
import owmLine11d from '@bybas/weather-icons/production/line/openweathermap/11d.svg?raw';
import owmLine11n from '@bybas/weather-icons/production/line/openweathermap/11n.svg?raw';
import owmLine13d from '@bybas/weather-icons/production/line/openweathermap/13d.svg?raw';
import owmLine13n from '@bybas/weather-icons/production/line/openweathermap/13n.svg?raw';
import owmLine50d from '@bybas/weather-icons/production/line/openweathermap/50d.svg?raw';
import owmLine50n from '@bybas/weather-icons/production/line/openweathermap/50n.svg?raw';
import owmFill01d from '@bybas/weather-icons/production/fill/openweathermap/01d.svg?raw';
import owmFill01n from '@bybas/weather-icons/production/fill/openweathermap/01n.svg?raw';
import owmFill02d from '@bybas/weather-icons/production/fill/openweathermap/02d.svg?raw';
import owmFill02n from '@bybas/weather-icons/production/fill/openweathermap/02n.svg?raw';
import owmFill03d from '@bybas/weather-icons/production/fill/openweathermap/03d.svg?raw';
import owmFill03n from '@bybas/weather-icons/production/fill/openweathermap/03n.svg?raw';
import owmFill04d from '@bybas/weather-icons/production/fill/openweathermap/04d.svg?raw';
import owmFill04n from '@bybas/weather-icons/production/fill/openweathermap/04n.svg?raw';
import owmFill09d from '@bybas/weather-icons/production/fill/openweathermap/09d.svg?raw';
import owmFill09n from '@bybas/weather-icons/production/fill/openweathermap/09n.svg?raw';
import owmFill10d from '@bybas/weather-icons/production/fill/openweathermap/10d.svg?raw';
import owmFill10n from '@bybas/weather-icons/production/fill/openweathermap/10n.svg?raw';
import owmFill11d from '@bybas/weather-icons/production/fill/openweathermap/11d.svg?raw';
import owmFill11n from '@bybas/weather-icons/production/fill/openweathermap/11n.svg?raw';
import owmFill13d from '@bybas/weather-icons/production/fill/openweathermap/13d.svg?raw';
import owmFill13n from '@bybas/weather-icons/production/fill/openweathermap/13n.svg?raw';
import owmFill50d from '@bybas/weather-icons/production/fill/openweathermap/50d.svg?raw';
import owmFill50n from '@bybas/weather-icons/production/fill/openweathermap/50n.svg?raw';
import smokeParticlesLine from '@bybas/weather-icons-master/production/line/svg/smoke-particles.svg?raw';
import thermometerLine from '@bybas/weather-icons-master/production/line/svg/thermometer.svg?raw';
import humidityLine from '@bybas/weather-icons-master/production/line/svg/humidity.svg?raw';
import barometerLine from '@bybas/weather-icons-master/production/line/svg/barometer.svg?raw';
import gloveLine from '@bybas/weather-icons-master/production/line/svg/glove.svg?raw';
import smokeParticlesFill from '@bybas/weather-icons-master/production/fill/svg/smoke-particles.svg?raw';
import thermometerFill from '@bybas/weather-icons-master/production/fill/svg/thermometer.svg?raw';
import humidityFill from '@bybas/weather-icons-master/production/fill/svg/humidity.svg?raw';
import barometerFill from '@bybas/weather-icons-master/production/fill/svg/barometer.svg?raw';
import gloveFill from '@bybas/weather-icons-master/production/fill/svg/glove.svg?raw';

export const owm = {
  'clear-sky-day': '01d',
  'clear-sky-night': '01n',
  'few-clouds-day': '02d',
  'few-clouds-night': '02n',
  'scattered-clouds-day': '03d',
  'scattered-clouds-night': '03n',
  'broken-clouds-day': '04d',
  'broken-clouds-night': '04n',
  'shower-rain-day': '09d',
  'shower-rain-night': '09n',
  'rain-day': '10d',
  'rain-night': '10n',
  'thunderstorm-day': '11d',
  'thunderstorm-night': '11n',
  'snow-day': '13d',
  'snow-night': '13n',
  'mist-day': '50d',
  'mist-night': '50n'
} as const;

export const owmIcon = {
  fill: {
    '01d': owmFill01d,
    '01n': owmFill01n,
    '02d': owmFill02d,
    '02n': owmFill02n,
    '03d': owmFill03d,
    '03n': owmFill03n,
    '04d': owmFill04d,
    '04n': owmFill04n,
    '09d': owmFill09d,
    '09n': owmFill09n,
    '10d': owmFill10d,
    '10n': owmFill10n,
    '11d': owmFill11d,
    '11n': owmFill11n,
    '13d': owmFill13d,
    '13n': owmFill13n,
    '50d': owmFill50d,
    '50n': owmFill50n
  },
  line: {
    '01d': owmLine01d,
    '01n': owmLine01n,
    '02d': owmLine02d,
    '02n': owmLine02n,
    '03d': owmLine03d,
    '03n': owmLine03n,
    '04d': owmLine04d,
    '04n': owmLine04n,
    '09d': owmLine09d,
    '09n': owmLine09n,
    '10d': owmLine10d,
    '10n': owmLine10n,
    '11d': owmLine11d,
    '11n': owmLine11n,
    '13d': owmLine13d,
    '13n': owmLine13n,
    '50d': owmLine50d,
    '50n': owmLine50n
  }
} as const;

export const newWeatherIcon = {
  line: {
    'smoke-particles': smokeParticlesLine,
    'thermometer': thermometerLine,
    'humidity': humidityLine,
    'barometer': barometerLine,
    'glove': gloveLine
  },
  fill: {
    'smoke-particles': smokeParticlesFill,
    'thermometer': thermometerFill,
    'humidity': humidityFill,
    'barometer': barometerFill,
    'glove': gloveFill
  }
} as const;

export type OwmIcon = keyof typeof owm | typeof owm[keyof typeof owm];
export type NewWeatherIcon = keyof typeof newWeatherIcon.line | keyof typeof newWeatherIcon.fill;

export const getWeatherIconSvg: (code: OwmIcon | NewWeatherIcon, iconVariant: 'fill' | 'line') => string = (
  code,
  iconVariant
) =>
  owmIcon[iconVariant][code as typeof owm[keyof typeof owm]] ?? // by name, eg. 'clear-sky-day'
  owmIcon[iconVariant][owm[code as keyof typeof owm] as typeof owm[keyof typeof owm]] ?? // by code, eg. '01d'
  newWeatherIcon[iconVariant][code as keyof typeof newWeatherIcon.fill | keyof typeof newWeatherIcon.line];
