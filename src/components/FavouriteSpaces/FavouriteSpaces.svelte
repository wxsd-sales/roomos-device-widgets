<script lang="ts">
  import { browser } from '$app/env';
  import { readable } from 'svelte/store';
  import FavouriteSpacesView from './FavouriteSpacesView.svelte';
  import type { FavouriteSpaces } from './types/favourite-spaces';

  export let id = undefined;
  export let accessToken = undefined;
  export let callsStore = readable([]);
  export let disconnect: (...args) => Promise<Response> = () => Promise.reject(undefined);
  export let connect: (...args) => Promise<Response> = () => Promise.reject(undefined);
  export let getFavouriteSpaces: (...args) => Promise<FavouriteSpaces> = () => Promise.reject(undefined);

  let favouriteSpaces = browser ? getFavouriteSpaces(id, accessToken) : Promise.resolve([]);
</script>

<div class="columns is-multiline is-align-content-start favourite-contacts-container">
  {#await favouriteSpaces}
    <div class="column is-12 favourite-contacts-loader">
      <progress class="progress is-small is-link" max="100">0%</progress>
    </div>
  {:then { direct, group }}
    <div class="column is-12 favourite-contacts-view">
      <FavouriteSpacesView {accessToken} {direct} {group} {disconnect} {connect} {callsStore} />
    </div>
  {:catch error}
    <div class="column is-12 favourite-contacts-error">
      <p class="subtitle has-text-danger" title={error?.message}>Could not get favourite contacts.</p>
    </div>
  {/await}
</div>
