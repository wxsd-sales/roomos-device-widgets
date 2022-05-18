<script lang="ts">
  import Avatar from '../Avatar.svelte';
  import type { WebexPerson } from '$lib/types';

  export let person: WebexPerson;

  const makeSIPCall = () => {
    window.location.href = `sip:${person.emails[0]}`;
  };
</script>

<div class="columns p-2 is-rounded is-vcentered is-mobile is-multiline">
  <div class="column is-align-items-center is-2-tablet is-2-mobile">
    <Avatar {person} size={4} />
  </div>
  <div class="column is-8-tablet is-10-mobile">
    <p class="title is-size-4">{person.displayName}</p>
    <p class="subtitle is-size-6">{person.emails[0]}</p>
  </div>
  <div class="column is-2-tablet">
    <button class="button is-success is-fullwidth is-rounded is-medium" on:click={makeSIPCall}>
      <span class="icon is-large">
        <i class="mdi mdi-phone" />
      </span>
      <span>Call</span>
    </button>
  </div>
</div>

<style>
  /* .is-translucent-light {
   background-color: hsl(0, 0%, 0%, 1);
   box-shadow: none;
 } */
</style>
