<script lang="ts">
  import { WXSD_MAILTO } from '$lib/constants';

  export let clientEmail;
  export let privateKey;
  export let clientCertificate;

  const logo = 'https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/google.svg';
  const privateKeyPlaceholder = '-----BEGIN PRIVATE KEY-----' + '\n\n\n\n\n\n' + '-----END PRIVATE KEY-----';
  const clientCertificatePlaceholder = '-----BEGIN CERTIFICATE-----' + '\n\n\n' + '-----END CERTIFICATE-----';

  $: isRequired = clientEmail?.length > 0 || privateKey?.length > 0 || clientCertificate?.length > 0;
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <div class="level is-mobile">
      <div class="level-left">
        <div>
          <h2 class="subtitle">Step #4 <span class="has-text-info">(optional)</span></h2>
          <h2 class="title">Google Integration</h2>
        </div>
      </div>
      <div class="level-right">
        <img class="image is-32x32" src={logo} alt="Google" />
      </div>
    </div>
  </div>
  <div class="column is-full content mb-0">
    <p>
      This is an advanced use case which requires setup of a Google Cloud Service Account with "Domain-wide delegation
      of authority" to access the user’s Workspace calendar. Consult the
      <a href={encodeURI(WXSD_MAILTO + ' (Google Integration)')}>WXSD team</a>
      for help/instructions if you want to try this.
    </p>
    <p>
      Once setup, PWA/Kiosk users will be able to join and schedule (create, read, update, delete) personal Google
      Calendar events from the device.
    </p>
  </div>
  <div class="column is-full">
    <label class="label" for="google-client-email">
      Client Email
      <sup class="has-text-danger" title="required" class:is-invisible={!isRequired}>*</sup>
    </label>
    <div class="control has-icons-left">
      <input
        name="googleClientEmail"
        id="google-client-email"
        class="input"
        type="email"
        required={isRequired}
        bind:value={clientEmail}
      />
      <span class="icon is-left">
        <i class="mdi mdi-at" />
      </span>
    </div>
    <div class="help">
      <p>This is the client email for your service account</p>
    </div>
  </div>
  <div class="column is-full">
    <label class="label" for="google-private-key">
      Private Key
      <sup class="has-text-danger" title="required" class:is-invisible={!isRequired}>*</sup>
    </label>
    <div class="control has-icons-right">
      <textarea
        name="googlePrivateKey"
        id="google-private-key"
        class="textarea is-family-monospace"
        rows="7"
        placeholder={privateKeyPlaceholder}
        required={isRequired}
        bind:value={privateKey}
      />
      <span class="icon is-right">
        <i class="mdi mdi-certificate" />
      </span>
    </div>
    <div class="help">
      <p>This is the private key for your service account</p>
    </div>
  </div>
  <div class="column is-full">
    <label class="label" for="google-client-certificate">
      Client Certificate
      <sup class="has-text-danger" title="required" class:is-invisible={!isRequired}>*</sup>
    </label>
    <div class="control has-icons-right">
      <textarea
        name="googleClientCertificate"
        id="google-client-certificate"
        class="textarea is-family-monospace"
        rows="4"
        placeholder={clientCertificatePlaceholder}
        required={isRequired}
        bind:value={clientCertificate}
      />
      <span class="icon is-right">
        <i class="mdi mdi-certificate" />
      </span>
    </div>
    <div class="help">
      <p>This is the X509 public certificate for your service account</p>
    </div>
  </div>
</div>
