<script>
  import { page } from "$app/stores"
</script>

<div class="flex h-screen w-screen flex-col items-center justify-center">
  <h1>{$page.status}</h1>
  {#if $page.error}
    <p>{$page.error.message}</p>
  {/if}
</div>
