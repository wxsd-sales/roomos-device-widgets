<script>
  export let url;
</script>

<div class="level-item" class:is-outer-background-image-container={true} class:weather-icon-container={true}>
  <div class:is-inner-background-image-container={true} style:background="url({url}) no-repeat" />
</div>

<style>
  .is-outer-background-image-container {
    position: relative;
  }
  .is-inner-background-image-container {
    mix-blend-mode: exclusion;
    position: absolute;
    right: 1.5rem;
    top: -5rem;
    height: 6.25rem;
    width: 6.25rem;
  }
</style>
