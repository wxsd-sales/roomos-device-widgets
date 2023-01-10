<script lang="ts">
  import DeviceCode from '$components/DeviceCode/DeviceCode.svelte';
  import { jsonRequest } from '$lib/shared/json-request';
  import { tokenResponseStore } from '$lib/store';
  import type { TokenResponse, AuthorizeResponse } from '$lib/types';

  export const httpApiRequest = jsonRequest('/api');

  const getAuthorizeResponse = () =>
    httpApiRequest.post('device-code/webex/authorize').then((r) => r.json() as Promise<AuthorizeResponse>);

  export const getTokenResponse = (deviceCode: string) =>
    httpApiRequest.post('device-code/webex/token', { deviceCode }).then((r) => r.json() as Promise<TokenResponse>);
</script>

<DeviceCode
  isMinimal={false}
  {getAuthorizeResponse}
  {getTokenResponse}
  on:newTokenResponse={(e) => tokenResponseStore.set(e.detail)}
/>
