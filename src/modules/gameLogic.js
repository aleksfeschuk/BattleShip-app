// import { Board } from './board.js';

export class BattleLogic {
    constructor(player, computer) {
        this.player = player;
        this.computer = computer;
        this.gameState = 'setup';
        this.gameActive = false;
        this.currentTurn = null;
        this.moveHistory = [];
        this.scores = {
            player: 0,
            computer: 0
        };

        this.lastComputerHit = null;
        this.potentialTargets = [];

        //add code
        this.hitSequence = [];
        this.unhitCells = [];
    }

    initialize() {
        this.player.setupShips();
        this.computer.setupShips();
        this.player.setEnemyBoard(this.computer.board);
        this.computer.setEnemyBoard(this.player.board);
        this.gameState = 'setup';
        this.moveHistory = [];
        this.hitSequence = [];
        
        this.unhitCells = [];
        for (let r = 0; r < 10; r++) {
            for(let c = 0; c < 10; c++) {
                this.unhitCells.push([r, c]);
            }
        }
    }


    startGame() {
        if(!this.player.board.ships.length || !this.computer.board.ships.length) {
            this.initialize();
        }
        this.gameState = 'playing';
        this.gameActive = true;
        this.currentTurn = 'player';
    }

    playerTurn(row, col) {
        if (!this.gameActive || this.currentTurn !== 'player' || this.gameState !== 'playing') return null;

        const enemyCell = this.computer.board.getCell(row, col);
        const alreadyAttacked = enemyCell?.hitPositions?.some(([r, c]) => r === row && c === col);

        if (alreadyAttacked) return null;

        const hit = enemyCell?.hit(row, col) || false;
        this.moveHistory.push({
            player: this.player.name, 
            row,
            col,
            hit,
            timestamp: Date.now()
        });

        if (hit) this.scores.player += 10;

        this.currentTurn = 'computer';
        return { row, col, hit};

    }


    computerTurn() {
        if (!this.gameActive || this.currentTurn !== 'computer' || this.gameState !== 'playing' ) return null;

        let row, col, enemyCell;

        if (this.lastComputerHit && this.potentialTargets.length > 0) {
            const target = this.potentialTargets.shift();
            row = target[0];
            col = target[1];
        } else {
            const index = Math.floor(Math.random() * this.unhitCells.length);
            const target = this.unhitCells.splice(index, 1)[0];
            row = target[0];
            col = target[1];
        }   

        enemyCell = this.player.board.getCell(row, col);
        const hit = enemyCell?.hit(row, col) || false;

        if (hit) {
            this.scores.computer += 10;
            this.lastComputerHit = [row, col];
            // add
            this.hitSequence.push([row, col])
            this.moveHistory.push({
                player: this.computer.name,
                row,
                col,
                hit,
                timestamp: Date.now()
            });
            if (enemyCell?.isSunk()) {
                this.hitSequence = []; 
                console.log('Hit sequence:', this.hitSequence)
                this.lastComputerHit = null;
                this.potentialTargets = [];
            } else {
                this.updatePotentialTargets(row, col);
            }
        } else {
            if (!this.potentialTargets.length) {
                this.lastComputerHit = null;
            }
        }
        

        this.currentTurn = 'player';
        return { row, col, hit };

    }


    updatePotentialTargets(row, col) {
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];

        this.potentialTargets = [];
        let isHorizontal = false;
        let isVertical = false;
        let lastHit = null;
        let secondLastHit = null;
        //optimization AI
        if (this.hitSequence.length >= 2) {
            lastHit = this.hitSequence[this.hitSequence.length - 1];
            secondLastHit = this.hitSequence[this.hitSequence.length - 2];
            isHorizontal = lastHit[0] === secondLastHit[0];
            isVertical = lastHit[1] === secondLastHit[1];


            if (isHorizontal) {
                if (col - 1 >= 0) {
                    const cellLeft = this.player.board.getCell(row, col - 1);
                    const hitLeft = cellLeft?.hitPositions?.some(([r, c]) => r === row && c === col - 1);
                    if(!hitLeft) this.potentialTargets.push([row, col - 1]);
                } 
                if (col + 1 < 10) {
                    // Same checks for [row, col + 1]
                }
                console.log('Working?', this.potentialTargets);
            } 
            if (isVertical) {
                if(row - 1 >= 0) {
                    // Same checks for [row - 1, col]
                }
                if (row + 1 < 10) {
                    const cellDown = this.player.board.getCell(row + 1, col);
                    const hitDown = cellDown?.hitPositions?.some(([r, c]) => r === row + 1 && c === col);
                    if(!hitDown) this.potentialTargets.push([row + 1, col]);
                }
            }
            if (isHorizontal) {
                if (col + 1 < 10) {
                    const cellRight = this.player.board.getCell(row, col + 1);
                    const hitRight = cellRight?.hitPositions?.some(([r, c]) => r === row && c === col + 1);
                    if(!hitRight) this.potentialTargets.push([row, col + 1]);
                }
            }
            if (isVertical) {
                if (row - 1 >= 0) {
                    const cellUp = this.player.board.getCell(row - 1, col);
                    const hitUp = cellUp?.hitPositions.some(([r, c]) => r === row - 1 && c === col);
                    if (!hitUp) this.potentialTargets.push([row - 1, col]);
                }
            }
        } else {
            directions.forEach(([dr, dc]) => {
                const newRow = row + dr;
                const newCol = col + dc;
                if(newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
                    const cell = this.player.board.getCell(newRow, newCol);
                    const alreadyHit = cell?.hitPositions?.some(([r, c]) => r === newRow && c === newCol);
                    if (!alreadyHit) {
                        this.potentialTargets.push([newRow, newCol]);
                    }
                }
            });
        }
    }


    checkWinner() {
        if (this.computer.board.ships.every(ship => ship.isSunk())) {
            this.scores.player += 100;
            return this.player.name;
        }

        if (this.player.board.ships.every(ship => ship.isSunk())) {
            this.scores.computer += 100;
            return this.computer.name;
        }
        return null;
    }

    endGame(winner) {
        this.gameActive = false;
        this.currentTurn = null;
        this.gameState = 'finished';
        this.lastComputerHit = null;
        this.potentialTargets = [];
        alert(`${winner} wins!\nScores:\n${this.player.name}: ${this.scores.player}\n${this.computer.name}: ${this.scores.computer}`);
    }

    restartGame() {
        this.gameState = 'setup';
        this.gameActive = false;
        this.currentTurn = null;
        this.moveHistory = [];
        this.lastComputerHit = null;
        this.potentialTargets = [];
        this.player.board.reset();
        this.computer.board.reset();
        this.initialize();
    }

    getGameState() {
        return this.gameState;
    }

    getScores() {
        return { ...this.scores };
    }

    getMoveHistory() {
        return [...this.moveHistory];
    }
}