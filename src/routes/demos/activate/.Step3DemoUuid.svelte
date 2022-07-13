<script lang="ts">
  import type { JSONObject, JSONValue } from '@sveltejs/kit/types/private';
  import { deviceId, demoUuid, botToken, botEmail } from '.stores';
  import { jsonRequest } from '$lib/shared/json-request';
  import { VALID_UUID } from '$lib/constants';

  export let demos: JSONValue = [];

  let isLoading = false;

  const retrieveDemos = () => {
    isLoading = true;

    return jsonRequest('/demos')
      .get()
      .then((r) => r.json())
      .then((r) => r.demos as JSONObject[])
      .then((r) => (demos = r) && demoUuid.set(undefined))
      .catch((e) => (demos = { error: e.status }) && demoUuid.set(undefined))
      .finally(() => (isLoading = false));
  };

  $: ($botToken && $botEmail && $deviceId && retrieveDemos()) || (demos = []);
</script>

<div class="columns is-multiline is-vcentered">
  <div class="column">
    <h2 class="subtitle">Step #3</h2>
    <h2 class="title">Choose a Demo</h2>
  </div>
  <div class="column is-full content mb-0">
    <p>
      A "Demo" in the context of this application is a collection of widgets (brand logo, background, sensors etc.) that
      make up the UI/controls on the PWA/Kiosk device display.
    </p>
    <p>
      {$deviceId != null && demos.length === 0 ? 'You have no demos. To create' : 'If you wish to create'} a new demo, please
      submit this form:
      <a href="/demos/create" target="_blank">Create a Demo</a> and then click the "Refresh" button.
    </p>
  </div>
  <div class="column is-full">
    <label class="label" for="demo-uuid">Demo ID <sup class="has-text-danger" title="required">*</sup></label>
    <div class="field has-addons mb-0">
      <div class="control has-icons-left is-expanded" class:is-loading={isLoading}>
        <input
          id="demo-uuid"
          class="input"
          name="demoUuid"
          list="demo-uuids"
          autocomplete="off"
          pattern={VALID_UUID.source}
          bind:value={$demoUuid}
          class:is-danger={demos?.error}
          disabled={isLoading || demos.length === 0 || $deviceId == null}
          required
        />
        <datalist id="demo-uuids">
          {#each demos as demo (demo.uuid)}
            <option value={demo.uuid}>
              {demo.name} &mdash; updated {new Date(demo.updatedAt).toLocaleString()}
            </option>
          {/each}
        </datalist>
        <span class="icon is-left">
          <i class="mdi mdi-identifier" />
        </span>
      </div>
      <div class="control">
        <button class="button is-info" disabled={$deviceId == null} on:click|preventDefault={retrieveDemos}>
          <span>Refresh</span>
          <span class="icon">
            <i class="mdi mdi-reload" />
          </span>
        </button>
      </div>
    </div>
    <div class="help">
      <p>To identify a demo, take not of its ID or name</p>
    </div>
  </div>
  <div class="column is-full">
    <details>
      <summary>Demos</summary>
      <pre>{JSON.stringify(demos, null, 2)}</pre>
    </details>
  </div>
</div>
