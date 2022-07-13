<script lang="ts">
  import Prerequisites from '.Step0Prerequisites.svelte';
  import BotToken from '.Step1BotToken.svelte';
  import DeviceId from '.Step2DeviceId.svelte';
  import DemoUuid from '.Step3DemoUuid.svelte';
  import Complete from '.Step4Complete.svelte';
  import { onMount } from 'svelte';

  export let form = undefined;

  let formElement: HTMLFormElement;

  onMount(() => form && scrollTo(null, formElement.scrollHeight));
</script>

<form id="demo-activate" class="container px-4 mb-6" action="./activate" method="post" bind:this={formElement}>
  <Prerequisites />
  <hr />
  <BotToken />
  <hr />
  <DeviceId />
  <hr />
  <DemoUuid />
  <hr />
  <Complete />
  <hr />
  <div class="columns is-multiline">
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
