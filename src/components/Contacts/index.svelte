<script lang="ts">
  import { webexOauthSessionWritable } from '../../lib/store';
  import Device from '../Auth/Device.svelte';
  import Content from './Content.svelte';
</script>

{#if $webexOauthSessionWritable}
  <Content />
{:else}
  <h1 class="title is-size-4">Contacts</h1>
  <Device text="Sign in to access and manage your contacts" />
{/if}
