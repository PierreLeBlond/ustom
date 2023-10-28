<script lang="ts">
  import Grid from "$lib/components/Grid.svelte";
  import Keyboard from "$lib/components/keyboard/Keyboard.svelte";
  import { Cookie, HelpCircle, Settings, Trophy } from "lucide-svelte";
  import type { PageData } from "./$types";
  import Notes from "$lib/components/Notes.svelte";
  import arrow from "$lib/images/arrow.svg";
  import Rules from "$lib/components/Rules.svelte";
  import Scores from "$lib/components/scores/Scores.svelte";
  import { Drawer, getDrawerStore } from "@skeletonlabs/skeleton";
  import ScoreForm from "$lib/components/scores/ScoreForm.svelte";

  export let data: PageData;

  const drawerStore = getDrawerStore();

  const winningMessage = [
    "T'aurais pas un peu triché toi ?",
    "Un petit peu chanceux, non ?",
    "J'aurais pas fait mieux.",
    "Ça c'est bien joué !",
    "Il était pas facile celui là.",
    "Yes, sur le gong !",
  ];

  $: currentGuess = data.guess;

  const handleInput = ({ detail }: CustomEvent<string>) => {
    if (currentGuess.length >= data.lettersCount) {
      return;
    }
    const firstLetter = data.partialWord.at(0);
    currentGuess +=
      currentGuess.length === 0 && firstLetter !== detail
        ? data.partialWord.at(0) + detail
        : detail;
  };

  const handleReturn = () => {
    if (currentGuess.length === 0) {
      return;
    }
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
  };

  let ready = true;
</script>

<Drawer>
  <div class="flex h-full justify-center overflow-y-hidden bg-stone-300 pt-8">
    {#if $drawerStore.id === "rules"}
      <Rules></Rules>
    {/if}
    {#if $drawerStore.id === "scores"}
      <Scores scores={data.scores} name={data.scoreName}></Scores>
    {/if}
  </div>
</Drawer>

<main
  class="grid h-full w-full grid-cols-1 items-center justify-items-center lg:grid-cols-3"
>
  <section class="hidden lg:block">
    <Rules></Rules>
  </section>
  <section class="flex w-full justify-between px-8 lg:hidden">
    <button
      class="rounded-full border p-2 shadow"
      on:click={() => drawerStore.open({ id: "rules", position: "left" })}
      ><HelpCircle></HelpCircle></button
    >
    <button
      class="rounded-full border p-2 shadow"
      on:click={() => drawerStore.open({ id: "scores", position: "right" })}
      ><Trophy></Trophy></button
    >
  </section>
  <section>
    <Grid
      columnsCount={data.lettersCount}
      linesCount={data.tryCounts}
      guess={currentGuess}
      guesses={data.guesses}
      partialWord={data.partialWord}
      finished={data.won || data.lost}
      bind:ready
    ></Grid>
  </section>
  <section class="hidden self-start lg:block">
    <Scores scores={data.scores} name={data.scoreName}></Scores>
  </section>
  <section></section>
  <section class="self-start">
    {#if data.won && ready}
      <div class="flex flex-col items-center gap-y-4 text-sm">
        <Notes>{winningMessage[data.guesses.length - 1]}</Notes>
        {#if !data.scoreName && (data.scores.length < 10 || data.scores.some(({ score }) => data.guesses.length < score))}
          <ScoreForm
            score={data.guesses.length}
            iv={data.iv}
            encryptedWord={data.encryptedWord}
          ></ScoreForm>
        {:else if data.scoreName}
          <Notes>Ton score est publié !</Notes>
        {:else}
          <Notes>Malheureusement tu n'est pas dans le top 10 :(</Notes>
        {/if}
      </div>
    {:else if data.lost && ready}
      <Notes>
        Oh non ! C'était ton dernier essai... ! Pour te consoler, voila un <Cookie
          class="inline h-4 w-4"
        ></Cookie>.
      </Notes>
    {:else}
      <Keyboard
        on:input={handleInput}
        on:return={handleReturn}
        disableInput={!ready || currentGuess.length === data.lettersCount}
        disableReturn={!ready || currentGuess.length === 0}
        disableSubmit={!ready || currentGuess.length !== data.lettersCount}
        inputAction={`?/input&iv=${data.iv}&encryptedWord=${data.encryptedWord}`}
        returnAction={`?/return&iv=${data.iv}&encryptedWord=${data.encryptedWord}`}
        submitAction={`?/submit&iv=${data.iv}&encryptedWord=${data.encryptedWord}`}
        wrongLetters={data.wrongLetters}
      >
        <input type="hidden" name="guess" value={currentGuess} />
        <input type="hidden" name="partialWord" value={data.partialWord} />
      </Keyboard>
    {/if}
  </section>
  <section class="flex w-full justify-end pr-8 xl:pr-32">
    <div class="grid w-64 grid-cols-2 gap-y-4">
      <div class="col-span-2 -rotate-6 text-sm">
        <Notes>si tu veux générer une partie avec ton propre mot</Notes>
      </div>
      <div class="grid-span-1 flex justify-end">
        <svg class="h-14 w-14">
          <image xlink:href={arrow} class="h-14 w-14" />
        </svg>
      </div>
      <div class="flex items-center justify-start pl-4">
        <a class="rounded-full border p-2 shadow" href="/generate"
          ><Settings></Settings></a
        >
      </div>
    </div>
  </section>
</main>
