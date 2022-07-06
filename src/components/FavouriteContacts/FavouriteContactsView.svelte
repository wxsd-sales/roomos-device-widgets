<script lang="ts">
  import { readable } from 'svelte/store';
  import FavouriteContactsRemove from './FavouriteContactsRemove.svelte';
  import Person from '../Person/Person.svelte';
  import Meet from '../Meet/Meet.svelte';

  export let ids = [];
  export let accessToken;
  export let edit = false;
  export let callsStore = readable([]);
  export let disconnect: (...args) => Promise<Response> = () => Promise.reject(undefined);
  export let connect: (...args) => Promise<Response> = () => Promise.reject(undefined);
</script>

<div class="columns is-multiline is-vcentered is-centered">
  {#each ids as id}
    <div class="column is-12">
      <Person {id} {accessToken} size={48} let:email>
        {#if edit}
          <FavouriteContactsRemove {id} {email} />
        {:else}
          <Meet {id} destination={email} {disconnect} {connect} {callsStore} />
        {/if}
      </Person>
    </div>
  {/each}
  {#if ids.length === 0}
    <div class="column is-12 has-text-centered">
      <p class="subtitle">Your favourite contacts list is empty.</p>
    </div>
  {/if}
</div>
