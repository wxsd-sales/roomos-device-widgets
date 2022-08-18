<script lang="ts" context="module">
  export const prerender = false;
</script>

<script lang="ts">
  import Login from '$components/Login/Login.svelte';

  export let form = undefined;
  export let email = undefined;
  export let action = './login';

  const href = 'https://github.com/wxsd-sales/roomos-device-widgets';
</script>

<div id="login" class="p-2 is-flex is-align-items-center">
  <Login {form} {email} {action}>
    <article class="message is-danger is-medium">
      <div class="message-header">
        <p>Private Preview Notice</p>
      </div>
      <div class="message-body content">
        <p>
          You are using a limited preview of this application (intended for select audience and testing). Data
          persistence is not guaranteed. We will do a public release very soon, meanwhile please consider starring the
          project on <a {href} target="_blank">GitHub: wxsd-sales/roomos-device-widgets</a>.
        </p>
        <p>
          If you need access, please reach out to
          <a href="mailto:wxsd@external.cisco.com">wxsd@external.cisco.com</a> and state your use.
        </p>
      </div>
    </article>
  </Login>
</div>
