<script lang="ts">
  export let text = 'Login Using Your Mobile or Computer';
  export let verificationUri: Promise<string | URL>;
  export let userCode: Promise<string>;
</script>

<section class="device-code-text-container">
  <div class="columns is-vcentered is-gapless is-multiline">
    <div class="column is-12">
      <p class="subtitle">{text}</p>
      <p>
        Go to
        {#await verificationUri}
          <span class="loader" />
        {:then value}
          <span class="has-text-weight-bold is-family-monospace">{value.replace(/^https?:\/\//, '')}</span>
        {:catch error}
          <span class="icon has-text-danger" title={error?.message}>
            <i class="mdi mdi-alert-circle-outline" />
          </span>
        {/await}
      </p>
      <p>
        Use code
        {#await userCode}
          <span class="loader" />
        {:then value}
          <span class="has-text-weight-bold is-family-monospace">{value}</span>
        {:catch error}
          <span class="icon has-text-danger" title={error?.message}>
            <i class="mdi mdi-alert-circle-outline" />
          </span>
        {/await}
      </p>
    </div>
  </div>
</section>
