<script lang="ts">
  import { jsonRequest } from '$lib/shared/json-request';
  import { derived, readable, writable } from 'svelte/store';
  import { browser } from '$app/env';
  import type * as TYPES from '$lib/types';

  import Background from '$components/Background/Background.svelte';
  import Brand from '$components/Brand/Brand.svelte';
  import Clock from '$components/Clock/Clock.svelte';
  import Weather from '$components/Weather/Weather.svelte';
  import DeviceCode from '$components/DeviceCode/DeviceCode.svelte';

  import Responder from './responder/index.svelte';
  import Requester from './requester/index.svelte';

  import type { Demo } from 'src/database/entities';
  import { tokenResponseStore } from '$lib/store';

  export let demo: Demo;
  export let role: string;

  const httpApiRequest = jsonRequest('/api');

  const getAuthorizeResponse = () =>
    httpApiRequest.post('device-code/webex/authorize').then((r) => r.json() as Promise<TYPES.AuthorizeResponse>);

  const getTokenResponse = (deviceCode: string) =>
    httpApiRequest
      .post('device-code/webex/token', { deviceCode })
      .then((r) => r.json() as Promise<TYPES.TokenResponse>);

  const getWeatherResponse = (id: number, units: string) =>
    httpApiRequest.get('weather', { id, units }).then((r) => r.json() as Promise<TYPES.WeatherResponse>);

  const isDevice = browser ? (window.navigator.userAgent.includes('RoomOS') ? true : false) : false;
</script>

<svelte:head>
  <script crossorigin src="https://unpkg.com/webex@^2/umd/webex.min.js"></script>
</svelte:head>

<Background imageLink={demo.backgroundPoster} filter="brightness({demo.backgroundBrightness}%)" />
<section id="hero" class="hero is-fullheight has-text-white is-dark">
  <!-- hero-head start -->
  <div id="head-widgets" class="hero-head">
    <nav class="navbar is-translucent-black">
      <div class="container is-block">
        <div class="columns m-0">
          <div id="brand" class="column is-7 is-flex is-align-self-center">
            <Brand title={demo.brandLogo} subtitle={demo.brandSubtitle} />
          </div>
          <div id="weather" class="column is-5 is-align-self-center">
            <Weather cityId={demo.weatherCityId} units={demo.weatherUnits} {getWeatherResponse}>
              <Clock timeFormatOptions={{ hour: '2-digit', minute: '2-digit', hour12: false }} />
            </Weather>
          </div>
        </div>
      </div>
    </nav>
  </div>
  <!-- hero-head end -->
  <!-- hero-body start -->
  <div id="body-widgets" class="hero-body p-1">
    <div class="container">
      <!--lhs start-->
      <div id="sessions" class="box is-flex is-flex-direction-column  is-translucent-black">
        {#if role === 'responder'}
          {#if demo.responderAuthIsRequired}
            {#if !$tokenResponseStore}
              <div style="margin-top: 20%">
                <DeviceCode
                  title="Favorites"
                  isMinimal={false}
                  {getAuthorizeResponse}
                  {getTokenResponse}
                  on:newTokenResponse={(e) => tokenResponseStore.set(e.detail)}
                />
              </div>
            {:else}
              <Responder socketID={demo.uuid} />
            {/if}
          {:else}
            <Responder socketID={demo.uuid} />
          {/if}
        {:else}
          <Requester socketID={demo.uuid} meetingTypeOptions={demo.meetingTypeOptions} />
        {/if}
      </div>
    </div>
  </div>
  <!-- hero-body end -->
  <!-- hero-foot start -->
  <div id="foot-widgets" class="hero-foot mx-2 p-2">
    <nav class="tabs">
      <div class="container">
        <div class="is-flex is-justify-content-flex-end ">
          <div class="has-text-centered has-text-weight-medium">
            <p>
              Made with
              <span class="icon-text has-text-danger">
                <i class="mdi mdi-heart" />
              </span>
              by the WXSD team (wxsd@external.cisco.com)
            </p>
          </div>
        </div>
      </div>
    </nav>
  </div>
  <!-- hero-foot end -->
</section>

<style lang="scss">
  @use 'bulma/sass/helpers/typography';
  @use 'bulma/sass/helpers/color';
  @use 'bulma/sass/helpers/spacing';

  #sessions {
    height: 43rem;

    @media screen and (min-width: 480px) {
      height: 48rem;
    }
  }

  #weather {
    display: none;

    @media screen and (min-width: 480px) {
      display: block;
    }
  }

  .is-translucent-black {
    background-color: hsl(0, 0%, 0%, 0.8) !important;
    box-shadow: none !important;
  }

  #device-code :global(hr) {
    background-color: hsl(0deg, 0%, 71%);
  }

  #device-code :global(nav.navbar > div.navbar-menu) {
    background-color: transparent;
  }

  #device-code :global(div.navbar-item) {
    @extend .px-0;
  }

  #device-code > :global(div.favourite-contacts-container) {
    height: calc(3.7 * (30px + 8px + 24px + 24px) - 25.2px);
    overflow-y: auto;
    overflow-x: hidden;
  }

  #app-model :global(.modal-content) {
    @extend .p-2;
    @extend .is-translucent-black;
    border-radius: var(--border-radius-large);
    width: calc(100% - 10vw);
  }

  #app-model :global(iframe) {
    border-radius: var(--border-radius-large);
  }

  @media screen and (max-width: 1215px) {
  }

  @media screen and (max-width: 1215px) {
  }
</style>
