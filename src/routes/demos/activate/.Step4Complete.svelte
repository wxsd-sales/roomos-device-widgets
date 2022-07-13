<script lang="ts">
  import { botToken, botEmail, deviceId, demoUuid } from '.stores';
  import { webexHttp } from '$lib/webex/http-wrapper';

  export let deviceStatus = {};

  export const retrieveDeviceStatus = (botToken: string, deviceId: string) =>
    webexHttp(botToken, 'xapi')
      .get('status', { deviceId: deviceId, name: '*' })
      .then((r) => r.json())
      .then((r) => (deviceStatus = r))
      .catch((e) => (deviceStatus = { error: e.status }));

  $: ($botToken && $deviceId && $demoUuid && retrieveDeviceStatus($botToken, $deviceId)) || (deviceStatus = {});
</script>

<div class="columns is-multiline is-vcentered is-mobile">
  <div class="column is-full">
    <details open>
      <summary>Device Status (current)</summary>
      <pre>{JSON.stringify(deviceStatus, null, 2)}</pre>
    </details>
  </div>
</div>
