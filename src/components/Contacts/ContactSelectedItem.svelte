<script lang="ts">
  import { contactsListSession, webexPeopleInstanceMemory } from '$lib/store';
  import Avatar from '../Avatar.svelte';
  import type {WebexPerson} from '$lib/types';

  export let person: WebexPerson;

  const removePerson = () => {
    $contactsListSession = $contactsListSession.filter(item => item !== person);
  }
</script>


<div class="box m-2 contactSelectedItem">
  <span class="icon is-align-self-flex-end is-clickable" on:click={removePerson}>
    <i class={`mdi mdi-dark mdi-24px mdi-close`} />
  </span>
  <Avatar 
    {person}
    size={4}
  />
  <p class=" has-text-centered is-size-5">{person.displayName}</p>
</div>

<style>
  .contactSelectedItem {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    max-width: 10rem;
    max-height: 10rem;
  }
</style>