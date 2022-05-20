<script lang="ts">
  import { onMount } from 'svelte';
  import { WebexUserStatus } from '$lib/types';
  import type { WebexPerson, AvatarSize } from '$lib/types';
  import { contactsListSession } from '$lib/store';
  import { AVATAR_ICONS } from '$lib/constants';

  export let person: WebexPerson;
  export let size: AvatarSize;

  const getNames = () => {
    console.log(person);
  };

  onMount(() => {
    getNames();
  });
</script>

<figure class={`image is-${size}x${size}`}>
  {#if person.avatar}
    <img class={`is-rounded ${person.status}`} src={person.avatar} alt={person.displayName} />
  {:else}
    <div class={`initials is-size-4 ${person.status}`} style={`height: ${size}px`}>
      {person.firstName.charAt(0)}{person.lastName.charAt(0)}
    </div>
  {/if}
  <span class="icon iconContainer has-text-danger">
    <i class={`mdi mdi-light mdi-36px mdi-${AVATAR_ICONS[person.status]}`} />
  </span>
</figure>

<style>
  .initials {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: gray;
    color: white;
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
