<script lang="ts">
  import { onMount } from 'svelte';
  import { activeCall, deviceSerial, webexOauthSessionWritable } from '$lib/store';
  import ContactsSearch from './ContactsSearch.svelte';
  import ContactItem from './ContactItem.svelte';
  import { WebexHttpPeopleResource } from '$lib/webex/http-wrapper/webex-http-people-resource';
  import { MANAGE_CONTACTS, VIEW_CONTACTS } from '$lib/constants';
  import { webexPeopleInstanceMemory } from '$lib/store';
  import ContactSelectedItem from './ContactSelectedItem.svelte';
  import { contactsListSession } from '$lib/store';
  import Avatar from '../Avatar.svelte';
  import { AvatarSize, type WebexPerson } from '$lib/types';
  import Modal from '../Modal.svelte';
  import { jsonRequest } from '../../lib/shared/json-request';
  import { v4 as uuidv4 } from 'uuid';

  let buttonContent = MANAGE_CONTACTS;
  let myPersonalDetails: WebexPerson;
  const xcommandRequest = jsonRequest('/xapi', 'command');
  const peopleInstance = new WebexHttpPeopleResource($webexOauthSessionWritable.access_token);
  webexPeopleInstanceMemory.set(peopleInstance);

  let isSignOutModalDisplayed = false;

  const handleOnClick = async () => {
    buttonContent = buttonContent === MANAGE_CONTACTS ? VIEW_CONTACTS : MANAGE_CONTACTS;
    await updateContatcs();
  };

  const toggleSignOutModal = () => {
    isSignOutModalDisplayed = !isSignOutModalDisplayed;
  };

  // TODO: Remove Duplicate
  function pollCallStatus(uuid) {
    let tries = 0;
    let intervalId = setInterval(async () => {
      if (tries < 3) {
        const status = await jsonRequest('/check', 'uuids').get(uuid);
        console.log(status);
        if (status == null) {
          console.log('clearing interval id', intervalId);
          clearInterval(intervalId);
          $activeCall.uuid = undefined;
          $activeCall.status = undefined;
        } else if (status?.e) {
          tries = tries + 1;
        } else {
          $activeCall.uuid = uuid;
          if ($activeCall.status?.includes('is-loading') && $activeCall.status?.includes('is-success')) {
            $activeCall.status = 'is-danger';
          }
          if ($activeCall.status?.includes('is-loading') && $activeCall.status?.includes('is-danger')) {
            $activeCall.status = undefined;
          }
        }
      } else {
        console.log('clearing interval id', intervalId);
        clearInterval(intervalId);
        $activeCall.uuid = undefined;
        $activeCall.status = undefined;
      }
    }, 2000);
  }

  // TODO: Remove Duplicate
  async function disconnect() {
    $activeCall.status = 'is-loading is-danger';

    return await xcommandRequest.get('call.disconnect', { serial: $deviceSerial });
  }

  const makeSIPCall = async (email, uuid) => {
    $activeCall.uuid = uuid;
    $activeCall.status = 'is-loading is-success';

    await xcommandRequest
      .get('dial', { number: email, serial: $deviceSerial, uuid: uuid })
      .then(() => pollCallStatus(uuid));
  };

  const handleLogOut = () => {
    contactsListSession.set([]);
    webexOauthSessionWritable.set(null);
  };

  const updateContatcs = async () => {
    $contactsListSession = await Promise.all(
      $contactsListSession.map(({ id }) => $webexPeopleInstanceMemory.getPersonDetails(id))
    );
  };

  onMount(async () => {
    myPersonalDetails = await peopleInstance.getMyOwnDetails();

    //Update Contacts List Initially!
    await updateContatcs();
  });
</script>

<nav class="navbar mb-1" aria-label="main navigation">
  <div class="navbar-item has-dropdown is-clickable is-hoverable">
    {#if myPersonalDetails}
      <Avatar person={myPersonalDetails} size={AvatarSize.XLARGE} />
      <!-- <div class="navbar-dropdown">
        <a class="navbar-item " on:click={toggleSignOutModal}> Sign Out </a>
      </div> -->
    {/if}
  </div>

  <a
    role="button"
    class="navbar-burger"
    href={null}
    aria-label="menu"
    aria-expanded="false"
    data-target="navbarBasicExample"
  >
    <span aria-hidden="true" />
    <span aria-hidden="true" />
    <span aria-hidden="true" />
  </a>

  <div id="navbarBasicExample" class="navbar-menu">
    <div class="navbar-start">
      <div class="navbar-item">
        <h2 class="title">Contacts</h2>
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
      <ContactItem {person} uuid={uuidv4()} {makeSIPCall} {disconnect} />
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
        <button class="button is-medium is-rounded is-success is-fullwidth" on:click={handleLogOut}>Yes</button>
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
