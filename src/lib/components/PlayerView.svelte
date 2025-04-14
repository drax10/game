<script>
  export let player;
  export let game;
  export let isRolling;
  export let selectedAction;
  export let onActionSelect;
  export let onDiceRoll;
  export let isUpsideDown = false;

  function getEnemyPlayer() {
    return player === 1 ? 2 : 1;
  }

  function getCurrentPlayer() {
    return player;
  }

  function toggleSpecial() {
    game.toggleSpecialAttack();
    game = game;
  }
</script>

<div class="player-view" class:upside-down={isUpsideDown}>
  <div class="roll-hit-container">
    <div class="roll-display">
      {#if game.lastRoll !== null}
        {#if typeof game.lastRoll === "string" && game.lastRoll.includes("+")}
          SPECIAL: {game.lastRoll}
        {:else}
          ROLL: {game.lastRoll}
        {/if}
      {/if}
    </div>

    <br />
    {#if game.stats[`player${player}`].specialAttackReady}
      <div class="special-attack-container">
        <div class="special-attack-ready">SPECIAL READY!</div>
        {#if game.turn === player - 1}
          <button
            class="special-toggle"
            class:active={game.stats[`player${player}`].usingSpecial}
            on:click={toggleSpecial}
          >
            {game.stats[`player${player}`].usingSpecial
              ? "SPECIAL ON"
              : "USE SPECIAL"}
          </button>
        {/if}
      </div>
    {/if}

    <div class="enemy-hp-bar">
      <div class="enemy-hp-text">
        <span class="special-progress enemy-special-progress"
          >SPECIAL: {game.stats[`player${getEnemyPlayer()}`].attacks %
            10}/10</span
        >
        <span
          >Enemy HP: {game.players[getEnemyPlayer() - 1]
            .hp}/{game.maxHealth}</span
        >
      </div>
      <div class="enemy-hp-bar-outer">
        <div
          class="enemy-hp-bar-inner"
          style="width: {(game.players[getEnemyPlayer() - 1].hp /
            game.maxHealth) *
            100}%"
        ></div>
      </div>
    </div>
    <div class="hp-bar">
      <div class="hp-text">
        <span class="special-progress"
          >SPECIAL: {game.stats[`player${player}`].attacks % 10}/10</span
        >
        <span
          >HP: {game.players[getCurrentPlayer() - 1].hp}/{game.maxHealth}</span
        >
      </div>
      <div class="hp-bar-outer">
        <div
          class="hp-bar-inner"
          style="width: {(game.players[getCurrentPlayer() - 1].hp /
            game.maxHealth) *
            100}%"
        ></div>
      </div>
    </div>
  </div>

  <div class="action-container">
    <div class="action-box">
      <div class="action-text" class:disabled={game.turn !== player - 1}>
        <div
          class:selected={selectedAction === "attack" &&
            game.turn === player - 1}
          on:click={() => game.turn === player - 1 && onActionSelect("attack")}
        >
          {#if selectedAction === "attack" && game.turn === player - 1}>
          {/if}
          {game.stats[`player${player}`].usingSpecial
            ? "DOUBLE ATTACK"
            : "Attack"}
        </div>
        <div
          class:selected={selectedAction === "heal" && game.turn === player - 1}
          on:click={() => game.turn === player - 1 && onActionSelect("heal")}
        >
          {#if selectedAction === "heal" && game.turn === player - 1}>
          {/if}
          {game.stats[`player${player}`].usingSpecial ? "HEAL +25" : "Heal"}
        </div>
      </div>
      <div
        class="dice-image"
        class:disabled={game.turn !== player - 1}
        class:rolling={isRolling}
        on:click={() => game.turn === player - 1 && onDiceRoll()}
      >
        <img src="/dice.png" alt="Dice" style="border-radius: 35px;" />
      </div>
    </div>
  </div>
  <div class="win-counter">Wins: {game.stats[`player${player}`].wins}</div>
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
    /* border-radius: 5px; */
    overflow: hidden;
    width: 100%;
    max-width: 500px;
  }

  .action-text {
    flex: 1;
    padding: 10px;
    font-weight: bold;
    cursor: pointer;
    border-right: 3px solid black;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .action-text.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .action-text div {
    padding: 8px 5px;
    border-bottom: 3px solid black;
    min-height: 30px;
    display: flex;
    align-items: center;
  }

  .action-text div:last-child {
    border-bottom: none;
  }

  .action-text div.selected {
    background-color: #f0f0f0;
  }

  .dice-image {
    width: 100px;
    height: 100px;
    padding: 5px;
    cursor: pointer;
    transition: transform 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dice-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
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
    text-align: right;
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  .enemy-hp-bar-outer {
    height: 15px;
    border: 2px solid black;
    background-color: white;
    position: relative;
    margin-bottom: 10px;
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
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  .special-attack-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    margin-bottom: 5px;
  }

  .special-toggle {
    background: #000;
    color: #ff0;
    border: 2px solid #ff0;
    padding: 4px 8px;
    font-family: "Press Start 2P", monospace;
    font-size: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
  }

  .special-toggle.active {
    background: #ff0;
    color: #000;
    box-shadow: 0 0 10px #ff0;
  }

  .special-toggle:hover {
    transform: scale(1.05);
  }

  .roll-display {
    font-size: 24px;
    font-weight: bold;
    color: red;
    text-shadow: 2px 2px 0 black;
    min-height: 30px;
    text-align: center;
  }

  .special-progress {
    color: #ff0;
    text-shadow: 1px 1px 0 #000;
  }
  .enemy-special-progress {
    color: #000;
    text-shadow: none;
  }

  .win-counter {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    margin-top: 5px;
    color: #000;
  }
</style>
