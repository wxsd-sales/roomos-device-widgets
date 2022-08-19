<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let id: string = undefined;
  export let addContact: (...args: string[]) => Promise<Response> = () => Promise.reject(undefined);

  const dispatch = createEventDispatcher();

  let isLoading = false;

  function handleClick() {
    return Promise.resolve((isLoading = true))
      .then(() => addContact(id))
      .then(() => dispatch('add', id))
      .finally(() => (isLoading = false));
  }
</script>

<button
  class="button is-success is-rounded is-medium is-fullwidth"
  type="button"
  class:is-loading={isLoading}
  on:click={handleClick}
>
  <span class="icon">
    <i class="mdi mdi-account-plus" />
  </span>
</button>

<style>
  .icon {
    position: relative !important;
  }
</style>
