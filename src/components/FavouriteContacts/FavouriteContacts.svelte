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

  export const getFavouriteContacts = (id?: string) =>
    jsonRequest('/api', 'favourite-contacts')
      .get(id)
      .then((r) => r.json())
      .then((r) => r.result);

  let favouriteContactsResponse = browser ? getFavouriteContacts(id) : Promise.resolve([]);
</script>

<div class="columns is-multiline favourite-contacts-container">
  {#await favouriteContactsResponse}
    <div class="column is-12 favourite-contacts-loader">
      <progress class="progress is-small is-link" max="100">0%</progress>
    </div>
  {:then ids}
    {#if edit}
      <div class="column is-12 favourite-contacts-search">
        <FavouriteContactsSearch {accessToken} excludeIds={[id, ...ids]} />
      </div>
    {/if}
    <div class="column is-12 favourite-contacts-view">
      <FavouriteContactsView {accessToken} {ids} {edit} {disconnect} {connect} {callsStore} />
    </div>
  {:catch error}
    <div class="column is-12">
      <p class="subtitle has-text-danger" title={error?.message}>Could not get favourite contacts.</p>
    </div>
  {/await}
</div>
