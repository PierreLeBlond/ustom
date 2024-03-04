<script lang="ts">
  export let letter: string;
  export let highlighted: boolean;
</script>

<div
  class="flex h-6 w-6 items-center justify-center rounded border xs:h-7 xs:w-7"
  class:text-stone-500={!highlighted}
  class:shadow={highlighted}
>
  {letter.toUpperCase()}
</div>
