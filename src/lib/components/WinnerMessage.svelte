<script>
  export let game;
  export let winner;
  export let onPlayAgain;

  // Calculate graph dimensions and scaling
  $: maxScore = Math.max(
    ...game.scoreHistory.player1,
    ...game.scoreHistory.player2,
  );
  $: minScore = Math.min(
    ...game.scoreHistory.player1,
    ...game.scoreHistory.player2,
  );
  $: scoreRange = maxScore - minScore;
  $: graphHeight = 100;
  $: graphWidth = 200;
  $: scaleY = scoreRange > 0 ? graphHeight / scoreRange : 1;
  $: scaleX = graphWidth / Math.max(game.scoreHistory.player1.length, 1);

  function getY(score) {
    return graphHeight - (score - minScore) * scaleY;
  }
</script>

<div class="winner-message">
  <div class="game-over-container">
    <div class="left-section">
      <h2 class="game-over">GAME OVER</h2>
      <h2 class="winner">{winner} WINS!</h2>
      <button class="play-again" on:click={onPlayAgain}>PLAY AGAIN</button>
    </div>
    <div class="right-section">
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
      <div class="score-graph">
        <svg width={graphWidth} height={graphHeight}>
          <!-- X and Y axes -->
          <line
            x1="0"
            y1={graphHeight}
            x2={graphWidth}
            y2={graphHeight}
            stroke="black"
          />
          <line x1="0" y1="0" x2="0" y2={graphHeight} stroke="black" />

          <!-- Player 1 line -->
          {#each game.scoreHistory.player1 as score, i}
            {#if i > 0}
              <line
                x1={(i - 1) * scaleX}
                y1={getY(game.scoreHistory.player1[i - 1])}
                x2={i * scaleX}
                y2={getY(score)}
                stroke="red"
                stroke-width="2"
              />
            {/if}
          {/each}

          <!-- Player 2 line -->
          {#each game.scoreHistory.player2 as score, i}
            {#if i > 0}
              <line
                x1={(i - 1) * scaleX}
                y1={getY(game.scoreHistory.player2[i - 1])}
                x2={i * scaleX}
                y2={getY(score)}
                stroke="blue"
                stroke-width="2"
              />
            {/if}
          {/each}
        </svg>
        <div class="graph-labels">
          <span class="p1-label">P1 Score</span>
          <span class="p2-label">P2 Score</span>
        </div>
      </div>
    </div>
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
    display: flex;
    gap: 20px;
    max-width: 600px;
    width: 100%;
    transform: rotate(-90deg);
    transform-origin: center;
  }

  .left-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 200px;
  }

  .right-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
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

  .score-graph {
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.05);
  }

  .graph-labels {
    display: flex;
    justify-content: space-around;
    margin-top: 5px;
    font-size: 12px;
  }

  .p1-label {
    color: red;
  }

  .p2-label {
    color: blue;
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
    margin-top: 20px;
  }

  .play-again:hover {
    background: #ff0;
    color: #000;
    box-shadow: 0 0 10px #ff0;
  }
</style>
