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
    searchIsLoading = true;
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
    searchIsLoading = false;
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
    <div class:is-loading={searchIsLoading} class="control is-medium">
      <input
        class="input is-medium"
        type="text"
        placeholder="Search...."
        bind:this={inputField}
        on:input={searchPeople}
      />
    </div>
  </div>
  {#if people.length}
    <div class="box">
      {#each people as person}
        <ContactSearchItem {person} {selectPerson} />
      {/each}
    </div>
  {:else if false}{/if}
</div>
