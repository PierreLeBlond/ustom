<script lang="ts">
  export let letter: string;
  export let highlighted: boolean;
</script>

<div
  class="flex h-7 w-7 items-center justify-center rounded border md:h-8 md:w-8"
  class:text-stone-500={!highlighted}
  class:shadow={highlighted}
>
  {letter.toUpperCase()}
</div>
