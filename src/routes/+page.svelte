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
      this.history = [];
      this.stats = {
        player1: { attacks: 0, heals: 0, totalDamage: 0, totalHealing: 0 },
        player2: { attacks: 0, heals: 0, totalDamage: 0, totalHealing: 0 },
      };
    }

    rollDice(range = [0, 20], zeroChance = 0.25) {
      // 1/4 chance to roll 0
      if (Math.random() < zeroChance) {
        return 0;
      }
      const rangeSize = range[1] - range[0];
      return Math.ceil(Math.random() * rangeSize) + range[0];
    }

    logAction(action, player, value) {
      const timestamp = new Date().toLocaleTimeString();
      this.history.push({ timestamp, action, player, value });
    }

    attack({ hp, player }) {
      const damage = hp;
      this.players[player].hp -= damage;
      this.players[player].hp = Math.max(this.players[player].hp, 0);
      this.logAction("attack", Number(!player), damage);
      this.stats[`player${Number(!player) + 1}`].attacks++;
      this.stats[`player${Number(!player) + 1}`].totalDamage += damage;
      this.checkGameOver();
    }

    heal({ hp, player }) {
      const healing = hp;
      const oldHp = this.players[player].hp;
      this.players[player].hp += healing;
      this.players[player].hp = Math.min(
        this.players[player].hp,
        this.maxHealth,
      );
      const actualHealing = this.players[player].hp - oldHp;
      this.logAction("heal", player, actualHealing);
      this.stats[`player${player + 1}`].heals++;
      this.stats[`player${player + 1}`].totalHealing += actualHealing;
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
  let startingPlayer = 0; // Track who starts first

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
        const roll = game.rollDice([0, 20], 0.25);
        game.lastRoll = roll;
        game.lastHit = roll;
        game.attack({ hp: roll, player: Number(!game.turn) });
      } else if (selectedAction === "heal") {
        const roll = game.rollDice([5, 15], 0);
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
    startingPlayer = Number(!startingPlayer); // Switch starting player
    game = new BattleGame();
    game.turn = startingPlayer; // Set the new starting player
    winner = null;
    selectedAction = "attack";
  }
</script>

<div class="game-container">
  {#if winner}
    <div class="winner-message">
      <div class="upside-down">
        <h2 class="game-over">GAME OVER</h2>
        <h2 class="winner">{winner} WINS!</h2>
        <div class="game-stats">
          <div class="player-stats">
            <h4>PLAYER 1</h4>
            <div class="stat-row">
              <span class="stat-label">DAMAGE:</span>
              <span class="stat-value">{game.stats.player1.totalDamage}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">HEALING:</span>
              <span class="stat-value">{game.stats.player1.totalHealing}</span>
            </div>
          </div>
          <div class="player-stats">
            <h4>PLAYER 2</h4>
            <div class="stat-row">
              <span class="stat-label">DAMAGE:</span>
              <span class="stat-value">{game.stats.player2.totalDamage}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">HEALING:</span>
              <span class="stat-value">{game.stats.player2.totalHealing}</span>
            </div>
          </div>
        </div>
        <button class="play-again" on:click={resetGame}>PLAY AGAIN</button>
      </div>
      <h2 class="game-over">GAME OVER</h2>
      <h2 class="winner">{winner} WINS!</h2>
      <div class="game-stats">
        <div class="player-stats">
          <h4>PLAYER 1</h4>
          <div class="stat-row">
            <span class="stat-label">DAMAGE:</span>
            <span class="stat-value">{game.stats.player1.totalDamage}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">HEALING:</span>
            <span class="stat-value">{game.stats.player1.totalHealing}</span>
          </div>
        </div>
        <div class="player-stats">
          <h4>PLAYER 2</h4>
          <div class="stat-row">
            <span class="stat-label">DAMAGE:</span>
            <span class="stat-value">{game.stats.player2.totalDamage}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">HEALING:</span>
            <span class="stat-value">{game.stats.player2.totalHealing}</span>
          </div>
        </div>
      </div>
      <button class="play-again" on:click={resetGame}>PLAY AGAIN</button>
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

    <PlayerView
      player={0}
      {game}
      {isRolling}
      {selectedAction}
      onActionSelect={selectAction}
      onDiceRoll={executeDiceAction}
    />
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
    height: calc(100vh - 50px);
  }

  .winner-message {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    padding: 20px;
    color: #fff;
    text-shadow: 2px 2px 0 #000;
  }

  .game-over {
    font-size: 48px;
    color: #ff0000;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .winner {
    font-size: 36px;
    color: #ffff00;
    margin: 10px 0 30px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .game-stats {
    display: flex;
    gap: 40px;
    margin-bottom: 30px;
  }

  .player-stats {
    text-align: center;
    padding: 15px;
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid #fff;
    border-radius: 5px;
    min-width: 150px;
  }

  .player-stats h4 {
    margin: 0 0 15px;
    color: #00ff00;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    margin: 5px 0;
    font-size: 14px;
  }

  .stat-label {
    color: #aaa;
  }

  .stat-value {
    color: #fff;
    font-weight: bold;
  }

  .play-again {
    background: #ff0000;
    color: #fff;
    border: none;
    padding: 10px 20px;
    font-size: 18px;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
    transition: transform 0.2s;
  }

  .play-again:hover {
    transform: scale(1.1);
  }
</style>
