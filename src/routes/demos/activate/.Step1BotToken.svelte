<script lang="ts">
  import type { JSONObject } from '@sveltejs/kit/types/private';
  import { botEmail, botToken } from '.stores';
  import { VALID_ACCESS_TOKEN } from '$lib/constants';
  import { webexHttpPeopleResource } from '$lib/webex/http-wrapper';

  export let bot: JSONObject = {};

  let isLoading = false;
  let botTokenInputElement: HTMLInputElement;

  const togglePasswordReveal = () => {
    botTokenInputElement.type = botTokenInputElement.type === 'password' ? 'text' : 'password';
  };

  const retrieveBotDetails = (botToken: string) => {
    isLoading = true;

    return webexHttpPeopleResource(botToken)
      .getMyOwnDetails()
      .then((r) => r.json())
      .then((r) => (bot = r) && botEmail.set(r?.emails[0] || undefined))
      .catch((e) => (bot = { error: e.status }) && botEmail.set(undefined))
      .finally(() => (isLoading = false));
  };

  $: ($botToken && retrieveBotDetails($botToken)) || ((bot = {}) && botEmail.set(undefined));
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="subtitle">Step #1</h2>
    <h2 class="title">Create a Webex Bot</h2>
  </div>
  <div class="column is-full content mb-0">
    <p>
      The application uses a Webex Bot access token to manage the shared PWA/Kiosk mode device you choose (in step #2).
      Although this token is saved securely in a backend-end database, it is shared with the font-end when navigating to
      the PWA/Kiosk URL.
    </p>
    <p>Hence, it is strongly advised that you use a different Webex Bot for each device.</p>
  </div>
  <div class="column is-full">
    <label class="label" for="bot-token">Bot Access Token <sup class="has-text-danger" title="required">*</sup></label>
    <div class="control has-icons-left {isLoading ? 'is-loading' : 'has-icons-right'}">
      <input
        id="bot-token"
        class="input"
        type="password"
        name="botToken"
        pattern={VALID_ACCESS_TOKEN.source}
        bind:value={$botToken}
        bind:this={botTokenInputElement}
        class:is-danger={bot?.error}
        disabled={isLoading}
        required
      />
      <span class="icon is-left">
        <i class="mdi mdi-key" />
      </span>
      {#if !isLoading}
        <span class="icon is-right" on:click={togglePasswordReveal}>
          <i class="mdi {botTokenInputElement?.type === 'password' ? 'mdi-eye' : 'mdi-eye-off'}" />
        </span>
      {/if}
    </div>
    <div class="help">
      <p>
        To create a new bot access token &mdash; visit
        <a href="https://developer.webex.com/my-apps/new/bot" target="_blank">
          https://developer.webex.com/my-apps/new/bot
        </a> and submit the form (you might need to login first)
      </p>
    </div>
  </div>
  <div class="column is-full">
    <details>
      <summary> Bot Details </summary>
      <pre>{JSON.stringify(bot, null, 2)}</pre>
    </details>
  </div>
</div>

<style>
  div.control.has-icons-right .icon.is-right .mdi-eye,
  div.control.has-icons-right .icon.is-right .mdi-eye-off {
    pointer-events: auto !important;
    cursor: pointer;
  }
</style>