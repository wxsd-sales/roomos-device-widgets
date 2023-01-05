<script lang="ts">
  import Meet from '../Meet/Meet.svelte';
  import { readable } from 'svelte/store';

  export let id: string;
  export let number: string = undefined;
  export let organizer: { name?: string; email?: string; prefix: string };
  export let protocol: 'SIP' | 'H323' | 'ISDN' | 'IP' | 'Spark' | 'WebRTC' = undefined;
  export let platform: 'GoogleMeet' | 'MicrosoftTeams' = undefined;
  export let time: { start: Date; end: Date; startBuffer: number };
  export let title = undefined;
  export let privacy: 'Private' | 'Public' = undefined;
  export let locale: string | string[] = undefined;
  export let timeFormatOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };
  export let callsStore = readable([]);
  export let disconnect: (...args) => Promise<Response> = () => Promise.reject(undefined);
  export let connect: (...args) => Promise<Response> = () => Promise.reject(undefined);

  let localeTimeString =
    new Date(time.start).toLocaleTimeString(locale, timeFormatOptions) +
    ' &mdash; ' +
    new Date(time.end).toLocaleTimeString(locale, timeFormatOptions);
</script>

<div class="columns is-mobile">
  <div class="column is-7 has-text-weight-medium" title={privacy}>
    {#if title == null}
      <p class="is-size-5">{@html localeTimeString}</p>
    {:else}
      <p class="is-size-5">{title}</p>
      <p class="is-size-6 has-text-grey-light">{@html localeTimeString}</p>
    {/if}
    <p class="is-size-6 has-text-grey-light">{organizer.prefix}{organizer.name || organizer.email || 'unknown'}</p>
  </div>
  <slot />
  {#if number != null}
    <div class="column">
      <Meet {id} {protocol} {platform} destination={number} {disconnect} {connect} {callsStore} />
    </div>
  {/if}
</div>
