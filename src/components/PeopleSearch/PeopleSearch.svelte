<script lang="ts">
  import type { PersonResponse } from './types/person-response';
  import { browser } from '$app/env';
  import { VALID_EMAIL } from '$lib/constants';
  import { webexHttpPeopleResource } from '$lib/webex/http-wrapper';
  import Person from '../Person/Person.svelte';

  export let accessToken;
  export let placeholder = 'Search with email or name';
  export let excludeIds = [];

  let term = '';
  let isLoading = false;

  const peopleResource = webexHttpPeopleResource(accessToken);

  const searchPeopleByDisplayName = (displayName, excludeIds) =>
    peopleResource
      .listPeople({ displayName: displayName, max: 20 })
      .then((r) => r as Promise<PersonResponse[]>)
      .then((r) => r.filter((e) => !excludeIds.includes(e.id)));

  const searchPeopleByEmail = (email, excludeIds) =>
    peopleResource
      .listPeople({ email: email, max: 20 })
      .then((r) => r as Promise<PersonResponse[]>)
      .then((r) => r.filter((e) => !excludeIds.includes(e.id)));

  const searchPeople = (term, excludeIds) => {
    const search = VALID_EMAIL.test(term)
      ? searchPeopleByEmail(term, excludeIds).then((r) => (r.length ? searchPeopleByDisplayName(term, excludeIds) : r))
      : searchPeopleByDisplayName(term, excludeIds);

    return Promise.resolve((isLoading = true))
      .then(() => search as Promise<PersonResponse[]>)
      .then((r) => r.sort((a, b) => a.nickName.localeCompare(b.nickName)))
      .finally(() => (isLoading = false));
  };

  let searchPeopleResponse = browser ? searchPeople(term, excludeIds) : Promise.resolve([]);

  $: term && (searchPeopleResponse = searchPeople(term, excludeIds));
</script>

<section class="people-search-container">
  <div class="control has-icons-left is-medium dropdown" class:is-active={!!term} class:is-loading={isLoading}>
    <input class="input is-rounded is-medium dropdown-trigger" type="text" {placeholder} bind:value={term} />
    <span class="icon is-left">
      <i class="mdi mdi-account-search" />
    </span>
    <div class="dropdown-menu is-active" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        {#await searchPeopleResponse}
          <p class="dropdown-item">Searching for '{term}'.</p>
        {:then people}
          {#each people as person (person.id)}
            <div class="dropdown-item">
              <Person id={person.id} {accessToken} let:email>
                <slot id={person.id} {email} />
              </Person>
            </div>
            <hr class="dropdown-divider" />
          {/each}
          {#if people.length === 0}
            <p class="dropdown-item">No contacts found for search '{term}'.</p>
          {/if}
        {:catch error}
          <p class="dropdown-item has-text-danger">Search failed for '{term}'.</p>
        {/await}
      </div>
    </div>
  </div>
</section>

<style>
  .dropdown,
  .dropdown-menu {
    width: 100%;
  }
  .dropdown-menu > .dropdown-content {
    max-height: 512px;
    overflow-y: scroll;
  }
  .dropdown {
    color: unset;
  }
  .dropdown-item:hover {
    background-color: hsl(0deg, 0%, 96%);
    color: hsl(0deg, 0%, 4%);
    border-radius: var(--border-radius);
  }
  hr.dropdown-divider:last-child {
    display: none;
  }
</style>
