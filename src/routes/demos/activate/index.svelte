<script lang="ts">
  import Prerequisites from '.Step0Prerequisites.svelte';
  import BotToken from '.Step1BotToken.svelte';
  import DeviceId from '.Step2DeviceId.svelte';
  import DemoUuid from '.Step3DemoUuid.svelte';
  import GoogleIntegration from '.Step4GoogleIntegration.svelte';
  import MicrosoftIntegration from '.Step5MicrosoftIntegration.svelte';
  import Complete from '.Step6Complete.svelte';
  import * as store from './.stores';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  export let demoUuid = undefined;
  export let botToken = undefined;
  export let deviceId = undefined;
  export let google = {};
  export let microsoft = {};
  export let orgId = undefined;
  export let form = undefined;

  const id = $page.url.searchParams.get('id');
  let formElement: HTMLFormElement;

  $: store.botToken.set(botToken);
  $: store.demoUuid.set(demoUuid);
  $: store.deviceId.set(deviceId);

  onMount(() => form && scrollTo(null, formElement.scrollHeight));
</script>

<form
  id="demo-activate"
  class="container px-4 mb-6"
  action={'./activate' + (id == null ? '' : '?_method=PATCH')}
  method="post"
  bind:this={formElement}
>
  <Prerequisites />
  <hr />
  <BotToken {orgId} />
  <hr />
  <DeviceId />
  <hr />
  <DemoUuid />
  <hr />
  <GoogleIntegration {...google} />
  <hr />
  <MicrosoftIntegration {...microsoft} />
  <hr />
  <Complete />
  <hr />
  <div class="columns is-multiline">
    {#if id != null}
      <div class="column is-12 is-hidden">
        <input class="input" name="id" value={id} readonly />
      </div>
    {/if}
    <div class="column is-12">
      <button class="button is-medium is-rounded is-success is-fullwidth" type="submit">
        <span>Next</span>
        <span class="icon">
          <i class="mdi mdi-arrow-right" />
        </span>
      </button>
    </div>
    <div class="column is-12 has-text-danger">
      {form ?? ''}
    </div>
  </div>
</form>

<style>
  #demo-activate :global(pre) {
    max-height: 400px;
    border-radius: var(--border-radius);
  }
  #demo-activate :global(details > summary) {
    cursor: pointer;
  }
  #demo-activate :global(details) {
    border: 1px solid hsl(0deg, 0%, 86%);
    border-radius: var(--border-radius);
    padding: 0.75rem;
  }
</style>
