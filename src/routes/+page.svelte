<script>
  import PlayerView from "$lib/components/PlayerView.svelte";
  import WinnerMessage from "$lib/components/WinnerMessage.svelte";

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
      this.scoreHistory = {
        player1: [],
        player2: [],
      };
      this.stats = {
        player1: {
          attacks: 0,
          heals: 0,
          totalDamage: 0,
          totalHealing: 0,
          specialAttackReady: false,
          usingSpecial: false,
          wins: 0,
        },
        player2: {
          attacks: 0,
          heals: 0,
          totalDamage: 0,
          totalHealing: 0,
          specialAttackReady: false,
          usingSpecial: false,
          wins: 0,
        },
      };
    }

    rollDice(range, chanceOfZero) {
      if (this.stats[`player${this.turn + 1}`].usingSpecial) {
        chanceOfZero = 0; // No chance of zero on special attacks
      }
      const roll =
        Math.random() < chanceOfZero
          ? 0
          : Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
      return roll;
    }

    logAction(action, player, value) {
      const timestamp = new Date().toLocaleTimeString();
      this.history.push({ timestamp, action, player, value });

      // Calculate and store current scores
      const p1Score =
        this.stats.player1.totalDamage - this.stats.player2.totalHealing;
      const p2Score =
        this.stats.player2.totalDamage - this.stats.player1.totalHealing;
      this.scoreHistory.player1.push(p1Score);
      this.scoreHistory.player2.push(p2Score);
    }

    attack({ hp, player }) {
      const damage = hp;
      this.players[player].hp -= damage;
      this.players[player].hp = Math.max(this.players[player].hp, 0);
      this.logAction("attack", Number(!player), damage);
      this.stats[`player${this.turn + 1}`].attacks++;
      this.stats[`player${this.turn + 1}`].totalDamage += damage;

      // Check for special attack activation (every 10 attacks)
      if (this.stats[`player${this.turn + 1}`].attacks % 10 === 0) {
        this.stats[`player${this.turn + 1}`].specialAttackReady = true;
      }

      this.checkGameOver();
    }

    heal({ hp, player }) {
      const healing = hp; // Use the passed in healing amount
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
        if (this.players[0].hp <= 0) {
          winner = "Player 2";
          this.stats.player2.wins++;
        } else if (this.players[1].hp <= 0) {
          winner = "Player 1";
          this.stats.player1.wins++;
        }
      }
    }

    toggleSpecialAttack() {
      if (this.stats[`player${this.turn + 1}`].specialAttackReady) {
        this.stats[`player${this.turn + 1}`].usingSpecial =
          !this.stats[`player${this.turn + 1}`].usingSpecial;
      }
    }
  }

  // Initialize game
  let game = new BattleGame();
  let showStats = false;
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
        let roll = game.rollDice([0, 20], 0.25);
        let secondRoll = 0;

        // Check for special attack
        if (game.stats[`player${game.turn + 1}`].usingSpecial) {
          const fiftyFifty = Math.random() < 0.5;
          if (!fiftyFifty) {
            roll = 0;
            secondRoll = 0;
            game.lastRoll = `Critical Miss!`;
          } else {
            secondRoll = game.rollDice([0, 20], 0);
            game.lastRoll = `${roll} + ${secondRoll}`;
            roll += secondRoll;
          }
          game.stats[`player${game.turn + 1}`].specialAttackReady = false;
          game.stats[`player${game.turn + 1}`].usingSpecial = false;
        } else {
          game.lastRoll = roll;
        }

        game.lastHit = roll;
        game.attack({ hp: roll, player: Number(!game.turn) });
      } else if (selectedAction === "heal") {
        let roll = game.rollDice([5, 15], 0);

        // Check for special attack
        if (game.stats[`player${game.turn + 1}`].usingSpecial) {
          roll += 25;
          game.lastRoll = `${roll - 25} + 25`;
          game.stats[`player${game.turn + 1}`].specialAttackReady = false;
          game.stats[`player${game.turn + 1}`].usingSpecial = false;
        } else {
          if (roll > 0) {
            game.lastRoll = roll;
          } else {
            game.lastRoll = `Miss!`;
          }
        }

        game.heal({ hp: roll, player: game.turn });
      }

      if (game.gameOver) {
        // Game over is already handled in checkGameOver
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
    // Preserve the win counts
    const player1Wins = game.stats.player1.wins;
    const player2Wins = game.stats.player2.wins;

    startingPlayer = Number(!startingPlayer); // Switch starting player
    game = new BattleGame();

    // Restore the win counts
    game.stats.player1.wins = player1Wins;
    game.stats.player2.wins = player2Wins;

    game.turn = startingPlayer; // Set the new starting player
    winner = null;
    selectedAction = "attack";
    showStats = false;
  }
</script>

<div class="root">
  <div class="game-container">
    {#if winner && showStats}
      <WinnerMessage {game} {winner} onPlayAgain={resetGame} />
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

      {#if game.gameOver}
        <button class="see-stats" on:click={() => (showStats = true)}>
          GAME OVER - SEE STATS
        </button>
      {/if}

      <PlayerView
        player={2}
        {game}
        {isRolling}
        {selectedAction}
        onActionSelect={selectAction}
        onDiceRoll={executeDiceAction}
      />
    </div>
  </div>
</div>

<style>
  .root {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
  }
  .game-container {
    font-family: "Courier New", monospace;
    max-width: 320px;
    margin: 0 auto;
    background-color: white;
    position: relative;
    padding: 10px;
    width: 100%;
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

  .see-stats {
    background: #000;
    color: #ff0;
    border: 2px solid #ff0;
    padding: 8px 16px;
    font-family: "Press Start 2P", monospace;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    margin: 10px auto;
    display: block;
  }

  .see-stats:hover {
    background: #ff0;
    color: #000;
    box-shadow: 0 0 10px #ff0;
  }
</style>
