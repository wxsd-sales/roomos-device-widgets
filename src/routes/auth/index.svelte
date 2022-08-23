<script lang="ts" context="module">
  export const prerender = false;
</script>

<script lang="ts">
  import { page } from '$app/stores';

  const href = $page.url.pathname + '/webex/redirect';
  const src = 'https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/cisco.svg';
</script>

<section class="container p-4 is-align-items-center" id="login">
  <div class="columns is-multiline">
    <div class="column is-12 is-hidden">
      <input class="input is-rounded is-medium is-fullwidth" name="provider" value="webex" readonly disabled />
    </div>
    <div class="column is-12">
      <a class="button is-rounded is-medium is-fullwidth is-primary" type="button" {href}>
        <img class="image is-48x48" alt="Login with Webex" {src} />
      </a>
    </div>
  </div>
</section>
