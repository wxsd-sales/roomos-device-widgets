<script>
  const boardSeriesLink = 'https://hardware.webex.com/products/board-series';
  const deskSeriesLink = 'https://hardware.webex.com/products/desk-series';
  const roomSeriesLink = 'https://hardware.webex.com/products/room-series-and-kits';
  const roomNavLink = 'https://hardware.webex.com/products/webex-room-navigator';
  const pwaLink = 'https://help.webex.com/en-us/article/ohq3u6/Configure-a-persistent-web-app-on-Webex-Room-Navigator';
  const kioskLink = 'https://help.webex.com/en-us/article/ol1th3/Configure-Kiosk-mode-on-Board-and-Desk-Series-devices';
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Before we begin...</h2>
    <h3 class="subtitle">Please ensure you have completed these prerequisites</h3>
  </div>
  <div class="column is-full content mb-0">
    <p>
      This page allows you to generate a unique link to one of your select demos for use on a compatible shared RoomOS
      device configured in PWA/Kiosk mode. For a smooth activation experience, please ensure that you have:
    </p>
    <ol class="gradient-list mb-0">
      <li>
        Compatible <b>RoomOS 11 device</b> &mdash; like a
        <a href={deskSeriesLink} target="_blank">Desk</a>/<a href={boardSeriesLink} target="_blank">Board</a> Series
        device in <a href={kioskLink} target="_blank">Kiosk mode</a>
        or a <a href={roomSeriesLink} target="_blank">Room Series</a> device paired with a
        <a href={roomNavLink} target="_blank">Room Navigator</a> in
        <a href={pwaLink} target="_blank">PWA mode</a>.
      </li>
      <li>
        Factory reset the device or otherwise <b>ensured that it doesn't have any active macros and users/bots</b> with
        <span class="is-family-monospace">xAPI</span> access.
      </li>
      <li>
        Provided <b>dedicated internet access</b> to both &mdash; the device and its paired accessory (if any).
      </li>
      <li>Moved the device to a Workspace, that is, the device should be in <b>shared mode</b>.</li>
      <li>
        Administrator access to the org's
        <a href="https://www.webex.com/control-hub.html" target="_blank">Control Hub</a>
        dashboard with the device (to make required changes).
      </li>
    </ol>
    <div class="notification is-danger is-light px-5">
      <p>
        Please note that this application is strictly a PoC (Proof-of-Concept) for demonstrating RoomOS device
        capabilities and <b>is not designed for use in a production environment</b> or for an extend period of time.
      </p>
      <p>
        This project is under rapid development. Although, we will do our best to make any needed changes in a
        backward-compatible fashion, it may not always be possible (we are a small team). As a result, expect things to
        break from time to time. Use at your own risk.
      </p>
    </div>
  </div>
</div>

<style lang="scss">
  // https://codepen.io/erinesullivan/pen/qGrdGV

  $black: #000000;
  $blue: #00bcf5;
  $green: #82cf5f;
  $yellow: #fbbd23;
  $white: #fafafa;
  %boxshadow {
    box-shadow: 0.25rem 0.25rem 0.6rem rgba(0, 0, 0, 0.05), 0 0.5rem 1.125rem rgba(75, 0, 0, 0.05);
  }
  ol.gradient-list {
    counter-reset: gradient-counter;
    list-style: none;
    margin: 1.75rem 0;
    padding-left: 1rem;
    > li {
      background: white;
      border-radius: 0.1rem 0.5rem 0.5rem 0.5rem;
      //@extend %boxshadow;
      counter-increment: gradient-counter;
      margin-top: 1rem;
      min-height: 3rem;
      padding: 0 1rem 1rem 3rem;
      position: relative;
      &::before,
      &::after {
        background: linear-gradient(135deg, $blue 0%, $green 100%);
        border-radius: 1rem 1rem 0.25rem 1rem;
        content: '';
        height: 3rem;
        left: -1rem;
        overflow: hidden;
        position: absolute;
        top: -1rem;
        width: 3rem;
      }
      &::before {
        align-items: flex-end;
        //@extend %boxshadow;
        content: counter(gradient-counter);
        color: $black;
        display: flex;
        font-weight: bold;
        justify-content: flex-end;
        padding: 0.125em 0.25em;
        z-index: 1;
      }
      @for $i from 1 through 5 {
        &:nth-child(10n + #{$i}):before {
          background: linear-gradient(135deg, rgba($green, $i * 0.2) 0%, rgba($yellow, $i * 0.2) 100%);
        }
      }
      @for $i from 6 through 10 {
        &:nth-child(10n + #{$i}):before {
          background: linear-gradient(
            135deg,
            rgba($green, 1 - (($i - 5) * 0.2)) 0%,
            rgba($yellow, 1 - (($i - 5) * 0.2)) 100%
          );
        }
      }
      + li {
        margin-top: 1rem;
      }
    }
  }
</style>
