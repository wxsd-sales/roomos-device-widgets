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
          <p>
            Before continuing, please note that you will need access to a <b>compatible RoomOS 11 device</b> registered
            in <b>shared mode</b> and <b>administrator access to the corresponding Webex Control Hub</b> organization.
          </p>
          <ul>
            <li>
              If you don't have admin access to any sandboxed or demo Control Hub org, please follow the instructions on
              the
              <a href="https://collabtoolbox.cisco.com/tools/sandbox" target="_blank">Collab Toolbox Sandbox</a> page to
              create one.
            </li>
            <li>
              If your device is in personal mode, you will have to perform a factory reset and then register it as a
              shared mode device on the Control Hub org.
            </li>
          </ul>
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
