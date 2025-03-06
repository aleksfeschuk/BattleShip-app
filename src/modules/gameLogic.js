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
        this.potentialTargets = [];
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
        this.potentialTargets = [];
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

       
        while (this.potentialTargets.length > 0) {
            [row, col] = this.potentialTargets.shift();
            if (this.isValidTarget(row, col)) {
                const target = this.player.board.getCell(row, col);
                if (target instanceof Ship) {
                    target.hit(row, col);
                    this.computerLastHit = { row, col };
                    this.computerHits.push([row, col]);
                    this.addAdjacentCells(row, col);
                    if (target.isSunk()) {
                        this.resetTracking();
                    }
                } else {
                    this.computerDirection = null; 
                }
                this.currentTurn = 'player';
                return { row, col, hit: target instanceof Ship };
            }
        }

        
        if (this.computerLastHit && this.computerHits.length > 0) {
            const lastRow = this.computerLastHit.row;
            const lastCol = this.computerLastHit.col;
            
           
            if (!this.computerDirection && this.computerHits.length >= 2) {
                const [firstRow, firstCol] = this.computerHits[0];
                const [secondRow, secondCol] = this.computerHits[1];
                if (firstRow === secondRow) this.computerDirection = 'horizontal';
                else if (firstCol === secondCol) this.computerDirection = 'vertical';
            }

            
            if (this.computerDirection) {
                const directionOptions = this.computerDirection === 'horizontal'
                    ? [[0, 1], [0, -1]]
                    : [[1, 0], [-1, 0]];
                
                for (const [dr, dc] of directionOptions) {
                    row = lastRow + dr;
                    col = lastCol + dc;
                    if (this.isValidTarget(row, col)) {
                        const target = this.player.board.getCell(row, col);
                        if (target instanceof Ship) {
                            this.hit(row, col)
                            this.computerLastHit = { row, col };
                            this.computerHits.push([row, col]);
                            this.addAdjacentCells(row, col);
                            if (target.isSunk()) {
                                this.resetTracking();
                            }
                        } else {
                            this.computerDirection = this.reverseDirection(this.computerDirection);
                        }
                        this.currentTurn = 'player';
                        return { row, col, hit: target instanceof Ship };
                    }
                }
                
                this.computerDirection = null;

            }  

            this.addAdjacentCells(lastRow, lastCol);
                if (this.potentialTargets.length > 0) {
                    return this.computerTurn();
                }
            }

        
            let attempts = 0;
            const maxAttempts = 100;
            do {
                row = Math.floor(Math.random() * 10);
                col = Math.floor(Math.random() * 10);
                if (this.isValidTarget(row, col)) {
                    const target = this.player.board.getCell(row, col);
                    if (target instanceof Ship) {
                        target.hit(row, col);
                        this.computerLastHit = { row, col };
                        this.computerHits = [[row, col]];
                        this.addAdjacentCells(row, col);
                    }
                    this.currentTurn = 'player';
                    return { row, col, hit: target instanceof Ship };
                }
                attempts++;
            } while (attempts < maxAttempts);

            return null;
    }

    
    isValidTarget(row, col) {
        return row >= 0 && row < 10 && col >= 0 && col < 10 && 
               (!this.player.board.getCell(row, col) || 
                this.player.board.getCell(row, col).hits === 0);
    }

    addAdjacentCells(row, col) {
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (this.isValidTarget(newRow, newCol) && 
                !this.potentialTargets.some(([r, c]) => r === newRow && c === newCol)) {
                this.potentialTargets.push([newRow, newCol]);
            }
        }
    }

    reverseDirection(direction) {
        return direction === 'horizontal' ? 'vertical' : 'horizontal';
    }

    resetTracking() {
        this.computerLastHit = null;
        this.computerHits = [];
        this.computerDirection = null;
        this.potentialTargets = [];
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
