<script lang="ts">
  import { page } from "$app/stores";
  import Notes from "$lib/components/Notes.svelte";
  import type { PageData } from "./$types";
  import { clipboard } from "@skeletonlabs/skeleton";

  export let data: PageData;
</script>

<main class="flex h-full w-full flex-col items-center">
  <form
    method="POST"
    class="flex w-full flex-col items-center justify-center gap-y-4 py-16 md:py-32"
  >
    <Notes>Choisir un mot de 4 à 10 lettres</Notes>
    <input
      class="w-64 rounded border p-2 shadow"
      type="text"
      required
      pattern={"[A-Za-z]{4,10}"}
      name="word"
    />
    <button class="rounded-full border px-4 py-2 shadow">Générer</button>
  </form>

  {#if data.encryptedWord && data.iv}
    <p class="pb-4">
      <Notes>
        Partie générée pour le mot '<span class="font-bold">{data.word}</span>'
      </Notes>
    </p>
    <div class="font-ui flex justify-center gap-x-4">
      <button
        class="rounded-full border px-4 py-2 shadow"
        use:clipboard={`${$page.url.origin}?encryptedWord=${data.encryptedWord}&iv=${data.iv}`}
        >Copier le lien</button
      >
      <a
        class="rounded-full border px-4 py-2 shadow"
        href={`${$page.url.origin}?encryptedWord=${data.encryptedWord}&iv=${data.iv}`}
        >Jouer avec ce mot</a
      >
    </div>
  {/if}
</main>
