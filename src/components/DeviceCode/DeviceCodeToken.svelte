<script lang="ts">
  import type { TokenResponse } from './types';
  import { createEventDispatcher, onMount } from 'svelte';

  export let deviceCode: Promise<string>;
  export let expiresAt: Promise<number>;
  export let interval: Promise<number>;
  export let getTokenResponse: (...args) => Promise<TokenResponse> = () => Promise.reject(undefined);

  const dispatch = createEventDispatcher();
  const intervalId = setInterval(() => (now = Date.now()), 1000);

  let timeoutId: number;
  let now: number = Date.now();
  let tokenResponse: Promise<TokenResponse> = Promise.resolve(undefined);

  const clearTimers = () => clearInterval(intervalId) || clearTimeout(timeoutId);
  const pollTokenEndpoint = async () => {
    const [x, y, z] = await Promise.all([deviceCode, expiresAt, interval]);
    tokenResponse = getTokenResponse(x as string)
      .then((r) => {
        clearTimers();
        now = 0;
        dispatch('newTokenResponse', r as string);
        return r;
      })
      .catch((e) => {
        if (e?.status === 428 && now < (y as number)) {
          timeoutId = setTimeout(pollTokenEndpoint, z * 1000 + 200) as number;
        } else if (e?.status >= 500) {
          clearTimers();
          dispatch('deviceCodeError', x as string) && (now = -1);
        } else {
          clearTimers();
          dispatch('deviceCodeExpired', x as string) && (now = -1);
        }
        return undefined;
      });
  };

  onMount(() => {
    timeoutId = setTimeout(pollTokenEndpoint, 0) as number;

    return () => clearTimers();
  });
</script>

<section class="device-code-token-container">
  <div class="columns is-vcentered is-gapless is-multiline">
    <div class="column">
      {#await Promise.all([deviceCode, expiresAt, interval])}
        <span class="loader" />
      {:then r}
        {#if now > 0}
          <p>Expires in ~{((r[1] - now) / 1000).toFixed(0)} seconds.</p>
        {:else if now <= -1}
          <p class="has-text-danger">Code expired.</p>
        {:else if now === 0}
          <p class="has-text-success">Success!</p>
        {/if}
      {:catch e}
        <p class="has-text-danger">An error occurred, please retry.</p>
      {/await}
    </div>
  </div>
</section>
