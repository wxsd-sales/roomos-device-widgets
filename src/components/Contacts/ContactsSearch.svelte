<script lang="ts">
import ContactSearchItem from "./ContactSearchItem.svelte";
import type {WebexHttpPeopleResource} from '$lib/webex/http-wrapper/webex-http-people-resource';
import validator from "validator";
import { onMount } from "svelte";
import type { WebexPeopleListQuery, WebexPerson } from "$lib/types";
import  {webexPeopleInstanceMemory, contactsListSession} from '$lib/store';

let people: Array<WebexPerson> = [];
let inputField: HTMLInputElement;

const searchPeople = async (event) => {
  const input = event.target.value;
  const option : WebexPeopleListQuery = {
    showAllTypes: false,
    max: 5,
  };

  if(validator.isEmail(input)) {
    option.email = input;
  } else {
    option.displayName = input;
  }

  people =  await $webexPeopleInstanceMemory.listPeople(option) as Array<WebexPerson> || [];
};

const selectPerson = (person: WebexPerson) => {
  $contactsListSession = [...$contactsListSession, person];
  people = [];
  inputField.value = '';
};

</script>

<div class="container">
  <input 
    class="input" 
    type="search" 
    placeholder="Search...."
    bind:this={inputField} 
    on:input={searchPeople}
  >
    {#if people.length}
      <div class="box">
      {#each people as person}
        <ContactSearchItem {person} {selectPerson}/>
      {/each}
    </div>
  {/if}
</div>