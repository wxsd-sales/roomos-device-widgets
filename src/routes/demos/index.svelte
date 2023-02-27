<script lang="ts">
  import { browser } from '$app/env';

  export let demos = [];
  export let origin = browser ? window.location.origin : '';

  const copyUrl = (e: Event, url: string) => {
    const target = e.target as HTMLButtonElement;
    browser &&
      Promise.resolve(target.classList.add('is-loading') || (target.disabled = true))
        .then(() => navigator.clipboard.writeText(url))
        .finally(() => setTimeout(() => target.classList.remove('is-loading') || (target.disabled = false), 400));
  };
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
      <a class="button is-fullwidth is-rounded is-light is-justify-content-space-between" href="/demos/save">
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
      <div class="column is-6">
        <p class="title is-size-5 has-text-weight-bold">{demo.name}</p>
      </div>
      <div class="column is-3">
        <a
          class="button is-fullwidth is-rounded is-warning is-light is-justify-content-space-between"
          href="/demos/save?id={demo.uuid}"
        >
          <span class="icon">
            <i class="mdi mdi-pencil" />
          </span>
          <span>Edit</span>
        </a>
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

    <div class="columns is-vcentered is-multiline my-0">
      <div class="column is-12">
        <p class="title is-size-5 has-text-weight-bold">Activations ({demo?.activations?.length})</p>
        {#if demo?.activations?.length === 0}
          <p class="subtitle is-size-6 has-text-weight-bold">No activations for this demo.</p>
        {/if}
      </div>
      {#each demo?.activations as activation}
        <div class="column is-6">
          <p class="subtitle is-size-6 has-text-weight-bold">{activation.uuid}</p>
        </div>
        <div class="column is-2">
          <button
            class="button is-info is-fullwidth is-rounded is-light is-justify-content-space-between"
            on:click={(e) => copyUrl(e, origin + '/?activationId=' + activation?.uuid)}
          >
            <span class="icon">
              <i class="mdi mdi-content-copy" />
            </span>
            <span>Copy</span>
          </button>
        </div>
        <div class="column is-2">
          <a
            class="button is-fullwidth is-rounded is-warning is-light is-justify-content-space-between"
            href="/demos/activate?id={activation.uuid}"
          >
            <span class="icon">
              <i class="mdi mdi-pencil" />
            </span>
            <span>Edit</span>
          </a>
        </div>
        <form action="/demos/activate/{activation.uuid}?_method=DELETE" method="post" class="column is-2">
          <button class="button is-fullwidth is-rounded is-danger is-light is-justify-content-space-between">
            <span class="icon">
              <i class="mdi mdi-delete" />
            </span>
            <span>Delete</span>
          </button>
        </form>
      {/each}
    </div>
  {/each}
</div>
