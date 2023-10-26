<script lang="ts">
  import Cell from "./Cell.svelte";

  type Guess = {
    letter: string;
    match: "x" | "?" | "!";
  };

  export let linesCount: number;
  export let columnsCount: number;

  export let guesses: Guess[][];
  export let guess: string;

  export let won: boolean;

  // Build the full grid with previous guess, current guess completed by ".", and remaining empty lines
  $: previousGuesses =
    guesses.length > 0 ? guesses.slice(0, guesses.length - 1) : [];
  $: lastGuess =
    guesses.length > 0 ? (guesses.at(guesses.length - 1) as Guess[]) : [];
  $: currentGuess = !won
    ? [
        ...guess.split("").map((letter) => ({ letter, match: "" })),
        ...new Array(columnsCount - guess.length).fill({
          letter: ".",
          match: "",
        }),
      ]
    : [];
  $: remainingGuesses = [
    ...new Array(linesCount - (guesses.length + (won ? 0 : 1))).fill([
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
        <Cell {letter} {match} delay={index}></Cell>
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
