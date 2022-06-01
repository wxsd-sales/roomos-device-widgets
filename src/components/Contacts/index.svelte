<script lang="ts">
  import { webexOauthSessionWritable } from '../../lib/store';
  import Device from '../Auth/Device.svelte';
  import Content from './Content.svelte';
</script>

{#if $webexOauthSessionWritable}
  <Content />
{:else}
  <Device text="Sign in to access and manage your Contacts" />
{/if}
