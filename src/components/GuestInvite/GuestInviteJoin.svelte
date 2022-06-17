<script lang="ts">
  import { readable } from 'svelte/store';
  import { createEventDispatcher } from 'svelte';
  import Title from '../Title/Title.svelte';
  import Meet from '../Meet/Meet.svelte';

  export let title = 'Text Video Chat Link to a Guest';
  export let uuid = undefined;
  export let number: string;
  export let sipTarget: string;
  export let callsStore = readable([]);
  export let disconnect: (...args) => Promise<Response> = () => Promise.reject(undefined);
  export let connect: (...args) => Promise<Response> = () => Promise.reject(undefined);

  const dispatch = createEventDispatcher();
</script>

{#if title}
  <Title text={title} />
{/if}

<div class="columns is-mobile is-vcentered">
  <div class="column is-flex is-align-items-center is-justify-content-center has-text-centered">
    <p>Meeting link sent to {number}.</p>
  </div>
  <div class="column is-5">
    <button
      class="button is-danger is-rounded is-medium is-fullwidth"
      type="button"
      on:click={() => dispatch('guestInviteRemove')}
    >
      <span class="icon">
        <i class="mdi mdi-arrow-left" />
      </span>
      <span>Back</span>
    </button>
  </div>
</div>
<div class="columns is-vcentered">
  <div class="column">
    <Meet id={uuid} destination={sipTarget} {callsStore} {disconnect} {connect} />
  </div>
</div>
