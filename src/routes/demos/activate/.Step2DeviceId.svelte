<script lang="ts">
  import type { JSONObject, JSONValue } from '@sveltejs/kit/types/private';
  import { botToken, botEmail, deviceId } from '.stores';
  import { webexHttp } from '$lib/webex/http-wrapper';

  export let compatibleDevices: JSONValue = [];

  let isLoading = false;

  const isCompatibleDevice = (r: Record<string, unknown>) =>
    r?.type.toLowerCase() === 'roomdesk' && r?.connectionStatus === 'connected' && (r?.errorCodes as []).length === 0;

  const retrieveCompatibleDevices = (botToken) => {
    isLoading = true;
    compatibleDevices = [];

    return webexHttp(botToken, 'devices')
      .get()
      .then((r) => r.json())
      .then((r) => r.items as JSONObject[])
      .then((r) => r.filter(isCompatibleDevice))
      .then((r) => (compatibleDevices = r) && deviceId.set(undefined))
      .catch((e) => (compatibleDevices = { error: e.status }) && deviceId.set(undefined))
      .finally(() => (isLoading = false));
  };

  $: ($botToken && $botEmail && retrieveCompatibleDevices($botToken)) || (compatibleDevices = []);
</script>

<div class="columns is-multiline is-vcentered">
  <div class="column is-full">
    <h2 class="subtitle">Step #2</h2>
    <h2 class="title">Choose a Device</h2>
  </div>
  <div class="column is-full content mb-0">
    <p>
      The application needs a compatible, newly factory-reset device in shared PWA/Kiosk mode. Additionally, the Webex
      Bot {$botEmail ?? '(in step #1)'} should have access to the xAPI of the device.
    </p>
    <p>If you don't see your target device in the list below, please check that it satisfies the following criteria:</p>
    <ul>
      <li>
        The Bot <span class="is-family-monospace has-text-weight-bold">{$botEmail ?? ''}</span> has "Full Access" to the
        shared workspace/device. To do this, please follow the guide:
        <a
          href="https://developer.webex.com/docs/devices#giving-a-bot-or-user-access-to-the-xapi-of-a-device"
          target="_blank">Giving a bot or user access to the xAPI of a device</a
        >.
      </li>
      <li>There are no pending software updates on the device.</li>
      <li>There are no unresolved errors on the device.</li>
      <li>The device is online.</li>
    </ul>
  </div>
  <div class="column is-full">
    <label class="label" for="device-id">Device ID <sup class="has-text-danger" title="required">*</sup></label>
    <div class="field has-addons mb-0">
      <div class="control has-icons-left is-expanded" class:is-loading={isLoading}>
        <input
          id="device-id"
          class="input"
          name="deviceId"
          list="compatible-devices"
          autocomplete="off"
          bind:value={$deviceId}
          class:is-danger={compatibleDevices?.error}
          disabled={isLoading || compatibleDevices.length === 0 || $botEmail == null}
          required
        />
        <datalist id="compatible-devices">
          {#if compatibleDevices?.length > 0}
            {#each compatibleDevices as compatibleDevice}
              <option value={compatibleDevice.id}>
                {compatibleDevice.serial} &mdash; {compatibleDevice.product}, {compatibleDevice.displayName}
              </option>
            {/each}
          {/if}
        </datalist>
        <span class="icon is-left">
          <i class="mdi mdi-identifier" />
        </span>
      </div>
      <div class="control">
        <button
          class="button is-info"
          disabled={$botEmail == null}
          on:click|preventDefault={retrieveCompatibleDevices($botToken)}
        >
          <span>Refresh</span>
          <span class="icon">
            <i class="mdi mdi-reload" />
          </span>
        </button>
      </div>
    </div>
    <div class="help">
      <p>
        To see a device in the list make sure that it is compatible, online, up-to-date and the bot
        <span class="is-family-monospace">{$botEmail ?? ''}</span> has
        <span class="is-family-monospace">xAPI</span> access to make required changes
      </p>
    </div>
  </div>
  <div class="column is-full">
    <details>
      <summary>Devices</summary>
      <pre>{JSON.stringify(compatibleDevices, null, 2)}</pre>
    </details>
  </div>
</div>

<style>
</style>
