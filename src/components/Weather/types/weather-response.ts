import type { Units } from './units';

export type WeatherResponse = {
  units: Units;
  place: string;
  timezone: number;
  temp: number;
  tempMin: number;
  tempMax: number;
  main: string;
  description: string;
  icon: string;
  svg: string;
};
