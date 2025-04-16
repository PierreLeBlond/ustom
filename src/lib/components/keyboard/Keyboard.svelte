<script lang="ts">
  import Key from "./Key.svelte";
  import { CornerDownLeft, Delete } from "lucide-svelte";
  import { enhance } from "$app/forms";

  interface Props {
    disableInput?: boolean;
    disableReturn?: boolean;
    disableSubmit?: boolean;
    inputAction: string;
    returnAction: string;
    submitAction: string;
    wrongLetters: string[];
    children?: import("svelte").Snippet;
    onreturn: () => void;
    oninput: (letter: string) => void;
  }

  let {
    disableInput = false,
    disableReturn = true,
    disableSubmit = true,
    inputAction,
    returnAction,
    submitAction,
    wrongLetters,
    children,
    onreturn,
    oninput,
  }: Props = $props();

  const layout: string[][] = [
    ["a", "z", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["q", "s", "d", "f", "g", "h", "j", "k", "l", "m"],
    ["w", "x", "c", "v", "b", "n"],
  ];

  let form: HTMLFormElement | null = $state(null);
</script>

<svelte:window
  onkeydown={(e) => {
    e.stopPropagation();
    if (e.key === "Backspace") {
      e.preventDefault();
      onreturn();
    }
  }}
  onkeypress={(e) => {
    e.stopPropagation();

    if (!form) {
      return;
    }

    if (e.key === "Enter" && !disableSubmit) {
      form.requestSubmit();
    } else if (e.key >= "a" && e.key <= "z") {
      oninput(e.key);
    }
  }}
/>

<form
  method="POST"
  class="flex flex-col"
  action={submitAction}
  use:enhance
  bind:this={form}
>
  {@render children?.()}
  {#each layout as line, lineIndex}
    <div class="flex" style="padding-left: {lineIndex}em">
      {#each line as letter, index}
        <button
          class="p-0.5"
          onclick={(e) => {
            e.preventDefault();
            oninput(letter);
          }}
          tabindex={10 * lineIndex + index + 1}
          formaction={inputAction}
          name="letter"
          value={letter}
          disabled={disableInput}
        >
          <Key
            {letter}
            highlighted={!wrongLetters.find(
              (wrongLetter) => wrongLetter === letter,
            )}
          ></Key>
        </button>
      {/each}
    </div>
  {/each}

  <div class="xs:pl-48 flex gap-x-1 pt-2 pl-32">
    <button
      class="xs:h-8 flex h-7 items-center justify-center rounded-sm border px-2 shadow-sm disabled:text-stone-500"
      onclick={(e) => {
        e.preventDefault();
        onreturn();
      }}
      tabindex={27}
      formaction={returnAction}
      disabled={disableReturn}
    >
      <Delete strokeWidth={1.5}></Delete>
    </button>

    <button
      class="xs:h-8 flex h-7 items-center justify-center rounded-sm border px-8 shadow-sm ring-1 ring-orange-500 disabled:text-stone-500 disabled:ring-0"
      tabindex={28}
      disabled={disableSubmit}
    >
      <CornerDownLeft strokeWidth={1.5}></CornerDownLeft>
    </button>
  </div>
</form>
