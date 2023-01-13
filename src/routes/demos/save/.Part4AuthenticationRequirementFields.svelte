<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Modal from '$components/Modal/Modal.svelte';

  export let responderAuthIsRequired: boolean;
  export let showAuthWarningModal = true;

  const dispatch = createEventDispatcher();

  $: if (showAuthWarningModal) responderAuthIsRequired = true;
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Enable Authentication</h2>
  </div>
  <div class="column is-full content mb-0">
    <p>
      Requiring authentication would allow the the queue system to manage and control both requests and calls more
      effectively. Also SIP URI Dialing call option is only available with authentication enabled.
    </p>
  </div>
  <div class="column is-full">
    <label class="checkbox">
      <input
        type="checkbox"
        on:click={() => dispatch('showSIPWarningModal', { authCheckBox: responderAuthIsRequired })}
        bind:checked={responderAuthIsRequired}
        id={'authIsReq'}
        name="authIsReq"
      />
      Enable Authentication
    </label>
    <div class="help">
      <p>
        For more information click <a target="_blank" href="https://developer.webex.com/docs/integrations">here</a>
      </p>
    </div>
  </div>
</div>

<Modal isActive={showAuthWarningModal}>
  <div class="modal-content is-translucent-black" style="border-radius: 1rem; padding: 1.75rem 1rem; width: 30rem;">
    <div class="has-text-white has-text-centered">
      <div class="subtitle is-size-4 has-text-white mb-2 ">Authentication Must Enable</div>
      <hr class="ml-4 mr-4" />
      <div class="is-size-5 has-text-white" style="padding: 0 2rem;">
        SIP URI Dialing option requires the responder to authenticate. Therefore authentication checkbox must be
        checked.
      </div>
    </div>
    <div class="is-flex is-justify-content-center mt-4">
      <button
        type="button"
        class="button is-success mt-4"
        on:click={() => {
          showAuthWarningModal = false;
        }}>Acknowledge</button
      >
    </div>
  </div>
</Modal>
