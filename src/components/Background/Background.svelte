<script lang="ts">
  export let filter = 'brightness(55%)';
  export let imageLink: string | URL = undefined;
  export let videoLink: string | URL = undefined;
</script>

{#if imageLink && videoLink}
  <video class="is-brand-background" autoplay loop muted playsinline poster={imageLink} style:filter>
    <source src={videoLink} />
  </video>
{:else}
  <img class="is-brand-background" alt="background" src={imageLink} style:filter on:load />
{/if}

<style>
  .is-brand-background {
    object-fit: cover;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
  }
</style>
