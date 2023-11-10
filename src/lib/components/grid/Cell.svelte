<script lang="ts">
  export let letter: string | null;
  export let match: "?" | "!" | "x" | "";
</script>

<div
  class="xs:h-8 xs:w-8 relative flex h-7 w-7 items-center justify-center border text-sm"
>
  <div
    class="absolute -z-10 h-full w-full"
    class:bg-orange-200={match === "?"}
    class:bg-blue-200={match === "!"}
    class:bg-stone-200={match === "x"}
  ></div>
  {letter ? letter.toUpperCase() : ""}
</div>
