<script lang="ts">
  import ContactSearchItem from './ContactSearchItem.svelte';
  import validator from 'validator';
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

    if (event.target.value === '') {
      people = [];
    } else {
      people = ((await $webexPeopleInstanceMemory.listPeople(option)) as Array<WebexPerson>) || [];
    }

    searchIsLoading = false;
  };

  const selectPerson = (person: WebexPerson) => {
    if (!$contactsListSession.some((item) => item.id === person.id)) {
      $contactsListSession = [person, ...$contactsListSession];
    }

    people = [];
    inputField.value = '';
    searchIsLoading = false;
  };
</script>

<div class="container">
  <div class="field">
    <div class:is-loading={searchIsLoading} class="control is-medium">
      <input
        class="input is-medium is-rounded has-background-black has-text-white"
        type="text"
        placeholder="Search...."
        bind:this={inputField}
        on:input={searchPeople}
      />
    </div>
  </div>
  {#if people.length}
    <div class="box searchBox">
      {#each people as person}
        <ContactSearchItem {person} {selectPerson} />
      {/each}
    </div>
  {:else if inputField?.value !== ''}
    <div class="box searchBox">
      <div class="columns has-text-white is-align-items-center contactsSearchItem is-mobile">
        <div class="column is-12">
          <p class="is-size-4 is-danger">No contacts found</p>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .searchBox {
    position: absolute;
    z-index: 1;
    width: 100%;
    background-color: hsla(0deg, 0%, 0%, 1);
  }
</style>
