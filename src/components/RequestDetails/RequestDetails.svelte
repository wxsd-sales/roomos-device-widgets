<script lang="ts">
  import { readable } from 'svelte/store';
  import { MEETING_TYPE_OPTIONS } from '$lib/enums';
  import type { RequestInfo } from './types';
  import { SESSION_STATUS } from './enums';

  export let onClick: (requestInfo: RequestInfo) => void;
  export let requestInfo: RequestInfo;

  let timer = 30 * 60;

  const mstime = readable(new Date().getTime(), (set) => {
    let animationFrame: number;

    const next = () => {
      set(new Date().getTime());
      animationFrame = requestAnimationFrame(next);
    };
    next();
    return () => cancelAnimationFrame(animationFrame);
  });

  mstime.subscribe(() => {
    if (minutes === 0 && seconds === 0) {
      if (requestInfo.sessionStatus === SESSION_STATUS.INACTIVE) {
        onClick({ ...requestInfo, command: 'force-close' });
      }
    }
  });

  const handleClick = () => {
    onClick(requestInfo);
  };

  const close = () => {
    onClick({ ...requestInfo, command: 'close' });
  };

  $: time = Math.floor(($mstime - requestInfo.timeStamp) / 1000);
  $: toWait = timer - time > 0 ? timer - time : 0;
  $: minutes = Math.floor(toWait / 60);
  $: seconds = toWait - minutes * 60;
</script>

<div class="box is-translucent-black pt-2 pb-5 item" class:flash={requestInfo.sessionStatus === SESSION_STATUS.ACTIVE}>
  <div class="close mb-2">
    <button
      class="button p-0 customButton"
      style="border: none; background-color: transparent; height: 2rem;"
      on:click={close}
      disabled={requestInfo.sessionStatus === SESSION_STATUS.ACTIVE}
    >
      <span class="icon has-text-danger">
        <i class="mdi mdi-24px mdi-close " />
      </span>
    </button>
  </div>
  <div class="is-clickable" on:click={handleClick}>
    <div class="columns is-mobile">
      <div class="column is-8">
        <div class="is-flex is-align-items-center ">
          <span
            class={`icon has-text-${
              requestInfo?.sessionStatus === SESSION_STATUS.ACTIVE
                ? 'danger'
                : requestInfo?.status === SESSION_STATUS.ACTIVE
                ? 'success'
                : 'warning'
            }`}
          >
            <i class="mdi mdi-18px mdi-circle " />
          </span>
          {#if requestInfo.sessionStatus === SESSION_STATUS.ACTIVE}
            <div class="subtitle has-text-weight-medium has-text-white ml-1">In Session</div>
          {:else}
            <div class="subtitle has-text-weight-medium has-text-white ml-1">Support Request</div>
          {/if}
        </div>
      </div>
      <div class="column has-text-white is-4 is-size-6 has-text-right">
        {requestInfo?.timeStamp.format('LT')}
      </div>
    </div>
    <div class="columns mb-5 mt-4">
      <div class="column has-text-left-desktop has-text-white ">You have a new support meeting request</div>
    </div>
    <div class="columns pb-0 has-text-white has-text-center time" style="font-size: 0.75rem;">
      <div
        class="column is-flex is-align-items-flex-end is-justify-content-center meetingType has-text-weight-semibold"
      >
        {requestInfo.meetingType === MEETING_TYPE_OPTIONS.BROWSER_SDK
          ? 'Provided By: Webex Browser SDK'
          : requestInfo.meetingType === MEETING_TYPE_OPTIONS.INSTANT_CONNECT
          ? 'Provided By: Webex Instant Connect'
          : 'Provided By: SIP URI Dialing Feature'}
      </div>
      <div class="column">
        {#if requestInfo.sessionStatus === 'inactive'}
          <div>Your request will auto expire in: {minutes} mins {seconds}s</div>
        {/if}
        <div>
          Please use the <span class="has-text-danger">X</span> icon to manually cancel this request
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @media screen and (min-width: 768px) {
    .meetingType {
      justify-content: flex-start !important;
    }
    .time {
      text-align: right !important;
    }
    .item {
      width: 45rem;
    }
  }

  @media screen and (min-width: 1024px) {
    .item {
      width: 55rem;
    }
  }

  @media screen and (min-width: 1216px) {
    .item {
      width: 68rem;
    }
  }

  @media screen and (min-width: 1408px) {
    .item {
      width: 75rem;
    }
  }

  .close {
    display: flex;
    justify-content: flex-end;
  }
  .customButton:focus {
    box-shadow: none;
  }
</style>
