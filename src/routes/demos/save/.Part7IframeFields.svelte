<script lang="ts">
  export let iframeUrl = undefined;
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Frame Element</h2>
  </div>
  <div class="column is-full content mb-0">
    <p>
      Embed links that show up on the device's display. If you choose to provide this, Room Bookings and Room Analytics
      widgets will be replaced.
    </p>
    <p>
      Please note that some pages/URLs
      <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options" target="_blank">
        deliberately prevent users from embedding them
      </a>
      on other sites as an <code>iframe</code> or <code>object</code>. It is your responsibility to ensure that the link
      is safe and embeddable.
    </p>
  </div>
  <!-- A -->
  <div class="column is-full">
    <label class="label" for="iframeUrl"> IFrame URL </label>
    <div class="control has-icons-left">
      <input
        name="iframeUrl"
        id="iframeUrl"
        class="input"
        type="url"
        placeholder="https://www.youtube-nocookie.com/embed/fIcKUqpVCzM?end=60&autoplay=1&loop=1&controls=0&disablekb=1&playlist=fIcKUqpVCzM"
        bind:value={iframeUrl}
        maxlength="2048"
      />
      <span class="icon is-left">
        <i class="mdi mdi-link" />
      </span>
    </div>
    <div class="help">
      <p>The application link to embed inline</p>
    </div>
  </div>
</div>
