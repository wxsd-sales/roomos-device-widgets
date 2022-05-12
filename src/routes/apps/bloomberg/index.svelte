<script>
  import Apps from './Apps.svelte';
</script>

<div class="hero is-fullheight p-6">
  <div class="tile is-ancestor">
    <div class="tile is-vertical is-4">
      <div class="tile">
        <div class="tile is-parent is-vertical">
          <article class="tile box is-child">
            <p class="title">Branding</p>
          </article>
          <article class="tile box is-child">
            <p class="title">Buttons</p>
          </article>
          <article class="tile box is-child">
            <p class="title">Bookings</p>
          </article>
        </div>
      </div>
    </div>
    <div class="tile is-vertical is-parent is-8">
      <div class="tile box is-vertical is-child is-12">
        <p class="title">Dashboard</p>
      </div>
      <div class="tile box is-child">
        <Apps />
      </div>
    </div>
  </div>
</div>
