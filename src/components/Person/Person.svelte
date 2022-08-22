<script lang="ts">
  import type { PersonResponse } from './types/person-response';
  import { webexHttpPeopleResource } from '$lib/webex/http-wrapper';
  import { browser } from '$app/env';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import Avatar from '../Avatar/Avatar.svelte';

  export let updateInterval = 20;
  export let id = undefined;
  export let email = undefined;
  export let accessToken: string;
  export let size = 64;
  export let rtf = new Intl.RelativeTimeFormat('en', { style: 'narrow' });

  export const units = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: (24 * 60 * 60 * 1000 * 365) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000
  };

  export const getRelativeTime = (d1, d2 = new Date(Date.now() - updateInterval * 1000)) => {
    const elapsed = d1 - d2;

    // "Math.abs" accounts for both "past" & "future" scenarios
    for (const u in units)
      if (Math.abs(elapsed) > units[u] || u == 'second') return rtf.format(Math.round(elapsed / units[u]), u);
  };

  export const getInitials = (email?: string, firstName?: string, lastName?: string) =>
    firstName != null && lastName != null
      ? firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()
      : email?.charAt(0).toUpperCase() ?? 'U';

  export const getPersonDetails = (accessToken: string, id?: string) =>
    (id != null
      ? webexHttpPeopleResource(accessToken).getPersonDetails(id)
      : webexHttpPeopleResource(accessToken).getMyOwnDetails()
    ).then((r) => r.json() as Promise<PersonResponse>);

  let personStore = writable<PersonResponse>(undefined);
  let personResponse = browser ? getPersonDetails(accessToken, id) : Promise.resolve(undefined);

  $: personResponse?.then((r) => id ?? (id = r.id));
  $: personResponse?.then((r) => email ?? (email = r.emails[0]));
  $: personResponse?.then((r) => personStore.set(r));

  onMount(() => {
    const interval = updateInterval * 1000;
    const intervalId = setInterval(() => (personResponse = getPersonDetails(accessToken, id)), interval);

    return () => clearInterval(intervalId);
  });
</script>

<section class="container person-container" data-person-id={id}>
  <div class="columns is-vcentered is-mobile">
    <div class="column is-narrow">
      <Avatar
        image={$personStore?.avatar?.replace(/~1600$/, '~640')}
        status={$personStore?.status}
        initials={getInitials($personStore?.emails[0], $personStore?.firstName, $personStore?.lastName)}
        {size}
      />
    </div>
    <div class="column name-column">
      <h2 class="has-text-weight-bold">
        <span class="is-size-5 person-nickname">{$personStore?.nickName},</span>
        <span class="has-text-grey-light is-size-6 person-email">
          {$personStore?.emails[0].replace(/@.*$/, '')}
        </span>
      </h2>
      <h3 class="is-size-6 has-text-grey-light has-text-weight-normal person-last-activity">
        {$personStore?.lastActivity ? 'last activity ~' + getRelativeTime(new Date($personStore?.lastActivity)) : ''}
      </h3>
    </div>
    {#if $$slots.default && id}
      <div class="column is-3">
        <slot {id} {email} />
      </div>
    {/if}
  </div>
</section>

<style>
  .name-column {
    word-wrap: anywhere;
  }
</style>
