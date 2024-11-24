<script lang="ts">
  import "../app.css"
  import { logStayCurious } from "$lib/curious"
  let { children } = $props()
  $effect(logStayCurious)
</script>

{@render children()}
