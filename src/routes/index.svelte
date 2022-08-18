<script lang="ts">
  import { jsonRequest } from '../lib/shared/json-request';
  import { derived, readable, writable } from 'svelte/store';
  import { browser } from '$app/env';
  import Weather from '$components/Weather/Weather.svelte';
  import Clock from '$components/Clock/Clock.svelte';
  import Background from '$components/Background/Background.svelte';
  import Brand from '$components/Brand/Brand.svelte';
  import DeviceCode from '$components/OAuth/DeviceCode/DeviceCode.svelte';
  import RoomAnalytics from '$components/RoomAnalytics/RoomAnalytics.svelte';
  import GuestInvite from '$components/GuestInvite/GuestInvite.svelte';
  import Bookings from '$components/Bookings/Bookings.svelte';
  import News from '$components/News/News.svelte';
  import Authorized from '$components/Authorized/Authorized.svelte';
  import FavouriteContacts from '../components/FavouriteContacts/FavouriteContacts.svelte';
  import Modal from '$components/Modal/Modal.svelte';
  import * as TYPES from '$lib/types';

  export let botToken = undefined;
  export let deviceId = undefined;
  export let demo = undefined;

  const defaultBookings = [
    {
      id: '1d308d49-a0f0-66a7-958d-f8a9361ae9a8',
      number:
        'https://teams.microsoft.com/l/meetup-join/19%3ameeting_MjU1NjUwM2EtYTYwYS00MzkxLWJiYjAtYmEyODI1NjFjNGM4%40thread.v2/0?context=%7b%22Tid%22%3a%2269cf187c-bec0-4e17-8b94-4edc6bbb7214%22%2c%22Oid%22%3a%227ef27040-10d2-4bf8-9ac6-918ee374bb73%22%7d',
      organizer: { name: 'William Mills', email: 'wimills@cisco.com' },
      protocol: 'WebRTC',
      platform: 'MicrosoftTeams',
      time: { start: '2022-05-16T19:20:00Z', end: '2022-05-16T19:37:00Z', startBuffer: 300 },
      title: 'Microsoft Teams Booking',
      privacy: 'Private'
    },
    {
      id: 'ee185ae7-ac99-6162-8ba2-f0482bcda22c',
      number: 'https://meet.google.com/fbh-zbuk-mbp?hs=224',
      organizer: { name: 'Ashesh Singh', email: 'ashessin@cisco.com' },
      protocol: 'WebRTC',
      platform: 'GoogleMeet',
      time: { start: '2022-05-16T18:37:00Z', end: '2022-05-16T19:37:00Z', startBuffer: 300 },
      title: 'Google Meet Booking',
      privacy: 'Private'
    }
  ];
  export const devicesHttpApiRequest = jsonRequest('/api', `devices/${deviceId}`, 'Bearer', botToken);

  export const getStatus = () => devicesHttpApiRequest.get('status').then((r) => r.json());
  export const disconnect = (id) => devicesHttpApiRequest.post('call-disconnect', undefined, { callId: id });
  export const connect = (id: string, destination: string, type?: 'MSTeams' | 'GoogleMeet' | '') =>
    type != null && type !== ''
      ? devicesHttpApiRequest.post('webrtc-join', undefined, { bookingId: id, url: destination, type })
      : devicesHttpApiRequest.post('dial', undefined, { bookingId: id, number: destination });
  export const getBookings = () =>
    devicesHttpApiRequest
      .get('bookings')
      .then((r) => r.json())
      .then((r) => [...r, ...defaultBookings]);

  export const statusStore = readable<TYPES.Status>(undefined, (set) => {
    const interval = setInterval(async () => set(await getStatus()), 1000);
    return () => clearInterval(interval);
  });

  export const roomAnalyticsStore = derived(statusStore, (status) => {
    const roomAnalytics = status?.roomAnalytics;
    const peripheralsRoomAnalytics = status?.peripherals
      ?.filter((e) => e.roomAnalytics != null)
      ?.map((e) => e.roomAnalytics);
    return {
      airQualityIndex:
        roomAnalytics?.airQualityIndex ??
        peripheralsRoomAnalytics?.find((e) => e?.airQualityIndex ?? false)?.airQualityIndex,
      ambientTemperature:
        roomAnalytics?.ambientTemperature ??
        peripheralsRoomAnalytics?.find((e) => e?.ambientTemperature ?? false)?.ambientTemperature,
      relativeHumidity:
        roomAnalytics?.relativeHumidity ??
        peripheralsRoomAnalytics?.find((e) => e?.relativeHumidity ?? false)?.relativeHumidity,
      peopleCountCurrent: roomAnalytics?.peoplePresence ? roomAnalytics?.peopleCountCurrent : 0,
      peopleCountCapacity: roomAnalytics?.peopleCountCapacity,
      ambientNoiseLevelA: roomAnalytics?.ambientNoiseLevelA
    } as TYPES.RoomAnalytics;
  });

  export const callsStore = derived(statusStore, (status) => {
    const calls = status?.calls?.map(({ id, bookingId, ...call }) => ({ id, bookingId }));
    return calls ?? [];
  });

  export const tokenResponseStore = writable<TYPES.TokenResponse>();

  const buttons = ['A', 'B', 'C']
    .filter((e) => demo?.[`button${e}Text`] && demo?.[`button${e}Link`])
    .map((e) => ({ text: demo?.[`button${e}Text`], link: demo?.[`button${e}Link`] }));

  let activeModalLink = undefined;
</script>

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
            <Weather cityId={demo.weatherCityId} units={demo.weatherUnits}>
              <Clock timeFormatOptions={{ hour: '2-digit', minute: '2-digit', hour12: false }} />
            </Weather>
          </div>
        </div>
      </div>
    </nav>
  </div>
  <!-- hero-head end -->
  <!-- hero-body start -->
  <div id="body-widgets" class="hero-body py-2">
    <div class="container">
      <div class="tile is-ancestor is-block is-flex-widescreen">
        <!--lhs start-->
        <div class="tile is-7 is-vertical is-parent is-flex-widescreen is-flex-grow-1 is-justify-content-space-between">
          <div id="device-code" class="tile is-child box is-translucent-black has-text-white">
            {#if $tokenResponseStore?.accessToken == null}
              <DeviceCode title="Favourite Contacts" on:newTokenResponse={(e) => tokenResponseStore.set(e.detail)} />
            {:else}
              <Authorized {tokenResponseStore}>
                <FavouriteContacts
                  id={$tokenResponseStore.id}
                  accessToken={$tokenResponseStore.accessToken}
                  edit={false}
                  {disconnect}
                  {connect}
                  {callsStore}
                />
              </Authorized>
            {/if}
          </div>
          <div id="news" class="tile is-child box is-translucent-black has-text-white">
            <News query={demo.newsUrl != null ? new URL(demo.newsUrl).searchParams.get('query') : 'webex'} />
          </div>
        </div>
        <!--lsh end-->
        <!--rhs start-->
        <div class="tile is-5 is-vertical is-parent is-flex-widescreen is-flex-grow-1 is-justify-content-space-between">
          <div
            id="guest-invite"
            class="tile is-child box is-translucent-black has-text-white is-flex-grow-0 is-flex-shrink-1"
          >
            <GuestInvite {disconnect} {connect} {callsStore} />
          </div>
          <div
            id="bookings"
            class="tile is-child box is-translucent-black has-text-white is-flex-grow-0 is-flex-shrink-1"
          >
            <Bookings {getBookings} {disconnect} {connect} {callsStore} />
          </div>
          <div
            id="room-analytics"
            class="tile is-child box is-translucent-black has-text-white is-flex-grow-0 is-flex-shrink-1"
          >
            <RoomAnalytics {roomAnalyticsStore} units={demo.weatherUnits} />
          </div>
        </div>
        <!--rhs end-->
      </div>
    </div>
  </div>
  <!-- hero-body end -->
  <!-- hero-foot start -->
  <div id="foot-widgets" class="hero-foot mx-2 pt-2">
    <nav class="tabs">
      <div class="container">
        <div class="columns is-multiline is-centered is-vcentered">
          <div class="column is-7 has-text-centered-mobile buttons mb-0">
            <button
              class="button is-danger is-light is-small is-rounded mr-6"
              type="button"
              on:click|preventDefault={() => browser && location.reload()}
            >
              <span class="icon">
                <i class="mdi mdi-reload" />
              </span>
            </button>
            {#each buttons as button}
              <button
                class="button is-primary is-light is-small is-rounded"
                type="button"
                on:click={() => (activeModalLink = button.link)}>{button.text}</button
              >
            {/each}
          </div>
          <div class="column is-5 has-text-centered has-text-weight-medium">
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

{#if activeModalLink}
  <div id="app-model">
    <Modal isActive={activeModalLink != null} on:click={() => (activeModalLink = undefined)}>
      <figure class="image is-16by9">
        <iframe src={activeModalLink} class="has-ratio" />
      </figure>
    </Modal>
  </div>
{/if}

<style lang="scss">
  @use 'bulma/sass/helpers/typography';
  @use 'bulma/sass/helpers/color';
  @use 'bulma/sass/helpers/spacing';

  .is-translucent-black {
    background-color: hsl(0, 0%, 0%, 0.8) !important;
    box-shadow: none !important;
  }

  #device-code :global(hr) {
    background-color: hsl(0deg, 0%, 71%);
  }

  #device-code :global(div.navbar-item) {
    @extend .px-0;
  }
  #device-code > :global(div.favourite-contacts-container) {
    height: calc(3.7 * (30px + 8px + 24px + 24px) - 25.2px);
    overflow-y: auto;
    overflow-x: hidden;
  }

  #news > :global(div.news-container) {
    height: calc(3.7 * (30px + 8px + 24px + 24px));
    overflow-y: auto;
    overflow-x: hidden;
  }

  #bookings > :global(div.bookings-container) {
    height: calc(3.7 * (var(--size-5) + 1.39 * var(--size-6)));
    overflow-y: auto;
    overflow-x: hidden;
  }

  #room-analytics > :global(div.room-analytics-row > div.room-analytics-column > div.room-analytics-card-container) {
    @extend .p-2;
    border-radius: var(--border-radius-large);
    box-shadow: hsl(0deg, 0%, 71%) 0 0 0 2px;
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
    .tile.is-7 {
      display: block;
      flex: none;
      width: 100%;
    }
  }
  @media screen and (max-width: 1215px) {
    .tile.is-5 {
      display: block;
      flex: none;
      width: 100%;
    }
  }
</style>
