<script lang="ts">
  import { onMount, SvelteComponent } from 'svelte';
  import type { SvelteElement } from 'svelte/internal';

  export let components: Array<typeof SvelteComponent>;
  let Carousel: typeof SvelteComponent;
  let carousel: typeof SvelteElement;

  onMount(async () => {
    const module = await import('svelte-carousel');
    Carousel = module.default;
  });
</script>

<section class="hero">
  <svelte:component this={Carousel} bind:this={carousel}>
    {#each components as item}
      <div class="container p-4">
        <svelte:component this={item} />
      </div>
    {/each}
  </svelte:component>
</section>
