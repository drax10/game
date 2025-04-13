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
      <div class="game-over-container">
        <h2 class="game-over">GAME OVER</h2>
        <h2 class="winner">{winner} WINS!</h2>
        <div class="stats-container">
          <div class="player-stats">
            <h4>P1</h4>
            <div class="stat-row">
              <span class="stat-label">DMG:</span>
              <span class="stat-value">{game.stats.player1.totalDamage}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">HL:</span>
              <span class="stat-value">{game.stats.player1.totalHealing}</span>
            </div>
          </div>
          <div class="player-stats">
            <h4>P2</h4>
            <div class="stat-row">
              <span class="stat-label">DMG:</span>
              <span class="stat-value">{game.stats.player2.totalDamage}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">HL:</span>
              <span class="stat-value">{game.stats.player2.totalHealing}</span>
            </div>
          </div>
        </div>
        <button class="play-again" on:click={resetGame}>PLAY AGAIN</button>
      </div>
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
    height: calc(100vh - 100px);
  }

  .winner-message {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .game-over-container {
    background: #000;
    border: 4px solid #fff;
    padding: 20px;
    text-align: center;
    transform: rotate(-90deg);
    transform-origin: center;
    width: 300px;
  }

  .game-over {
    font-family: "Press Start 2P", monospace;
    font-size: 24px;
    color: #ff0000;
    margin: 0;
    text-transform: uppercase;
  }

  .winner {
    font-family: "Press Start 2P", monospace;
    font-size: 20px;
    color: #ffff00;
    margin: 10px 0 20px;
    text-transform: uppercase;
  }

  .stats-container {
    display: flex;
    justify-content: space-around;
    margin: 20px 0;
  }

  .player-stats {
    text-align: center;
    padding: 10px;
    background: #111;
    border: 2px solid #fff;
  }

  .player-stats h4 {
    margin: 0 0 10px;
    color: #0f0;
    font-family: "Press Start 2P", monospace;
    font-size: 14px;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    margin: 5px 0;
    font-family: "Press Start 2P", monospace;
    font-size: 12px;
    color: #fff;
  }

  .stat-label {
    color: #aaa;
  }

  .stat-value {
    color: #fff;
    margin-left: 10px;
  }

  .play-again {
    background: #000;
    color: #fff;
    border: 2px solid #fff;
    padding: 8px 16px;
    font-family: "Press Start 2P", monospace;
    font-size: 12px;
    cursor: pointer;
    margin-top: 10px;
  }

  .play-again:hover {
    background: #fff;
    color: #000;
  }
</style>
