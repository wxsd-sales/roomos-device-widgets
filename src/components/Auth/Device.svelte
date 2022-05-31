<script lang="ts">
  import jsSHA from 'jssha/dist/sha3';
  import QRCode from 'qrcode';
  import { onDestroy, onMount } from 'svelte';
  import { jsonRequest } from '../../lib/shared/json-request';
  import type { AuthorizeResponse } from '../../lib/types';
  import { webexOauthSessionWritable } from '../../lib/store';

  let authorizeResponse: AuthorizeResponse;
  let webexDeviceValidateUrl: string;
  let qrImage: HTMLImageElement;
  let tries = 0;
  let expired = true;
  let sha: jsSHA;

  const authRequest = jsonRequest('/actions', 'device');

  function authorize() {
    return authRequest.get('authorize');
  }

  function token(deviceCode: string) {
    return authRequest.get('token', { deviceCode: deviceCode });
  }

  function validateUrl() {
    return authRequest.get('validateUrl');
  }

  function updateQrCode(webexDeviceValidateUrl, imageElement) {
    QRCode.toDataURL(webexDeviceValidateUrl, { errorCorrectionLevel: 'H' }, (error, url) =>
      error ? console.error(error) : (imageElement.src = url)
    );
  }

  let pollTokenEndpointId;

  function pollTokenEndpoint(deviceCode: string, interval = 2, expiresIn = 300) {
    tries = 0;

    pollTokenEndpointId = setInterval(() => {
      tries = tries + 1;
      if (tries >= expiresIn / interval || $webexOauthSessionWritable) {
        console.info('Clearing setInterval id:', pollTokenEndpointId);
        clearInterval(pollTokenEndpointId);
        expired = true;
      }

      token(deviceCode)
        .then((r) => webexOauthSessionWritable.set(r))
        .catch(() => null);
    }, 1000);
  }

  function init() {
    if (pollTokenEndpointId) {
      expired = true;
      sha = undefined;
      clearInterval(pollTokenEndpointId);
    }

    return Promise.all([authorize(), validateUrl()])
      .then(([r1, r2]) => {
        authorizeResponse = r1;
        sha = new jsSHA('SHA3-256', 'TEXT', { encoding: 'UTF8' });
        sha.update(authorizeResponse.user_code);
        webexDeviceValidateUrl = r2.validateUrl + '?userCode=' + sha.getHash('HEX');
      })
      .then(() => updateQrCode(webexDeviceValidateUrl, qrImage))
      .then(() =>
        pollTokenEndpoint(authorizeResponse.device_code, authorizeResponse.interval, authorizeResponse.expires_in)
      )
      .finally(() => (expired = false));
  }
  onMount(() => init());
  onDestroy(() => clearInterval(pollTokenEndpointId));
</script>

<div class="columns is-multiline is-vcentered is-align-content-center is-align-items-center" id="qr-container">
  <div class="column is-two-fifths" class:is-hidden={expired}>
    <figure class="has-text-centered">
      <img bind:this={qrImage} id="qr-code" alt="Webex QR Code" src="" />
    </figure>
  </div>
  <div class="column has-text-centered-mobile is-align-items-center is-flex-tablet" class:is-hidden={expired}>
    <div>
      <p class="is-size-4">Can't scan the QR code?</p>
      <br />
      <p>
        Visit <code id="verification-uri" class="has-text-link">
          {authorizeResponse?.verification_uri}
        </code> and enter code:
      </p>
      <br />
      <code id="user-code" class="subtitle has-text-weight-semibold has-text-link">{authorizeResponse?.user_code}</code>
    </div>
  </div>
  {#if authorizeResponse && !$webexOauthSessionWritable?.access_token && expired === false}
    <div class="column is-12 has-text-centered" class:is-hidden={expired}>
      Expires in {(authorizeResponse.expires_in / authorizeResponse.interval).toFixed(0) - tries} seconds
    </div>
  {:else}
    <div class="column is-12 has-text-centered">
      <button class="button is-active is-info is-rounded is-medium" on:click={init}>
        <span class="icon">
          <i class="mdi mdi-qrcode-plus" />
        </span>
        <span>Get New Code</span>
      </button>
    </div>
  {/if}
</div>

<style>
  #qr-code {
    border-radius: 0.25rem;
  }
  #qr-container {
    height: 100%;
  }
</style>
