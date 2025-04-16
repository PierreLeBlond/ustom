<script lang="ts">
  import { page } from "$app/stores";
  import Notes from "$lib/components/Notes.svelte";
  import type { ActionData, PageData } from "./$types";
  import logo from "$lib/images/logo.svg";
  import { superForm } from "sveltekit-superforms";

  interface Props {
    form: ActionData;
    data: PageData;
  }

  let { form, data }: Props = $props();

  const { form: superform, errors, enhance } = superForm(data.form);

  const handleClipboard = () => {
    if (!form) {
      return;
    }

    navigator.clipboard
      .writeText(
        `${$page.url.origin}?encryptedWord=${form.encryptedMessage}&iv=${form.iv}`,
      )
      .then(() => {});
  };
</script>

<main class="flex w-full flex-col items-center gap-y-4">
  <svg class="flex h-32 w-16 py-8 lg:hidden">
    <image xlink:href={logo} class="h-16 w-16" />
  </svg>
  <form
    method="POST"
    class="flex w-full flex-col items-center justify-center gap-y-4"
    use:enhance
  >
    <Notes>
      <div class="text-xs sm:text-base">
        Choisir un mot de 6 à 10 lettres, sans accents
      </div>
    </Notes>
    <input
      class="w-64 rounded-sm border border-transparent p-2 shadow-sm outline-hidden focus:border-blue-500"
      class:!border-red-500={$errors.word}
      type="text"
      name="word"
      bind:value={$superform.word}
      aria-invalid={$errors.word ? "true" : undefined}
    />
    <Notes>
      <p class="h-8 px-2 text-center text-xs text-red-500">
        {$errors.word || ""}
      </p>
    </Notes>
    <button class="rounded-full border px-4 py-2 shadow-sm">Générer</button>
  </form>

  {#if form && form.encryptedMessage && form.iv}
    <Notes>
      <p class="pb-4 text-center">
        Partie générée pour le mot '<span class="font-bold">{form.word}</span>'
      </p>
      {#if !form.validWord}
        <p class="pb-4 text-center text-orange-400">
          Attention, ce mot n'est pas dans notre dictionnaire, <br />
          il sera potentiellement plus difficile à trouver.
        </p>
      {/if}
    </Notes>
    <div class="font-ui flex justify-center gap-x-4">
      <button
        class="rounded-full border px-4 py-2 shadow-sm"
        onclick={handleClipboard}>Copier le lien</button
      >
      <a
        class="rounded-full border px-4 py-2 shadow-sm"
        href={`${$page.url.origin}?encryptedWord=${form.encryptedMessage}&iv=${form.iv}`}
        >Jouer avec ce mot</a
      >
    </div>
  {/if}
</main>
