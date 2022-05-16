<script lang="ts">
  import type { WebexPerson } from '$lib/types';
  import Avatar from '../Avatar.svelte';

  export let person: WebexPerson;
  export let selectPerson: Function;
</script>

<div class="columns is-align-items-center contactsSearchItem" on:click={selectPerson(person)}>
  <div class="column is-one-fifth">
    <Avatar {person} size={3} />
  </div>
  <div style="align-items: center" class="column is-fourth-fifths">
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
