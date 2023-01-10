<script lang="ts">
  import { MEETING_TYPE_OPTIONS } from '$lib/constants';

  export let isSDK: boolean, isIC: boolean, isSIP: boolean;
  let isNotRequired = isSDK || isIC || isSIP;

  let SDKCheckBoxElement: HTMLInputElement;
  let ICCheckBoxElement: HTMLInputElement;
  let SIPCheckBoxElement: HTMLInputElement;

  const handleClick = () => {
    isNotRequired = SDKCheckBoxElement.checked || ICCheckBoxElement.checked || SIPCheckBoxElement.checked;
  };
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Meeting Types</h2>
  </div>
  <div class="column is-full content mb-0">
    <p>Provide a list of Meeting type options for a requester to choose from.</p>
  </div>
  <!-- A -->
  <div class="column is-one-third">
    <label class="checkbox">
      <input
        type="checkbox"
        bind:checked={isSDK}
        id={MEETING_TYPE_OPTIONS.BROWSER_SDK}
        name={MEETING_TYPE_OPTIONS.BROWSER_SDK}
        bind:this={SDKCheckBoxElement}
        on:input={handleClick}
        required={!isNotRequired}
      />
      Meeting Browser SDK
    </label>
    <div class="help">
      <p>Meeting Browser SDK</p>
    </div>
  </div>
  <div class="column is-one-third">
    <label class="checkbox">
      <input
        type="checkbox"
        bind:checked={isIC}
        id={MEETING_TYPE_OPTIONS.INSTANT_CONNECT}
        name={MEETING_TYPE_OPTIONS.INSTANT_CONNECT}
        bind:this={ICCheckBoxElement}
        on:input={handleClick}
        required={!isNotRequired}
      />
      Instant Connect
    </label>
    <div class="help">
      <p>Instant Connect</p>
    </div>
  </div>
  <div class="column is-one-third">
    <label class="checkbox">
      <input
        type="checkbox"
        bind:checked={isSIP}
        id={MEETING_TYPE_OPTIONS.SIP_URI_DIALING}
        name={MEETING_TYPE_OPTIONS.SIP_URI_DIALING}
        bind:this={SIPCheckBoxElement}
        on:input={handleClick}
        required={!isNotRequired}
      />
      SIP URI Dialing
    </label>
    <div class="help">
      <p>SIP URI Dialing</p>
    </div>
  </div>
</div>
