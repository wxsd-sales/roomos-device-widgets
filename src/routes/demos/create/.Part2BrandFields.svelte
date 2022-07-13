<script lang="ts">
  import Brand from '$components/Brand/Brand.svelte';

  export let logo: FileList = undefined;
  export let title: string = undefined;
  export let subtitle: string = undefined;
  export let acceptedFileTypes: string = '.png, .svg, .gif, .webp, .avif, .apng';
  export let maxFileSize: number = 200000;

  let clientHeight: number;
  let clientWidth: number;
  let naturalHeight: number;
  let naturalWidth: number;

  export const handleLogoUpload = (ev: Event) => {
    clientHeight = clientWidth = naturalHeight = naturalWidth = undefined;
    const file = (ev.target as HTMLInputElement)?.files?.[0];
    file?.size > maxFileSize
      ? (ev.target as HTMLInputElement).setCustomValidity('File size is too large.')
      : (ev.target as HTMLInputElement).setCustomValidity('');
    (ev.target as HTMLInputElement).reportValidity();
  };

  export const handleLogoLoad = (ev: Event) => {
    const image = ev.target as HTMLImageElement;
    ({ clientHeight, clientWidth, naturalHeight, naturalWidth } = image);
  };
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Brand</h2>
  </div>
  <div class="column is-three-fifths">
    <label class="label" for="logo">Logo <sup class="has-text-danger" title="required">*</sup></label>
    <div class="file has-name is-fullwidth">
      <label class="file-label">
        <input
          name="logo"
          id="logo"
          class="file-input"
          type="file"
          accept={acceptedFileTypes}
          bind:files={logo}
          on:input={handleLogoUpload}
          required
        />
        <span class="file-cta">
          <span class="file-icon">
            <i class="mdi mdi-image-plus" />
          </span>
        </span>
        <span class="file-name">{logo?.[0]?.name || 'No file selected'}</span>
      </label>
    </div>
    <p class="help">Minimum recommended image resolution is 320W &#10005; 70H</p>
    <p class="help">Accepted file types are {acceptedFileTypes}</p>
    <p class="help">File must not exceed {maxFileSize / 1000}KB in size</p>
  </div>
  <div class="column is-one-fifths">
    <label class="label" for="title">Title <sup class="has-text-danger" title="required">*</sup></label>
    <div class="control has-icons-left">
      <input
        name="title"
        id="title"
        class="input"
        type="text"
        maxlength="16"
        placeholder="Cisco Systems, Inc."
        required
        bind:value={title}
      />
      <span class="icon is-left">
        <i class="mdi mdi-format-header-1" />
      </span>
    </div>
    <p class="help">The organization's common name</p>
  </div>
  <div class="column is-one-fifths">
    <label class="label" for="subtitle">Subtitle <sup class="has-text-danger" title="required">*</sup></label>
    <div class="control has-icons-left">
      <input
        name="subtitle"
        id="subtitle"
        class="input"
        type="text"
        placeholder="Bridge to Possible"
        maxlength="64"
        required
        bind:value={subtitle}
      />
      <span class="icon is-left">
        <i class="mdi mdi-format-header-2" />
      </span>
    </div>
    <p class="help">The organization's slogan</p>
  </div>
  <div id="logo-preview" class="column is-12">
    {#if logo?.[0]}
      <div class="level help is-mobile">
        <p class="level-left label mb-0">Preview</p>
        <div class="level-right">
          <p class="level-item">{logo[0].type}</p>
          <p class="level-item">{logo[0].size / 1000} KB</p>
          <p class="level-item">modified {new Date(logo[0].lastModified).toISOString()}</p>
        </div>
      </div>
      <Brand title={window.URL.createObjectURL(logo[0])} {subtitle} on:load={handleLogoLoad} />
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
  #logo-preview :global(img.is-brand-logo) {
    background: repeating-conic-gradient(hsl(0deg, 0%, 71%) 0% 25%, transparent 0% 50%) 50% / 10px 10px;
  }
</style>
