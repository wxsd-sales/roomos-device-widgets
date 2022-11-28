<script lang="ts">
  export let units;
  export let cityId;
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Weather</h2>
  </div>
  <div class="column is-full content mb-0">
    <p>
      Show weather information for a particular city using data from
      <a href="https://openweathermap.org/city/4887398" target="_blank">Open Weather Maps</a>.
    </p>
  </div>
  <div class="column is-three-fifths">
    <label class="label" for="units">Units <sup class="has-text-danger" title="required">*</sup></label>
    <div class="control has-icons-left">
      <span class="select is-empty is-fullwidth">
        <select name="units" id="units" bind:value={units}>
          <option value="imperial">Imperial &mdash; &deg;F</option>
          <option value="metric">Metric &mdash; &deg;C</option>
        </select>
      </span>
      <span class="icon is-left">
        <i class="mdi mdi-tape-measure" />
      </span>
      <div class="help">
        <p>Choose a unit for display values</p>
      </div>
    </div>
  </div>
  <div class="column is-two-fifths">
    <label class="label" for="city-id">City Id <sup class="has-text-danger" title="required">*</sup></label>
    <div class="control has-icons-left">
      <input
        name="cityId"
        id="city-id"
        class="input"
        type="number"
        placeholder="4887398"
        required
        bind:value={cityId}
      />
      <span class="icon is-left">
        <i class="mdi mdi-numeric" />
      </span>
    </div>
    <div class="help">
      <p>
        Enter a valid
        <a href="https://bulk.openweathermap.org/sample/city.list.json.gz" target="_blank">OWM City Id</a>
      </p>
    </div>
  </div>
</div>
