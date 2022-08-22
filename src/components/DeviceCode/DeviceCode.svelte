<script lang="ts">
  import type { AuthorizeResponse } from './types';
  import DeviceCodeNew from './DeviceCodeNew.svelte';
  import DeviceCodeQr from './DeviceCodeQr.svelte';
  import DeviceCodeText from './DeviceCodeText.svelte';
  import DeviceCodeToken from './DeviceCodeToken.svelte';
  import Title from '../../Title/Title.svelte';

  export let title = 'Sign-In with Your Device';
  export let isMinimal = true;

  let isLoading = false;
  let authorizeResponse: AuthorizeResponse = undefined;
</script>

{#if title}
  <Title text={title} />
{/if}

<div class="columns is-multiline is-centered is-vcentered has-text-centered device-code-container">
  {#if authorizeResponse == null}
    <div class="column is-12">
      <div class="is-flex is-align-items-center is-justify-content-center device-code-help-text">
        <p class="subtitle">Get a new code, and sign-in with your device.</p>
      </div>
    </div>
  {:else}
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
        deviceCode={Promise.resolve(authorizeResponse.deviceCode)}
        expiresAt={Promise.resolve(Date.parse(authorizeResponse.expiresAt).valueOf())}
        interval={Promise.resolve(authorizeResponse.interval)}
        on:deviceCodeExpired={() => (authorizeResponse = undefined)}
        on:newTokenResponse
      />
    </div>
  {/if}
  <div class="column is-12">
    <DeviceCodeNew
      text={isMinimal ? 'Get New QR Code' : 'Get New Code'}
      on:newAuthorizeRequest={() => (isLoading = true)}
      on:newAuthorizeResponse={(e) => [(isLoading = false), (authorizeResponse = e.detail)]}
    />
  </div>
</div>

<style>
  .device-code-help-text {
    min-height: 15rem;
  }
</style>
