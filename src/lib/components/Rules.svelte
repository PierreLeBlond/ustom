<script>
  import Notes from "./Notes.svelte";
</script>

<div class="w-full -rotate-2 p-8 text-xs md:w-96 md:text-sm">
  <Notes>
    <div class="flex flex-col gap-y-4">
      <p class="w-full text-center">Rêgles du jeu</p>
      <p>
        Le but du jeu est de deviner un mot mystère en un maximum de six essais.
      </p>
      <p>Seule la première lettre est connu.</p>
      <p>Après chaque tentative, des indications sont données :</p>
      <p>
        - Une lettre correctement placée apparait sur fond <span
          class="bg-blue-200">bleu</span
        >
      </p>
      <p>
        - Une lettre existante mais mal placée apparait sur fond
        <span class="bg-orange-200">orange</span>
      </p>
      <p>
        - Une lettre qui n'est pas présente dans le mot apparait sur fond
        <span class="bg-stone-200">gris</span>
      </p>
    </div>
  </Notes>
</div>
