<script>
  import Notes from "./Notes.svelte";
  import logo from "$lib/images/logo.svg";
</script>

<Notes>
  <header class="hidden w-full justify-center py-8 lg:flex">
    <svg class="h-32 w-32">
      <image xlink:href={logo} class="h-32 w-32" />
    </svg>
  </header>
</Notes>
