<script lang="ts">
  import Grid from "$lib/components/grid/Grid.svelte";
  import Keyboard from "$lib/components/keyboard/Keyboard.svelte";
  import {
    CircleQuestionMark,
    Cookie,
    Settings,
    Trophy,
    X,
  } from "lucide-svelte";
  import type { ActionData, PageData } from "./$types";
  import Notes from "$lib/components/Notes.svelte";
  import arrow from "$lib/images/arrow.svg";
  import logo from "$lib/images/logo.svg";
  import Rules from "$lib/components/Rules.svelte";
  import Scores from "$lib/components/scores/Scores.svelte";
  import { Dialog, Portal } from "@skeletonlabs/skeleton-svelte";
  import ScoreForm from "$lib/components/scores/ScoreForm.svelte";
  import { confetti } from "@neoconfetti/svelte";
  import { base } from "$app/paths";

  interface Props {
    data: PageData;
    form: ActionData;
  }

  let { data, form }: Props = $props();

  const winningMessage = [
    "T'aurais pas un peu triché toi ?",
    "Un petit peu chanceux, non ?",
    "J'aurais pas fait mieux.",
    "Ça c'est bien joué !",
    "Il était pas facile celui là.",
    "Yes, sur le gong !",
  ];

  const animBackdrop =
    "transition transition-discrete opacity-0 starting:data-[state=open]:opacity-0 data-[state=open]:opacity-100";
  const animModalLeft =
    "transition transition-discrete opacity-0 -translate-x-full starting:data-[state=open]:opacity-0 starting:data-[state=open]:-translate-x-full data-[state=open]:opacity-100 data-[state=open]:translate-x-0";
  const animModalRight =
    "transition transition-discrete opacity-0 translate-x-full starting:data-[state=open]:opacity-0 starting:data-[state=open]:translate-x-full data-[state=open]:opacity-100 data-[state=open]:translate-x-0";

  let currentGuess = $derived(data.guess);

  const handleInput = (letter: string) => {
    if (currentGuess.length >= data.lettersCount) {
      return;
    }
    const firstLetter = data.partialWord.at(0);
    currentGuess +=
      currentGuess.length === 0 && firstLetter !== letter
        ? data.partialWord.at(0) + letter
        : letter;
  };

  const handleReturn = () => {
    if (currentGuess.length === 0) {
      return;
    }
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
  };

  let ready = $state(true);
</script>

<main
  class="grid w-full grid-cols-1 justify-items-center gap-y-4 lg:h-full lg:grid-cols-3"
>
  <section class="hidden lg:block">
    <Rules></Rules>
  </section>
  <section class="flex w-64 items-center justify-between px-8 pt-4 lg:hidden">
    <Dialog>
      <Dialog.Trigger class="rounded-full border p-2 shadow-sm"
        ><CircleQuestionMark></CircleQuestionMark>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop
          class="bg-surface-50-950/50 fixed inset-0 z-50 transition transition-discrete {animBackdrop}"
        />
        <Dialog.Positioner class="fixed inset-0 z-50 flex justify-start">
          <Dialog.Content class="h-screen {animModalLeft}">
            <div
              class="flex h-full w-full flex-col items-center justify-start gap-y-8 overflow-y-hidden bg-stone-300 pt-8"
            >
              <Dialog.CloseTrigger class="rounded-full border p-2 shadow-sm">
                <X></X>
              </Dialog.CloseTrigger>
              <Rules></Rules>
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog>
    <svg class="h-16 w-16">
      <image xlink:href={logo} class="h-16 w-16" />
    </svg>
    <Dialog>
      <Dialog.Trigger class="rounded-full border p-2 shadow-sm">
        <Trophy></Trophy>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop
          class="bg-surface-50-950/50 fixed inset-0 z-50 transition transition-discrete {animBackdrop}"
        />
        <Dialog.Positioner class="fixed inset-0 z-50 flex justify-end">
          <Dialog.Content class="h-screen {animModalRight}">
            <div
              class="flex h-full w-full flex-col items-center justify-start gap-y-8 overflow-y-hidden bg-stone-300 pt-8"
            >
              <Dialog.CloseTrigger class="rounded-full border p-2 shadow-sm">
                <X></X>
              </Dialog.CloseTrigger>
              <Scores scores={data.scores} name={data.scoreName}></Scores>
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog>
  </section>
  <section class="flex flex-col items-center gap-y-4 px-4 text-sm">
    <Grid
      columnsCount={data.lettersCount}
      linesCount={data.tryCounts}
      guess={currentGuess}
      guesses={data.guesses}
      partialWord={data.partialWord}
      finished={data.won || data.lost}
      bind:ready
    ></Grid>
    {#if data.won && ready}
      <Notes>{winningMessage[data.guesses.length - 1]}</Notes>
      <div use:confetti={{ colors: ["#BFDBFE", "#E7E5E4", "#FED7AA"] }}></div>
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
    {:else if data.lost && ready}
      <Notes>
        Oh non ! C'était ton dernier essai... ! Pour te consoler, voila un <Cookie
          class="inline h-4 w-4"
        ></Cookie>.
      </Notes>
    {:else}
      <Notes>
        <p class="flex h-8 items-center text-center text-orange-500">
          {form?.message ? form.message : ""}
        </p>
      </Notes>
      <Keyboard
        oninput={handleInput}
        onreturn={handleReturn}
        disableInput={!ready ||
          currentGuess.length === data.lettersCount ||
          data.won ||
          data.lost}
        disableReturn={!ready ||
          currentGuess.length === 0 ||
          data.won ||
          data.lost}
        disableSubmit={!ready ||
          currentGuess.length !== data.lettersCount ||
          data.won ||
          data.lost}
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
  <section class="hidden self-start lg:block">
    <Scores scores={data.scores} name={data.scoreName}></Scores>
  </section>
  <section></section>
  <section></section>
  <section class="flex w-full justify-end pt-4 pr-8 xl:pr-32">
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
        <a class="rounded-full border p-2 shadow-sm" href={`${base}/generate`}
          ><Settings></Settings></a
        >
      </div>
    </div>
  </section>
</main>
