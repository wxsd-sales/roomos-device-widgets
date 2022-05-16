<script lang="ts">
  import Avatar from '../Avatar.svelte';
  import { onMount } from 'svelte';
  import type {WebexPerson} from '$lib/types';

  export let person: WebexPerson;

  const makeSIPCall = () => {
    window.location.href = `sip:${person.emails[0]}`;
  };
</script>

<div class="box">
  <div class="columns">
    <div class="column is-1">
      <Avatar
        person={person}
        size={4}
      />
    </div>
    <div class="column is-10">
      <p class="title">{person.displayName}</p>
      <p class="subtitle">{person.emails[0]}</p>
    </div>
    <div class="column is-1">
      <button class="button is-success" on:click={makeSIPCall}>Call</button>
    </div>
  </div>
</div>
