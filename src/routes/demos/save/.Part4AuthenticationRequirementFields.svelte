<script lang="ts">
  export let responderAuthIsRequired;
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Is Authentication Required?</h2>
  </div>
  <div class="column is-full content mb-0">
    <p>Authentication?</p>
  </div>
  <div class="column is-full">
    <label class="checkbox">
      <input type="checkbox" bind:checked={responderAuthIsRequired} id={'authIsReq'} name="authIsReq" />
      Is Authentication Required?
    </label>
    <div class="help">
      <p>Meeting Browser SDK</p>
    </div>
  </div>
</div>
