<script lang="ts">
  export let title: string | URL = 'Cisco';
  export let subtitle = 'Bridge to possible.';

  let isTitleImageUrl = title?.toString().startsWith('data:image') || title?.toString().startsWith('blob:');
  let isTitleUrl = title?.toString().startsWith('http');
</script>

{#if isTitleImageUrl || isTitleUrl}
  <img class="is-brand-logo" src={title} alt={subtitle} on:load />
{:else}
  <h1 class="title is-brand-title">{title}</h1>
  <h2 class="subtitle px-1 is-brand-subtitle">{subtitle}</h2>
{/if}

<style>
  .is-brand-title {
    font-size: clamp(2.5rem, 3rem, 5rem);
  }
  .is-brand-logo {
    height: 3.75rem;
  }
</style>
