<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let id = undefined;
  export let removeContact: (...args) => Promise<Response> = () => Promise.reject(undefined);

  const dispatch = createEventDispatcher();

  let isLoading = false;

  function handleClick() {
    return Promise.resolve((isLoading = true))
      .then(() => removeContact(id))
      .then(() => dispatch('remove', id))
      .finally(() => (isLoading = false));
  }
</script>

<button
  class="button is-danger is-rounded is-medium is-fullwidth"
  type="button"
  class:is-loading={isLoading}
  on:click={handleClick}
>
  <span class="icon">
    <i class="mdi mdi-account-minus" />
  </span>
</button>

<style>
  .icon {
    position: relative !important;
  }
</style>
