<script lang="ts">
  import { browser } from '$app/env';

  export let activation = undefined;
  export let origin = browser ? window.location.origin : '';

  let url = origin + '/?activationId=' + activation?.id;
  let deviceMode = 'pwa';

  let isLoading = false;

  const copyUrl = (url) => {
    browser &&
      Promise.resolve((isLoading = true))
        .then(() => navigator.clipboard.writeText(url))
        .finally(() => setTimeout(() => (isLoading = false), 400));
  };
</script>

<div id="demo-activate-done" class="container px-4 mb-6">
  <div class="columns is-multiline">
    <div class="column is-full">
      <h2 class="title">Your PWA/Kiosk URL</h2>
    </div>
    <hr />
    <div class="column is-full">
      <div class="field has-addons mb-0">
        <div class="control has-icons-left is-expanded">
          <input id="url" class="has-text-success input is-medium has-text-weight-bold" value={url} readonly />
          <span class="icon is-left">
            <i class="mdi mdi-link" />
          </span>
        </div>
        <div class="control">
          <button class="button is-info is-medium" class:is-loading={isLoading} on:click={() => copyUrl(url)}>
            <span>Copy</span>
            <span class="icon">
              <i class="mdi mdi-content-copy" />
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="column is-full content mb-0">
      <div class="notification is-danger is-light px-5">
        Copy this URL and keep it in a safe place, you may not see this again.
      </div>
      <div class="notification is-danger is-light px-5">
        <p>
          Please note that this is a unique PWA/Kiosk mode URL linked to a particular Device Id, Bot Access Token, etc.
          The URL is not protected by any form of authorization mechanism and anyone with the knowledge of this url may
          even use it to remotely control the device.
        </p>
        <p>
          <b>Hence, you must not share it with others or use it on a different device.</b>
          Doing so can compromise the associated token(s) and cause unintended outcomes.
        </p>
        <p>
          Finally, always be cognizant of user access levels in your org and make sure to maintain proper access logs.
        </p>
      </div>
    </div>
    <div class="column is-full content mb-0">
      <div class="notification is-info is-light px-5">
        <label for="device-mode" class="label">Select Device Mode to see Usage Instructions</label>
        <div class="select is-fullwidth block">
          <select id="device-mode" bind:value={deviceMode}>
            <option value="pwa">PWA</option>
            <option value="kiosk">Kiosk</option>
          </select>
        </div>
        <p>
          Visit the org's
          <a href="https://admin.webex.com/devices" target="_blank">Control Hub device page</a>, choose your device and
          make the following changes using the "All configuration" link:
        </p>
        {#if deviceMode === 'pwa'}
          <ol>
            <li>
              Set the value for
              <span class="is-family-monospace">NetworkServices > HTTP > Mode</span> to
              <span class="is-family-monospace has-text-weight-semibold">HTTP+HTTPS</span>
            </li>
            <li>
              Set the value for
              <span class="is-family-monospace">WebEngine > Mode</span> to
              <span class="is-family-monospace has-text-weight-semibold">On</span>
            </li>
            <li>
              Set the value for
              <span class="is-family-monospace">WebEngine > Features > Xapi.Peripherals.AllowedHosts.Hosts</span> to
              <span class="is-family-monospace has-text-weight-semibold">*</span>
            </li>
            <li>
              Set the value for
              <span class="is-family-monospace">UserInterface > HomeScreen.Peripherals.WebApp.URL</span> to
              <span class="is-family-monospace has-text-weight-semibold">{url}</span>
            </li>
            <li>
              Set the value for
              <span class="is-family-monospace">RoomAnalytics > AmbientNoiseEstimation > Mode</span> to
              <span class="is-family-monospace has-text-weight-semibold">On</span>
            </li>
            <li>
              Set the value for
              <span class="is-family-monospace">RoomAnalytics > PeoplePresenceDetector</span> to
              <span class="is-family-monospace has-text-weight-semibold">On</span>
            </li>
          </ol>
          <details open>
            <summary>Example</summary>
            <figure>
              <img src="/pwa/admin.webex.com_overview.png" alt="PWA Configuration" />
            </figure>
          </details>
        {/if}
        {#if deviceMode === 'kiosk'}
          <ol>
            <li>
              Set the value for
              <span class="is-family-monospace">NetworkServices > HTTP > Mode</span> to
              <span class="is-family-monospace has-text-weight-semibold">HTTP+HTTPS</span>
            </li>
            <li>
              Set the value for
              <span class="is-family-monospace">WebEngine > Mode</span> to
              <span class="is-family-monospace has-text-weight-semibold">On</span>
            </li>
            <li>
              Set the value for
              <span class="is-family-monospace">WebEngine > Features > SipUrlHandler</span> to
              <span class="is-family-monospace has-text-weight-semibold">On</span>
            </li>
            <li>
              Set the value for
              <span class="is-family-monospace">UserInterface > Kiosk > URL</span> to
              <span class="is-family-monospace has-text-weight-semibold">{url}</span>
            </li>
            <li>
              Set the value for
              <span class="is-family-monospace">UserInterface > Kiosk > Mode</span> to
              <span class="is-family-monospace has-text-weight-semibold">On</span>
            </li>
            <li>
              Set the value for
              <span class="is-family-monospace">RoomAnalytics > AmbientNoiseEstimation > Mode</span> to
              <span class="is-family-monospace has-text-weight-semibold">On</span>
            </li>
            <li>
              Set the value for
              <span class="is-family-monospace">RoomAnalytics > PeoplePresenceDetector</span> to
              <span class="is-family-monospace has-text-weight-semibold">On</span>
            </li>
          </ol>
          <details open>
            <summary>Example</summary>
            <figure>
              <img src="/kiosk/admin.webex.com_overview.png" alt="Kiosk Configuration" />
            </figure>
          </details>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  img {
    border-radius: var(--border-radius);
  }
  #demo-activate-done :global(details > summary) {
    cursor: pointer;
  }
  #demo-activate-done :global(details) {
    border: 1px solid hsl(0deg, 0%, 86%);
    border-radius: var(--border-radius);
    padding: 0.75rem;
  }
</style>
