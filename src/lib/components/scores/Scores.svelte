<script lang="ts">
  import Notes from "../Notes.svelte";

  export let scores: { id: string; score: number }[];
  export let name: string | undefined;
</script>

<div class="w-96 rotate-6 p-8 text-sm">
  <Notes>
    <div class="flex flex-col gap-y-4">
      <p class="w-full text-center">Top 10</p>
      {#each scores as { id, score }}
        <div
          class="flex w-full justify-evenly"
          class:text-orange-500={id === name}
        >
          <p>{id}</p>
          <p>{score}</p>
        </div>
      {/each}
    </div>
  </Notes>
</div>
