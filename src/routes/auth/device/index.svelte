<script lang="ts">
  import Device from '../../../components/Auth/Device.svelte';
</script>

<div class="container">
  <div class="columns is-centered m-1 py-6">
    <div class="column is-four-fifths is-12-mobile">
      <div class="notification box is-info has-text-justified">
        <p class="subtitle">
          Seamlessly authenticate with Webex on systems with limited web or input capability — Smart TVs, In-Car
          Displays or Apps running on RoomOS devices (in kiosk mode).
        </p>
      </div>
      <div class="box">
        <Device />
      </div>
    </div>
  </div>
</div>
