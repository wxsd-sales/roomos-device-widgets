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

<div class="hero tile">
  {#if displayInputs}
    <form
      class="is-flex is-flex-direction-column is-justify-content-space-between tile"
      on:submit|preventDefault={sendInvites}
    >
      <p class="subtitle">
        Text a video chat link to a family member. Enter their mobile number and click the invite button.
      </p>
      <input
        class="input mb-4"
        placeholder="From"
        type="text"
        bind:value={fromInputValue}
        required
        on:input={handleFromChange}
      />
      <MaskedInput
        class="input mb-4"
        options={phoneNumberOption}
        placeholder="+1 (XXX) - XXX - XXXX"
        type="tel"
        on:input={handlePhoneChange}
        bind:value={phoneInputValue}
      />
      <button class="button is-success is-rounded is-large" {disabled}>Send Invitation</button>
    </form>
  {:else}
    <div class="is-flex is-flex-direction-column is-justify-content-space-between has-text-centered tile">
      <p class="title mb-6">Video chat invite sent!</p>
      <p class="subtitle">{`to ${phoneInputValue} from ${fromInputValue}`}</p>
      <button
        class="button is-success is-rounded is-large"
        on:click={() => {
          window.location.href = `sip:${sipAddress}`;
        }}>Join</button
      >
    </div>
  {/if}
</div>
