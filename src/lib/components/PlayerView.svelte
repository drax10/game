<script>
  export let player;
  export let game;
  export let isRolling;
  export let selectedAction;
  export let onActionSelect;
  export let onDiceRoll;
  export let isUpsideDown = false;
</script>

<div class="player-view" class:upside-down={isUpsideDown}>
  {#if isUpsideDown}
    <div class="action-container">
      <div class="action-box">
        <div
          class="dice-image"
          class:disabled={game.turn === 0}
          class:rolling={isRolling}
          on:click={() => game.turn === 1 && onDiceRoll()}
        >
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            <rect
              x="2"
              y="2"
              width="20"
              height="20"
              fill="#d0d0d0"
              stroke="black"
              stroke-width="1"
            />
            <circle cx="7" cy="7" r="2" fill="black" />
            <circle cx="17" cy="7" r="2" fill="black" />
            <circle cx="7" cy="17" r="2" fill="black" />
            <circle cx="17" cy="17" r="2" fill="black" />
            <circle cx="12" cy="12" r="2" fill="black" />
          </svg>
        </div>
        <div class="action-text" class:disabled={game.turn === 0}>
          <div
            class:selected={selectedAction === "attack" && game.turn === 1}
            on:click={() => game.turn === 1 && onActionSelect("attack")}
          >
            Attack
          </div>
          <div
            class:selected={selectedAction === "heal" && game.turn === 1}
            on:click={() => game.turn === 1 && onActionSelect("heal")}
          >
            Heal
          </div>
        </div>
      </div>
    </div>

    <div class="hp-container">
      <div class="hp-bar">
        <div class="hp-text">HP: {game.players[1].hp}/{game.maxHealth}</div>
        <div class="hp-bar-outer">
          <div
            class="hp-bar-inner"
            style="width: {(game.players[1].hp / game.maxHealth) * 100}%"
          ></div>
        </div>
      </div>
    </div>
  {:else}
    <div class="hp-container">
      <div class="hp-bar">
        <div class="hp-text">HP: {game.players[0].hp}/{game.maxHealth}</div>
        <div class="hp-bar-outer">
          <div
            class="hp-bar-inner"
            style="width: {(game.players[0].hp / game.maxHealth) * 100}%"
          ></div>
        </div>
      </div>
    </div>

    <div class="action-container">
      <div class="action-box">
        <div class="action-text" class:disabled={game.turn === 1}>
          <div
            class:selected={selectedAction === "attack" && game.turn === 0}
            on:click={() => game.turn === 0 && onActionSelect("attack")}
          >
            Attack
          </div>
          <div
            class:selected={selectedAction === "heal" && game.turn === 0}
            on:click={() => game.turn === 0 && onActionSelect("heal")}
          >
            Heal
          </div>
        </div>
        <div
          class="dice-image"
          class:disabled={game.turn === 1}
          class:rolling={isRolling}
          on:click={() => game.turn === 0 && onDiceRoll()}
        >
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            <rect
              x="2"
              y="2"
              width="20"
              height="20"
              fill="#d0d0d0"
              stroke="black"
              stroke-width="1"
            />
            <circle cx="7" cy="7" r="2" fill="black" />
            <circle cx="17" cy="7" r="2" fill="black" />
            <circle cx="7" cy="17" r="2" fill="black" />
            <circle cx="17" cy="17" r="2" fill="black" />
            <circle cx="12" cy="12" r="2" fill="black" />
          </svg>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .player-view {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .upside-down {
    transform: rotate(180deg);
  }

  .action-container {
    display: flex;
    justify-content: center;
  }

  .action-box {
    display: flex;
    border: 3px solid black;
    border-radius: 5px;
    overflow: hidden;
    width: 100%;
  }

  .action-text {
    flex: 1;
    padding: 10px;
    font-weight: bold;
    cursor: pointer;
  }

  .action-text.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .action-text div {
    padding: 2px 5px;
  }

  .action-text div.selected {
    background-color: #f0f0f0;
  }

  .dice-image {
    width: 50px;
    height: 50px;
    border-left: 3px solid black;
    padding: 5px;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .dice-image.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .dice-image.rolling {
    animation: roll 0.5s ease;
  }

  @keyframes roll {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(90deg);
    }
    50% {
      transform: rotate(180deg);
    }
    75% {
      transform: rotate(270deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .hp-container {
    margin: 5px 0;
  }

  .hp-bar {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .hp-bar-outer {
    height: 15px;
    border: 2px solid black;
    background-color: white;
    position: relative;
  }

  .hp-bar-inner {
    height: 100%;
    background-color: #00cc00;
    transition: width 0.3s ease;
  }

  .hp-text {
    font-size: 14px;
    font-weight: bold;
    text-align: right;
  }
</style>
