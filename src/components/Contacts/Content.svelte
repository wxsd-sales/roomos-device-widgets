<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import { activeCall, deviceSerial, webexOauthSessionWritable, contactsStatusMode } from '$lib/store';
  import ContactsSearch from './ContactsSearch.svelte';
  import ContactItem from './ContactItem.svelte';
  import { WebexHttpPeopleResource } from '$lib/webex/http-wrapper/webex-http-people-resource';
  import { MANAGE_CONTACTS, VIEW_CONTACTS, ENABLE, DISABLE } from '$lib/constants';
  import { webexPeopleInstanceMemory } from '$lib/store';
  import ContactSelectedItem from './ContactSelectedItem.svelte';
  import Avatar from '../Avatar.svelte';
  import { AvatarSize, ContactsStatusMode, type WebexPerson } from '$lib/types';
  import Modal from '../Modal.svelte';
  import { jsonRequest } from '../../lib/shared/json-request';
  import { v4 as uuidv4 } from 'uuid';

  let buttonContent = MANAGE_CONTACTS;
  let disableStatusMode = DISABLE;
  let contacts: Array<WebexPerson> = [];
  let myPersonalDetails: WebexPerson;
  let hideDropDown = false;
  const xcommandRequest = jsonRequest('/xapi', 'command');
  const peopleInstance = new WebexHttpPeopleResource($webexOauthSessionWritable.access_token);

  webexPeopleInstanceMemory.set(peopleInstance);

  let isSignOutModalDisplayed = false;

  const toggleContactsView = async () => {
    buttonContent = buttonContent === MANAGE_CONTACTS ? VIEW_CONTACTS : MANAGE_CONTACTS;
  };

  const toggleStatusMode = () => {
    if (disableStatusMode === ENABLE) {
      disableStatusMode = DISABLE;
      $contactsStatusMode = ContactsStatusMode.POLLING;
    } else {
      disableStatusMode = ENABLE;
      $contactsStatusMode = ContactsStatusMode.NONE;
    }
    hideDropDown = true;
  };

  const toggleSignOutModal = () => {
    isSignOutModalDisplayed = !isSignOutModalDisplayed;
    hideDropDown = true;
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

  const postContacts = async (newContacts: Array<WebexPerson>) => {
    try {
      await jsonRequest('/user', 'contacts').post(undefined, undefined, {
        userID: myPersonalDetails.id,
        contacts: newContacts.map(({ id }) => id)
      });
    } catch (e) {
      console.error(e);
    }
  };

  const getContacts = async (currentUserID: string) => {
    try {
      return await jsonRequest('/user', 'contacts').get(undefined, { userID: currentUserID });
    } catch (error) {
      console.error(error);
    }
  };

  const removePerson = async (person: WebexPerson) => {
    contacts = contacts.filter((item) => item !== person);
    await postContacts(contacts);
  };

  const addPerson = async (person: WebexPerson) => {
    if (!contacts.some((item) => item.id === person.id)) {
      contacts = [person, ...contacts];
      await postContacts(contacts);
    }
  };

  const makeSIPCall = async (email, uuid) => {
    $activeCall.uuid = uuid;
    $activeCall.status = 'is-loading is-success';

    await xcommandRequest
      .get('dial', { number: email, serial: $deviceSerial, uuid: uuid })
      .then(() => pollCallStatus(uuid));
  };

  const handleLogOut = () => {
    webexOauthSessionWritable.set(null);
  };

  onMount(async () => {
    myPersonalDetails = await peopleInstance.getMyOwnDetails();
    const people = await getContacts(myPersonalDetails.id);
    contacts = await Promise.all(people.map((id: string) => $webexPeopleInstanceMemory.getPersonDetails(id)));
  });
</script>

<nav class="navbar mb-1" aria-label="main navigation">
  <div class="navbar-item has-dropdown is-clickable is-hoverable">
    {#if myPersonalDetails}
      <Avatar person={myPersonalDetails} size={AvatarSize.XLARGE} />
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
      <div class="navbar-item is-flex is-flex-direction-column is-align-items-flex-start">
        <h2 class="title mb-3">Contacts</h2>
        {#if myPersonalDetails}
          <h3 class="is-size-5 ">{myPersonalDetails.displayName}</h3>
        {/if}
      </div>
      <div class="navbar-item" />
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <button on:click={toggleContactsView} class="button is-rounded is-warning is-light">{buttonContent}</button>
      </div>
      <div class="navbar-item  is-clickable is-hoverable">
        <button
          class="button is-rounded is-info"
          on:click={() => {
            hideDropDown = false;
          }}
        >
          <span class="icon is-large">
            <i class="mdi mdi-24px mdi-cog" />
          </span>
        </button>
        <div class:is-hidden={hideDropDown} class="navbar-dropdown is-right is-translucent-black is-size-5">
          <a class="navbar-item" on:click={toggleStatusMode}> {`${disableStatusMode} Presence Status`} </a>
          <a class="navbar-item" on:click={toggleSignOutModal}> Sign Out </a>
        </div>
      </div>
    </div>
  </div>
</nav>
<div class="container contactsContainer">
  <div class:is-hidden={buttonContent === VIEW_CONTACTS}>
    {#each contacts as person}
      <ContactItem {person} uuid={uuidv4()} {makeSIPCall} {disconnect} />
    {/each}
  </div>
  <div class:is-hidden={buttonContent === MANAGE_CONTACTS} class="box viewContainer">
    <div class="columns">
      <div class="column">
        <ContactsSearch {addPerson} />
      </div>
    </div>
    <div class="columns is-multiline">
      {#each contacts as person}
        <div class="column is-4 ">
          <ContactSelectedItem {person} {removePerson} />
        </div>
      {/each}
    </div>
  </div>
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
