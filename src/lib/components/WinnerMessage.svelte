<script>
  export let game;
  export let winner;
  export let onPlayAgain;
</script>

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
    <button class="play-again" on:click={onPlayAgain}>PLAY AGAIN</button>
  </div>
</div>

<style>
  .winner-message {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .game-over-container {
    background-color: white;
    border: 3px solid #ff0;
    padding: 20px;
    text-align: center;
    max-width: 300px;
    width: 100%;
    transform: rotate(-90deg);
    transform-origin: center;
  }

  .game-over {
    color: #f00;
    font-size: 24px;
    margin: 0;
    text-shadow: 2px 2px 0 #000;
  }

  .winner {
    color: #ff0;
    font-size: 20px;
    margin: 10px 0;
    text-shadow: 2px 2px 0 #000;
  }

  .stats-container {
    display: flex;
    justify-content: space-around;
    margin: 20px 0;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 10px;
  }

  .player-stats {
    text-align: left;
  }

  .player-stats h4 {
    color: #000;
    margin: 0 0 10px 0;
    font-size: 14px;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  .stat-label {
    color: #000;
    margin-right: 10px;
  }

  .stat-value {
    color: #000;
  }

  .play-again {
    background: #000;
    color: #ff0;
    border: 2px solid #ff0;
    padding: 8px 16px;
    font-family: "Press Start 2P", monospace;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
  }

  .play-again:hover {
    background: #ff0;
    color: #000;
    box-shadow: 0 0 10px #ff0;
  }
</style>
