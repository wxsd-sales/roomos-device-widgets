<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/env';

  import { queueOrderStore, requesterIDStore } from '$lib/store';
  import {
    APPEND,
    MESSAGE,
    QUEUE,
    HSET,
    VISIBILITY_CHANGE,
    VISIBILITY_HIDDEN,
    REMOVE,
    MESSAGE_RESPONSE,
    MEMBERS_UPDATE,
    IC_SESSION,
    JOIN,
    INIT_LIST,
    LIST,
    SET
  } from '../constants';

  import { MEETING_TYPE_OPTIONS } from '$lib/enums';

  import { SocketIO } from '../socket';

  import Modal from '$components/Modal/Modal.svelte';

  export let socketID: string;
  export let meetingTypeOptions: Array<MEETING_TYPE_OPTIONS>;

  let assistanceHasBeenRequested = false;
  let assistanceIsReady = false;
  let iframeIsLoading = false;
  let meetingURL: string;
  let finalMeetingURL = '';
  let readyToJoin = false;
  let showModal = false;
  let meetingInSession = false;
  let isSip = false;
  let tempID: string;
  let meetingType = 'SDK';
  let selectedNurse = {};
  let isOnMobile = browser && window.screen.availWidth < 480;

  if (browser) {
    window.addEventListener('resize', function () {
      isOnMobile = window.screen.availWidth < 480;
    });
  }

  const socketIO = new SocketIO(socketID);

  const sendStatus = (status: string) => {
    socketIO.emit(MESSAGE, {
      data: { ...selectedNurse, status },
      key: $requesterIDStore,
      set: QUEUE,
      command: HSET
    });
  };

  if (browser) {
    window.addEventListener(VISIBILITY_CHANGE, function () {
      let status = 'active';

      if (document.visibilityState === VISIBILITY_HIDDEN) {
        status = 'inactive';
      }

      sendStatus(status);
    });
  }

  const cancelRequest = () => {
    socketIO.emit(MESSAGE, {
      command: REMOVE,
      set: QUEUE,
      data: $requesterIDStore,
      id: REMOVE
    });

    assistanceHasBeenRequested = false;
  };

  socketIO.listen(MESSAGE_RESPONSE, (event, payload) => {
    if (payload.index || payload.index === 0) {
      $queueOrderStore = payload.index;
    }
  });

  socketIO.listen(MESSAGE, async (event, payload) => {
    if (payload.command === REMOVE) {
      if (payload.data === $requesterIDStore) {
        assistanceHasBeenRequested = false;
        readyToJoin = false;
        assistanceIsReady = false;
      } else {
        if (tempID != payload.data) {
          if (payload.index < $queueOrderStore) {
            $queueOrderStore -= 1;
          }
          tempID = payload.data as string;
        }
      }
    }
    if (payload.room === $requesterIDStore) {
      if (payload.data.event === 'meeting-link') {
        assistanceIsReady = true;
        meetingURL = `${payload.data.payload}&autoDial=true&embedSize=desktop&sessionId=${$requesterIDStore}`;
      }
      if (payload.data.event === MEMBERS_UPDATE) {
        if (
          payload.data.payload.updated.some((participant: any) => participant.isSelf && !participant.isInMeeting) ||
          payload.data.payload.updated.some(
            (participant: any) => participant.isHost && participant.status === 'NOT_IN_MEETING'
          )
        ) {
          meetingURL = '';
          readyToJoin = false;
          assistanceIsReady = false;
          iframeIsLoading = false;
          cancelRequest();
        }
      }
      if (payload.data.event === 'meeting-state-change') {
        console.log('MEETING STATE CHANGE', payload.data.payload);
      }
    }
    if (payload.set === IC_SESSION && payload.id === SET && $requesterIDStore === payload.data.gradNurseID) {
      const {
        data: { link }
      } = payload;
      assistanceIsReady = true;
      meetingURL = link;
    }

    if (payload.set === IC_SESSION && payload.id === REMOVE && $requesterIDStore === payload.data.gradNurseID) {
      readyToJoin = false;
      assistanceIsReady = false;
      iframeIsLoading = false;
      cancelRequest();
    }

    if (payload.set === 'SIP_ADDRESS' && $requesterIDStore === payload.data.gradNurseID) {
      const {
        data: { link }
      } = payload;
      assistanceIsReady = true;
      meetingURL = link;
      isSip = true;
    }

    if (payload.set === 'REMOVE_SIP_ADDRESS' && $requesterIDStore === payload.data.gradNurseID) {
      readyToJoin = false;
      assistanceIsReady = false;
      iframeIsLoading = false;
      meetingInSession = false;
      cancelRequest();
    }
  });

  const requestAssistance = () => {
    if ($requesterIDStore === undefined) {
      $requesterIDStore = crypto.randomUUID();
      socketIO.emit(JOIN, $requesterIDStore);
    }

    selectedNurse = { status: 'active', meetingType, sessionStatus: 'inactive' };
    const message = {
      command: APPEND,
      set: QUEUE,
      key: $requesterIDStore,
      id: APPEND,
      data: selectedNurse
    };

    socketIO.emit(MESSAGE, message);
    assistanceHasBeenRequested = true;
  };

  const joinSession = () => {
    readyToJoin = true;
    finalMeetingURL = meetingURL;
    if (isSip) {
      meetingInSession = true;
    }
  };

  onMount(() => {
    socketIO.listen(MESSAGE_RESPONSE, (event, payload) => {
      if (payload.id === INIT_LIST && payload.data) {
        const userExists = payload.data.some((q) => q.value === $requesterIDStore);
        if (userExists) {
          assistanceHasBeenRequested = true;
        } else {
          $requesterIDStore = crypto.randomUUID();
        }
      }

      socketIO.emit(JOIN, $requesterIDStore);
    });

    socketIO.connect(() => {
      const message = { command: LIST, set: QUEUE, id: INIT_LIST };
      socketIO.emit(MESSAGE, message);
    });
  });
</script>

<div class="columns">
  <div class="column">
    <h1 class="is-size-3 has-text-white">Submit Request</h1>
  </div>
</div>
<hr />
<div class="is-flex is-justify-content-center is-align-items-center is-fullheight ">
  <span class="bulma-loader-mixin" class:is-hidden={!iframeIsLoading} style="position:absolute" />
  <iframe
    width="100%"
    height="100%"
    title="meeting"
    src={finalMeetingURL}
    class:is-hidden={!readyToJoin && !meetingInSession}
    allow="camera;microphone"
    on:load={() => {
      iframeIsLoading = false;
    }}
  />
  {#if meetingInSession}
    <div class="flash box is-flex is-flex-direction-column is-translucent-black pb-5" style="padding: 2rem;">
      <div class=" title has-text-white is-size-5 mb-4">Meeting In Session!</div>
    </div>
  {/if}
  {#if !readyToJoin}
    <div class="box is-flex is-flex-direction-column is-translucent-black pb-5" style="padding: 2.5rem;">
      {#if assistanceIsReady}
        <div class="has-text-centered has-text-white is-size-5 mb-4">Representative is Now Available!</div>
        <button class="button is-size-5 mt-6 is-primary is-centered" on:click={joinSession}
          >Join Support Session
        </button>
      {:else if assistanceHasBeenRequested}
        <div class="is-size-5 has-text-white has-text-centered">
          Your request has been queued. A representative will reach out shortly.
        </div>
        <span class="has-text-white has-text-centered flash" style="margin-top: 1.5rem; font-size: 0.9rem;">
          {$queueOrderStore === 0 ? 'You are next!' : `There are ${$queueOrderStore} additional requests ahead of you.`}
        </span>
        <button class="button is-size-5 mt-6 is-danger is-centered" on:click={cancelRequest}>Cancel Request </button>
      {:else}
        <div class="title has-text-white  has-text-centered is-size-4">Looking for Assistance?</div>
        <button
          class="button is-size-5 is-primary is-centered mb-5"
          style="margin-top: 1.75rem;"
          on:click={requestAssistance}
          >Request Assistance
        </button>
        <div
          class="control is-justify-content-space-around is-flex has-text-white is-size-6"
          style="margin: 1rem 0 0.25rem 0;"
        >
          {#if meetingTypeOptions.includes(MEETING_TYPE_OPTIONS.BROWSER_SDK)}
            <label class="radio">
              <input
                type="radio"
                name="meeting"
                value="SDK"
                checked={meetingType === 'SDK'}
                on:change={(e) => (meetingType = e.currentTarget.value)}
              />
              {isOnMobile ? 'SDK' : 'Meeting SDK'}
            </label>
          {/if}
          {#if meetingTypeOptions.includes(MEETING_TYPE_OPTIONS.INSTANT_CONNECT)}
            <label id="ic-checkbox" class="radio ml-4">
              <input
                type="radio"
                name="meeting"
                checked={meetingType === 'IC'}
                value="IC"
                on:change={(e) => (meetingType = e.currentTarget.value)}
              />
              {isOnMobile ? 'IC' : 'Instant Connect'}
            </label>
          {/if}
          {#if meetingTypeOptions.includes(MEETING_TYPE_OPTIONS.SIP_URI_DIALING)}
            <label id="sip-checkbox" class="radio ml-4">
              <input
                type="radio"
                name="meeting"
                checked={meetingType === 'SIP'}
                value="SIP"
                on:change={(e) => (meetingType = e.currentTarget.value)}
              />
              {isOnMobile ? 'SIP' : 'SIP URI Dialing'}
            </label>
          {/if}
        </div>
        <div class="has-text-white has-text-centered mt-5" style="font-size: 0.65rem ">
          * Unanswered request will auto-expire in 30 minutes
        </div>
      {/if}
    </div>
  {/if}
</div>

<Modal isActive={showModal}>
  <div class="modal-content is-translucent-black" style="padding: 1.5rem 0.5rem; width: 22rem;">
    <div class="has-text-white has-text-centered">
      <div class="subtitle is-size-5 has-text-white mb-2 ">Your request has been canceled</div>
      <div class="subtitle is-size-5 has-text-white">Please try again.</div>
    </div>
    <div class="is-flex is-justify-content-center mt-4">
      <button
        class="button is-success"
        on:click={() => {
          showModal = false;
        }}>Acknowledge</button
      >
    </div>
  </div>
</Modal>
