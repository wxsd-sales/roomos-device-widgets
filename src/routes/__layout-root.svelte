<!-- Scripts -->
<script>
  import '../app.scss';
  import { onMount } from 'svelte';

  onMount(() => {
    // if this functions returns it indicates javascript is enabled on the browser
    function isJavascriptEnabled() {
      return true;
    }

    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js
    function hasCookiesEnabled() {
      // Quick test if browser has cookieEnabled host property
      if (navigator.cookieEnabled) return true;
      // Create cookie
      document.cookie = 'cookieTest=1';
      const isCookieSet = document.cookie.indexOf('cookieTest=') !== -1;
      // Delete cookie
      document.cookie = 'cookieTest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
      return isCookieSet;
    }

    const mainMenu = document.getElementById('main-burger');
    // Check if there are any navbar burgers
    mainMenu?.addEventListener('click', () => {
      // Get the target from the "data-target" attribute
      const target = document.getElementById(mainMenu.dataset.target);
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      mainMenu.classList.toggle('is-active');
      target.classList.toggle('is-active');
    });

    // Show the app if javascript is enabled
    if (isJavascriptEnabled() === true) {
      document.getElementById('app').classList.remove('is-hidden');
    }

    // log to console and hide the app if cookies are not enabled
    if (hasCookiesEnabled() === false) {
      console.error('Cookies are disabled.');
      document.getElementById('cookies-warning').classList.remove('is-hidden');
      document.getElementById('app').classList.add('is-invisible');
    }
  });
</script>

<noscript id="javascript-warning" class="hero is-danger is-bold">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        <span class="icon">
          <i class="mdi mdi-alert" />
        </span>
        <span>Javascript is disabled.</span>
      </h1>
      <h2 class="subtitle">
        This site requires Javascript for its core functionality. Please enable Javascript in browser settings and
        reload this page.
      </h2>
    </div>
  </div>
</noscript>

<section id="cookies-warning" class="hero is-danger is-bold is-hidden">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        <span class="icon">
          <i class="mdi mdi-alert" />
        </span>
        <span>Cookies are disabled.</span>
      </h1>
      <h2 class="subtitle">
        This site requires cookies for its core functionality. Please enable cookies in browser settings and reload this
        page.
      </h2>
    </div>
  </div>
</section>

<main id="app" class="is-hidden">
  <slot />
  <span class="icon has-text-primary">
    <i class="mdi mdi-alert" />
  </span>
</main>

<slot name="script" />
