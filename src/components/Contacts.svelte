<script lang="ts">
  import { accessTokenSession } from '../lib/store';
  import Device from './Auth/Device.svelte';
</script>

{#if $accessTokenSession}
  <iframe
    src={`https://wxsd-sales.github.io/presence-on-device/?token=${$accessTokenSession.access_token}`}
    frameborder="0"
    id="contactsIframe"
    title="contacts"
  />
{:else}
  <Device />
{/if}

<style>
  #contactsIframe {
    width: 100%;
    height: 100%;
  }
</style>
