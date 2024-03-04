<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Key from "./Key.svelte";
  import { CornerDownLeft, Delete } from "lucide-svelte";
  import { enhance } from "$app/forms";

  export let disableInput = false;
  export let disableReturn = true;
  export let disableSubmit = true;

  export let inputAction: string;
  export let returnAction: string;
  export let submitAction: string;

  export let wrongLetters: string[];

  const layout: string[][] = [
    ["a", "z", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["q", "s", "d", "f", "g", "h", "j", "k", "l", "m"],
    ["w", "x", "c", "v", "b", "n"],
  ];

  const dispatch = createEventDispatcher<{
    input: string;
    return: null;
  }>();

  let form: HTMLFormElement;
</script>

<svelte:window
  on:keydown={(e) => {
    e.stopPropagation();
    if (e.key === "Backspace") {
      e.preventDefault();
      dispatch("return");
    }
  }}
  on:keypress={(e) => {
    e.stopPropagation();
    if (e.key === "Enter" && !disableSubmit) {
      form.requestSubmit();
    } else if (e.key >= "a" && e.key <= "z") {
      dispatch("input", e.key);
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
  <slot />
  {#each layout as line, lineIndex}
    <div class="flex" style="padding-left: {lineIndex}em">
      {#each line as letter, index}
        <button
          class="p-0.5"
          on:click|preventDefault={() => dispatch("input", letter)}
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

  <div class="flex gap-x-1 pl-32 pt-2 xs:pl-48">
    <button
      class="flex h-7 items-center justify-center rounded border px-2 shadow disabled:text-stone-500 xs:h-8"
      on:click|preventDefault={() => dispatch("return")}
      tabindex={27}
      formaction={returnAction}
      disabled={disableReturn}
    >
      <Delete strokeWidth={1.5}></Delete>
    </button>

    <button
      class="flex h-7 items-center justify-center rounded border px-8 shadow ring-1 ring-orange-500 disabled:text-stone-500 disabled:ring-0 xs:h-8"
      tabindex={28}
      disabled={disableSubmit}
    >
      <CornerDownLeft strokeWidth={1.5}></CornerDownLeft>
    </button>
  </div>
</form>
