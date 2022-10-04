<script lang="ts">
  import { FavoriteContactsTypes } from '$lib/types';

  export let favoriteContactsType: FavoriteContactsTypes;
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Favorite Contacts</h2>
  </div>
  <div class="column is-full content mb-0">
    <p>Build your own custom set of favorite contacts or pull the list of favorite spaces set in Webex desktop app</p>
  </div>
  <div class="column is-3 control">
    <label class="radio" class:label={favoriteContactsType === FavoriteContactsTypes.CUSTOM}>
      <input
        type="radio"
        name="favoriteContactsType"
        value="custom"
        checked={favoriteContactsType === FavoriteContactsTypes.CUSTOM}
        on:change={(e) => (favoriteContactsType = e.currentTarget.value)}
      />
      Custom Favorite Contacts
    </label>
  </div>
  <div class="column is-3 control">
    <label class="radio" class:label={favoriteContactsType === FavoriteContactsTypes.FIXED}>
      <input
        type="radio"
        name="favoriteContactsType"
        value="fixed"
        checked={favoriteContactsType === FavoriteContactsTypes.FIXED}
        on:change={(e) => (favoriteContactsType = e.currentTarget.value)}
      />
      Webex Client Favorite Spaces
    </label>
  </div>
</div>
