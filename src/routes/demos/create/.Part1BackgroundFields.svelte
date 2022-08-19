<script lang="ts">
  import Background from '$components/Background/Background.svelte';

  export let poster: FileList = undefined;
  export let brightness: number = undefined;
  export let acceptedFileTypes: string = '.jpg, .jpeg, .png, .svg, .gif, .webp, .avif, .apng';
  export let maxFileSize: number = 700000;

  let clientHeight: number;
  let clientWidth: number;
  let naturalHeight: number;
  let naturalWidth: number;

  export const handlePosterUpload = (ev: Event) => {
    clientHeight = clientWidth = naturalHeight = naturalWidth = undefined;
    const file = (ev.target as HTMLInputElement)?.files?.[0];
    file?.size > maxFileSize
      ? (ev.target as HTMLInputElement).setCustomValidity('File size is too large.')
      : (ev.target as HTMLInputElement).setCustomValidity('');
    (ev.target as HTMLInputElement).reportValidity();
  };

  export const handlePosterLoadedMetadata = (ev: Event) => {
    const image = ev.target as HTMLImageElement;
    ({ clientHeight, clientWidth, naturalHeight, naturalWidth } = image);
  };
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Background</h2>
  </div>
  <div class="column is-full content mb-0">
    <p>Set a custom image to automatically cover the entire background of the device's display.</p>
  </div>
  <div class="column is-three-fifths">
    <label class="label" for="poster">Poster <sup class="has-text-danger" title="required">*</sup></label>
    <div class="file has-name is-fullwidth">
      <label class="file-label">
        <input
          id="poster"
          name="poster"
          class="file-input"
          type="file"
          accept={acceptedFileTypes}
          bind:files={poster}
          on:input={handlePosterUpload}
          required
        />
        <span class="file-cta">
          <span class="file-icon">
            <i class="mdi mdi-image-plus" />
          </span>
        </span>
        <span class="file-name">{poster?.[0]?.name || 'No file selected'}</span>
      </label>
    </div>
    <p class="help">Minimum recommended image resolution is 1000W &#10005; 1600H</p>
    <p class="help">Accepted file types are {acceptedFileTypes}</p>
    <p class="help">File must not exceed {maxFileSize / 1000}KB in size</p>
  </div>
  <div class="column is-two-fifths">
    <label class="label" for="brightness">Brightness <sup class="has-text-danger" title="required">*</sup></label>
    <div class="control has-icons-left">
      <input
        name="brightness"
        id="brightness"
        class="input"
        type="number"
        min="0"
        max="100"
        placeholder="55"
        required
        bind:value={brightness}
      />
      <span class="icon is-left">
        <i class="mdi mdi-brightness-percent" />
      </span>
    </div>
    <p class="help">Choose a brightness percentage</p>
  </div>
  <div id="background-preview" class="column is-12">
    {#if poster?.[0] && brightness != null}
      <div class="level is-mobile help">
        <p class="level-left label mb-0">Preview</p>
        <div class="level-right">
          <p class="level-item">{poster[0].type}</p>
          <p class="level-item">{poster[0].size / 1000} KB</p>
          <p class="level-item">modified {new Date(poster[0].lastModified).toISOString()}</p>
        </div>
      </div>
      <Background
        imageLink={window.URL.createObjectURL(poster[0])}
        filter="brightness({brightness}%)"
        on:load={handlePosterLoadedMetadata}
      />
      <p class="help">
        Dimensions:
        {clientWidth}W &#10005; {clientHeight}H (scaled); {naturalWidth}W &#10005; {naturalHeight}H (original)
      </p>
    {:else}
      <div class="level is-mobile help">
        <p class="level-left label mb-0">Preview</p>
        <p class="level-right">Not available</p>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  #background-preview > :global(.is-brand-background) {
    position: revert;
    background: repeating-conic-gradient(hsl(0deg, 0%, 71%) 0% 25%, transparent 0% 50%) 50% / 10px 10px;
  }
</style>
