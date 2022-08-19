<script lang="ts">
  import type * as TYPES from './types/bookings';
  import { onMount } from 'svelte';
  import { browser } from '$app/env';
  import Booking from './Booking.svelte';
  import Title from '../Title/Title.svelte';
  import { readable } from 'svelte/store';

  export let title = 'Upcoming Room Bookings';
  export let dataSource = 'RoomOS Devices';
  export let updateInterval = 3600;
  export let callsStore = readable([]);
  export let getBookings: (...args) => Promise<TYPES.Bookings> = () => Promise.reject(undefined);
  export let disconnect: (...args) => Promise<Response> = () => Promise.reject(undefined);
  export let connect: (...args) => Promise<Response> = () => Promise.reject(undefined);

  let bookings = browser ? getBookings() : Promise.reject(undefined);

  onMount(() => {
    const interval = updateInterval * 1000;
    const intervalId = setInterval(() => (bookings = getBookings()), interval);

    return () => clearInterval(intervalId);
  });
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

<div class="columns is-multiline is-align-content-start" class:bookings-container={true}>
  {#await bookings}
    <div class="column is-12">
      <progress class="progress is-small is-link" max="100">0%</progress>
    </div>
  {:then bookings}
    {#each bookings as booking}
      <div class="column is-12">
        <Booking {...booking} {disconnect} {connect} {callsStore} />
      </div>
    {/each}
    {#if bookings.length === 0}
      <div class="column is-12">
        <p class="subtitle">No upcoming room bookings.</p>
      </div>
    {/if}
  {:catch error}
    <div class="column is-12">
      <p class="subtitle has-text-danger" title={error?.message}>Could not get room bookings.</p>
    </div>
  {/await}
</div>
