<script lang="ts">
  import { derived, readable, writable } from 'svelte/store';
  import { browser } from '$app/env';
  import { page } from '$app/stores';
  import { jsonRequest } from '$lib/shared/json-request';
  import { webexSdk, webexSdkPeoplePlugin, webexSdkInternalConversationPlugin } from '$lib/webex/sdk-wrapper';
  import { webexHttpRoomsResource } from '$lib/webex/http-wrapper';
  import type { JSONObject } from '@sveltejs/kit/types/private';
  import type * as TYPES from '$lib/types';

  import Weather from '$components/Weather/Weather.svelte';
  import Clock from '$components/Clock/Clock.svelte';
  import Background from '$components/Background/Background.svelte';
  import Brand from '$components/Brand/Brand.svelte';
  import DeviceCode from '$components/DeviceCode/DeviceCode.svelte';
  import RoomAnalytics from '$components/RoomAnalytics/RoomAnalytics.svelte';
  import GuestInvite from '$components/GuestInvite/GuestInvite.svelte';
  import Bookings from '$components/Bookings/Bookings.svelte';
  import News from '$components/News/News.svelte';
  import Authorized from '$components/Authorized/Authorized.svelte';
  import FavouriteContacts from '$components/FavouriteContacts/FavouriteContacts.svelte';
  import FavouriteSpaces from '$components/FavouriteSpaces/FavouriteSpaces.svelte';
  import Modal from '$components/Modal/Modal.svelte';

  export let botToken = undefined;
  export let deviceId = undefined;
  export let demo = undefined;
  export let statusErrorCountThreshold = 10;
  export let authWidget = $page.url.searchParams.get('authWidget') ?? 'contacts';

  let statusErrorCount = 0;
  let activeModalLink = undefined;
  let isUserListEditable = false;

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
  export const httpApiRequest = jsonRequest('/api');
  export const devicesHttpApiRequest = jsonRequest('/api', `devices/${deviceId}`, 'Bearer', botToken);

  export const getAuthorizeResponse = () =>
    httpApiRequest.post('device-code/webex/authorize').then((r) => r.json() as Promise<TYPES.AuthorizeResponse>);

  export const getTokenResponse = (deviceCode: string) =>
    httpApiRequest
      .post('device-code/webex/token', { deviceCode })
      .then((r) => r.json() as Promise<TYPES.TokenResponse>);

  export const getWeatherResponse = (id: number, units: string) =>
    httpApiRequest.get('weather', { id, units }).then((r) => r.json() as Promise<TYPES.WeatherResponse>);

  export const getStatus = () =>
    devicesHttpApiRequest
      .get('status')
      .then((r) => !(statusErrorCount = 0) && (r.json() as Promise<TYPES.Status>))
      .catch((e) => (statusErrorCount = statusErrorCount + 1) && Promise.reject(e));

  export const disconnect = (id: number) => devicesHttpApiRequest.post('call-disconnect', undefined, { callId: id });

  export const connect = (id: string, destination: string, type?: 'MSTeams' | 'GoogleMeet' | '') =>
    type != null && type !== ''
      ? devicesHttpApiRequest.post('webrtc-join', undefined, { bookingId: id, url: destination, type })
      : devicesHttpApiRequest.post('dial', undefined, { bookingId: id, number: destination });

  export const getBookings = () =>
    devicesHttpApiRequest
      .get('bookings')
      .then((r) => r.json())
      .then((r) => [...r, ...defaultBookings]);

  export const getFavouriteSpaces = (id, accessToken) => {
    const webex: Promise<unknown> = webexSdk(accessToken).initialize();
    const webexInternalConversationPlugin = webexSdkInternalConversationPlugin();
    const webexPeoplePlugin = webexSdkPeoplePlugin();
    const webexHttpRoomsRequest = webexHttpRoomsResource(accessToken);

    return webex.then((r) =>
      (
        webexInternalConversationPlugin.list(r, {
          globalId: true,
          isFavorite: true,
          participantsLimit: 2
        } as unknown) as Promise<unknown>
      ).then(async (s) => {
        const [directConversations, groupConversations] = (s as []).reduce(
          (r, e) => {
            r[((e as JSONObject).tags as string[]).includes('ONE_ON_ONE') ? 0 : 1].push(e);
            return r;
          },
          [[], []]
        );

        const direct = await Promise.all(
          directConversations.map(async (s) =>
            (
              await Promise.all(
                s?.participants?.items.map(async (s) => {
                  if (s.type.toUpperCase() === 'PERSON') {
                    const id = Buffer.from(`ciscospark://us/PEOPLE/${s.id}`).toString('base64').slice(0, -1);
                    return { id, type: 'person' };
                  } else {
                    const { id, avatar, displayName, nickName, userName, emails, type } = await webexPeoplePlugin.get(
                      r,
                      s.id
                    );
                    return {
                      id,
                      avatar,
                      title: displayName ?? nickName ?? userName,
                      sipAddress: emails[0],
                      type
                    };
                  }
                })
              )
            ).filter((r) => r.id !== id)
          )
        ).then((r) => r.flat());

        const group = await Promise.all(
          groupConversations.map(async (s) => {
            const id = s.globalId;
            const isLocked = s.tags.includes('LOCKED');
            const isAnnouncementOnly = s.tags.includes('ANNOUNCEMENT');
            const title = s.displayName ?? s.computedTitle;
            const avatarFileItem = s?.avatar?.files?.items[0];
            const avatarBufferItem = avatarFileItem
              ? await webexInternalConversationPlugin.download(r, avatarFileItem)
              : undefined;
            const avatarBase64 = avatarBufferItem
              ? `data:${avatarFileItem.mimeType};base64,${Buffer.from(avatarBufferItem as never).toString('base64')}`
              : undefined;
            const sipAddress = await webexHttpRoomsRequest
              .getRoomMeetingDetails(id)
              .then((s) => s.json())
              .then((s) => s.sipAddress)
              .catch((e) => (e.status === 403 && isAnnouncementOnly ? undefined : Promise.reject(e)));
            return { id, title, avatar: avatarBase64, sipAddress, isLocked, isAnnouncementOnly };
          })
        );

        return { direct, group };
      })
    );
  };

  export const statusStore = readable<TYPES.Status>(undefined, (set) => {
    const interval = setInterval(
      async () => set(statusErrorCount < statusErrorCountThreshold ? await getStatus() : undefined),
      1000
    );
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
      peoplePresence: roomAnalytics?.peoplePresence,
      peopleCountCurrent: roomAnalytics?.peopleCountCurrent,
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
  <div id="body-widgets" class="hero-body py-2">
    <div class="container">
      <div class="tile is-ancestor is-block is-flex-widescreen">
        <!--lhs start-->
        <div class="tile is-7 is-vertical is-parent is-flex-widescreen is-flex-grow-1 is-justify-content-space-between">
          <div id="device-code" class="tile is-child box is-translucent-black has-text-white is-flex-grow-1">
            {#if $tokenResponseStore?.accessToken == null}
              <DeviceCode
                title="Favorites"
                isMinimal={false}
                {getAuthorizeResponse}
                {getTokenResponse}
                on:newTokenResponse={(e) => tokenResponseStore.set(e.detail)}
              />
            {:else if authWidget === 'spaces'}
              <Authorized {tokenResponseStore}>
                <FavouriteSpaces
                  id={$tokenResponseStore.id}
                  accessToken={$tokenResponseStore.accessToken}
                  {getFavouriteSpaces}
                  {disconnect}
                  {connect}
                  {callsStore}
                />
              </Authorized>
            {:else}
              <Authorized {tokenResponseStore}>
                <button
                  slot="navbar-button"
                  class="button is-rounded is-primary is-medium"
                  on:click={() => (isUserListEditable = !isUserListEditable)}
                >
                  <span class="icon">
                    <i class="mdi {isUserListEditable ? 'mdi-account-eye' : 'mdi-account-edit'}" />
                  </span>
                </button>
                <FavouriteContacts
                  id={$tokenResponseStore.id}
                  accessToken={$tokenResponseStore.accessToken}
                  edit={isUserListEditable}
                  {disconnect}
                  {connect}
                  {callsStore}
                />
              </Authorized>
            {/if}
          </div>
          <div id="news" class="tile is-child box is-translucent-black has-text-white is-flex-grow-0 is-flex-shrink-1">
            <News query={demo.newsUrl != null ? new URL(demo.newsUrl).searchParams.get('q') : undefined} />
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

  #news > :global(div.news-container) {
    height: calc(3.7 * (30px + 8px + 24px + 24px));
    overflow-y: auto;
    overflow-x: hidden;
  }

  #bookings > :global(div.bookings-container) {
    height: calc(3.7 * (var(--size-5) + 2 * var(--size-6)));
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
