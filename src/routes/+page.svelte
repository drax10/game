<script>
  import PlayerView from "$lib/components/PlayerView.svelte";

  // Game logic
  class BattleGame {
    constructor(
      options = { players: [{ hp: 50 }, { hp: 50 }], maxHealth: 60 },
    ) {
      this.players = options.players;
      this.maxHealth = options.maxHealth;
      this.turn = 0;
      this.lastRoll = null;
      this.lastHit = null;
      this.gameOver = false;
    }

    rollDice(range = [0, 20]) {
      // 1/4 chance to roll 0
      if (Math.random() < 0.25) {
        return 0;
      }
      const rangeSize = range[1] - range[0];
      return Math.ceil(Math.random() * rangeSize) + range[0];
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
      if (selectedAction === "attack") {
        const roll = game.rollDice([0, 20]);
        game.lastRoll = roll;
        game.lastHit = roll;
        game.attack({ hp: roll, player: Number(!game.turn) });
      } else if (selectedAction === "heal") {
        const roll = game.rollDice([5, 15]);
        game.lastRoll = roll;
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
    <div class="winner-message upside-down">
      <h2>{winner} wins!</h2>
      <button on:click={resetGame}>Play Again</button>
    </div>
    <div class="winner-message">
      <h2>{winner} wins!</h2>
      <button on:click={resetGame}>Play Again</button>
    </div>
  {/if}

  <div class="game-ui">
    <PlayerView
      player={1}
      {game}
      {isRolling}
      {selectedAction}
      onActionSelect={selectAction}
      onDiceRoll={executeDiceAction}
      isUpsideDown={true}
    />

    <!-- Roll and Hit display (center) -->
    {#if game.lastRoll !== null}
      <div class="roll-hit-container upside-down">
        <div class="hit-display">
          HIT: {game.lastHit !== null ? game.lastHit : ""}
          {game.lastHit === 0 ? "☠️" : ""}
        </div>
        <div class="roll-display">ROLL: {game.lastRoll}</div>
      </div>
      <div class="roll-hit-container">
        <div class="hit-display">
          HIT: {game.lastHit !== null ? game.lastHit : ""}
          {game.lastHit === 0 ? "☠️" : ""}
        </div>
        <div class="roll-display">ROLL: {game.lastRoll}</div>
      </div>
    {/if}

    <PlayerView
      player={0}
      {game}
      {isRolling}
      {selectedAction}
      onActionSelect={selectAction}
      onDiceRoll={executeDiceAction}
    />

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

  .upside-down {
    transform: rotate(180deg);
  }

  .winner-message button {
    margin-top: 20px;
    padding: 10px 20px;
    border: 2px solid black;
    background-color: white;
    cursor: pointer;
  }
</style>
