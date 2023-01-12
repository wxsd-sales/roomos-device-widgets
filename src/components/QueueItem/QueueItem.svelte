<script lang="ts">
  import { onMount } from 'svelte';
  import { readable } from 'svelte/store';
  import moment from 'moment';

  export let onClick = (data: unknown) => {};
  export let data;
  let start;
  let timer = 30 * 60;

  const mstime = readable(new Date().getTime(), (set) => {
    let animationFrame;
    const next = () => {
      set(new Date().getTime());
      animationFrame = requestAnimationFrame(next);
    };
    if (window.requestAnimationFrame) {
      next();
      return () => cancelAnimationFrame(animationFrame);
    }
  });

  const handleClick = () => {
    onClick(data);
  };

  const close = () => {
    onClick({ ...data, command: 'close' });
  };

  mstime.subscribe(() => {
    if (minutes === 0 && seconds === 0) {
      if (data.sessionStatus === ' inactive') {
        onClick({ ...data, command: 'force-close' });
      }
    }
  });

  $: time = Math.floor(($mstime - data.timeStamp) / 1000);
  $: toWait = timer - time > 0 ? timer - time : 0;
  $: minutes = Math.floor(toWait / 60);
  $: seconds = toWait - minutes * 60;
</script>

<div class="box is-translucent-black pt-2 pb-5 item" class:flash={data.sessionStatus === 'active'}>
  <div class="close mb-2">
    <button
      class="button p-0 customButton"
      style="border: none; background-color: transparent; height: 2rem;"
      on:click={close}
      disabled={data.sessionStatus === 'active'}
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
              data?.sessionStatus === 'active' ? 'danger' : data?.status === 'active' ? 'success' : 'warning'
            }`}
          >
            <i class="mdi mdi-18px mdi-circle " />
          </span>
          {#if data.sessionStatus === 'active'}
            <div class="subtitle has-text-weight-medium has-text-white ml-1">In Session</div>
          {:else}
            <div class="subtitle has-text-weight-medium has-text-white ml-1">Support Request</div>
          {/if}
        </div>
      </div>
      <div class="column has-text-white is-4 is-size-6 has-text-right">
        {data?.timeStamp.format('LT')}
      </div>
    </div>
    <div class="columns mb-5 mt-4">
      <div class="column has-text-left-desktop has-text-white ">You have a new support meeting request</div>
    </div>
    <div class="columns pb-0 has-text-white has-text-center time" style="font-size: 0.75rem;">
      <div
        class="column is-flex is-align-items-flex-end is-justify-content-center meetingType has-text-weight-semibold"
      >
        {data.meetingType === 'SDK'
          ? 'Provided By: Webex Browser SDK'
          : data.meetingType === 'IC'
          ? 'Provided By: Webex Instant Connect'
          : 'Provided By: SIP URI Dialing Feature'}
      </div>
      <div class="column">
        {#if data.sessionStatus === 'inactive'}
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
  @media screen and (min-width: 480px) {
    .meetingType {
      justify-content: flex-start !important;
    }
    .time {
      text-align: right !important;
    }
    .item {
      width: 65rem;
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
