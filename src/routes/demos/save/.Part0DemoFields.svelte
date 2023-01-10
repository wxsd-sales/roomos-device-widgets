<script lang="ts">
  export let name = undefined;
  export let description = undefined;
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Create a New Demo</h2>
    <h3 class="subtitle">
      A "Demo" is a collection of sessions along with brand logo, background, sensors etc. that creates a customizable
      UX for a responder to manage the requests.
    </h3>
  </div>
  <div class="column is-full">
    <label class="label" for="name">Name <sup class="has-text-danger" title="required">*</sup></label>
    <div class="control has-icons-left">
      <input
        name="name"
        id="name"
        class="input"
        type="text"
        minlength="6"
        maxlength="64"
        placeholder="WXSD Support Demo"
        required
        bind:value={name}
      />
      <span class="icon is-left">
        <i class="mdi mdi-form-textbox" />
      </span>
    </div>
    <div class="help">
      <p>This is only for your reference</p>
    </div>
  </div>
  <div class="column is-full">
    <label class="label" for="description">Description</label>
    <textarea
      name="description"
      id="description"
      class="textarea"
      type="text"
      maxlength="256"
      placeholder="A few lines..."
      bind:value={description}
    />
    <div class="help">
      <p>This is only for your reference</p>
    </div>
  </div>
</div>
