<script lang="ts">
  import { onMount } from 'svelte';
  import { accessTokenSession } from '$lib/store';
  import ContactsSearch from './ContactsSearch.svelte';
  import ContactItem from './ContactItem.svelte';
  import { WebexHttpPeopleResource } from '$lib/webex/http-wrapper/webex-http-people-resource';
  import { MANAGE_CONTACTS, VIEW_CONTACTS } from '$lib/constants';
  import { webexPeopleInstanceMemory } from '$lib/store';
  import ContactSelectedItem from './ContactSelectedItem.svelte';
  import { contactsListSession } from '$lib/store';

  let buttonContent = VIEW_CONTACTS;

  webexPeopleInstanceMemory.set(new WebexHttpPeopleResource($accessTokenSession.access_token));

  const handleOnClick = () => {
    buttonContent = buttonContent === MANAGE_CONTACTS ? VIEW_CONTACTS : MANAGE_CONTACTS;
  };

  onMount(() => {
    const interval = setInterval(async () => {
      $contactsListSession = await Promise.all(
        $contactsListSession.map(({ id }) => $webexPeopleInstanceMemory.getPersonDetails(id))
      );
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<div class="columns m-4 p-4 ">
  <div class="column auto" />
  <div class="column is-three-fifths">
    <div class="container">
      {#if buttonContent === MANAGE_CONTACTS}
        <div class="container">
          {#each $contactsListSession as person}
            <ContactItem {person} />
          {/each}
        </div>
      {:else}
        <div class="columns">
          <div class="column auto">
            <ContactsSearch />
          </div>
          <div class="column auto">
            <div class="box container is-flex">
              {#each $contactsListSession as person}
                <ContactSelectedItem {person} />
              {/each}
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
  <div class="column is-one-fifth container">
    <button on:click={handleOnClick} class="button is-primary">{buttonContent}</button>
  </div>
</div>
