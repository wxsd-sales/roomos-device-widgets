<script lang="ts">
  import Avatar from '../Avatar.svelte';
  import { WebexUserStatus, type WebexPerson } from '$lib/types';
  import { AvatarSize } from '$lib/types';
  import { deviceSerial } from '../../lib/store';
  import { jsonRequest } from '../../lib/shared/json-request';

  export let person: WebexPerson;

  const disabled = person.status !== WebexUserStatus.ACTIVE;
  const makeSIPCall = async () => {
    const xcommandRequest = jsonRequest('/xapi', 'command');

    await xcommandRequest.get('dial', { number: person.emails[0], serial: $deviceSerial }).then((r) => console.log(r));
  };
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
    <button
      class="button is-success is-fullwidth is-rounded is-medium"
      class:disabled
      on:click={makeSIPCall}
      {disabled}
    >
      <span class="icon is-large">
        <i class="mdi mdi-phone" />
      </span>
      <span>Call</span>
    </button>
  </div>
</div>

<style>
  .disabled {
    opacity: 0.3;
  }
</style>
