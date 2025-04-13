<script>
  // Game logic
  class BattleGame {
    constructor(
      options = { players: [{ hp: 25 }, { hp: 25 }], maxHealth: 25 },
    ) {
      this.players = options.players;
      this.maxHealth = options.maxHealth;
      this.turn = 0;
      this.lastRoll = null;
      this.lastHit = null;
      this.gameOver = false;
    }

    rollDice(range = [0, 20]) {
      const rangeSize = range[1] - range[0];
      return Math.floor(Math.random() * rangeSize) + range[0];
    }

    attack({ hp, player }) {
      this.players[player].hp -= hp;
      this.players[player].hp = Math.max(this.players[player].hp, 0);
      this.checkGameOver();
    }

    heal({ hp, player }) {
      this.players[player].hp += hp;
      this.players[player].hp = Math.min(
        this.players[player].hp,
        this.maxHealth,
      );
    }

    nextTurn() {
      this.turn = Number(!this.turn);
    }

    checkGameOver() {
      if (this.players[0].hp <= 0 || this.players[1].hp <= 0) {
        this.gameOver = true;
      }
    }
  }

  // Initialize game
  let game = new BattleGame();
  let winner = null;
  let selectedAction = "attack"; // Default selected action
  let isRolling = false; // For dice animation

  // Handle action selection
  function selectAction(action) {
    selectedAction = action;
  }

  // Handle dice roll and action execution
  function executeDiceAction() {
    if (game.gameOver || isRolling) return;

    isRolling = true;

    // Simulate dice rolling animation
    setTimeout(() => {
      const roll = game.rollDice();
      game.lastRoll = roll;

      if (selectedAction === "attack") {
        game.lastHit = roll;
        game.attack({ hp: roll, player: Number(!game.turn) });
      } else if (selectedAction === "heal") {
        game.heal({ hp: roll, player: game.turn });
      }

      if (game.gameOver) {
        if (game.players[0].hp <= 0) {
          winner = "Player 2";
        } else if (game.players[1].hp <= 0) {
          winner = "Player 1";
        }
      } else {
        game.nextTurn();
        // Reset selected action for next player
        selectedAction = "attack";
      }

      isRolling = false;
    }, 500); // Animation duration
  }

  // Reset game
  function resetGame() {
    game = new BattleGame();
    winner = null;
    selectedAction = "attack";
  }
</script>

<div class="game-container">
  {#if winner}
    <div class="winner-message">
      <h2>{winner} wins!</h2>
      <button on:click={resetGame}>Play Again</button>
    </div>
  {/if}

  <div class="game-ui">
    <!-- Player 2 view (upside down) -->
    <div class="player-view player-two">
      <div class="action-container">
        <div class="action-box">
          <div
            class="dice-image"
            class:disabled={game.turn === 0}
            class:rolling={isRolling}
            on:click={() => game.turn === 1 && executeDiceAction()}
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
              on:click={() => game.turn === 1 && selectAction("attack")}
            >
              Attack
            </div>
            <div
              class:selected={selectedAction === "heal" && game.turn === 1}
              on:click={() => game.turn === 1 && selectAction("heal")}
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
    </div>

    <!-- Roll and Hit display (center) -->
    {#if game.lastRoll !== null}
      <div class="roll-hit-container">
        <div class="hit-display">
          HIT: {game.lastHit !== null ? game.lastHit : ""}
        </div>
        <div class="roll-display">ROLL: {game.lastRoll}</div>
      </div>
    {/if}

    <!-- Player 1 view (normal orientation) -->
    <div class="player-view player-one">
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
              on:click={() => game.turn === 0 && selectAction("attack")}
            >
              Attack
            </div>
            <div
              class:selected={selectedAction === "heal" && game.turn === 0}
              on:click={() => game.turn === 0 && selectAction("heal")}
            >
              Heal
            </div>
          </div>
          <div
            class="dice-image"
            class:disabled={game.turn === 1}
            class:rolling={isRolling}
            on:click={() => game.turn === 0 && executeDiceAction()}
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

    <!-- Turn indicator -->
    <div class="turn-indicator">
      Player {game.turn + 1}'s turn
    </div>
  </div>
</div>

<style>
  .game-container {
    font-family: "Courier New", monospace;
    max-width: 320px;
    margin: 0 auto;
    background-color: white;
    position: relative;
    padding: 10px;
  }

  .game-ui {
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: space-between;
    height: 100vh;
  }

  .player-view {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .player-two {
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

  .roll-hit-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px 0;
  }

  .roll-display,
  .hit-display {
    font-size: 24px;
    font-weight: bold;
    color: red;
    text-shadow: 2px 2px 0 black;
  }

  .turn-indicator {
    text-align: center;
    margin-top: 10px;
    font-weight: bold;
  }

  .winner-message {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .winner-message button {
    margin-top: 20px;
    padding: 10px 20px;
    border: 2px solid black;
    background-color: white;
    cursor: pointer;
  }
</style>
