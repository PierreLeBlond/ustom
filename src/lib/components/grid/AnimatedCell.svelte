<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  export let letter: string | null;
  export let match: "?" | "!" | "x" | "";

  export let columnsCount: number;
  export let index: number;
</script>

<div
  class=" relative flex h-7 w-7 items-center justify-center border text-sm xs:h-8 xs:w-8"
>
  <div
    class="absolute -z-10 h-full w-full"
    class:bg-orange-200={match === "?"}
    class:bg-blue-200={match === "!"}
    class:bg-stone-200={match === "x"}
    in:fade|global={{ delay: index * 300, duration: 0 }}
    on:introstart={() => {
      if (index === 0) {
        dispatch("start");
      }
    }}
    on:introend={() => {
      if (index === columnsCount - 1) {
        dispatch("end");
      }
    }}
  ></div>
  {letter ? letter.toUpperCase() : ""}
</div>
