<script lang="ts">
  import { WebexUserStatus } from '$lib/types';
  import type { WebexPerson, AvatarSize } from '$lib/types';
  import { AVATAR_ICONS, ICON_SIZES } from '$lib/constants';

  export let person: WebexPerson;
  export let size: AvatarSize;

  const getName = () => {
    if (person.firstName && person.lastName) return `${person.firstName.charAt(0)}${person.lastName.charAt(0)}`;

    return person.emails[0].charAt(0);
  };

  $: cssVarStyles = Object.entries({ width: ICON_SIZES[size].background, height: ICON_SIZES[size].background })
    .map(([key, value]) => `--${key}:${value}`)
    .join(';');
</script>

<figure class={`image is-${size}x${size}`}>
  {#if person.avatar}
    <img class={`is-rounded ${person.status}`} src={person.avatar} alt={person.displayName} />
  {:else}
    <div class={`initials is-size-4`} style={`height: ${size}px`}>
      {getName()}
    </div>
  {/if}
  {#if person.status !== WebexUserStatus.UNKNOWN}
    <span class={`icon iconContainer has-text-${AVATAR_ICONS[person.status].color}`} style={cssVarStyles}>
      <i class={`mdi mdi-${ICON_SIZES[size].svg} mdi-${AVATAR_ICONS[person.status].name}`} />
    </span>
  {/if}
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
    background-color: black;
    width: var(--width);
    height: var(--height);
    border-radius: 50%;
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>
