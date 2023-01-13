<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { MEETING_TYPE_OPTIONS } from '$lib/constants';

  import Modal from '$components/Modal/Modal.svelte';

  export let isSDK: boolean, isIC: boolean, isSIP: boolean, showSIPWarningModal: boolean;
  let isNotRequired = isSDK || isIC || isSIP;

  let SDKCheckBoxElement: HTMLInputElement;
  let ICCheckBoxElement: HTMLInputElement;
  let SIPCheckBoxElement: HTMLInputElement;

  const handleClick = () => {
    isNotRequired = SDKCheckBoxElement.checked || ICCheckBoxElement.checked || SIPCheckBoxElement.checked;
  };

  const dispatch = createEventDispatcher();

  $: if (showSIPWarningModal) isSIP = false;
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Video Call Options</h2>
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
      <p>
        For more information click <a
          target="_blank"
          href="https://developer.webex.com/docs/sdks/browser#getting-started">here</a
        >
      </p>
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
      <p>
        For more information click <a target="_blank" href="https://instant.webex.com/">here</a>
      </p>
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
        on:click={() => dispatch('showAuthWarningModal', { checkSIPBox: !isSIP })}
        required={!isNotRequired}
      />
      SIP URI Dialing
    </label>
    <div class="help">
      <p>
        For more information click <a
          target="_blank"
          href="https://community.cisco.com/t5/collaboration-knowledge-base/sip-uri-dialing/ta-p/3157406">here</a
        >
      </p>
    </div>
  </div>
</div>

<Modal isActive={showSIPWarningModal}>
  <div class="modal-content is-translucent-black" style="border-radius: 1rem; padding: 1.75rem 1rem; width: 30rem;">
    <div class="has-text-white has-text-centered">
      <div class="subtitle is-size-4 has-text-white mb-2 ">SIP URI Dialing Will Disable</div>
      <hr class="ml-4 mr-4" />
      <div class="is-size-5 has-text-white" style="padding: 0 2rem;">
        SIP URI Dialing option will disable if authentication is disabled. SIP URI Dialing call option requires
        responder to authenticate.
      </div>
    </div>
    <div class="is-flex is-justify-content-center mt-4">
      <button
        type="button"
        class="button is-success mt-4"
        on:click={() => {
          showSIPWarningModal = false;
        }}>Acknowledge</button
      >
    </div>
  </div>
</Modal>
