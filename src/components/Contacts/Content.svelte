<script lang="ts">
  import { accessTokenSession } from '$lib/store';
  import ContactsSearch from './ContactsSearch.svelte';
  import ContactItems from './ContactItems.svelte';
  import {WebexHttpPeopleResource} from '$lib/webex/http-wrapper/webex-http-people-resource';
  import {MANAGE_CONTACTS, VIEW_CONTACTS} from '$lib/constants';
  import {webexPeopleInstanceMemory} from '$lib/store';

  let buttonContent = VIEW_CONTACTS;

  webexPeopleInstanceMemory.set(new WebexHttpPeopleResource($accessTokenSession.access_token));

  const handleOnClick = () => {
    buttonContent = buttonContent === MANAGE_CONTACTS ? VIEW_CONTACTS : MANAGE_CONTACTS;
  };
</script>

<div class="columns m-4 p-4 ">
  <div class="column auto" />
  <div class="column is-three-fifths">
    <div class="container">
      {#if buttonContent === MANAGE_CONTACTS}
        <ContactItems  />
      {:else}
        <div class="container columns">
          <div class="column">
            <ContactsSearch />
          </div>
          <div class="column">
            <div class="box">

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
