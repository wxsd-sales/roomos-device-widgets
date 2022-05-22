<script lang="ts">
  import Avatar from '../Avatar.svelte';
  import { WebexUserStatus, type WebexPerson } from '$lib/types';
  import { AvatarSize } from '$lib/types';
  import { activeCall } from '$lib/store';

  export let person: WebexPerson;
  export let uuid: string;
  export let makeSIPCall: (email: string, uuid: string) => void;
  export let disconnect: () => void;

  const disabled = person.status !== WebexUserStatus.ACTIVE;
</script>

<div class="columns p-2 m-4 is-translucent-black box is-rounded is-vcentered is-mobile is-multiline">
  <div class="column is-align-items-center is-2-tablet is-2-mobile">
    <Avatar {person} size={AvatarSize.LARGE} />
  </div>
  <div class="column is-8-tablet is-10-mobile">
    <p class="title is-size-4">{person.displayName}</p>
    <p class="subtitle is-size-6">{person.emails[0]}</p>
  </div>
  <div class="column is-2-tablet">
    {#if $activeCall?.uuid == null}
      <button
        class="button is-success is-fullwidth is-rounded is-medium  is-fullwidth"
        class:disabled
        on:click={makeSIPCall(person.emails[0], uuid)}
        {disabled}
      >
        <span class="icon is-large">
          <i class="mdi mdi-phone" />
        </span>
      </button>
    {:else if $activeCall?.uuid === uuid}
      <button class="button {$activeCall?.status} is-rounded is-medium is-fullwidth" on:click={() => disconnect()}>
        <span class="icon">
          <i class="mdi mdi-phone-hangup" />
        </span>
      </button>
    {/if}
  </div>
</div>

<style>
  .disabled {
    opacity: 0.3;
  }
</style>
