<script lang="ts">
  import type { Protocol, Call } from './types';
  import { readable } from 'svelte/store';

  export let id: string = undefined;
  export let destination: string = undefined;
  export let protocol: Protocol = 'SIP';
  export let platform: 'GoogleMeet' | 'MicrosoftTeams' = undefined;
  export let callsStore = readable<Call[]>([]);
  export let disconnect: (...args) => Promise<Response> = () => Promise.reject(undefined);
  export let connect: (...args) => Promise<Response> = () => Promise.reject(undefined);

  let isLoading = false;

  function handleClick(id, destination, platform?: 'GoogleMeet' | 'MSTeams') {
    return Promise.resolve((isLoading = true))
      .then(() => ($callsStore.length > 0 ? disconnect(id) : connect(id, destination, platform)))
      .finally(() => setTimeout(() => (isLoading = false), 700));
  }

  function getPlatformType(value?: 'GoogleMeet' | 'MicrosoftTeams') {
    switch (value) {
      case 'GoogleMeet':
        return 'GoogleMeet';
      case 'MicrosoftTeams':
        return 'MSTeams';
      default:
        return undefined;
    }
  }

  function getPlatformIcon(value: 'GoogleMeet' | 'MicrosoftTeams') {
    switch (value?.toLocaleLowerCase()) {
      case 'googlemeet':
        return 'https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/googlemeet.svg';
      case 'microsoftteams':
        return 'https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/microsoftteams.svg';
      default:
        return 'https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/cisco.svg';
    }
  }
</script>

{#if connect == null || disconnect == null}
  <a
    class="button is-rounded is-medium is-fullwidth is-success"
    type="button"
    data-id={id}
    href="sip:{destination}"
    target="_blank"
  >
    {#if protocol === 'WebRTC' && $callsStore[0]?.bookingId !== id && isLoading === false}
      <img class="image is-32x32" src={getPlatformIcon(platform)} alt={platform} />
    {:else}
      <span class="icon">
        <i class="mdi mdi-36px {$callsStore[0]?.bookingId !== id ? 'mdi-phone' : 'mdi-phone-hangup'}" />
      </span>
    {/if}
  </a>
{:else}
  <button
    class="button is-rounded is-medium is-fullwidth {$callsStore[0]?.bookingId !== id ? 'is-success' : 'is-danger'}"
    disabled={$callsStore.length > 0 && $callsStore[0]?.bookingId !== id}
    type="button"
    data-id={id}
    data-destination={destination}
    class:is-loading={isLoading}
    on:click={() =>
      handleClick($callsStore.length > 0 ? $callsStore[0]?.id : id, destination, getPlatformType(platform))}
  >
    {#if protocol === 'WebRTC' && $callsStore[0]?.bookingId !== id && isLoading === false}
      <img class="image is-32x32" src={getPlatformIcon(platform)} alt={platform} />
    {:else}
      <span class="icon">
        <i class="mdi mdi-36px {$callsStore[0]?.bookingId !== id ? 'mdi-phone' : 'mdi-phone-hangup'}" />
      </span>
    {/if}
  </button>
{/if}
