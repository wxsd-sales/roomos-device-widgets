<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { imask } from '@imask/svelte';
  import { jsonRequest } from '$lib/shared/json-request';
  import Title from '../Title/Title.svelte';

  export let destination: string | undefined = undefined;
  export let httpApiRequest = jsonRequest('/api');
  export let title = 'Text Video Chat Link to a Guest';

  let destinationValue = destination;
  const dispatch = createEventDispatcher();
  const numberInput = { mask: `(000) 000-0000`, lazy: true };
  const numberRegex = new RegExp(`\\(\\d{3}\\) \\d{3}-\\d{4}`);
  const countryCodes = ['🇺🇸 +1', '🇬🇧 +44', '🇦🇺 +61', '🇮🇪 +353'];

  let formElement: HTMLFormElement;
  let isLoading = false;

  // eslint-disable-next-line no-undef
  function handleSubmit(e: SubmitEvent): void {
    if (import.meta.env.DEV) console.info(e);

    const formData = new FormData(e.target as HTMLFormElement);
    const countryCode = (formData.get('countryCode') as string).split(' ').pop();
    if (countryCode == undefined) return;

    const query = {
      sipTarget: formData.get('sip-target') as string,
      number: (countryCode + ' ' + formData.get('number')) as string,
      expiresIn: 8 * 3600
    };

    return Promise.resolve((isLoading = true))
      .then(() => httpApiRequest.post('guest-invite', undefined, query).then((r) => r.json()))
      .then((r) => dispatch('guestInviteInsert', { number: query.number, ...r }))
      .finally(() => (isLoading = false));
  }
</script>

{#if title}
  <Title text={title} />
{/if}

<form bind:this={formElement} on:submit|preventDefault={handleSubmit}>
  <div class="columns is-vcentered" class:is-hidden={destination != null}>
    <div class="column">
      <div class="control has-icons-left">
        <input
          class="input is-rounded is-medium"
          placeholder="SIP Destination"
          type="email"
          name="sip-target"
          bind:value={destinationValue}
          readonly={destination != null}
          required
        />
        <span class="icon is-left">
          <i class="mdi mdi-at" />
        </span>
      </div>
    </div>
  </div>
  <div class="columns is-mobile is-vcentered" class:is-multiline={destination != null}>
    <div class="column" class:is-12={destination != null}>
      <div class="field has-addons is-flex ">
        <p class="control">
          <span class="select is-rounded is-medium">
            <select name="countryCode">
              {#each countryCodes as code}
                <option>{code}</option>
              {/each}
            </select>
          </span>
        </p>

        <div class="control is-expanded">
          <input
            class="input is-rounded is-medium"
            type="tel"
            name="number"
            required
            pattern={numberRegex.source}
            placeholder={numberInput.mask}
            use:imask={numberInput}
          />
        </div>
      </div>
    </div>
    <div class="column {destination != null ? 'is-12' : 'is-4'}">
      <button class="button is-primary is-rounded is-medium is-fullwidth" type="submit" class:is-loading={isLoading}>
        <span class="icon">
          <i class="mdi mdi-message-text-fast" />
        </span>
        <span>Invite</span>
      </button>
    </div>
  </div>
</form>
