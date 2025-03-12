import { Board } from './board.js';

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
    }

    initialize() {
        this.player.setupShips();
        this.computer.setupShips();
        this.player.setEnemyBoard(this.computer.board);
        this.computer.setEnemyBoard(this.player.board);
        this.gameState = 'setup';
        this.moveHistory = [];
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
            do {
                row = Math.floor(Math.random() * 10);
                col = Math.floor(Math.random() * 10);
                enemyCell = this.player.board.getCell(row, col);
            } while (enemyCell?.hitPositions?.some(([r, c]) => r === row && c === col));
        }

        enemyCell = this.player.board.getCell(row, col);
        const hit = enemyCell?.hit(row, col) || false;

        this.moveHistory.push({
            player: this.computer.name,
            row,
            col,
            hit,
            timestamp: Date.now()
        });

        if (hit) {
            this.scores.computer += 10;
            this.lastComputerHit = [row, col];
            this.updatePotentialTargets(row, col);
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

        this.potentialTargets.sort((a, b) => {
            return Math.random() - 0.5;
        })
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