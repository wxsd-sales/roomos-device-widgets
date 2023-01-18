<script lang="ts">
  import type { AuthorizeResponse, TokenResponse } from './types';
  import DeviceCodeQr from './DeviceCodeQr.svelte';
  import DeviceCodeText from './DeviceCodeText.svelte';
  import DeviceCodeToken from './DeviceCodeToken.svelte';
  import { onMount } from 'svelte';

  export let isMinimal = true;
  export let getAuthorizeResponse: (...args) => Promise<AuthorizeResponse> = () => Promise.reject(undefined);
  export let getTokenResponse: (...args) => Promise<TokenResponse> = () => Promise.reject(undefined);
  let authorizeResponse: AuthorizeResponse = undefined;

  onMount(async () => {
    authorizeResponse = await getAuthorizeResponse();
  });
</script>

{#if authorizeResponse}
  <div class="columns is-multiline is-centered is-vcentered has-text-centered device-code-container">
    <div class="column is-12-tablet is-narrow-desktop">
      <DeviceCodeQr qrImage={Promise.resolve(authorizeResponse.qrImage)} />
    </div>
    <div class="column is-12-tablet is-7-desktop" class:is-hidden={isMinimal}>
      <DeviceCodeText
        userCode={Promise.resolve(authorizeResponse.userCode)}
        verificationUri={Promise.resolve(authorizeResponse.verificationUri)}
      />
      <hr />
      <DeviceCodeToken
        {getTokenResponse}
        deviceCode={Promise.resolve(authorizeResponse.deviceCode)}
        expiresAt={Promise.resolve(Date.parse(authorizeResponse.expiresAt).valueOf())}
        interval={Promise.resolve(authorizeResponse.interval)}
        on:deviceCodeExpired={async () => (authorizeResponse = await getAuthorizeResponse())}
        on:newTokenResponse
      />
    </div>
  </div>
{/if}
