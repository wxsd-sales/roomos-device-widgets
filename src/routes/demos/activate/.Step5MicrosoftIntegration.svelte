<script lang="ts">
  export let tenantId;
  export let clientId;
  export let privateKey;
  export let clientCertificate;

  const logo = 'https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/microsoft.svg';
  const privateKeyPlaceholder = '-----BEGIN PRIVATE KEY-----' + '\n\n\n\n\n\n' + '-----END PRIVATE KEY-----';
  const clientCertificatePlaceholder = '-----BEGIN CERTIFICATE-----' + '\n\n\n' + '-----END CERTIFICATE-----';

  $: isRequired =
    tenantId?.length > 0 || clientId?.length > 0 || privateKey?.length > 0 || clientCertificate?.length > 0;
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <div class="level is-mobile">
      <div class="level-left">
        <div>
          <h2 class="subtitle">Step #4 <span class="has-text-info">(optional)</span></h2>
          <h2 class="title">Microsoft Integration</h2>
        </div>
      </div>
      <div class="level-right">
        <img class="image is-32x32" src={logo} alt="Google" />
      </div>
    </div>
  </div>
  <div class="column is-full content mb-0">
    <p>
      This is an advanced use case which requires setup of a Microsoft Azure App Registration with Certificates to
      access the user’s Office 365 calendar. Consult the WXSD team for help/instructions if you want to try this.
    </p>
    <p>
      Once setup, PWA/Kiosk users will be able to join and schedule (create, read, update, delete) personal Microsoft
      Office 365 events from the device.
    </p>
  </div>
  <div class="column is-full">
    <label class="label" for="microsoft-tenant-id">
      Azure Tenant Id
      <sup class="has-text-danger" title="required" class:is-invisible={!isRequired}>*</sup>
    </label>
    <div class="control has-icons-left">
      <input
        name="microsoftTenantId"
        id="microsoft-tenant-id"
        class="input"
        type="text"
        required={isRequired}
        bind:value={tenantId}
      />
      <span class="icon is-left">
        <i class="mdi mdi-identifier" />
      </span>
    </div>
    <div class="help">
      <p>This is the id for your Azure Tenant</p>
    </div>
  </div>
  <div class="column is-full">
    <label class="label" for="microsoft-client-id">
      Application (client) Id
      <sup class="has-text-danger" title="required" class:is-invisible={!isRequired}>*</sup>
    </label>
    <div class="control has-icons-left">
      <input
        name="microsoftClientId"
        id="microsoft-client-id"
        class="input"
        type="text"
        required={isRequired}
        bind:value={clientId}
      />
      <span class="icon is-left">
        <i class="mdi mdi-identifier" />
      </span>
    </div>
    <div class="help">
      <p>This is the client id for your app registration</p>
    </div>
  </div>
  <div class="column is-full">
    <label class="label" for="microsoft-private-key">
      Private Key
      <sup class="has-text-danger" title="required" class:is-invisible={!isRequired}>*</sup>
    </label>
    <div class="control has-icons-right">
      <textarea
        name="microsoftPrivateKey"
        id="microsoft-private-key"
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
      <p>This is the private key for your app registration's certificate</p>
    </div>
  </div>
  <div class="column is-full">
    <label class="label" for="microsoft-client-certificate">
      Client Certificate
      <sup class="has-text-danger" title="required" class:is-invisible={!isRequired}>*</sup>
    </label>
    <div class="control has-icons-right">
      <textarea
        name="microsoftClientCertificate"
        id="microsoft-client-certificate"
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
      <p>This is the X509 public certificate for your app registration's certificate</p>
    </div>
  </div>
</div>
