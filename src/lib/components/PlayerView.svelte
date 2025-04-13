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
  {#if game.stats[`player${player}`].specialAttackReady}
    <div class="special-attack-ready">SPECIAL READY!</div>
  {:else}
    <div class="special-attack-progress">
      SPECIAL: {game.stats[`player${player}`].attacks % 10}/10
    </div>
  {/if}
  <div class="roll-hit-container">
    <div class="hit-display">
      HIT: {game.lastHit !== null ? game.lastHit : ""}
      {game.lastHit === 0 ? "☠️" : ""}
    </div>
    <div class="roll-display">ROLL: {game.lastRoll}</div>
    <div class="enemy-hp-bar">
      <div class="enemy-hp-text">
        Enemy HP: {game.players[1].hp}/{game.maxHealth}
      </div>
      <div class="enemy-hp-bar-outer">
        <div
          class="enemy-hp-bar-inner"
          style="width: {(game.players[1].hp / game.maxHealth) * 100}%"
        ></div>
      </div>
    </div>
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
</div>

<style>
  .player-view {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .upside-down {
    transform: rotate(180deg);
  }

  .action-container {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .action-box {
    display: flex;
    border: 3px solid black;
    border-radius: 5px;
    overflow: hidden;
    width: 100%;
    max-width: 500px;
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

  .roll-hit-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px 0;
    width: 100%;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .roll-display,
  .hit-display {
    font-size: 24px;
    font-weight: bold;
    color: red;
    text-shadow: 2px 2px 0 black;
  }

  .enemy-hp-bar {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
  }

  .enemy-hp-text {
    font-size: 14px;
    font-weight: bold;
    text-align: center;
  }

  .enemy-hp-bar-outer {
    height: 15px;
    border: 2px solid black;
    background-color: white;
    position: relative;
  }

  .enemy-hp-bar-inner {
    height: 100%;
    background-color: #ff0000;
    transition: width 0.3s ease;
  }

  .hp-bar {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
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

  .special-attack-ready {
    background: #ff0;
    color: #000;
    padding: 4px 8px;
    font-family: "Press Start 2P", monospace;
    font-size: 10px;
    text-align: center;
    margin-bottom: 5px;
    border: 2px solid #000;
    animation: pulse 1s infinite;
    z-index: 2;
  }

  .special-attack-progress {
    background: #000;
    color: #ff0;
    padding: 4px 8px;
    font-family: "Press Start 2P", monospace;
    font-size: 10px;
    text-align: center;
    margin-bottom: 5px;
    border: 2px solid #ff0;
    z-index: 2;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
