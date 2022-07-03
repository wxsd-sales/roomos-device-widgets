<script lang="ts">
  import Person from '../Person/Person.svelte';
  import { onMount } from 'svelte';

  export let id: string = undefined;
  export let scope: string;
  export let expiresIn: string;
  export let expiresAt: Date;
  export let accessToken: string;
  export let tokenType: string;
  export let refreshToken: string;
  export let refreshTokenExpiresIn: string;
  export let refreshTokenExpiresAt: string;

  let isActive = false;
</script>

<nav class="navbar is-spaced px-0 pt-0 authorized-nav" aria-label="navigation">
  <div class="navbar-brand is-align-items-center">
    <div class="navbar-item avatar-navbar-item">
      <div class="is-hoverable title">
        <Person {accessToken} bind:id />
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
          <button class="button is-rounded is-danger is-medium is-fullwidth" on:click={() => (accessToken = undefined)}>
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

{#if id}
  <slot {id} {accessToken} />
{/if}

<style>
  .navbar-item :global(img) {
    max-height: unset;
  }
</style>
