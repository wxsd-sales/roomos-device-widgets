<script lang="ts">
  import type { AuthorizeResponse } from './types';
  import { createEventDispatcher } from 'svelte';

  export let text = 'Get New Code';
  export let getAuthorizeResponse: (...args) => Promise<AuthorizeResponse> = () => Promise.reject(undefined);

  const dispatch = createEventDispatcher();

  let isLoading = false;

  // eslint-disable-next-line no-undef
  function handleClick(e: PointerEvent): void {
    if (import.meta.env.DEV) console.info(e);

    return Promise.resolve((isLoading = true))
      .then(() => dispatch('newAuthorizeRequest'))
      .then(() => getAuthorizeResponse())
      .then((r) => dispatch('newAuthorizeResponse', r))
      .finally(() => (isLoading = false));
  }
</script>

<button
  class="button is-primary is-rounded is-medium is-fullwidth"
  disabled={isLoading}
  class:is-loading={isLoading}
  on:click={handleClick}
>
  <span class="icon">
    <i class="mdi mdi-qrcode-plus" />
  </span>
  <span>{text}</span>
</button>
