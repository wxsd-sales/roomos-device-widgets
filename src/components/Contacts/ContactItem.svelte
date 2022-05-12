<script>
  import Avatar from '../Avatar.svelte';
  import {onMount} from 'svelte';



</script>

<div class="box">
  <div class="columns">
    <div class="column is-1">
      <Avatar
        src="https://avatar-prod-us-east-2.webexcontent.com/Avtr~V1~1eb65fdf-9643-417f-9974-ad72cae0e10f/V1~3929cc6a2f77d7369122b134af3d6fe4d8783205cbd6ca016911668fab3085ba~8719f15802504387a97dd8351d5a29e4~1600"
        type="active"
        size="4"
      />
    </div>
    <div class="column is-10">
      <p class="title">Arash Koushkebaghi</p>
      <p class="subtitle">akoushke@cisco.com</p>
    </div>
    <div class="column is-1">
      <button class="button is-success">Call</button>
    </div>
  </div>
</div>
