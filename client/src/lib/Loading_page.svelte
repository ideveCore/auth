<script>
  import Loading from "$lib/Loading.svelte";
  let isLoading = true
</script>

<main class="page">
  <Loading {isLoading}/>
  <h3>Loading...</h3>
</main>

<style lang="scss">
  .page {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-direction: column;
    gap: var(--padding);
    & h3 {
      font-size: var(--fs-h3);
      color: rgb(var(--text-color));
    }
  }
</style>