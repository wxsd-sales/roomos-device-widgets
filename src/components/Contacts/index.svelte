<script lang="ts">
  import { accessTokenSession } from '../../lib/store';
  import Device from '../Auth/Device.svelte';
  import Content from './Content.svelte';
</script>

{#if $accessTokenSession}
  <Content />
{:else}
  <Device />
{/if}
