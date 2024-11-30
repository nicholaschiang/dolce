<script lang="ts">
  let { children, ...props } = $props()
</script>

<a
  {...props}
  class="underline decoration-gray-400 transition-colors hover:decoration-inherit dark:decoration-gray-500"
  >{@render children()}</a
>
