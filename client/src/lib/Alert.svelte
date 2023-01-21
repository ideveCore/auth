<script lang="ts">
  import { fade } from "svelte/transition";
  export let openAlert = false;
  export let msg = "";
  export let alert_type = ''
</script>

<main>
  {#if openAlert}
    <div class="alert" transition:fade={{ duration: 200 }} data-type={alert_type}>{msg}</div>
  {/if}
</main>

<style lang="scss">
  .alert {
    width: 95%;
    height: max-content;
    word-break: break-all;
    max-width: 400px;
    display: flex;
    position: fixed;
    left: 50%;
    bottom: 0.5em;
    align-items: center;
    justify-content: center;
    transform: translateX(-50%);
    background-color: rgb(var(--primary-color));
    box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
    border-radius: var(--border-radius);
    padding: 0.5em;
    z-index: 3;
    color: rgb(255, 255, 255);
    font-size: var(--fs-body);
    &[data-type="danger"] {
      background-color: rgb(var(--danger-color));
    }
    &[data-type="success"] {
      background-color: rgb(var(--success-color));
    }
    &[data-type="warning"] {
      background-color: rgb(var(--warning-color));
    }
  }
</style>