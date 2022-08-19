<script lang="ts">
  export let destination = undefined;
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Guest Invite</h2>
  </div>
  <div class="column is-full content mb-0">
    <p>Set a default SIP enabled destination for a guest user (non Webex) to join over an invite via SMS.</p>
  </div>
  <div class="column is-full">
    <label class="label" for="destination">SIP destination</label>
    <div class="control has-icons-left">
      <input
        name="destination"
        id="destination"
        class="input"
        type="email"
        placeholder="ashessin.acecloud@webex.com"
        bind:value={destination}
      />
      <span class="icon is-left">
        <i class="mdi mdi-at" />
      </span>
    </div>
    <div class="help">
      <p>A valid SIP destination, or leave empty</p>
    </div>
  </div>
</div>
