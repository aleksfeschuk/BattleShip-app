import { Ship } from "./ship.js";

export class BattleLogic {
    constructor(player, computer) {
        this.player = player;
        this.computer = computer;
        this.gameActive = false;
        this.currentTurn = 'player';
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
    }

    computerTurn() {
        if(!this.gameActive || this.currentTurn !== 'computer') return null;
        let row, col;
        do {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
        } while (this.player.board.getCell(row, col)?.hit)
        const target = this.player.board.getCell(row, col);
        if (target instanceof Ship) {
            target.hit(row, col)
        }
        this.currentTurn = 'player';
        return { row, col, hit: !!target };
    } 

    playerTurn(row, col) {
        if (!this.gameActive || this.currentTurn !== 'player') return null;
        const target = this.computer.board.getCell(row, col);
        if (target?.hit) return null;
        if (target instanceof Ship) {
            target.hit(row, col);
        }
        this.currentTurn = 'computer';
        return { row, col, hit: !!target};
    }

    startGame() {
        this.gameActive = true;
        this.currentTurn = 'player';
    }
}