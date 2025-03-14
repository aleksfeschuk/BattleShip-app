(()=>{"use strict";class t{constructor(t){this.size=t,this.hits=0,this.positions=[],this.hitPositions=[]}setPosition(t,e,s){if(t<0||e<0||t>=10||e>=10||s&&e+this.size>10||!s&&t+this.size>10)throw new Error(`Invalid ship placement: row=${t}, col=${e}, size=${this.size}, horizontal=${s}`);this.positions=[];for(let i=0;i<this.size;i++){const r=s?t:t+i,a=s?e+i:e;this.positions.push([r,a])}}hit(t,e){return!!this.positions.some((([s,i])=>s===t&&i===e))&&(!this.hitPositions.some((([s,i])=>s===t&&i===e))&&(this.hitPositions.push([t,e]),this.hits++,!0))}isSunk(){return this.hits>=this.size}}class e{constructor(t,e){this.gridElement=t,this.board=e}createGrid(){for(let t=0;t<10;t++)for(let e=0;e<10;e++){const s=document.createElement("div");s.classList.add("cell"),s.dataset.row=t,s.dataset.col=e,this.gridElement.appendChild(s)}}updateGrid(e=!1){this.gridElement.querySelectorAll(".cell").forEach((s=>{const i=parseInt(s.dataset.row),r=parseInt(s.dataset.col);s.classList.remove("ship","hit","miss");const a=this.board.getCell(i,r);e&&a instanceof t&&s.classList.add("ship"),a?.hitPositions?.some((([t,e])=>t===i&&e===r))?s.classList.add("hit"):"true"===s.dataset.attacked&&s.classList.add("miss")}))}markAttack(t,e,s){const i=this.gridElement.querySelector(`.cell[data-row="${t}"][data-col="${e}"]`);i.dataset.attacked=!0,i.classList.add(s?"hit":"miss")}clearGrid(){this.gridElement.querySelectorAll(".cell").forEach((t=>{t.classList.remove("ship","hit","miss"),delete t.dataset.attacked})),this.board&&this.board.reset()}}class s{constructor(t,e){this.player=t,this.computer=e,this.gameState="setup",this.gameActive=!1,this.currentTurn=null,this.moveHistory=[],this.scores={player:0,computer:0},this.lastComputerHit=null,this.potentialTargets=[],this.hitSequence=[],this.unhitCells=[]}initialize(){this.player.setupShips(),this.computer.setupShips(),this.player.setEnemyBoard(this.computer.board),this.computer.setEnemyBoard(this.player.board),this.gameState="setup",this.moveHistory=[],this.hitSequence=[],this.unhitCells=[];for(let t=0;t<10;t++)for(let e=0;e<10;e++)this.unhitCells.push([t,e])}startGame(){this.player.board.ships.length&&this.computer.board.ships.length||this.initialize(),this.gameState="playing",this.gameActive=!0,this.currentTurn="player"}playerTurn(t,e){if(!this.gameActive||"player"!==this.currentTurn||"playing"!==this.gameState)return null;const s=this.computer.board.getCell(t,e),i=s?.hitPositions?.some((([s,i])=>s===t&&i===e));if(i)return null;const r=s?.hit(t,e)||!1;return this.moveHistory.push({player:this.player.name,row:t,col:e,hit:r,timestamp:Date.now()}),r&&(this.scores.player+=10),this.currentTurn="computer",{row:t,col:e,hit:r}}computerTurn(){if(!this.gameActive||"computer"!==this.currentTurn||"playing"!==this.gameState)return null;let t,e,s;if(this.lastComputerHit&&this.potentialTargets.length>0){const s=this.potentialTargets.shift();t=s[0],e=s[1]}else{const s=Math.floor(Math.random()*this.unhitCells.length),i=this.unhitCells.splice(s,1)[0];t=i[0],e=i[1]}s=this.player.board.getCell(t,e);const i=s?.hit(t,e)||!1;return i?(this.scores.computer+=10,this.lastComputerHit=[t,e],this.hitSequence.push([t,e]),this.moveHistory.push({player:this.computer.name,row:t,col:e,hit:i,timestamp:Date.now()}),s?.isSunk()?(this.hitSequence=[],console.log("Hit sequence:",this.hitSequence),this.lastComputerHit=null,this.potentialTargets=[]):this.updatePotentialTargets(t,e)):this.potentialTargets.length||(this.lastComputerHit=null),this.currentTurn="player",{row:t,col:e,hit:i}}updatePotentialTargets(t,e){this.potentialTargets=[];let s=!1,i=!1,r=null,a=null;if(this.hitSequence.length>=2){if(r=this.hitSequence[this.hitSequence.length-1],a=this.hitSequence[this.hitSequence.length-2],s=r[0]===a[0],i=r[1]===a[1],s){if(e-1>=0){const s=this.player.board.getCell(t,e-1),i=s?.hitPositions?.some((([s,i])=>s===t&&i===e-1));i||this.potentialTargets.push([t,e-1])}console.log("Working?",this.potentialTargets)}if(i&&t+1<10){const s=this.player.board.getCell(t+1,e),i=s?.hitPositions?.some((([s,i])=>s===t+1&&i===e));i||this.potentialTargets.push([t+1,e])}if(s&&e+1<10){const s=this.player.board.getCell(t,e+1),i=s?.hitPositions?.some((([s,i])=>s===t&&i===e+1));i||this.potentialTargets.push([t,e+1])}if(i&&t-1>=0){const s=this.player.board.getCell(t-1,e),i=s?.hitPositions.some((([s,i])=>s===t-1&&i===e));i||this.potentialTargets.push([t-1,e])}}else[[-1,0],[1,0],[0,-1],[0,1]].forEach((([s,i])=>{const r=t+s,a=e+i;if(r>=0&&r<10&&a>=0&&a<10){const t=this.player.board.getCell(r,a),e=t?.hitPositions?.some((([t,e])=>t===r&&e===a));e||this.potentialTargets.push([r,a])}}))}checkWinner(){return this.computer.board.ships.every((t=>t.isSunk()))?(this.scores.player+=100,this.player.name):this.player.board.ships.every((t=>t.isSunk()))?(this.scores.computer+=100,this.computer.name):null}endGame(t){this.gameActive=!1,this.currentTurn=null,this.gameState="finished",this.lastComputerHit=null,this.potentialTargets=[],alert(`${t} wins!\nScores:\n${this.player.name}: ${this.scores.player}\n${this.computer.name}: ${this.scores.computer}`)}restartGame(){this.gameState="setup",this.gameActive=!1,this.currentTurn=null,this.moveHistory=[],this.lastComputerHit=null,this.potentialTargets=[],this.player.board.reset(),this.computer.board.reset(),this.initialize()}getGameState(){return this.gameState}getScores(){return{...this.scores}}getMoveHistory(){return[...this.moveHistory]}}class i{constructor(t,e,s){this.playerDisplay=t,this.computerDisplay=e,this.battleLogic=s,this.placeShipsBtn=document.querySelector("#placeShips"),this.startGameBtn=document.querySelector("#startGame"),this.restartGameBtn=document.querySelector("#restartGame"),this.setupComputerGridClicks(),this.setupRestartButton()}setupListeners(){this.placeShipsBtn.addEventListener("click",(()=>{this.battleLogic.initialize(),this.playerDisplay.updateGrid(!0),this.computerDisplay.updateGrid(!1)})),this.startGameBtn.addEventListener("click",(()=>{this.battleLogic.startGame(),this.playerDisplay.updateGrid(!0),this.computerDisplay.updateGrid(!1)}))}setupComputerGridClicks(){this.computerDisplay.gridElement.querySelectorAll(".cell").forEach((t=>{t.addEventListener("click",(()=>{if(!this.battleLogic.gameActive||"player"!==this.battleLogic.currentTurn)return;const e=parseInt(t.dataset.row),s=parseInt(t.dataset.col),i=this.battleLogic.playerTurn(e,s);if(i){this.computerDisplay.markAttack(i.row,i.col,i.hit),this.computerDisplay.updateGrid(!1);const t=this.battleLogic.checkWinner();if(t)return setTimeout((()=>this.battleLogic.endGame(t)),500),void setTimeout((()=>{this.playerDisplay.clearGrid(),this.computerDisplay.clearGrid(),this.battleLogic.restartGame(),this.playerDisplay.updateGrid(!0),this.computerDisplay.updateGrid(!1),this.setupComputerGridClicks()}),1e3);setTimeout((()=>{const t=this.battleLogic.computerTurn();if(t){this.playerDisplay.markAttack(t.row,t.col,t.hit),this.playerDisplay.updateGrid(!0);const e=this.battleLogic.checkWinner();e&&(setTimeout((()=>this.battleLogic.endGame(e)),500),setTimeout((()=>{this.playerDisplay.clearGrid(),this.computerDisplay.clearGrid(),this.battleLogic.restartGame(),this.playerDisplay.updateGrid(!0),this.computerDisplay.updateGrid(!1),this.setupComputerGridClicks()}),1e3))}else console.log("Computer turn failed")}),1e3)}else console.log("Player turn failed")}))}))}setupRestartButton(){this.restartGameBtn||(this.restartGameBtn=document.createElement("button"),this.restartGameBtn.id="restartGame",this.restartGameBtn.textContent="Restart Game",this.restartGameBtn.className="button restart",document.querySelector(".buttons").appendChild(this.restartGameBtn)),this.restartGameBtn.addEventListener("click",(()=>{this.battleLogic.restartGame(),this.playerDisplay.clearGrid(),this.computerDisplay.clearGrid(),this.playerDisplay.updateGrid(!0),this.computerDisplay.updateGrid(!1)}))}}class r{constructor(t=[5,4,3,2,2]){this.grid=Array(10).fill().map((()=>Array(10).fill(null))),this.ships=[],this.shipSizes=t,this.hits=0,this.miss=0}canPlaceShip(t,e,s,i){for(let r=0;r<s;r++){const s=i?t:t+r,a=i?e+r:e;if(s>=10||a>=10)return!1;for(let t=-2;t<=2;t++)for(let e=-2;e<=2;e++){const i=s+t,r=a+e;if(i>=0&&i<10&&r>=0&&r<10&&null!==this.grid[i][r])return!1}}return!0}placeAllShips(){try{this.shipSizes.forEach((t=>this.placeShip(t)))}catch(t){console.log("Clear board",t.message),this.reset(),this.placeAllShips()}}placeShip(e){const s=new t(e);let i=!1,r=0;for(;!i&&r<100;){const t=Math.random()>.5,a=Math.floor(10*Math.random()),o=Math.floor(10*Math.random());this.canPlaceShip(a,o,e,t)&&(s.setPosition(a,o,t),s.positions.forEach((([t,e])=>this.grid[t][e]=s)),this.ships.push(s),i=!0),r++}if(!i)throw new Error("Unable to place ship: not enough space")}getCell(t,e){return this.grid[t][e]}reset(){this.grid.forEach((t=>t.fill(null))),this.ships=[],this.hits=0,this.misses=0}}class a{constructor(t,e=!1){this.name=t,this.isComputer=e,this.board=new r,this.enemyBoard=null}setupShips(){this.board.placeAllShips()}setEnemyBoard(t){this.enemyBoard=t}}document.addEventListener("DOMContentLoaded",(()=>{const t=document.querySelector(".player-grid"),r=document.querySelector(".computer-grid"),o=new a("Player"),h=new a("Computer",!0),l=new e(t,o.board),n=new e(r,h.board);l.createGrid(),n.createGrid();const c=new s(o,h),p=new i(l,n,c);try{p.setupListeners()}catch(t){console.log(t)}}))})();
//# sourceMappingURL=bundle.js.map