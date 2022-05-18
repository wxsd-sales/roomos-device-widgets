<script lang="ts">
  import { webexOauthSessionWritable } from '../../lib/store';
  import Device from '../Auth/Device.svelte';
  import Content from './Content.svelte';
</script>

{#if $webexOauthSessionWritable}
  <Content />
{:else}
  <Device />
{/if}
