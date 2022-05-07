<script lang="ts">
  import { exampleLocalWritable, exampleSessionWritable, exampleWritable } from '../lib/store';
</script>

<h1 class="title">I am an example component</h1>

<div class="field">
  <label class="label" for="writable">Writable</label>
  <p class="control has-icons-left">
    <input id="writable" class="input" type="text" placeholder="Test Writable" bind:value={$exampleWritable} />
    <span class="icon is-small is-left">
      <i class="mdi mdi-pencil" />
    </span>
  </p>
</div>

<div class="field">
  <label class="label" for="local">Local Storage Writable</label>
  <p class="control has-icons-left">
    <input id="local" class="input" type="text" placeholder="Test Writable" bind:value={$exampleLocalWritable} />
    <span class="icon is-small is-left">
      <i class="mdi mdi-pencil" />
    </span>
  </p>
</div>

<div class="field">
  <label class="label" for="session">Session Storage Writable</label>
  <p class="control has-icons-left">
    <input id="session" class="input" type="text" placeholder="Test Writable" bind:value={$exampleSessionWritable} />
    <span class="icon is-small is-left">
      <i class="mdi mdi-pencil" />
    </span>
  </p>
</div>
