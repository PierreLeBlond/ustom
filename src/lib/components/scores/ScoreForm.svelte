<script lang="ts">
  import { enhance } from "$app/forms";
  import Notes from "$lib/components/Notes.svelte";

  export let iv: string;
  export let encryptedWord: string;
  export let score: number;
</script>

<Notes>Tu es dans le top 10 !</Notes>
<Notes>Tu peux envoyer ton score :)</Notes>
<form
  action={`?/score&iv=${iv}&encryptedWord=${encryptedWord}`}
  method="POST"
  class="flex flex-col items-center gap-y-4 pt-8"
  use:enhance
>
  <div class="flex flex-col">
    <Notes>Ton nom ?</Notes>
    <input
      class="w-64 rounded border p-2 shadow"
      type="text"
      required
      pattern={"[A-Za-z]{4,10}"}
      name="name"
    />
  </div>
  <input type="hidden" name="score" value={score} />
  <button class="rounded-full border px-4 py-2 shadow">Envoyer mon score</button
  >
</form>
