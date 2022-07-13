<script lang="ts">
  export let url = undefined;
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">News</h2>
  </div>
  <div class="column is-full">
    <label class="label" for="url">Query</label>
    <div class="control has-icons-left">
      <input
        name="url"
        id="url"
        class="input"
        type="url"
        placeholder={'https://news.google.com/rss/search?q=site:cisco.com+"webex"'}
        pattern="^https:\/\/news\.google\.com\/rss\/search\?q=.+$"
        maxlength="256"
        bind:value={url}
      />
      <span class="icon is-left">
        <i class="mdi mdi-search-web" />
      </span>
    </div>
    <div class="help">
      <p>Google News RSS search URL, or leave empty for trending</p>
    </div>
  </div>
</div>
