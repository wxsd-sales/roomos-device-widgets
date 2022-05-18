<script lang="ts">
  import { isValidPhoneNumber } from 'libphonenumber-js';
  import { MaskedInput } from 'svelte-imask';
  import { jsonRequest } from '$lib/shared/json-request';
  import { GUEST_DEMO_SERVER_URL, IMI_CONNECT_SMS_HOOK_URL } from '$lib/constants';

  const sipAddress = 'kiosk.wxsd@webex.com';
  let disabled = true;
  let fromInputValue: string;
  let phoneInputValue: string;
  let displayInputs = true;

  const phoneNumberOption = {
    mask: '+{1} (000) 000 - 0000'
  };

  const validate = (from: string, phone: string) => {
    if (isValidPhoneNumber(`+${phone}`) && from) {
      disabled = false;
    } else {
      disabled = true;
    }
  };
  const handlePhoneChange = (event?: any) => {
    validate(fromInputValue, phoneInputValue);
  };

  const handleFromChange = (event) => {
    validate(event.target.value, phoneInputValue);
  };

  const sendInvites = async () => {
    const body = {
      sip_target: sipAddress,
      header_toggle: false,
      sms_button: false,
      expire_hours: 8,
      self_view: true,
      auto_dial: true,
      version: 2
    };

    const {
      urls: { Guest }
    } = await jsonRequest(GUEST_DEMO_SERVER_URL).post('create_url', undefined, body);
    const IMIBody = {
      number: phoneInputValue,
      message: `${fromInputValue} has invited you to join the meeting: ${Guest[0]}`
    };

    await jsonRequest(IMI_CONNECT_SMS_HOOK_URL).post('JAMIQW66NE', undefined, IMIBody);

    disabled = true;
    displayInputs = false;
  };
</script>

{#if displayInputs}
  <form class="" on:submit|preventDefault={sendInvites}>
    <p class="title is-size-4">Text a video chat link to a guest</p>
    <div class="field control">
      <input
        class="input is-rounded is-medium"
        placeholder="From"
        type="text"
        bind:value={fromInputValue}
        required
        on:input={handleFromChange}
      />
    </div>
    <div class="columns is-centered">
      <div class="column is-7">
        <MaskedInput
          class="input is-rounded is-medium control"
          options={phoneNumberOption}
          placeholder="+1 (XXX) - XXX - XXXX"
          type="tel"
          on:input={handlePhoneChange}
          bind:value={phoneInputValue}
        />
      </div>
      <div class="column is-centered has-text-centered">
        <button class="button is-success is-rounded is-medium is-fullwidth" {disabled}>
          <span class="icon">
            <i class="mdi mdi-message-text-fast" />
          </span>
          <span>Send Invite</span>
        </button>
      </div>
    </div>
  </form>
{:else}
  <p class="title is-size-4 has-text-centered">Video chat invite sent!</p>
  <p class="subtitle has-text-centered mb-6">
    {`A video chat link was sent to ${phoneInputValue}.`}
  </p>
  <button
    class="button is-success is-rounded is-medium is-fullwidth mt-6"
    on:click={() => {
      window.location.href = `sip:${sipAddress}`;
    }}>Join</button
  >
{/if}
