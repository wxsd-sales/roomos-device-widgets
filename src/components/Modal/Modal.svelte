<script lang="ts">
  export let isActive = true;
</script>

<div class="modal" class:is-active={isActive}>
  <div class="modal-background" on:click />
  <section class="modal-content">
    <slot />
  </section>
</div>
