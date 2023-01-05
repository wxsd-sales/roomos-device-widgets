<script lang="ts">
  import type * as TYPES from './types/events';
  import { onMount } from 'svelte';
  import { browser } from '$app/env';
  import { readable } from 'svelte/store';
  import Event from './Event.svelte';

  export let updateInterval = 3600;
  export let callsStore = readable([]);
  export let listEvents: (...args) => Promise<TYPES.Events> = () => Promise.reject(undefined);
  export let deleteEvent: (...args) => Promise<Response> = () => Promise.reject(undefined);
  export let disconnect: (...args) => Promise<Response> = () => Promise.reject(undefined);
  export let connect: (...args) => Promise<Response> = () => Promise.reject(undefined);

  let events = browser ? listEvents() : Promise.reject(undefined);

  onMount(() => {
    const interval = updateInterval * 1000;
    const intervalId = setInterval(() => (events = listEvents()), interval);

    return () => clearInterval(intervalId);
  });
</script>

<div class="columns is-multiline is-flex is-flex-grow-1" class:bookings-container={true}>
  <slot name="header" />
  <div class="column is-12" class:bookings-container-column={true}>
    {#await events}
      <progress class="progress is-small is-link" max="100">0%</progress>
    {:then event}
      {#each event as event (event.id)}
        <Event {...event} {disconnect} {connect} {callsStore}>
          <div class="column is-2">
            <button
              class="button is-medium is-danger is-rounded is-fullwidth"
              disabled={event.isLoading}
              class:is-loading={event.isLoading}
              on:click={() =>
                Promise.resolve((event.isLoading = true))
                  .then(() => deleteEvent(event.id))
                  .then(() => {
                    let index = event.map((x) => x.id).indexOf(event.id);
                    event.splice(index, 1);
                    // eslint-disable-next-line no-self-assign
                    event = event;
                  })}
            >
              <span class="icon">
                <i class="mdi mdi-calendar-remove" />
              </span>
            </button>
          </div>
          <slot />
        </Event>
      {/each}
      {#if event.length === 0}
        <p class="subtitle">No upcoming Google Calendar events.</p>
      {/if}
    {:catch error}
      <p class="subtitle has-text-danger" title={error?.message}>Could not get Google Calendar events.</p>
    {/await}
  </div>
  <slot name="footer" />
</div>
