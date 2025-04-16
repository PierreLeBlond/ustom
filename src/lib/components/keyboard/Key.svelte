<script lang="ts">
  interface Props {
    letter: string;
    highlighted: boolean;
  }

  let { letter, highlighted }: Props = $props();
</script>

<div
  class="flex h-6 w-6 items-center justify-center rounded-sm border xs:h-7 xs:w-7"
  class:text-stone-500={!highlighted}
  class:shadow={highlighted}
>
  {letter.toUpperCase()}
</div>
