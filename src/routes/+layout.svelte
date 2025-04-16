<script lang="ts">
  import "../app.css";
  import Header from "$lib/components/Header.svelte";
  import Notes from "$lib/components/Notes.svelte";
  import { Github } from "lucide-svelte";
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="flex h-full w-full flex-col">
  <Header></Header>

  <div class="relative flex grow">
    {@render children?.()}
  </div>

  <Notes>
    <p class="flex w-full items-center justify-center p-4 text-center text-xs">
      Fait avec amour :) ->&nbsp;
      <a class="inline" href="https://github.com/PierreLeBlond/ustom"
        ><Github class="h-4 w-4"></Github></a
      >
    </p>
  </Notes>
</div>
