<script lang="ts">
  import Avatar from '../Avatar/Avatar.svelte';

  export let id;
  export let avatar;
  export let sipAddress = undefined;
  export let title = undefined;
  export let size = 64;

  let visible = false;

  export const getInitials = (sipAddress?: string, title?: string) =>
    title != null
      ? title?.charAt(0)?.toUpperCase() + title?.charAt(1)?.toUpperCase()
      : sipAddress?.charAt(0).toUpperCase() ?? 'U';
</script>

<section class="container space-container" data-group-id={id}>
  <div class="columns is-vcentered is-mobile">
    <div class="column is-narrow">
      <Avatar image={avatar?.replace(/~1600$/, '~640')} initials={getInitials(sipAddress, title)} {size} />
    </div>
    <div class="column name-column">
      <h2 class="has-text-weight-bold">
        {#if sipAddress && visible}
          <span class="is-size-5 person-nickname" on:click={() => (visible = !visible)}>{title},</span>
          <span class="has-text-grey-light is-size-6 person-email" on:click={() => (visible = !visible)}>
            {sipAddress.replace(/@.*$/, '')}
          </span>
        {:else}
          <span class="is-size-5 person-nickname" on:click={() => (visible = !visible)}>{title}</span>
        {/if}
      </h2>
    </div>
    {#if $$slots.default && id}
      <div class="column is-3">
        <slot {id} {sipAddress} />
      </div>
    {/if}
  </div>
</section>

<style>
  .name-column {
    word-wrap: anywhere;
  }
</style>
