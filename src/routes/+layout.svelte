<script>
  import "../app.css";
  import { AppShell } from "@skeletonlabs/skeleton";
  import Header from "$lib/components/Header.svelte";
  import Notes from "$lib/components/Notes.svelte";
  import { initializeStores } from "@skeletonlabs/skeleton";
  import { Github } from "lucide-svelte";

  initializeStores();
</script>

<AppShell>
  <svelte:fragment slot="header">
    <Header></Header>
  </svelte:fragment>

  <slot />

  <svelte:fragment slot="pageFooter">
    <Notes>
      <p
        class="flex w-full items-center justify-center pb-4 text-center text-xs"
      >
        Fait avec amour :) ->&nbsp;
        <a class="inline" href="https://github.com/PierreLeBlond/ustom"
          ><Github class="h-4 w-4"></Github></a
        >
      </p>
    </Notes>
  </svelte:fragment>
</AppShell>
