<script lang="ts">
  import type { WebexPerson } from '$lib/types';
  import Avatar from '../Avatar.svelte';

  export let person: WebexPerson;
  export let selectPerson: unknown;
</script>

<div class="columns is-align-items-center contactsSearchItem is-mobile" on:click={selectPerson(person)}>
  <div class="column is-1-tablet is-2-mobile">
    <Avatar {person} size={3} />
  </div>
  <div class="column is-11-tablet is-10-mobile">
    <p class="is-size-4">{person.displayName}</p>
  </div>
</div>

<style>
  .contactsSearchItem {
    border-radius: 0.5rem;
  }
  .contactsSearchItem:hover {
    background-color: #00bcf5;
    cursor: pointer;
    color: white;
  }
</style>
