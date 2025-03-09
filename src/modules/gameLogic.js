import { Ship } from './ship.js';

export class BattleLogic {
    constructor(player, computer) {
        this.player = player;
        this.computer = computer;
        this.gameActive = false;
        this.currentTurn = 'player';
        this.computerLastHit = null;
        this.computerHits = [];
        this.nextDirectionIndex = 0;
        
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
        this.nextDirectionIndex = 0;
    }

    playerTurn(row, col) { 
        if (!this.gameActive || this.currentTurn !== 'player') return null; 
        const target = this.computer.board.getCell(row, col); 
        if (target && target.hits > 0) return null; 
        if (target instanceof Ship) { 
            target.hit(row, col); 
        } 
        this.currentTurn = 'computer'; 
        return { 
            row, col, hit: target instanceof Ship 
        }; 
    }
    


    computerTurn() {
        if (!this.gameActive || this.currentTurn !== 'computer') return null;
    
        let row, col;
        
        
        if (this.computerLastHit) {
            const lastRow = this.computerLastHit.row;
            const lastCol = this.computerLastHit.col;
            const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    
            while (this.nextDirectionIndex < directions.length) {
                const [dr, dc] = directions[this.nextDirectionIndex];
                row = lastRow + dr;
                col = lastCol + dc;
                this.nextDirectionIndex++;
    
                if (row >= 0 && row < 10 && col >= 0 && col < 10) {
                    const target = this.player.board.getCell(row, col);
                    if (target && target.hits === 0) {
                        const hit = target instanceof Ship;
                        if (hit) {
                            this.computerLastHit = { row, col };
                            this.computerHits.push([row, col]);
                            if (target.isSunk()) {
                                this.computerLastHit = null;
                                this.computerHits = [];
                                this.nextDirectionIndex = 0;
                            }
                        }
                        this.currentTurn = 'player';
                        return { row, col, hit };
                    }
                }
            }
            
            this.nextDirectionIndex = 0;
            this.computerLastHit = null;
        }
    
       
        do {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
            const target = this.player.board.getCell(row, col);
            if (!target || target.hits === 0) break;
        } while (true);
    
        const target = this.player.board.getCell(row, col);
        const hit = target instanceof Ship;
        if (hit) {
            this.computerLastHit = { row, col };
            this.computerHits = [[row, col]];
        }
        this.currentTurn = 'player';
        return { row, col, hit };
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
        this.restartGame();
    }

    restartGame() {
        this.initialize();
        this.startGame();
    }
}


