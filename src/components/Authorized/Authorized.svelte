<script lang="ts">
  import type { TokenResponse } from './types/token-response';
  import type { PersonResponse } from '$lib/types';
  import { writable } from 'svelte/store';
  import Person from '../Person/Person.svelte';

  export let tokenResponseStore = writable<TokenResponse>(undefined);
  export let personStore = writable<PersonResponse>(undefined);

  let isActive = false;
</script>

<nav class="navbar is-transparent is-spaced px-0 pt-0 authorized-nav" aria-label="navigation">
  <div class="navbar-brand is-align-items-center avatar-navbar-brand">
    <div class="navbar-item dropdown is-hoverable avatar-navbar-brand-item">
      <div class="dropdown-trigger title mb-0">
        {#if $tokenResponseStore?.accessToken}
          <Person accessToken={$tokenResponseStore.accessToken} bind:id={$tokenResponseStore.id} {personStore} />
        {/if}
      </div>
      <div class="dropdown-menu" role="menu">
        <slot name="dropdown-content" />
      </div>
    </div>
    <a
      role="button"
      class="navbar-burger"
      aria-label="menu"
      aria-expanded="false"
      class:is-active={isActive}
      on:click={() => (isActive = !isActive)}
    >
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </a>
  </div>

  <div class="navbar-menu" class:is-active={isActive}>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <slot name="navbar-button" />
          <button
            class="button is-rounded is-danger is-medium is-flex-grow-1 has-text-weight-bold"
            on:click={() => tokenResponseStore.set(undefined) || personStore.set(undefined)}
          >
            <span class="icon">
              <i class="mdi mdi-logout" />
            </span>
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</nav>

{#if $tokenResponseStore.id}
  <slot />
{/if}

<style>
  .navbar-item :global(img) {
    max-height: unset;
  }

  .avatar-navbar-brand {
    flex-shrink: unset;
  }
</style>
