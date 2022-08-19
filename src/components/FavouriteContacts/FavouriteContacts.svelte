<script lang="ts">
  import { browser } from '$app/env';
  import { readable } from 'svelte/store';
  import { jsonRequest } from '$lib/shared/json-request';
  import FavouriteContactsSearch from './FavouriteContactsSearch.svelte';
  import FavouriteContactsView from './FavouriteContactsView.svelte';

  export let id = undefined;
  export let accessToken = undefined;
  export let edit = false;
  export let callsStore = readable([]);
  export let disconnect: (...args) => Promise<Response> = () => Promise.reject(undefined);
  export let connect: (...args) => Promise<Response> = () => Promise.reject(undefined);

  export const favouriteContactsHttpApiRequest = jsonRequest('/api', 'favourite-contacts');
  export const getFavouriteContacts = (id?: string) =>
    favouriteContactsHttpApiRequest
      .get(id)
      .then((r) => r.json())
      .then((r) => r.result as string[]);
  export const removeContacts = (...ids: string[]) =>
    favouriteContactsHttpApiRequest.post(id, undefined, { ids, action: 'remove' });
  export const addContacts = (...ids: string[]) =>
    favouriteContactsHttpApiRequest.post(id, undefined, { ids, action: 'add' });

  let favouriteContactsResponse = browser ? getFavouriteContacts(id) : Promise.resolve([]);

  function handleRemove(e: CustomEvent) {
    favouriteContactsResponse = favouriteContactsResponse
      .then((r) => r.filter((i) => [e.detail].indexOf(i) === -1))
      .then((r) => Promise.resolve(r));
  }

  function handleAdd(e: CustomEvent) {
    favouriteContactsResponse = favouriteContactsResponse.then((r) => [e.detail, ...r]).then((r) => Promise.resolve(r));
  }
</script>

<div class="columns is-multiline is-align-content-start favourite-contacts-container">
  {#await favouriteContactsResponse}
    <div class="column is-12 favourite-contacts-loader">
      <progress class="progress is-small is-link" max="100">0%</progress>
    </div>
  {:then ids}
    {#if edit}
      <div class="column is-12 favourite-contacts-search">
        <FavouriteContactsSearch {accessToken} excludeIds={[id, ...ids]} addContact={addContacts} on:add={handleAdd} />
      </div>
    {/if}
    <div class="column is-12 favourite-contacts-view">
      <FavouriteContactsView
        {accessToken}
        {ids}
        {edit}
        {disconnect}
        {connect}
        {callsStore}
        removeContact={removeContacts}
        on:remove={handleRemove}
      />
    </div>
  {:catch error}
    <div class="column is-12 favourite-contacts-error">
      <p class="subtitle has-text-danger" title={error?.message}>Could not get favourite contacts.</p>
    </div>
  {/await}
</div>
