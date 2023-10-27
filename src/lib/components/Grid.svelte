<script lang="ts">
  import type { LetterGuess } from "$lib/util/LetterGuess";
  import AnimatedCell from "./AnimatedCell.svelte";
  import Cell from "./Cell.svelte";

  export let linesCount: number;
  export let columnsCount: number;

  export let guesses: LetterGuess[][];
  export let guess: string;

  export let partialWord: string;

  export let won: boolean;

  export let ready: boolean = true;

  // Build the full grid with previous guess, current guess completed by ".", and remaining empty lines
  $: previousGuesses =
    guesses.length > 0 ? guesses.slice(0, guesses.length - 1) : [];
  $: lastGuess =
    guesses.length > 0 ? (guesses.at(guesses.length - 1) as LetterGuess[]) : [];

  let currentGuess: LetterGuess[] = [];
  $: if (won || !ready) {
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

  $: remainingGuesses = [
    ...new Array(linesCount - (guesses.length + (won || !ready ? 0 : 1))).fill([
      ...new Array(columnsCount).fill({ letter: "", match: "" }),
    ]),
  ];
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
          on:start={() => (ready = false)}
          on:end={() => (ready = true)}
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
