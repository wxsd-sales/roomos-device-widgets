<script lang="ts">
  import Device from '../../../components/Auth/Device.svelte';
</script>

<div class="container">
  <div class="columns is-centered is-mobile my-1 py-6">
    <div class="column is-8">
      <div class="notification box is-success has-text-justified">
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
