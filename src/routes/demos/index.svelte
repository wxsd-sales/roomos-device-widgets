<script lang="ts">
  export let demos = [];
</script>

<div class="container px-4 mb-6">
  <div class="columns is-vcentered">
    <div class="column is-3">
      <a
        class="button is-fullwidth is-rounded is-primary is-light is-justify-content-space-between"
        href="/demos/activate"
      >
        <span class="icon">
          <i class="mdi mdi-wrench" />
        </span>
        <span>Activate</span>
      </a>
    </div>
    <div class="column is-3">
      <a class="button is-fullwidth is-rounded is-light is-justify-content-space-between" href="/demos/create">
        <span class="icon">
          <i class="mdi mdi-plus-box" />
        </span>
        <span>New</span>
      </a>
    </div>
    <div class="column is-6 has-text-centered has-text-right-tablet">
      <p>Last refreshed at: {new Date().toLocaleString()}</p>
    </div>
  </div>
  {#if demos.length === 0}
    <hr />
    <p>You currently have no demos. To create one, click the "New" button above.</p>
  {/if}
  {#each demos as demo (demo.uuid)}
    <hr />
    <div class="columns is-vcentered is-mobile">
      <div class="column is-9">
        <p class="title is-size-5 has-text-weight-bold">{demo.name}</p>
      </div>
      <form action="/demos/{demo.uuid}?_method=DELETE" method="post" class="column is-3">
        <button class="button is-fullwidth is-rounded is-danger is-light is-justify-content-space-between">
          <span class="icon">
            <i class="mdi mdi-delete" />
          </span>
          <span>Delete</span>
        </button>
      </form>
    </div>
    <div class="columns">
      <div class="column is-12">
        <div class="level is-mobile mb-0">
          <p class="level-left">id</p>
          <p class="level-right">{demo.uuid}</p>
        </div>
        <div class="level is-mobile mb-0">
          <p class="level-left">updated</p>
          <p class="level-right">{new Date(demo.updatedAt).toLocaleString()}</p>
        </div>
        <div class="level is-mobile mb-0">
          <p class="level-left">created</p>
          <p class="level-right">{new Date(demo.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  {/each}
</div>
