<script lang="ts">
  import ContactSearchItem from './ContactSearchItem.svelte';
  import type { WebexHttpPeopleResource } from '$lib/webex/http-wrapper/webex-http-people-resource';
  import validator from 'validator';
  import { onMount } from 'svelte';
  import type { WebexPeopleListQuery, WebexPerson } from '$lib/types';
  import { webexPeopleInstanceMemory, contactsListSession } from '$lib/store';

  let people: Array<WebexPerson> = [];
  let inputField: HTMLInputElement;
  let searchIsLoading = people.length !== 0;

  const searchPeople = async (event) => {
    const input = event.target.value;
    const option: WebexPeopleListQuery = {
      showAllTypes: false,
      max: 5
    };
    if (validator.isEmail(input)) {
      option.email = input;
    } else {
      option.displayName = input;
    }
    
    people = ((await $webexPeopleInstanceMemory.listPeople(option)) as Array<WebexPerson>) || [];
    searchIsLoading = true;
  };

  const selectPerson = (person: WebexPerson) => {
    $contactsListSession = [...$contactsListSession, person];
    people = [];
    inputField.value = '';
    searchIsLoading = false;
  };
</script>

<div class="container">
  <div class="field">
    <p class="control has-icons-right">
      <input class="input is-medium" type="text" placeholder="Search...." bind:this={inputField} on:input={searchPeople} />
        {#if searchIsLoading}
          <span class="icon is-small is-right loader is-loading" />
        {/if}
    </p>
  </div>
  {#if people.length}
    <div class="box">
      {#each people as person}
        <ContactSearchItem {person} {selectPerson} />
      {/each}
    </div>
  {:else if false}
  {/if}
</div>

<style>
 .loader {
    height: 1rem !important;
    width: 1rem !important;
    margin: 1rem;
  }
</style>