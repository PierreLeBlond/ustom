<script lang="ts">
  import type { LetterGuess } from "$lib/util/LetterGuess";
  import AnimatedCell from "./AnimatedCell.svelte";
  import Cell from "./Cell.svelte";

  interface Props {
    linesCount: number;
    columnsCount: number;
    guesses: LetterGuess[][];
    guess: string;
    partialWord: string;
    finished: boolean;
    ready?: boolean;
  }

  let {
    linesCount,
    columnsCount,
    guesses,
    guess,
    partialWord,
    finished,
    ready = $bindable(true),
  }: Props = $props();

  // Build the full grid with previous guess, current guess completed by ".", and remaining empty lines
  let previousGuesses = $derived(
    guesses.length > 0 ? guesses.slice(0, guesses.length - 1) : [],
  );
  let lastGuess = $derived(
    guesses.length > 0 ? (guesses.at(guesses.length - 1) as LetterGuess[]) : [],
  );

  let currentGuess: LetterGuess[] = $state([]);
  $effect(() => {
    if (finished || !ready) {
      currentGuess = [];
    } else if (guess === "") {
      // The user has not entered letter yet, let's display him all correct letters
      currentGuess = partialWord
        .split("")
        .map((letter) => ({ letter, match: "" }));
    } else {
      currentGuess = [
        ...guess.split("").map((letter) => ({ letter, match: "" })),
        ...new Array(columnsCount - guess.length).fill({
          letter: ".",
          match: "",
        }),
      ];
    }
  });

  let remainingGuesses = $derived([
    ...new Array(
      linesCount - (guesses.length + (finished || !ready ? 0 : 1)),
    ).fill([...new Array(columnsCount).fill({ letter: "", match: "" })]),
  ]);
</script>

<div class="flex flex-col">
  {#each previousGuesses as line}
    <div class="flex">
      {#each line as { letter, match }}
        <Cell {letter} {match}></Cell>
      {/each}
    </div>
  {/each}
  <div class="flex">
    {#key lastGuess}
      {#each lastGuess as { letter, match }, index}
        <AnimatedCell
          {letter}
          {match}
          {index}
          {columnsCount}
          onstart={() => (ready = false)}
          onend={() => (ready = true)}
        ></AnimatedCell>
      {/each}
    {/key}
  </div>
  <div class="flex">
    {#each currentGuess as { letter, match }}
      <Cell {letter} {match}></Cell>
    {/each}
  </div>
  {#each remainingGuesses as line}
    <div class="flex">
      {#each line as { letter, match }}
        <Cell {letter} {match}></Cell>
      {/each}
    </div>
  {/each}
</div>
