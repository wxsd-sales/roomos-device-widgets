<script lang="ts">
  import { isValidPhoneNumber } from 'libphonenumber-js';
  import { MaskedInput } from 'svelte-imask';
  import { jsonRequest } from '$lib/shared/json-request';
  import { GUEST_DEMO_SERVER_URL, IMI_CONNECT_SMS_HOOK_URL } from '$lib/constants';
  import { activeCall, deviceSerial } from '../lib/store';
  import { v4 as uuidv4 } from 'uuid';

  const sipAddress = 'kiosk.wxsd@webex.com';
  const uuid = uuidv4();
  const xcommandRequest = jsonRequest('/xapi', 'command');
  let disabled = true;
  let fromInputValue: string;
  let phoneInputValue: string;
  let displayInputs = true;

  const phoneNumberOption = { mask: '+{1} (000) 000 - 0000' };

  const validate = (from: string, phone: string) => {
    disabled = !(isValidPhoneNumber(`+${phone}`) && from);
  };
  const handlePhoneChange = () => {
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

  // TODO: Remove Duplicate
  function pollGuestJoinStatus(uuid) {
    let tries = 0;
    let intervalId = setInterval(async () => {
      if (tries < 3) {
        const status = await jsonRequest('/check', 'uuids').get(uuid);
        console.log(status);
        if (status == null) {
          console.log('clearing interval id', intervalId);
          clearInterval(intervalId);
          $activeCall.uuid = undefined;
          $activeCall.status = undefined;
        } else if (status?.e) {
          tries = tries + 1;
        } else {
          $activeCall.uuid = uuid;
          if ($activeCall.status?.includes('is-loading') && $activeCall.status?.includes('is-success')) {
            $activeCall.status = 'is-danger';
          }
          if ($activeCall.status?.includes('is-loading') && $activeCall.status?.includes('is-danger')) {
            $activeCall.status = undefined;
          }
        }
      } else {
        console.log('clearing interval id', intervalId);
        clearInterval(intervalId);
        $activeCall.uuid = undefined;
        $activeCall.status = undefined;
      }
    }, 2000);
  }

  // TODO: Remove Duplicate
  async function disconnect() {
    $activeCall.status = 'is-loading is-danger';

    return await xcommandRequest.get('call.disconnect', { serial: $deviceSerial });
  }

  const makeSIPCall = async (number, uuid) => {
    $activeCall.uuid = uuid;
    $activeCall.status = 'is-loading is-success';

    await xcommandRequest
      .get('dial', { number: number, serial: $deviceSerial, uuid: uuid })
      .then(() => pollGuestJoinStatus(uuid));
  };
</script>

{#if displayInputs}
  <form on:submit|preventDefault={sendInvites}>
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
          <span class="icon is-medium">
            <i class="mdi mdi-message-text-fast" />
          </span>
          <span>Send Invite</span>
        </button>
      </div>
    </div>
  </form>
{:else}
  <div class="columns">
    <span
      class="icon is-clickable"
      on:click={() => {
        displayInputs = true;
        fromInputValue = '';
        phoneInputValue = '';
      }}
    >
      <i class="mdi mdi-light mdi-24px mdi-arrow-left" />
    </span>
    <div class="column">
      <p class="title is-size-4 has-text-centered ">Video chat invite sent!</p>
      <p class="subtitle has-text-centered ">
        {`A video chat link was sent to ${phoneInputValue}.`}
      </p>
    </div>
  </div>
  {#if $activeCall?.uuid == null}
    <button
      class="button is-success is-rounded is-medium is-fullwidth mt-6"
      on:click={() => makeSIPCall(sipAddress, uuid)}
    >
      <span class="icon is-medium">
        <i class="mdi mdi-phone" />
      </span>
    </button>
  {:else if $activeCall?.uuid === uuid}
    <button class="button {$activeCall?.status} is-rounded is-medium is-fullwidth mt-6" on:click={() => disconnect()}>
      <span class="icon is-medium">
        <i class="mdi mdi-phone-hangup" />
      </span>
    </button>
  {/if}
{/if}
