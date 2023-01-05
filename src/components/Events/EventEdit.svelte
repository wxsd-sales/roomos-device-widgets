<script lang="ts">
  export let id;
  export let isSelf = false;
  export let date = new Date().setSeconds(0, 0);
  export let attendees = new Set();
  export let summary = undefined;
  export let description = undefined;
  export let start = new Date(date).toISOString().replace(':00.000Z', '');
  export let end = new Date(new Date(date).setHours(new Date(date).getHours() + 1))
    .toISOString()
    .replace(':00.000Z', '');

  export let patchGoogleWorkspaceMeeting: (...args) => Promise<Response> = () => Promise.reject(undefined);
  export let onSuccess: (...args) => void;

  let emailInputElement: HTMLInputElement = undefined;
  let email: string = undefined;
  let isEmailValid = false;

  let isLoading = false;
  let error = undefined;

  const addAttendee = (email) => (attendees = attendees.add(email));
  const removeAttendee = (email) => attendees.delete(email) && (attendees = attendees);

  const handleClick = () =>
    Promise.resolve((isLoading = true))
      .then(() => patchGoogleWorkspaceMeeting(id, new Date(start), new Date(end), attendees, summary, description))
      .then(() => onSuccess())
      .catch(() => (error = 'Failed to create/update invite.'))
      .finally(() => (isLoading = false));
</script>

<form class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title has-text-white">New Calendar Event</h2>
  </div>
  <div class="column is-full">
    <label class="label has-text-white-ter">Event Name<sup class="has-text-danger" title="required">*</sup></label>
    <div class="control has-icons-left">
      <input class="input is-medium is-rounded" type="email" bind:value={summary} required />
      <span class="icon is-left">
        <i class="mdi mdi-card-text" />
      </span>
    </div>
  </div>
  <div class="column is-full">
    <label class="label has-text-white-ter">Invitees</label>
    <div class="field has-addons">
      <div class="control is-expanded has-icons-left">
        <input
          class="input is-medium is-rounded"
          type="email"
          bind:value={email}
          bind:this={emailInputElement}
          on:input={() => (isEmailValid = emailInputElement?.checkValidity())}
          on:change={() => (isEmailValid = emailInputElement?.reportValidity())}
        />
        <span class="icon is-left">
          <i class="mdi mdi-at" />
        </span>
      </div>
      <div class="control">
        <button
          type="button"
          class="button is-medium is-rounded"
          disabled={!isEmailValid}
          on:click={() => addAttendee(email) && (email = undefined)}
        >
          <span class="icon">
            <i class="mdi mdi-keyboard-return" />
          </span>
        </button>
      </div>
    </div>
    <div class="field is-grouped is-grouped-multiline">
      {#each Array.from(attendees) as attendee}
        <div class="control">
          <span class="tag is-rounded">
            {attendee}
            <button class="delete is-small" on:click={() => removeAttendee(attendee)} />
          </span>
        </div>
      {/each}
    </div>
  </div>

  <!-- From -->
  <div class="column is-half">
    <label class="label has-text-white-ter">From<sup class="has-text-danger" title="required">*</sup></label>
    <div class="field">
      <div class="control is-expanded">
        <input class="input is-medium is-rounded" type="datetime-local" bind:value={start} />
      </div>
    </div>
  </div>

  <!-- To -->
  <div class="column is-half">
    <label class="label has-text-white-ter">To<sup class="has-text-danger" title="required">*</sup></label>
    <div class="field">
      <div class="control is-expanded">
        <input class="input is-medium is-rounded" type="datetime-local" bind:value={end} min={start} />
      </div>
    </div>
  </div>

  <!-- Message -->
  <div class="column is-full">
    <label class="label has-text-white">Message</label>
    <div class="control has-icons-right">
      <textarea class="textarea" rows="7" bind:value={description} />
      <span class="icon is-right">
        <i class="mdi mdi-text-box" />
      </span>
    </div>
  </div>

  <div class="column is-full">
    <button
      class="button is-medium is-rounded is-fullwidth is-primary"
      type="submit"
      disabled={isLoading}
      class:is-loading={isLoading}
      on:click={handleClick}
    >
      Send
    </button>
  </div>

  <div class="column is-12 has-text-danger">
    {error ?? ''}
  </div>
</form>
