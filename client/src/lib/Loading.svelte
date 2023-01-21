<script lang="ts">
  export let isLoading = false;
</script>

{#if isLoading}
  <div class="loading-animation">
    <div class="ball ball-ne"></div>
    <div class="ball ball-nw"></div>
    <div class="ball ball-sw"></div>
    <div class="ball ball-se"></div>
  </div>
{/if}

<style lang="scss">
  .loading-animation {
    --accent: hsl(186, 68%, 29%);
    --loading-ball-size: 8px;
    --loading-spacing-size: 12px;
    --loading-ball-spacing-size: calc(
      (var(--loading-ball-size) + var(--loading-spacing-size))
    );
    --loading-total-size: calc(
      (var(--loading-ball-size) * 2 + var(--loading-spacing-size))
    );
    width: var(--loading-total-size);
    height: var(--loading-total-size);
    position: relative;
    display: inline-block;
    -webkit-animation: spin 2s infinite linear;
    animation: spin 2s infinite linear;
    pointer-events: none;


    & .ball {
      position: absolute;
      width: var(--loading-ball-size);
      height: var(--loading-ball-size);
      border-radius: 100%;
      background-color: var(--accent);

      &.ball-ne {
        background-color: rgb(var(--yellow-color));
        animation: ne 2s infinite linear;
      }

      &.ball-nw {
        background-color: rgb(var(--yellow-color));
        animation: nw 2s infinite linear;
        right: 0;
      }

      &.ball-sw {
        background-color: rgb(var(--yellow-color));
        animation: sw 2s infinite linear;
        right: 0;
        bottom: 0;
      }

      &.ball-se {
        background-color: rgb(var(--yellow-color));
        -webkit-animation: se 2s infinite linear;
        animation: se 2s infinite linear;
        bottom: 0;
      }
    }
  }

  @keyframes spin {
    to {
      transform: rotate(720deg);
    }
  }

  @keyframes ne {
    50% {
      transform: translate3d(
          calc((var(--loading-ball-spacing-size) / 3)),
          calc((var(--loading-ball-spacing-size) / 3)),
          0
      );
    }
  }

  @keyframes nw {
    50% {
      transform: translate3d(
          calc((var(--loading-ball-spacing-size) / -3)),
          calc((var(--loading-ball-spacing-size) / 3)),
          0
      );
    }
  }

  @keyframes sw {
    50% {
      transform: translate3d(
          calc((var(--loading-ball-spacing-size) / -3)),
          calc((var(--loading-ball-spacing-size) / -3)),
          0
      );
    }
  }

  @keyframes se {
    50% {
      transform: translate3d(
          calc((var(--loading-ball-spacing-size) / 3)),
          calc((var(--loading-ball-spacing-size) / -3)),
          0
      );
    }
  }
</style>