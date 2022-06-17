<script lang="ts">
  import { readable } from 'svelte/store';
  import GuestInviteSend from './GuestInviteSend.svelte';
  import GuestInviteJoin from './GuestInviteJoin.svelte';

  export let callsStore = readable([]);
  export let disconnect: (...args) => Promise<Response> = () => Promise.reject(undefined);
  export let connect: (...args) => Promise<Response> = () => Promise.reject(undefined);

  const guestInvite = {
    send: { component: GuestInviteSend, props: {} },
    join: { component: GuestInviteJoin, props: { callsStore, disconnect, connect } }
  };
  let activeComponent = guestInvite.send;

  function showGuestInviteSend(e: CustomEvent) {
    if (import.meta.env.DEV) console.info(e);

    guestInvite.join.props = { ...e.detail, callsStore, disconnect, connect };
    activeComponent = guestInvite.join;
  }

  function showGuestInviteJoin(e: CustomEvent) {
    if (import.meta.env.DEV) console.info(e);

    guestInvite.join.props = {};
    activeComponent = guestInvite.send;
  }
</script>

<svelte:component
  this={activeComponent.component}
  {...activeComponent.props}
  on:guestInviteInsert={showGuestInviteSend}
  on:guestInviteRemove={showGuestInviteJoin}
/>
