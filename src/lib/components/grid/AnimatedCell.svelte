<script lang="ts">
  import { fade } from "svelte/transition";

  interface Props {
    letter: string | null;
    match: "?" | "!" | "x" | "";
    columnsCount: number;
    index: number;
    onstart: () => void;
    onend: () => void;
  }

  let { letter, match, columnsCount, index, onstart, onend }: Props = $props();
</script>

<div
  class=" xs:h-8 xs:w-8 relative flex h-7 w-7 items-center justify-center border text-sm"
>
  <div
    class="absolute -z-10 h-full w-full"
    class:bg-orange-200={match === "?"}
    class:bg-blue-200={match === "!"}
    class:bg-stone-200={match === "x"}
    in:fade|global={{ delay: index * 300, duration: 10 }}
    onintrostart={() => {
      if (index === 0) {
        onstart();
      }
    }}
    onintroend={() => {
      if (index === columnsCount - 1) {
        onend();
      }
    }}
  ></div>
  {letter ? letter.toUpperCase() : ""}
</div>
