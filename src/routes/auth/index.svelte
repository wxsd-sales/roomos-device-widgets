<script lang="ts" context="module">
  export const prerender = false;
</script>

<script lang="ts">
  import { page } from '$app/stores';

  const href = $page.url.pathname + '/webex/redirect';
</script>

<section class="container p-4 is-align-items-center" id="login">
  <div class="columns is-multiline">
    <div class="column is-12 is-hidden">
      <input class="input is-rounded is-medium is-fullwidth" name="provider" value="webex" readonly disabled />
    </div>
    <div class="column is-12">
      <article class="message is-info is-medium">
        <div class="message-header is-hidden" />
        <div class="message-body content">
          <p>
            Generate web application links for compatible RoomOS 11 device in Kiosk or PWA mode; replacing the default
            controls. To learn more, watch this
            <a href="https://app.vidcast.io/share/bb910329-f398-4f04-baec-18ddaf46f493" target="_blank">Vidcast</a>.
          </p>
        </div>
      </article>
    </div>
    <div class="column is-12">
      <a class="button is-rounded is-medium is-fullwidth is-primary has-text-weight-bold" type="button" {href}>
        <span class="icon">
          <i class="mdi mdi-login" />
        </span>
        <span>Login with Webex</span>
      </a>
    </div>
  </div>
</section>
