<script lang="ts">
  import Avatar from '../Avatar.svelte';
  import type { WebexPerson } from '$lib/types';

  export let person: WebexPerson;

  const makeSIPCall = () => {
    window.location.href = `sip:${person.emails[0]}`;
  };
</script>

<div class="columns is-vcentered">
  <div class="column">
    <Avatar {person} size={4} />
  </div>
  <div class="column is-7">
    <p class="title is-size-3">{person.displayName}</p>
    <p class="subtitle is-size-5">{person.emails[0]}</p>
  </div>
  <div class="column is-3">
    <button class="button is-success is-fullwidth is-rounded is-large" on:click={makeSIPCall}>
      <span class="icon is-large">
        <i class="mdi mdi-phone" />
      </span>
      <span>Call</span>
    </button>
  </div>
</div>
