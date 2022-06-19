<script lang="ts">
  import type { AuthorizeResponse } from './types';
  import { createEventDispatcher } from 'svelte';
  import { jsonRequest } from '$lib/shared/json-request';

  export let text = 'Get New Code';
  export let httpApiRequest = jsonRequest('/api', 'auth-webex');
  export const getAuthorizeResponse: () => Promise<AuthorizeResponse> = () =>
    httpApiRequest.post('device-code/authorize').then((r) => r.json() as AuthorizeResponse);

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

<button class="button is-primary is-rounded is-medium is-fullwidth" class:is-loading={isLoading} on:click={handleClick}>
  <span class="icon">
    <i class="mdi mdi-qrcode-plus" />
  </span>
  <span>{text}</span>
</button>
