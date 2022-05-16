<script lang="ts">
  import { WebexUserStatus } from '$lib/types';
  import type { WebexPerson } from '$lib/types';
  import {contactsListSession} from '$lib/store';
import { AVATAR_ICONS } from '$lib/constants';

  export let person: WebexPerson;
  export let size: number;
  let icon = '';

  let styles = {
    width: `${size}rem`,
    height: `${size}rem`
  };

  $: cssVarStyles = Object.entries(styles)
    .map(([key, value]) => `--${key}:${value}`)
    .join(';');

</script>

<figure class="image is-128*128 avatarContainer" style={cssVarStyles}>
  {#if person.avatar}
    <img class={`is-rounded avatar ${person.status}`} src={person.avatar} alt={person.displayName} />
  {:else}
    <div class={`initials is-size-4 ${person.status}`}>
      {person.firstName.charAt(0)}{person.lastName.charAt(0)}
    </div>
  {/if}
  <span class="icon iconContainer has-text-danger">
    <i class={`mdi mdi-light mdi-36px mdi-${AVATAR_ICONS[person.status]}`} />
  </span>
</figure>

<style>
  .avatarContainer {
    position: relative;
    align-items: center;
  }
  .avatar {
    display: block;
    width: var(--width);
    height: var(--height);
  }

  .initials {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: gray;
    color: white;
    width: var(--width);
    height: var(--height);
    border-radius: 50%;
  }

  .iconContainer {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    margin: 0 auto;
    transform: translateX(50%) translateY(25%);
  }
  .active {
    border: 2px solid green;
  }

  .inactive {
    opacity: 0.5;
  }
</style>
