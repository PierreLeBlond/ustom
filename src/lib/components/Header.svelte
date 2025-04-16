<script>
  import Notes from "./Notes.svelte";
  import logo from "$lib/images/logo.svg";
</script>

<Notes>
  <div class="hidden w-full justify-center py-8 lg:flex">
    <svg class="h-32 w-32">
      <image xlink:href={logo} class="h-32 w-32" />
    </svg>
  </div>
</Notes>
