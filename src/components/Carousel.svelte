<script lang="ts">
  import { onMount, SvelteComponent } from 'svelte';

  export let components: Array<typeof SvelteComponent>;
  let Carousel: typeof SvelteComponent;

  onMount(async () => {
    const module = await import('svelte-carousel');
    Carousel = module.default;
  });
</script>

<svelte:component this={Carousel}>
  {#each components as item}
    <div class="p-2 carouselItem ">
      <svelte:component this={item} />
    </div>
  {/each}
</svelte:component>

<style>
  .carouselItem {
    height: 45rem;
  }
</style>
