<script lang="ts">
  export let aText = 'The Bridge to Possible';
  export let aLink =
    'https://www.youtube-nocookie.com/embed/fIcKUqpVCzM?end=60&autoplay=1&loop=1&controls=0&disablekb=1&playlist=fIcKUqpVCzM';
  export let bText = undefined;
  export let bLink = undefined;
  export let cText = undefined;
  export let cLink = undefined;
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Buttons</h2>
  </div>
  <div class="column is-full content mb-0">
    <p>Embed links that show up when you tap on their respective buttons at the bottom of the device's display.</p>
    <p>
      Please note that some pages/URLs
      <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options" target="_blank">
        deliberately prevent users from embedding them
      </a>
      on other sites as an <code>iframe</code> or <code>object</code>. It is your responsibility to ensure that the
      above links are safe and embeddable.
    </p>
  </div>
  <!-- A -->
  <div class="column is-three-fifths">
    <label class="label" for="aLink">
      Link A
      <sup class="has-text-danger" title="required" class:is-invisible={!aText}>*</sup>
    </label>
    <div class="control has-icons-left">
      <input
        name="aLink"
        id="aLink"
        class="input"
        type="url"
        placeholder="https://www.youtube-nocookie.com/embed/fIcKUqpVCzM?end=60&autoplay=1&loop=1&controls=0&disablekb=1&playlist=fIcKUqpVCzM"
        bind:value={aLink}
        maxlength="1024"
        required={aText}
      />
      <span class="icon is-left">
        <i class="mdi mdi-link" />
      </span>
    </div>
    <div class="help">
      <p>The application link to open</p>
    </div>
  </div>
  <div class="column is-two-fifths">
    <label class="label" for="aText">
      Text A
      <sup class="has-text-danger" title="required" class:is-invisible={!aLink}>*</sup>
    </label>
    <div class="control has-icons-left">
      <input name="aText" id="aText" class="input" type="text" bind:value={aText} maxlength="24" required={aLink} />
      <span class="icon is-left">
        <i class="mdi mdi-text-box" />
      </span>
    </div>
    <div class="help">
      <p>The name for the link, max. 24 characters</p>
    </div>
  </div>
  <!-- B -->
  <div class="column is-three-fifths">
    <label class="label" for="bLink">
      Link B
      <sup class="has-text-danger" title="required" class:is-invisible={!bText}>*</sup>
    </label>
    <div class="control has-icons-left">
      <input name="bLink" id="bLink" class="input" type="url" bind:value={bLink} maxlength="1024" required={bText} />
      <span class="icon is-left">
        <i class="mdi mdi-link" />
      </span>
    </div>
    <div class="help">
      <p>The application link to open</p>
    </div>
  </div>
  <div class="column is-two-fifths">
    <label class="label" for="bText">
      Text B
      <sup class="has-text-danger" title="required" class:is-invisible={!bLink}>*</sup>
    </label>
    <div class="control has-icons-left">
      <input name="bText" id="bText" class="input" type="text" bind:value={bText} maxlength="24" required={bLink} />
      <span class="icon is-left">
        <i class="mdi mdi-text-box" />
      </span>
    </div>
    <div class="help">
      <p>The name for the link, max. 24 characters</p>
    </div>
  </div>
  <!-- C -->
  <div class="column is-three-fifths">
    <label class="label" for="cLink">
      Link C
      <sup class="has-text-danger" title="required" class:is-invisible={!cText}>*</sup>
    </label>
    <div class="control has-icons-left">
      <input name="cLink" id="cLink" class="input" type="url" bind:value={cLink} maxlength="1024" required={cText} />
      <span class="icon is-left">
        <i class="mdi mdi-link" />
      </span>
    </div>
    <div class="help">
      <p>The application link to open</p>
    </div>
  </div>
  <div class="column is-two-fifths">
    <label class="label" for="cText">
      Text C
      <sup class="has-text-danger" title="required" class:is-invisible={!cLink}>*</sup>
    </label>
    <div class="control has-icons-left">
      <input name="cText" id="cText" class="input" type="text" bind:value={cText} maxlength="24" required={cLink} />
      <span class="icon is-left">
        <i class="mdi mdi-text-box" />
      </span>
    </div>
    <div class="help">
      <p>The name for the link, max. 24 characters</p>
    </div>
  </div>
</div>
