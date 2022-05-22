<script lang="ts">
  import { onMount } from 'svelte';
  import cloudy from '@bybas/weather-icons/production/line/openweathermap/03n.svg';
  import thermometer from '@bybas/weather-icons/production/line/all/thermometer.svg';
  import humidity from '@bybas/weather-icons/production/line/all/humidity.svg';
  import barometer from '@bybas/weather-icons/production/line/all/barometer.svg';
  import smokeParticles from '@bybas/weather-icons/production/line/all/smoke-particles.svg';
  import { roomosJsxapi } from '../../lib/roomos/jsxapi-wrapper/roomos-jsxapi';
  import Contacts from '../../components/Contacts/index.svelte';
  import GuestDemoSmsInvitation from '../../components/GuestDemoSMSInvitation.svelte';
  import { jsonRequest } from '../../lib/shared/json-request';
  import { page } from '$app/stores';
  import FoodMenu from '../../components/FoodMenu.svelte';
  import Modal from '../../components/Modal.svelte';
  import { activeCall, deviceSerial } from '../../lib/store';
  import { v4 as uuidv4 } from 'uuid';

  let xapi;
  let bookings: { call: unknown; organizer: unknown; time: unknown; title: string; meetingPlatform: string }[] = [];
  let ambientTemperature: number;
  let peripheralsAmbientTemperature: number;
  let relativeHumidity: number;
  let peripheralsRelativeHumidity: number;
  let ambientNoise: number;
  let peripheralsAmbientNoise: number;
  let ambientSound: number;
  let peripheralsAirQuality: string;
  let showFoodMenu: boolean;
  let showModal = false;

  const cityId = $page.url.searchParams.get('id') || 4887398;
  const units = $page.url.searchParams.get('units') || 'imperial';
  const brandTitle = $page.url.searchParams.get('brandTitle') || import.meta.env.EXPOSED_BRAND_TITLE || 'Cisco';
  const brandSubtitle = $page.url.searchParams.get('brandSubtitle') || import.meta.env.EXPOSED_BRAND_TITLE || 'Cisco';
  let weather = {
    place: 'Chicago, IL',
    timezone: -18000,
    temp: 56.8,
    tempMin: 49.77,
    tempMax: 55.65,
    main: 'Clouds',
    icon: cloudy
  };

  function convertToF(celsius) {
    return (celsius * 9) / 5 + 32;
  }

  async function updateSensorData() {
    [ambientTemperature, peripheralsAmbientTemperature] = await Promise.all(
      [
        xapi.Status.RoomAnalytics.AmbientTemperature.get(),
        xapi.Status.Peripherals.ConnectedDevice.RoomAnalytics.AmbientTemperature.get()
      ].map((p) => p.catch(() => -0))
    ).then(([t1, t2]) => [Number(t1), Number(t2)]);

    [relativeHumidity, peripheralsRelativeHumidity] = await Promise.all(
      [
        xapi.Status.RoomAnalytics.RelativeHumidity.get(),
        xapi.Status.Peripherals.ConnectedDevice.RoomAnalytics.RelativeHumidity.get()
      ].map((p) => p.catch(() => -0))
    ).then(([t1, t2]) => [Number(t1), Number(t2)]);

    ambientNoise = await xapi.Status.RoomAnalytics.AmbientNoise.Level.A.get()
      .then((n) => Number(n))
      .catch(() => -0);

    ambientSound = await xapi.Status.RoomAnalytics.Sound.Level.A.get()
      .then((n) => Number(n))
      .catch(() => -0);

    peripheralsAirQuality = await xapi.Status.Peripherals.ConnectedDevice.RoomAnalytics.AirQuality.Index.get()
      .then((i) => i)
      .catch(() => null);
  }

  const xcommandRequest = jsonRequest('/xapi', 'command');

  function updateBookingData() {
    const rawBookings = {
      Booking: [
        {
          Agenda: '',
          BookingStatus: 'OK',
          BookingStatusMessage: '',
          Cancellable: 'False',
          DialInfo: {
            Calls: {
              Call: [
                {
                  Number: 'https://meet.google.com/fbh-zbuk-mbp?hs=224',
                  Protocol: 'WebRTC',
                  id: 1
                }
              ]
            },
            ConnectMode: 'OBTP'
          },
          Encryption: 'BestEffort',
          Id: 'webex-17',
          MaximumMeetingExtension: 30,
          MeetingExtensionAvailability: 'Guaranteed',
          MeetingId: 'ee185ae7-ac99-6162-8ba2-f0482bcda22c',
          MeetingPlatform: 'GoogleMeet',
          Organizer: {
            Email: '',
            FirstName: 'Ashesh Singh',
            Id: 'be81be28-0014-4009-ad79-350f53ec8d35',
            LastName: ''
          },
          Privacy: 'Private',
          Recording: 'Disabled',
          Spark: {
            Alert: 'True',
            LocusActive: 'False',
            MeetingType: 'Scheduled',
            Participants: {},
            Pending: 'False'
          },
          Time: {
            EndTime: '2022-05-16T19:37:00Z',
            EndTimeBuffer: 0,
            StartTime: '2022-05-16T18:37:00Z',
            StartTimeBuffer: 300
          },
          Title: 'Google Meeting Test',
          Webex: {
            DialInNumbers: {},
            Enabled: 'False',
            HostKey: '',
            MeetingNumber: '',
            Password: '',
            Url: ''
          },
          id: 2
        },
        {
          Agenda: '',
          BookingStatus: 'OK',
          BookingStatusMessage: '',
          Cancellable: 'False',
          DialInfo: {
            Calls: {
              Call: [
                {
                  Number:
                    'https://teams.microsoft.com/l/meetup-join/19%3ameeting_MjU1NjUwM2EtYTYwYS00MzkxLWJiYjAtYmEyODI1NjFjNGM4%40thread.v2/0?context=%7b%22Tid%22%3a%2269cf187c-bec0-4e17-8b94-4edc6bbb7214%22%2c%22Oid%22%3a%227ef27040-10d2-4bf8-9ac6-918ee374bb73%22%7d',
                  Protocol: 'WebRTC',
                  id: 1
                }
              ]
            },
            ConnectMode: 'OBTP'
          },
          Encryption: 'BestEffort',
          Id: 'webex-18',
          MaximumMeetingExtension: 30,
          MeetingExtensionAvailability: 'Guaranteed',
          MeetingId: '1d308d49-a0f0-66a7-958d-f8a9361ae9a8',
          MeetingPlatform: 'MicrosoftTeams',
          Organizer: {
            Email: '',
            FirstName: 'Mills William',
            Id: 'dd6e60a2-769b-6188-b2a2-ac6ba5f343f6',
            LastName: ''
          },
          Privacy: 'Private',
          Recording: 'Disabled',
          Spark: {
            Alert: 'True',
            LocusActive: 'False',
            MeetingType: 'Scheduled',
            Participants: {},
            Pending: 'False'
          },
          Time: {
            EndTime: '2022-05-16T19:20:00Z',
            EndTimeBuffer: 0,
            StartTime: '2022-05-16T18:50:00Z',
            StartTimeBuffer: 300
          },
          Title: 'Test MS Teams meeting',
          Webex: {
            DialInNumbers: {},
            Enabled: 'False',
            HostKey: '',
            MeetingNumber: '',
            Password: '',
            Url: ''
          },
          id: 3
        }
      ],
      LastUpdated: '2022-05-16T18:44:59Z',
      ResultInfo: {
        TotalRows: 3
      },
      status: 'OK'
    };

    bookings = rawBookings.Booking.filter(() => true).map((r) => ({
      id: uuidv4(),
      call: r.DialInfo.Calls.Call[0] || {},
      time: r.Time || {},
      organizer: r.Organizer || {},
      title: r.Title || '',
      meetingPlatform: r.MeetingPlatform === 'GoogleMeet' ? 'GoogleMeet' : 'MSTeams'
    }));
  }

  async function updateWeatherData() {
    await jsonRequest('/weather')
      .get(undefined, { id: cityId, units: units })
      .then((r) => {
        weather.place = `${r.name}, ${r.sys.country}`;
        weather.main = r.weather[0].main;
        weather.temp = r.main.temp;
        weather.tempMin = r.main.temp_min;
        weather.tempMax = r.main.temp_max;
        weather.icon = cloudy;
      })
      .catch((r) => console.error(r));
  }

  // TODO: Remove Duplicate
  function pollWebrtcStatus(uuid) {
    let tries = 0;
    let intervalId = setInterval(async () => {
      if (tries < 3) {
        const status = await jsonRequest('/check', 'uuids').get(uuid);
        console.log(status);
        if (status == null) {
          console.log('clearing interval id', intervalId);
          clearInterval(intervalId);
          $activeCall.uuid = undefined;
          $activeCall.status = undefined;
        } else if (status?.e) {
          tries = tries + 1;
        } else {
          $activeCall.uuid = uuid;
          if ($activeCall.status?.includes('is-loading') && $activeCall.status?.includes('is-success')) {
            $activeCall.status = 'is-danger';
          }
          if ($activeCall.status?.includes('is-loading') && $activeCall.status?.includes('is-danger')) {
            $activeCall.status = undefined;
          }
        }
      } else {
        console.log('clearing interval id', intervalId);
        clearInterval(intervalId);
        $activeCall.uuid = undefined;
        $activeCall.status = undefined;
      }
    }, 2000);
  }

  // TODO: Remove Duplicate
  async function disconnect() {
    $activeCall.status = 'is-loading is-danger';

    return await xcommandRequest.get('call.disconnect', { serial: $deviceSerial });
  }

  async function dialWebrtc(webRtcUrl, type: string, uuid: string) {
    $activeCall.uuid = uuid;
    $activeCall.status = 'is-loading is-success';

    return await xcommandRequest
      .get('webrtc.join', { url: webRtcUrl, type: type, serial: $deviceSerial, uuid: uuid })
      .then(() => pollWebrtcStatus(uuid));
  }

  onMount(async () => {
    await updateWeatherData();
    updateBookingData();
    xapi = await roomosJsxapi().initialize();
    deviceSerial.set(await xapi.Status.SystemUnit.Hardware.Module.SerialNumber.get());
    setTimeout(updateSensorData, 3000);
  });
</script>

<video
  playsinline
  autoplay
  muted
  loop
  poster="https://assets.website-files.com/61eb3600c6f037f539a83578/61eb3600c6f03751b6a83599_Bloomberg_60_LANDING_PAGE_210825-poster-00001.jpg"
  class="is-brand-video"
>
  <!-- <source
    src="https://assets.website-files.com/61eb3600c6f037f539a83578/61eb3600c6f03751b6a83599_Bloomberg_60_LANDING_PAGE_210825-transcode.webm"
    type="video/webm"
  />
  <source
    src="https://assets.website-files.com/61eb3600c6f037f539a83578/61eb3600c6f03751b6a83599_Bloomberg_60_LANDING_PAGE_210825-transcode.mp4"
    type="video/mp4"
  /> -->
</video>

<section class="hero is-black is-fullheight">
  <!-- Hero head: will stick at the top -->
  <nav class="navbar is-translucent-black">
    <div class="container is-block mt-2 p-2">
      <div class="columns is-size-4">
        <div class="column is-7 has-text-white">
          <h1 class="title is-brand-title has-text-white">{brandTitle}</h1>
          <h2 class="subtitle is-brand-subtitle has-text-white px-1">
            {brandSubtitle}
          </h2>
        </div>
        <div class="column is-5 has-text-weight-light">
          <p class="level-right has-text-weight-medium has-text-grey-light is-size-6 mb-3">{weather.place}</p>
          <div class="level is-mobile mb-0">
            <div class="level-left">Sun, Sep 15, 2021</div>
            <div class="level-right">12:45 PM</div>
          </div>
          <div class="level is-mobile">
            <div class="level-left">
              <p class="level-item">{weather.temp.toFixed(0)}&deg;{units === 'imperial' ? 'F' : 'C'}</p>
              <p class="level-item is-size-6">
                <small>H: {weather.tempMax.toFixed(0)}&deg;{units === 'imperial' ? 'F' : 'C'}</small>
              </p>
              <p class="level-item is-size-6">
                <small>L: {weather.tempMin.toFixed(0)}&deg;{units === 'imperial' ? 'F' : 'C'}</small>
              </p>
            </div>
            <div class="level-right has-text-right">
              <figure class="level-item image is-32x32">
                <img src={weather.icon} alt={weather.main} />
              </figure>
              <p class="level-item">{weather.main}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero content: will be in the middle -->
  <div class="hero-body py-1">
    <div class="container">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <div class="tile is-child box is-translucent-black has-text-white">
            <Contacts />
          </div>
        </div>
        <div class="tile is-5 is-vertical is-parent">
          <div class="tile is-child has-text-white box is-translucent-black" id="sms-title">
            <GuestDemoSmsInvitation />
          </div>
          <div class="tile is-child has-text-white box is-translucent-black">
            <div class="columns is-mobile is-multiline">
              {#each bookings as booking}
                <div class="column is-12 is-inline-grid">
                  <p class="title has-text-white is-size-4 is-overflow-ellipse">{booking.title || '?'}</p>
                </div>
                <div class="column is-8">
                  <p class="subtitle has-text-white mb-1">
                    {new Date(booking.time.StartTime).toLocaleString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    }) || '?'} &mdash; {new Date(booking.time.EndTime).toLocaleString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    }) || '?'}
                  </p>
                  <p class="subtitle has-text-primary-dark">
                    Organised by {booking.organizer.FirstName || booking.organizer.Email || '?'}
                  </p>
                </div>
                <div class="column is-4 is-center">
                  {#if $activeCall?.uuid == null}
                    <button
                      on:click={dialWebrtc(booking.call.Number, booking.meetingPlatform, booking.id)}
                      class="button is-success is-rounded is-medium is-fullwidth"
                    >
                      {#if booking.meetingPlatform === 'GoogleMeet'}
                        <figure class="image is-32x32">
                          <img src="googlemeet.svg" alt="" />
                        </figure>
                      {:else if booking.meetingPlatform === 'MSTeams'}
                        <figure class="image is-32x32">
                          <img src="microsoftteams.svg" alt="" />
                        </figure>
                      {:else}
                        <span class="icon">
                          <i class="mdi mdi-phone" />
                        </span>
                      {/if}
                    </button>
                  {:else if $activeCall?.uuid === booking.id}
                    <button
                      on:click={() => disconnect()}
                      class="button {$activeCall?.status} is-rounded is-medium is-fullwidth"
                    >
                      <span class="icon">
                        <i class="mdi mdi-phone-hangup" />
                      </span>
                    </button>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
          <div class="tile is-child has-text-white box is-translucent-black">
            <div class="level is-mobile mb-0 pb-0">
              <p class="level-left title is-size-4 mb-0 pb-0">Air Quality Index</p>
              <div class="level-right is-size-4 has-text-weight-semibold">
                <figure class="level-left image is-48x48"><img src={smokeParticles} alt="air-quality-index" /></figure>
                {peripheralsAirQuality || '?'}
              </div>
            </div>
            <div class="level is-mobile">
              <div class="level-item has-text-centered">
                <figure class="level-left image is-48x48"><img src={thermometer} alt="ambient-temperature" /></figure>
                <p class="is-size-4 level-right has-text-weight-semibold">
                  {ambientTemperature || peripheralsAmbientTemperature || '?'} &deg;C
                </p>
              </div>
              <div class="level-item has-text-centered">
                <figure class="level-left image is-48x48"><img src={humidity} alt="relative-humidity" /></figure>
                <p class="is-size-4 level-right has-text-weight-semibold">
                  {relativeHumidity || peripheralsRelativeHumidity || '?'} %
                </p>
              </div>
              <div class="level-item has-text-right">
                <figure class="level-left image is-48x48"><img src={barometer} alt="ambient-noise" /></figure>
                <p class="is-size-4 level-right has-text-weight-semibold">
                  {ambientNoise || peripheralsAmbientNoise || '?'} dB
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Hero footer: will stick at the bottom -->
  <div class="hero-foot">
    <nav class="tabs">
      <div class="container mb-4">
        <ul class="">
          <li>
            <a
              class="button is-rounded is-light mx-1 is-primary has-text-primary-dark"
              on:click={() => {
                showModal = true;
                showFoodMenu = true;
              }}>Order Food</a
            >
          </li>
          <li>
            <a
              class="button is-rounded is-light mx-1 is-primary has-text-primary-dark"
              on:click={() => (showModal = true)}>MTA Map</a
            >
          </li>
          <li>
            <a
              class="button is-rounded is-light mx-1 is-primary has-text-primary-dark"
              on:click={() => {
                location.reload();
              }}
            >
              <span class="icon">
                <i class="mdi has-primary-text mdi-refresh" />
              </span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</section>

<Modal
  {showModal}
  toggleModal={() => {
    showModal = false;
    showFoodMenu = false;
  }}
>
  <div class="box is-modal-translucent-black has-text-white">
    {#if showFoodMenu}
      <FoodMenu />
    {:else}
      <figure class="image">
        <img src={'https://upload.wikimedia.org/wikipedia/commons/0/04/NYC_subway-4D.svg'} alt="MTA" />
      </figure>
    {/if}
  </div></Modal
>

<style>
  .is-brand-title {
    font-size: 4.35rem;
  }
  .is-brand-subtitle {
    font-size: 1.275rem;
  }
  .is-brand-video {
    object-fit: cover;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    filter: brightness(60%);
  }

  .is-translucent-black {
    background-color: hsl(0, 0%, 0%, 0.7);
    box-shadow: none;
  }
  #sms-title {
    min-height: 210px;
  }
</style>
