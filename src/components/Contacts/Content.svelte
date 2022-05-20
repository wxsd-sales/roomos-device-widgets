<script lang="ts">
  import { onMount } from 'svelte';
  import { webexOauthSessionWritable } from '$lib/store';
  import ContactsSearch from './ContactsSearch.svelte';
  import ContactItem from './ContactItem.svelte';
  import { WebexHttpPeopleResource } from '$lib/webex/http-wrapper/webex-http-people-resource';
  import { MANAGE_CONTACTS, VIEW_CONTACTS } from '$lib/constants';
  import { webexPeopleInstanceMemory } from '$lib/store';
  import ContactSelectedItem from './ContactSelectedItem.svelte';
  import { contactsListSession } from '$lib/store';
  import Avatar from '../Avatar.svelte';
  import { AvatarSize, type WebexPerson } from '$lib/types';
  import { clickOutside } from '$lib/helpers';
  import Modal from '../Modal.svelte';

  let buttonContent = MANAGE_CONTACTS;
  let myPersonalDetails: WebexPerson;
  const peopleInstance = new WebexHttpPeopleResource($webexOauthSessionWritable.access_token);
  webexPeopleInstanceMemory.set(peopleInstance);

  let isDropdownDisplayed = false;
  let isSignOutModalDisplayed = false;

  const handleOnClick = () => {
    buttonContent = buttonContent === MANAGE_CONTACTS ? VIEW_CONTACTS : MANAGE_CONTACTS;
  };

  const toggleDropdown = () => {
    isDropdownDisplayed = !isDropdownDisplayed;
  };

  const toggleSignOutModal = () => {
    isSignOutModalDisplayed = !isSignOutModalDisplayed;
  };

  onMount(async () => {
    myPersonalDetails = await peopleInstance.getMyOwnDetails();
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

<nav class="navbar mb-1" role="navigation" aria-label="main navigation">
  <div class="navbar-item has-dropdown is-clickable is-hoverable">
    {#if myPersonalDetails}
      <Avatar person={myPersonalDetails} size={AvatarSize.XLARGE} />
      <!-- <div class="navbar-dropdown">
        <a class="navbar-item " on:click={toggleSignOutModal}> Sign Out </a>
      </div> -->
    {/if}
  </div>

  <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
    <span aria-hidden="true" />
    <span aria-hidden="true" />
    <span aria-hidden="true" />
  </a>

  <div id="navbarBasicExample" class="navbar-menu">
    <div class="navbar-start">
      <div class="navbar-item">
        <h2 class="title">Favorite Contacts</h2>
      </div>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <button on:click={handleOnClick} class="button is-rounded is-primary is-light">{buttonContent}</button>
          <button class="button is-danger is-rounded is-light" on:click={toggleSignOutModal}> Sign Out </button>
        </div>
      </div>
    </div>
  </div>
</nav>
<div class="container contactsContainer">
  {#if buttonContent === MANAGE_CONTACTS}
    {#each $contactsListSession as person}
      <ContactItem {person} />
    {/each}
  {:else}
    <div class="box viewContainer">
      <div class="columns">
        <div class="column">
          <ContactsSearch />
        </div>
      </div>
      <div class="columns is-multiline">
        {#each $contactsListSession as person}
          <div class="column is-4 ">
            <ContactSelectedItem {person} />
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<Modal showModal={isSignOutModalDisplayed} toggleModal={toggleSignOutModal}>
  <div class="box is-modal-translucent-black has-text-white">
    <p class="is-size-4 has-white-text">You are about to logout. Would you like to continue?</p>
    <div class="columns mt-4">
      <div class="column">
        <button
          class="button is-medium is-rounded is-success is-fullwidth"
          on:click={() => {
            webexOauthSessionWritable.set(null);
          }}>Yes</button
        >
      </div>
      <div class="column">
        <button class="button is-medium is-rounded is-danger is-fullwidth" on:click={toggleSignOutModal}>No</button>
      </div>
    </div>
  </div>
</Modal>

<style>
  .contactsContainer {
    height: 37rem;
    overflow-y: scroll;
  }

  .viewContainer {
    background-color: transparent;
  }
</style>
