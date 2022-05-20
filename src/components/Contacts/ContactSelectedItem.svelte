<script lang="ts">
  import { contactsListSession } from '$lib/store';
  import Avatar from '../Avatar.svelte';
  import { AvatarSize, type WebexPerson } from '$lib/types';

  export let person: WebexPerson;

  const removePerson = () => {
    $contactsListSession = $contactsListSession.filter((item) => item !== person);
  };
</script>

<div class="box p-2 m-2 is-translucent-black has-text-white">
  <div class="columns">
    <div class="column is-flex is-justify-content-end ">
      <span class="icon is-clickable" on:click={removePerson}>
        <i class={`mdi mdi-light mdi-24px mdi-close`} />
      </span>
    </div>
  </div>
  <div class="columns">
    <div class="column is-12 is-flex is-justify-content-center">
      <Avatar {person} size={AvatarSize.LARGE} />
    </div>
  </div>
  <div class="columns ">
    <div class="column is-inline-grid has-text-centered ">
      <p class="is-overflow-ellipse has-text-centered is-size-5 personName">{person.displayName}</p>
    </div>
  </div>
</div>

<style>
  /* .contactSelectedItem {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    max-width: 10rem;
    max-height: 10rem;
  } */
</style>
