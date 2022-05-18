<script lang="ts">
  import jsSHA from 'jssha/dist/sha3';
  import QRCode from 'qrcode';
  import { onMount } from 'svelte';
  import { JsonRequest } from '../../lib/shared/json-request';
  import type { AuthorizeResponse } from '../../lib/types';
  import { webexOauthSessionWritable } from '../../lib/store';

  let authorizeResponse: AuthorizeResponse;
  let webexDeviceValidateUrl: string;
  let qrImage: HTMLImageElement;
  let tries = 0;
  let expired = true;

  const jsonRequest = new JsonRequest('/actions', 'device');
  const sha = new jsSHA('SHA3-256', 'TEXT', { encoding: 'UTF8' });

  function authorize() {
    return jsonRequest.get('authorize');
  }

  function token(deviceCode: string) {
    return jsonRequest.get('token', { deviceCode: deviceCode });
  }

  function validateUrl() {
    return jsonRequest.get('validateUrl');
  }

  function updateQrCode(webexDeviceValidateUrl, imageElement) {
    QRCode.toDataURL(webexDeviceValidateUrl, { errorCorrectionLevel: 'H' }, (error, url) =>
      error ? console.error(error) : (imageElement.src = url)
    );
  }

  function pollTokenEndpoint(deviceCode: string, interval = 2, expiresIn = 300) {
    tries = 0;

    const id = setInterval(() => {
      tries = tries + 1;
      if (tries >= expiresIn / interval || $webexOauthSessionWritable) {
        console.info('Clearing setInterval id:', id);
        clearInterval(id);
        expired = true;
      }

      token(deviceCode)
        .then((r) => webexOauthSessionWritable.set(r))
        .catch((e) => console.error(e));
    }, interval * 1100);
  }

  function init() {
    return Promise.all([authorize(), validateUrl()])
      .then(([r1, r2]) => {
        authorizeResponse = r1;
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
</script>

<div class="columns is-multiline v-ce">
  <div class="column is-two-fifths" class:is-invisible={expired}>
    <figure class="has-text-centered">
      <img bind:this={qrImage} id="qr-code" alt="Webex QR Code" src="" />
    </figure>
  </div>
  <div class="column has-text-centered-mobile is-align-items-center is-flex-tablet" class:is-invisible={expired}>
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
      <button class="button is-active is-info is-rounded is-large" on:click={init}>
        <span class="icon">
          <i class="mdi mdi-qrcode-plus" />
        </span>
        <span>Get New Code</span>
      </button>
    </div>
  {/if}
</div>
