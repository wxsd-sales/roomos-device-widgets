<script>
  import ContactItems from './ContactItems.svelte';

  let buttonContent = 'Manage Contacts';
  const handleOnClick = () => {
    buttonContent = buttonContent === 'Manage Contacts' ? 'View Contacts' : 'Manage Contacts';
  };
</script>

<div class="columns m-4 p-4">
  <div class="column is-four-fifths">
    <div class="container">
      <ContactItems />
    </div>
  </div>
  <div class="column is-one-fifth container">
    <button on:click={handleOnClick} class="button is-primary">{buttonContent}</button>
  </div>
</div>
