<script lang="ts">
  import type { RoomAnalytics } from './types/room-analytics';
  import { readable } from 'svelte/store';
  import Title from '../Title/Title.svelte';
  import RoomAnalyticsCard from './RoomAnalyticsCard.svelte';

  export let title = 'Sensor Metrics';
  export let dataSource = 'RoomOS Devices';
  export let units: 'imperial' | 'metric' = 'imperial';
  export let roomAnalyticsStore = readable<RoomAnalytics>(undefined);

  const temperatureFToC = (value: number) => ((value - 32) / 1.8).toFixed(1);
  const temperatureCToF = (value: number) => (value * 1.8 + 32).toFixed(1);
  const convertTemperature = (value?: number, toUnits: 'metric' | 'imperial' = 'imperial') => {
    if (value == null) return undefined;
    switch (toUnits) {
      case 'imperial':
        return temperatureCToF(value);
      case 'metric':
        return temperatureFToC(value);
      default:
        return undefined;
    }
  };
  const temperatureSymbol = (units: 'metric' | 'imperial' = 'imperial') => {
    switch (units) {
      case 'imperial':
        return '&deg;F';
      case 'metric':
        return '&deg;C';
      default:
        return undefined;
    }
  };
</script>

{#if title != null}
  <Title text={title}>
    {#if dataSource}
      <div class="column is-narrow" class:title-column={true}>
        <p class="is-size-7 has-text-right has-text-grey-light" class:title-data-source={true}>Source: {dataSource}</p>
      </div>
    {/if}
  </Title>
{/if}
<div
  class="columns is-mobile is-multiline has-text-centered"
  class:room-analytics-row={true}
  class:room-analytics-container={true}
>
  <div
    class="column is-4-mobile is-4-tablet is-align-items-flex-end is-justify-content-end"
    class:room-analytics-column={true}
    class:room-analytics-air-quality={true}
  >
    <RoomAnalyticsCard name="Air Quality" icon="smoke" value={$roomAnalyticsStore?.airQualityIndex} />
  </div>
  <div
    class="column is-4-mobile is-4-tablet is-align-items-flex-end is-justify-content-end"
    class:room-analytics-column={true}
    class:room-analytics-temperature={true}
  >
    <RoomAnalyticsCard
      name="Temperature"
      icon="thermometer"
      value={convertTemperature($roomAnalyticsStore?.ambientTemperature)}
      units={temperatureSymbol(units)}
    />
  </div>
  <div
    class="column is-4-mobile is-4-tablet is-align-items-flex-end is-justify-content-end"
    class:room-analytics-column={true}
    class:room-analytics-humidity={true}
  >
    <RoomAnalyticsCard name="Humidity" icon="water-percent" value={$roomAnalyticsStore?.relativeHumidity} units="%" />
  </div>
  <div
    class="column is-4-mobile is-4-tablet is-align-items-flex-end is-justify-content-end"
    class:room-analytics-column={true}
    class:room-analytics-noise={true}
  >
    <RoomAnalyticsCard name="Noise" icon="waveform" value={$roomAnalyticsStore?.ambientNoiseLevelA} units="dBA" />
  </div>
  <div
    class="column is-8-mobile is-8-tablet is-align-items-flex-end is-justify-content-end"
    class:room-analytics-column={true}
    class:room-analytics-occupancy={true}
  >
    <RoomAnalyticsCard name="Occupancy" icon="account-group" value={$roomAnalyticsStore?.peopleCountCurrent} />
  </div>
</div>
