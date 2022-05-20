<script lang="ts">
  export let showModal: boolean;
  export let toggleModal: () => void;
</script>

<div class="modal" class:is-active={showModal}>
  <div class="modal-background" on:click={toggleModal} />
  <div class="modal-content">
    <slot />
  </div>
</div>
