import { Ship } from './ship.js';

export class BattleLogic {
    constructor(player, computer) {
        this.player = player;
        this.computer = computer;
        this.gameActive = false;
        this.currentTurn = 'player';
        this.computerLastHit = null; 
        this.computerHits = []; 
        this.computerDirection = null; 
    }

    initialize() {
        this.player.board.ships = [];
        this.player.board.grid = Array(10).fill().map(() => Array(10).fill(null));
        this.computer.board.ships = [];
        this.computer.board.grid = Array(10).fill().map(() => Array(10).fill(null));

        this.player.setupShips();
        this.computer.setupShips();
        this.player.setEnemyBoard(this.computer.board);
        this.computer.setEnemyBoard(this.player.board);
        this.gameActive = false;
        this.currentTurn = 'player';
        this.computerLastHit = null;
        this.computerHits = [];
        this.computerDirection = null;
    }

    playerTurn(row, col) {
        if (!this.gameActive || this.currentTurn !== 'player') return null;
        const target = this.computer.board.getCell(row, col);
        if (target && target.hits > 0 && target.isSunk()) return null;
        const wasAttacked = target && target.hits > 0;
        if (target instanceof Ship && !wasAttacked) {
            target.hit(row, col);
        }
        this.currentTurn = 'computer';
        return { row, col, hit: target instanceof Ship };
    }

    computerTurn() {
        if (!this.gameActive || this.currentTurn !== 'computer') return null;
        let row, col;

        
        if (this.computerLastHit) {
            const lastRow = this.computerLastHit.row;
            const lastCol = this.computerLastHit.col;
            const directions = [
                [0, 1], [0, -1], [1, 0], [-1, 0] 

            ];
            if (this.computerHits.length >= 2 && !this.computerDirection) {
                const [firstRow, firstCol] = this.computerHits[0];
                const [secondRow, secondCol] = this.computerHits[1];
                if (firstRow === secondRow) {
                    this.computerDirection = 'horizontal';
                } else if (firstCol === secondCol) {
                    this.computerDirection = 'vertical';
                }
            }

            
            if (this.computerDirection) {
                const directionOptions = this.computerDirection === 'horizontal'
                    ? [[0, 1], [0, -1]] 
                    : [[1, 0], [-1, 0]]; 
                for (const [dr, dc] of directionOptions) {
                    row = lastRow + dr;
                    col = lastCol + dc;
                    if (row >= 0 && row < 10 && col >= 0 && col < 10) {
                        const target = this.player.board.getCell(row, col);
                        if (target && target.hits === 0) {
                            target.hit(row, col);
                            if (target instanceof Ship) {
                                this.computerLastHit = { row, col };
                                this.computerHits.push([row, col]);
                                if (target.isSunk()) {
                                    this.computerLastHit = null;
                                    this.computerHits = [];
                                    this.computerDirection = null;
                                }
                            } else {
                                this.computerDirection = null; 
                            }
                            this.currentTurn = 'player';
                            return { row, col, hit: target instanceof Ship };
                        }
                    }
                }
                this.computerLastHit = null;
                this.computerHits = [];
                this.computerDirection = null;
            } else {
                
                for (const [dr, dc] of directions) {
                    row = lastRow + dr;
                    col = lastCol + dc;
                    if (row >= 0 && row < 10 && col >= 0 && col < 10) {
                        const target = this.player.board.getCell(row, col);
                        if (target && target.hits === 0) {
                            target.hit(row, col);
                            if (target instanceof Ship) {
                                this.computerLastHit = { row, col };
                                this.computerHits.push([row, col]);
                                if (target.isSunk()) {
                                    this.computerLastHit = null;
                                    this.computerHits = [];
                                }
                            }
                            this.currentTurn = 'player';
                            return { row, col, hit: target instanceof Ship };
                        }
                    }
                }
                this.computerLastHit = null;
                this.computerHits = [];
            }
        }

    
        let attempts = 0;
        const maxAttempts = 100;
        do {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
            const target = this.player.board.getCell(row, col);
            if (!target || target.hits === 0) break;
            attempts++;
            if (attempts >= maxAttempts) return null;
        } while (true);

        const target = this.player.board.getCell(row, col);
        if (target instanceof Ship) {
            target.hit(row, col);
            this.computerLastHit = { row, col };
            this.computerHits = [[row, col]];
        }
        this.currentTurn = 'player';
        return { row, col, hit: target instanceof Ship };
    }

    startGame() {
        this.gameActive = true;
        this.currentTurn = 'player';
    }

    checkWinner() {
        const computerSunk = this.computer.board.ships.every(ship => ship.isSunk());
        if (computerSunk) return 'player';

        const playerSunk = this.player.board.ships.every(ship => ship.isSunk());
        if (playerSunk) return 'computer';

        return null;
    }

    endGame(winner) {
        this.gameActive = false;
        alert(winner === 'player' ? 'You win!' : 'Computer wins!');
    }

    restartGame() {
        this.initialize();
        this.startGame();
    }
}