<script lang="ts">
  import { jsonRequest } from '$lib/shared/json-request';
  import { page } from '$app/stores';

  let cityNameValue: string;
  let cityNamePlaceholder = 'San Jose';

  let unitSysValue = 'metric';

  let titleValue: string;
  let titlePlaceholder = 'Webex';

  let subTitleValue: string;
  let subTitlePlaceholder = 'One app for everything. And everyone.';

  let deviceSerialValue: string;
  let deviceSerialPlaceholder = 'XXXXXXXXX';

  let deviceIDValue: string;
  let deviceIDPlaceholder = 'XXXXXXXXX';

  let apps = ['Food Order', 'MTA'];
  let selectedApps = ['Food Order', 'MTA'];
  let widgets = ['Contacts', 'Guest SMS', 'Bookings', 'Environmental Dashboard'];
  let selectedWidgets = ['Contacts', 'Guest SMS', 'Bookings', 'Environmental Dashboard'];
  let URLOrigin = `${$page.url.origin}`;

  const submit = async (event) => {
    event.preventDefault();

    try {
      const { id } = await jsonRequest('/weather').get(undefined, {
        city: cityNameValue ? cityNameValue : cityNamePlaceholder
      });

      URLOrigin = `${URLOrigin}/dashboard?id=${id}&units=${unitSysValue}&brandTitle=${encodeURIComponent(
        titleValue ? titleValue : titlePlaceholder
      )}&brandSubtitle=${encodeURIComponent(
        subTitleValue ? subTitleValue : subTitlePlaceholder
      )}&widgets=${encodeURIComponent(selectedWidgets.join(', '))}&apps=${encodeURIComponent(selectedApps.join(', '))}`;

      if (deviceSerialValue) {
        URLOrigin = `${URLOrigin}&serial=${deviceSerialValue}`;
      }

      if (deviceIDValue) {
        URLOrigin = `${URLOrigin}&deviceId=${deviceIDValue}`;
      }

      cityNameValue = '';
      titleValue = '';
      subTitleValue = '';
      unitSysValue = 'metric';
      deviceSerialValue = '';
      deviceSerialValue = '';
      selectedApps = ['Food Order', 'MTA'];
      selectedWidgets = ['Contacts', 'Guest SMS', 'Bookings', 'Environmental Dashboard'];
    } catch (error) {
      console.log(error);
    }
  };
</script>

<div class="hero is-fullheight is-mobile is-justify-content-center">
  <div class="columns">
    <form class="column is-10 is-offset-1 box">
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label" for="city"> City</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control is-expanded">
              <input class="input" type="text" placeholder={cityNamePlaceholder} bind:value={cityNameValue} id="city" />
            </p>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label">
          <label class="label" for="units">Units</label>
        </div>
        <div class="field-body">
          <div class="field is-narrow">
            <div class="control">
              <label class="radio">
                <input type="radio" name="units" bind:group={unitSysValue} value="metric" id="units" />
                Metric
              </label>
              <label class="radio">
                <input type="radio" name="units" bind:group={unitSysValue} value="imperial" id="units" />
                Imperial
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label" for="title"> Title</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control is-expanded">
              <input class="input" type="text" placeholder={titlePlaceholder} bind:value={titleValue} id="title" />
            </p>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label" for="subtitle"> Subtitle</label>
        </div>
        <div class="field-body">
          <div class="field is-expanded">
            <p class="control is-expanded">
              <input
                class="input"
                type="tel"
                placeholder={subTitlePlaceholder}
                bind:value={subTitleValue}
                id="subtitle"
              />
            </p>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label" for="deviceSerial">Device Serial Number</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder={deviceSerialPlaceholder}
                bind:value={deviceSerialValue}
                id="deviceSerial"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label" for="deviceID">Device ID</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input class="input" placeholder={deviceIDPlaceholder} bind:value={deviceIDValue} id="deviceID" />
            </div>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label">
          <label class="label" for="widgets">Widgets</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              {#each widgets as widget}
                <label class="checkbox">
                  <input type="checkbox" bind:group={selectedWidgets} name="widgets" value={widget} id="widgets" />
                  {widget}
                </label>
              {/each}
            </div>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label">
          <label class="label" for="apps">Apps</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              {#each apps as app}
                <label class="checkbox">
                  <input type="checkbox" bind:group={selectedApps} name="apps" value={app} id="apps" />
                  {app}
                </label>
              {/each}
            </div>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label">
          <!-- Left empty for spacing -->
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control is-flex is-justify-content-flex-end">
              <button class="button is-primary" on:click={submit}> Generate URL </button>
            </div>
          </div>
        </div>
      </div>
      <textarea class="textarea is-size-5">{URLOrigin}</textarea>
    </form>
  </div>
</div>

<style>
  .checkbox {
    margin-right: 1rem;
  }
</style>
