<script lang="ts">
  import type { Status } from './types/status';
  import Presence from '../Presence/Presence.svelte';

  export let initials = 'U';
  export let image = undefined;
  export let status: Status = undefined;
  export let size = 64;
</script>

<figure class="image is-{size}x{size} avatar-container">
  <img class="is-rounded avatar-image" src={image ?? '/api/avatar?initials=' + initials} alt="avatar" />
  {#if status && status !== 'unknown'}
    <Presence {status} />
  {/if}
</figure>

<style>
  figure.avatar-container {
    position: relative !important;
  }

  figure.avatar-container > .avatar-image {
    position: absolute !important;
    width: 100%;
    height: 100%;
    bottom: 0;
    right: 0;
  }

  figure.avatar-container > :global(.presence) {
    position: absolute !important;
    border-radius: 100%;
    width: 35%;
    height: 35%;
    bottom: 0;
    right: 0;
  }
</style>
