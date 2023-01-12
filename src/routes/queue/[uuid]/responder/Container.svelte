<script lang="ts">
  import { io } from 'socket.io-client';
  import moment from 'moment';
  import { onMount } from 'svelte';
  import { browser } from '$app/env';
  import {
    SOAP_BOX_URL,
    INSTANT_CONNECT_TALK_URL,
    NODE_SERVER_URL_SIP_DEMO,
    MEETING_TYPE_OPTIONS
  } from '$lib/constants';
  import QueueItem from '$components/QueueItem/QueueItem.svelte';
  import { jsonRequest } from '$lib/shared/json-request';
  import type * as TYPES from '$lib/types';
  import {
    MESSAGE,
    MEMBERS_UPDATE,
    APPEND,
    REMOVE,
    HSET,
    SET,
    QUEUE,
    ACTIVE,
    LIST,
    MESSAGE_RESPONSE,
    INIT_LIST,
    JOIN
  } from './socket/constants';
  import { SocketIO } from './socket';
  import Modal from '$components/Modal/Modal.svelte';

  export let socketID;

  let virtualNurseID = crypto.randomUUID();
  let queue = [];
  let displayQueue = true;
  let joinSession = false;
  let joinButtonIsLoading = false;
  let iframeIsLoading = false;
  let selectedGradNurse = {};
  let meetingURL = '';
  let showModal = false;
  let iframe;
  let dummyToken;
  let isOnDevice = browser ? (window.navigator.userAgent.includes('RoomOS') ? true : false) : false;

  const socketIO = new SocketIO(socketID);
  const httpApiRequest = jsonRequest('/api');

  const postMindyResponse = (guid: string) =>
    httpApiRequest.post('mindy', { guid }).then((r) => r.json() as Promise<TYPES.MindyResponse>);

  const getInstantConnectJEResponse = (sub: string) =>
    httpApiRequest.get('instant-connect/joseencrypts', { sub }).then((r) => r.json() as Promise<TYPES.ICResponse>);

  const getInstantConnectTokenResponse = (data: string) =>
    httpApiRequest.get('instant-connect/space', { data }).then((r) => r.json() as Promise<TYPES.ICToken>);

  socketIO.listen(MESSAGE, (event, payload) => {
    switch (event) {
      case MEMBERS_UPDATE:
        if (payload.data.payload.updated.some((participant: any) => participant.isSelf && !participant.isInMeeting)) {
          displayQueue = true;
          joinSession = false;
          joinButtonIsLoading = false;
          iframeIsLoading = false;
          removeQueue(selectedGradNurse);
        }
        break;
      case APPEND:
        if (!queue.some((q) => q.ID === payload.key)) {
          queue = [
            ...queue,
            {
              timeStamp: moment().local(),
              ID: payload.key,
              status: payload.data.status,
              sessionStatus: payload.data.sessionStatus,
              meetingType: payload.data.meetingType
            }
          ];
        }
        break;
      case REMOVE:
        queue = queue.filter((q) => q.ID !== payload.data);

        if (!queue.some((q) => q.ID === selectedGradNurse.ID)) {
          displayQueue = true;
        }

        if (joinSession) {
          meetingURL = '';
          displayQueue = true;
          joinButtonIsLoading = false;
          iframeIsLoading = false;
          joinSession = false;
        }
        break;
      case HSET:
        queue = queue.map((item) => {
          if (item.ID === payload.key) {
            if (payload.data.status) {
              item.status = payload.data.status;
            }
            if (payload.data.sessionStatus) {
              item.sessionStatus = payload.data.sessionStatus;
            }
          }
          return item;
        });
        break;

      default:
        break;
    }
  });

  socketIO.listen(MESSAGE_RESPONSE, async (event, payload) => {
    if (event === INIT_LIST && payload.data) {
      queue = payload.data.map((q) => ({
        timeStamp: moment(q.score).local(),
        ID: q.value,
        status: JSON.parse(q.data).status,
        sessionStatus: JSON.parse(q.data).sessionStatus,
        meetingType: JSON.parse(q.data).meetingType
      }));
    }
  });

  const startGuestDemoSession = async () => {
    try {
      const { redirect } = await postMindyResponse(selectedGradNurse.ID);
      meetingURL = `${redirect}&autoDial=true&embedSize=desktop&sessionId=${virtualNurseID}`;
      joinSession = true;
      joinButtonIsLoading = false;
      iframeIsLoading = true;
    } catch (error) {
      console.log(error);
    }
  };

  const startICSession = async () => {
    const {
      guest: [guestData],
      host: [hostData]
    } = await getInstantConnectJEResponse('calling-queue-demo');
    const { token: guestToken } = await getInstantConnectTokenResponse(guestData);
    const { token: hostToken } = await getInstantConnectTokenResponse(hostData);

    meetingURL = `${INSTANT_CONNECT_TALK_URL}?int=jose&v=1&data=${hostData}`;
    joinSession = true;
    joinButtonIsLoading = false;

    socketIO.emit(MESSAGE, {
      command: SET,
      set: 'IC_GUEST_URL',
      data: {
        link: `${INSTANT_CONNECT_TALK_URL}?int=jose&v=1&data=${guestData}`,
        guestToken,
        gradNurseID: selectedGradNurse.ID
      }
    });

    await monitorMeeting(hostToken);
  };

  const monitorMeeting = async (token, sip = '') => {
    const webexSDK = new window.Webex({
      credentials: {
        access_token: token
      }
    });

    await webexSDK.meetings.register();

    if (sip !== '') {
      const meeting = await webexSDK.meetings.create(sip);
      await meeting.join();
      meeting.members.on('members:update', async ({ delta, full }) => {
        const newMembers = Object.values({ ...full, ...delta.updated, ...delta.added });
        newMembers.forEach((nm) => {
          if (nm.isInLobby) {
            console.log('admitted', nm);
            meeting.members.admitMembers([nm.id]);
          }
        });

        const members = Object.values({ ...full, ...delta.updated, ...delta.added });
        const guestHasLeft = members.some((member) => member.isGuest && member.status === 'NOT_IN_MEETING');

        if (guestHasLeft) {
          meetingURL = '';
          displayQueue = true;
          joinButtonIsLoading = false;
          joinSession = false;

          HCA_MAIN_SOCKET.emit('message', {
            command: 'set',
            set: 'REMOVE_SIP_ADDRESS',
            data: {
              gradNurseID: selectedGradNurse.ID
            }
          });
        }
      });
    }

    webexSDK.meetings.on('meeting:removed', (addedMeetingEvent) => {
      meetingURL = '';
      displayQueue = true;
      joinButtonIsLoading = false;
      joinSession = false;

      HCA_MAIN_SOCKET.emit('message', {
        command: 'set',
        set: 'REMOVE_IC_GUEST_URL',
        data: {
          gradNurseID: selectedGradNurse.ID
        }
      });
    });
  };

  const createMeeting = async () => {
    let start_date = new Date(new Date().getTime() + 90 * 1000); //90 seconds in the future
    let end_date = new Date(start_date.getTime() + 1 * 60 * 60 * 1000); //1 hour after start_date
    let body = {
      title: 'Consultation Session',
      start: start_date,
      end: end_date,
      allowAnyUserToBeCoHost: true,
      allowAuthenticatedDevices: true,
      enableAutomaticLock: false,
      enableConnectAudioBeforeHost: true,
      enabledAutoRecordMeeting: false,
      enabledJoinBeforeHost: true,
      sendEmail: false,
      unlockedMeetingJoinSecurity: 'allowJoin'
    };

    const { data } = await axios.post('https://webexapis.com/v1/meetings', body, {
      headers: {
        'Authorization': `Bearer ${dummyToken.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    return { sipAddress: data.sipAddress, pin: data.hostKey };
  };

  const startSIPSession = async () => {
    try {
      joinSession = true;
      joinButtonIsLoading = false;
      iframeIsLoading = true;

      const {
        data: { hostToken, sipAddress }
      } = await axios({
        method: 'post',
        url: NODE_SERVER_URL_SIP_DEMO,
        data: {
          guid: selectedGradNurse.ID
        }
      });

      await monitorMeeting(hostToken, sipAddress);
      meetingURL = `sip:${sipAddress}`;

      iframeIsLoading = false;

      HCA_MAIN_SOCKET.emit('message', {
        command: 'set',
        set: 'SIP_ADDRESS',
        data: {
          gradNurseID: selectedGradNurse.ID,
          link: meetingURL
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const startSession = async () => {
    joinButtonIsLoading = true;
    const { meetingType } = selectedGradNurse;

    switch (meetingType) {
      case MEETING_TYPE_OPTIONS.INSTANT_CONNECT:
        await startICSession();
        break;
      case MEETING_TYPE_OPTIONS.BROWSER_SDK:
        await startGuestDemoSession();
        break;
      case MEETING_TYPE_OPTIONS.SIP_URI_DIALING:
        await startSIPSession();
        break;

      default:
        return;
    }

    socketIO.emit(MESSAGE, {
      data: { sessionStatus: ACTIVE },
      key: selectedGradNurse.ID,
      set: QUEUE,
      command: HSET
    });
  };

  const removeQueue = (selectedNurse) => {
    socketIO.emit(MESSAGE, {
      command: REMOVE,
      set: QUEUE,
      data: selectedNurse.ID,
      id: REMOVE
    });

    queue = queue.filter((q) => q.ID !== selectedNurse.ID);
  };

  const handleClick = (selectedNurse) => {
    if (selectedNurse.command) {
      if (selectedNurse.command === 'close') {
        showModal = true;
      } else if (selectedNurse.command === 'force-close') {
        removeQueue(selectedNurse);
      }
    } else {
      displayQueue = false;
    }

    selectedGradNurse = selectedNurse;
  };

  onMount(async () => {
    socketIO.connect(() => {
      socketIO.emit(MESSAGE, { command: LIST, set: QUEUE, id: INIT_LIST });
    });
  });
</script>

<div class="columns">
  <div class="column is-3">
    <h1 class="is-size-3 has-text-white">Request Queue</h1>
  </div>
</div>
<hr />
<div class="is-flex is-fullheight is-align-items-center is-justify-content-center" style="overflow: auto">
  <iframe
    title="meeting"
    width="100%"
    height="100%"
    class:is-hidden={!joinSession}
    bind:this={iframe}
    src={meetingURL}
    allow="camera;microphone"
    on:load={() => {
      iframeIsLoading = false;
    }}
  />
  {#if !joinSession}
    {#if displayQueue}
      {#if queue.length === 0}
        <p class="is-flex subtitle has-text-white has-text-centered">There are no requests.</p>
      {:else}
        <div class="is-flex is-flex-direction-column" style="height: 100%;">
          {#each queue as q}
            <QueueItem onClick={handleClick} data={q} />
          {/each}
        </div>
      {/if}
    {:else}
      <div class="box has-text-centered is-translucent-black p-0" style="height: 40%">
        <div class="is-flex is-justify-content-flex-end m-2">
          <span
            class="icon has-text-danger is-clickable"
            on:click={() => {
              displayQueue = true;
            }}
          >
            <i class="mdi mdi-24px mdi-close" />
          </span>
        </div>
        <div style="padding: 0 1.5rem 1.5rem 1.5rem">
          <div class="subtitle has-text-white has-text-centered is-size-4">Start Support Session</div>
          <button
            class="button is-size-5 mt-5 is-primary is-centered"
            class:is-loading={joinButtonIsLoading}
            on:click={startSession}
            >Join Session
          </button>
        </div>
      </div>
    {/if}
  {/if}
</div>

<Modal isActive={showModal}>
  <div class="modal-content is-translucent-black" style="padding: 1.75rem 0.5rem; width: 22rem;">
    <div class="has-text-white has-text-centered">
      <div class="subtitle is-size-5 has-text-white mb-2 ">You are about to cancel this request.</div>
      <div class="subtitle is-size-5 has-text-white">The requester will be notified.</div>
      <div class="is-size-6">Would you like to continue?</div>
    </div>
    <div class="is-flex is-justify-content-center mt-4">
      <button
        class="button is-primary mr-6"
        on:click={() => {
          removeQueue(selectedGradNurse);
          showModal = false;
        }}>Yes</button
      >
      <button
        class="button is-danger"
        on:click={() => {
          showModal = false;
        }}>No</button
      >
    </div>
  </div>
</Modal>

<style lang="scss">
  .queue {
    overflow: scroll;
    height: 40rem;
  }
</style>
