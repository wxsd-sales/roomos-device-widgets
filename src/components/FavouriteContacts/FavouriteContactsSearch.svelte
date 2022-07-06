<script>
  import FavouriteContactsAdd from './FavouriteContactsAdd.svelte';
  import PeopleSearch from '../PeopleSearch/PeopleSearch.svelte';

  export let accessToken = undefined;
  export let excludeIds = [];
</script>

<PeopleSearch {accessToken} {excludeIds} let:id let:email>
  <FavouriteContactsAdd {id} {email} />
</PeopleSearch>
