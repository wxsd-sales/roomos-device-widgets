<script lang="ts">
  export let url = 'https://news.google.com/rss/search?q=site:cisco.com+"webex"';
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">News</h2>
  </div>
  <div class="column is-full content mb-0">
    <p>Show news articles from <a href="https://news.google.com/rss" target="_blank">Google News RSS</a> feed.</p>
    <p>Some examples:</p>
    <ul>
      <li>
        News items matching a keyword:
        <a href={'https://news.google.com/rss/search?q="webex"'} target="_blank">
          https://news.google.com/rss/search?q="webex"
        </a>
      </li>
      <li>
        News items from a particular source:
        <a href={'https://news.google.com/rss/search?q=site:cisco.com'} target="_blank">
          https://news.google.com/rss/search?q=site:cisco.com
        </a>
      </li>
      <li>
        News items matching a keyword from a particular source:
        <a href={'https://news.google.com/rss/search?q=site:cisco.com+"webex"'} target="_blank">
          https://news.google.com/rss/search?q=site:cisco.com+"webex"
        </a>
      </li>
    </ul>
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
