<script lang="ts" context="module">
  export const prerender = false;
</script>

<section class="container p-4 is-align-items-center" id="login">
  <div class="columns is-multiline">
    <div class="column is-12 is-hidden">
      <input class="input is-rounded is-medium is-fullwidth" name="provider" value="webex" readonly disabled />
    </div>
    <div class="column is-12">
      <h1 class="title">Video Calling Queue</h1>
      <h2 class="subtitle pt-2 pl-1">Demo Builder</h2>
    </div>
    <div class="column is-12">
      <hr />
    </div>
    <div class="column is-12">
      <article class="message is-info is-medium">
        <div class="message-header is-hidden" />
        <div class="message-body content">
          <p>
            Generate custom support queue systems to provide video Webex engined calling platforms compatible on variety
            of clients (e.g. Mobiles, Cisco Devices & Desktops). To learn more about our support queue system, please
            watch the video below:
          </p>
        </div>
      </article>
    </div>
    <div style="margin: 1rem; padding-bottom:60.25%; position:relative; display:block; width: 100%">
      <iframe
        src="https://app.vidcast.io/share/embed/013bee2d-4aff-4921-b760-599ad96dff43"
        width="100%"
        height="100%"
        title="Expert Help Calling Queue"
        frameborder="0"
        loading="lazy"
        allowfullscreen
        style="position:absolute; top:0; left: 0"
      />
    </div>
    <div class="column is-12">
      <a
        class="button is-rounded is-medium is-fullwidth is-primary has-text-weight-bold"
        type="button"
        href={'auth/webex/redirect'}
      >
        <span class="icon">
          <i class="mdi mdi-login" />
        </span>
        <span>Login with Webex</span>
      </a>
    </div>
  </div>
</section>
