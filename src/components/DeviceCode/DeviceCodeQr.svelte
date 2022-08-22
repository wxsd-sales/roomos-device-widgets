<script lang="ts">
  export let qrImage: Promise<string>;
</script>

<figure class="is-flex is-align-items-center is-justify-content-center device-code-qr-container">
  {#await qrImage}
    <div class="loader" />
  {:then value}
    <img alt="QR Code" src={value} />
  {:catch error}
    <span class="icon has-text-danger" title={error?.message}>
      <i class="mdi mdi-alert-circle-outline" />
    </span>
  {/await}
</figure>

<style>
  figure {
    min-height: 15rem;
  }
  img {
    border-radius: 4px;
  }
  div.loader,
  span.icon.has-text-danger {
    height: 7.5rem;
    width: 7.5rem;
    font-size: 7.5rem;
  }
</style>
