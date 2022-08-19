<script lang="ts">
  import FavouriteContactsAdd from './FavouriteContactsAdd.svelte';
  import PeopleSearch from '../PeopleSearch/PeopleSearch.svelte';

  export let accessToken = undefined;
  export let excludeIds = [];
  export let placeholder = 'To add, search with email or name';
  export let addContact: (...args) => Promise<Response> = () => Promise.reject(undefined);
</script>

<PeopleSearch {accessToken} {excludeIds} {placeholder} let:id let:email>
  <FavouriteContactsAdd {id} {addContact} on:add />
</PeopleSearch>
