<script lang="ts">
  export let form = undefined;
  export let email = undefined;
  export let action = './login';

  let formElement: HTMLFormElement;
  let passwordInputElement: HTMLInputElement;

  function togglePasswordReveal() {
    passwordInputElement.type = passwordInputElement.type === 'password' ? 'text' : 'password';
  }
</script>

<form class="container login-container" {action} method="post" bind:this={formElement}>
  <slot />
  <div class="columns is-vcentered is-centered is-multiline">
    <div class="column is-12">
      <div class="control has-icons-left has-icons-right">
        <input
          class="input is-large is-rounded"
          type="email"
          placeholder="Email"
          name="email"
          autocomplete="email"
          bind:value={email}
          required
        />
        <span class="icon is-left">
          <i class="mdi mdi-email" />
        </span>
        <span class="icon is-right">
          <i class="mdi mdi-check" />
        </span>
      </div>
    </div>
    <div class="column is-8">
      <div class="control has-icons-left has-icons-right">
        <input
          class="input is-large is-rounded"
          type="password"
          placeholder="Password"
          name="password"
          autocomplete="password"
          required
          bind:this={passwordInputElement}
        />
        <span class="icon is-left">
          <i class="mdi mdi-form-textbox-password" />
        </span>
        <span class="icon is-right" on:click={togglePasswordReveal}>
          <i class="mdi {passwordInputElement?.type === 'password' ? 'mdi-eye' : 'mdi-eye-off'}" />
        </span>
      </div>
    </div>
    <div class="column is-4">
      <button class="button is-primary is-fullwidth is-rounded is-large" type="submit">
        <span class="icon is-large">
          <i class="mdi mdi-login-variant" />
        </span>
        <span>Login</span>
      </button>
    </div>
    <div class="column is-12 has-text-danger px-5">
      {form ?? ''}
    </div>
  </div>
</form>

<style>
  div.control.has-icons-right .icon.is-right .mdi-eye,
  div.control.has-icons-right .icon.is-right .mdi-eye-off {
    pointer-events: auto !important;
    cursor: pointer;
  }
</style>
