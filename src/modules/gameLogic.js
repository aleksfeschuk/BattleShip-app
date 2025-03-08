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
            const hit = target.hit(row, col);
            if (hit) {
                this.addAdjacentCells(row, col);
                return this.playerTurnContinue(row, col)
            }
        }
        this.currentTurn = 'computer';
        return { row, col, hit: target instanceof Ship && target.hit(row, col) };
    }


    playerTurnContinue(row, col) {
        while (this.potentialTargets.length > 0) {
            const [nextRow, nextCol] = this.potentialTargets.shift();
            if (this.isValidTarget(nextRow, nextCol, this.computer.board)) {
                const target = this.computer.board.getCell(nextRow, nextCol);
                if (target instanceof Ship) {
                    const hit = target.hit(nextRow, nextCol);
                    if (hit) {
                        this.addAdjacentCells(row, col);
                        if (target.isSunk()) {
                            this.potentialTargets = [];
                        }
                        return this.playerTurnContinue(nextRow, nextCol);
                    }
                } 
                this.currentTurn = 'computer';
                return { row: nextRow, col: nextCol, hit: false};
            }
        }
        this.currentTurn = 'computer';
        return { row, col, hit: this.computer.board.getCell(row, col) instanceof Ship}
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
                    return this.computerTurn();
                } else {
                    this.computerLastHit = null;
                    this.computerHits = [];
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
                    if (this.isValidTarget(row, col, this.player.board)) {
                        const target = this.player.board.getCell(row, col);
                        const hit = target.hit(row, col);
                        if (target instanceof Ship) {
                            this.computerLastHit = { row, col };
                            this.computerHits.push([row, col]);
                            this.addAdjacentCells(row, col);
                            if (target.isSunk()) {
                                this.resetTracking();
                            }
                            return this.computerTurn();
                        } else {
                            this.computerDirection = this.reverseDirection(this.computerDirection);
                            this.computerLastHit = null;
                            this.computerHits = [];
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
                if (this.isValidTarget(row, col, this.player.board)) {
                    const target = this.player.board.getCell(row, col);
                    const hit = target instanceof Ship ? target.hit(row, col) : false;
                    if (target instanceof Ship) {
                        this.computerLastHit = { row, col };
                        this.computerHits = [[row, col]];
                        this.addAdjacentCells(row, col);
                        return this.computerTurn();
                    }
                    this.currentTurn = 'player';
                    return { row, col, hit: false };
                }
                attempts++;
            } while (attempts < maxAttempts);

            return null;
    }

    
    isValidTarget(row, col, board) {
        const cell = board.getCell(row, col);
        const isValid = row >= 0 && row < 10 && col >= 0 && col < 10 &&
                       (!cell || (cell.hits === 0 && !cell.isSunk()));
        return isValid;
    }

    addAdjacentCells(row, col) {
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        const targetBoard = this.currentTurn === 'player' ? this.computer.board : this.player.board;
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
                if (this.isValidTarget(newRow, newCol, targetBoard) &&
                    !this.potentialTargets.some(([r, c]) => r === newRow && c === newCol)) {
                    this.potentialTargets.push([newRow, newCol]);
                }
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