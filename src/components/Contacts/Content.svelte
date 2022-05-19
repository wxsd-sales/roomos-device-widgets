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
  import type { WebexPerson } from '$lib/types';
  import { clickOutside } from '$lib/helpers';

  let buttonContent = VIEW_CONTACTS;
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

<!-- <div class="columns m-4 p-4 ">-->
<!--  <div class="column auto" />-->
<!--  <div class="column is-three-fifths">-->
<!--    <div class="container">-->
<!--      {#if buttonContent === MANAGE_CONTACTS}-->
<!--        <div class="container">-->
<!--          {#each $contactsListSession as person}-->
<!--            <ContactItem {person} />-->
<!--          {/each}-->
<!--        </div>-->
<!--      {:else}-->
<!--        <div class="columns">-->
<!--          <div class="column auto">-->
<!--            <ContactsSearch />-->
<!--          </div>-->
<!--          <div class="column auto">-->
<!--            <div class="box container is-flex">-->
<!--              {#each $contactsListSession as person}-->
<!--                <ContactSelectedItem {person} />-->
<!--              {/each}-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      {/if}-->
<!--    </div>-->
<!--  </div>-->
<!--  <div class="column is-one-fifth container">-->
<!--  </div>-->
<!--</div> -->

<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <div class="navbar-item has-dropdown is-clickable is-hoverable">
      {#if myPersonalDetails}
        <Avatar person={myPersonalDetails} size={5} />
        <div class="navbar-dropdown">
          <a class="navbar-item " on:click={toggleSignOutModal}> Sign Out </a>
        </div>
      {/if}
    </div>

    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </a>
  </div>

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
<div class="container mt-6 ">
  {#if buttonContent === MANAGE_CONTACTS}
    {#each $contactsListSession as person}
      <ContactItem {person} />
    {/each}
  {:else}
    <div class="columns">
      <div class="column">
        <ContactsSearch />
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="box container is-flex">
          {#each $contactsListSession as person}
            <ContactSelectedItem {person} />
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<!--
<nav class="navbar mb-8">
  <div class="container is-fluid is-block">
      <div class="navbar-start">
        {#if myPersonalDetails}
          <div class={`dropdown ${isDropdownDisplayed && 'is-active'} `} use:clickOutside on:click_outside={()=>{isDropdownDisplayed = false;}} >
            <div class="dropdown-trigger is-clickable" on:click={toggleDropdown}>
              <Avatar person={myPersonalDetails} size={5} />
            </div>
            <div class="dropdown-menu" >
              <div class="dropdown-content is-translucent-black">
                <a class="dropdown-item " on:click={toggleSignOutModal}>
                  Sign Out
                </a>
              </div>
            </div>
            <h2 class="title"> Favorite Contacts</h2>
          </div>
        {/if}
      </div>
      <div class="navbar-end">
      </div>
      <div class="column is-3">
        <button on:click={handleOnClick} class="button is-primary">{buttonContent}</button>
      </div>
  </div>
</nav>
<div class="hero-body m-6">
  {#if buttonContent === MANAGE_CONTACTS}
    {#each $contactsListSession as person}
      <ContactItem {person} />
    {/each}
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
<div class="">

</div>



<div class={`modal ${isSignOutModalDisplayed && 'is-active'}`}>
  <div class="modal-background" on:click={toggleSignOutModal}></div>
  <div class="modal-content">
    <div class="box is-modal-translucent-black has-text-white">
      <p class="is-size-4 has-white-text">You are about to logout. Would you like to continue?</p>
      <div class="columns mt-4">
        <div class="column">
          <button
            class="button is-medium is-rounded is-success is-fullwidth"
            on:click={() => {webexOauthSessionWritable.set(null)}}>Yes</button>
        </div>
        <div class="column">
          <button
            class="button is-medium is-rounded is-danger is-fullwidth"
            on:click={toggleSignOutModal}>No</button>
        </div>
      </div>
    </div>
  </div>
</div> -->
<style>
  .is-modal-translucent-black {
    background-color: hsl(0, 0%, 0%, 1);
    box-shadow: none;
  }
</style>
