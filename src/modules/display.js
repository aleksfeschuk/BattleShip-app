import { Ship } from "./ship.js";

export class GameDisplay {
    constructor(gridElement, board) {
        this.gridElement = gridElement;
        this.board = board;
    }

    createGrid() {
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                this.gridElement.appendChild(cell);
            }
        }
    }

    updateGrid(showShips = false) {
        const cells = this.gridElement.querySelectorAll('.cell');
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            cell.classList.remove('ship', 'hit', 'miss');
            const cellContent = this.board.getCell(row, col);
            if (showShips && cellContent instanceof Ship) {
                cell.classList.add('ship');
            }
            if (cellContent?.hitPositions?.some(([r, c]) => r === row && c === col)) {
                cell.classList.add('hit');
            } else if (cell.dataset.attacked === 'true') { 
                cell.classList.add('miss');
            }
        });
    }

    markAttack(row, col, hit) {
        const cell = this.gridElement.querySelector(
            `.cell[data-row="${row}"][data-col="${col}"]`
        );
        cell.dataset.attacked = true;
        cell.classList.add(hit ? 'hit' : 'miss');
    }

    clearGrid() {
        const cells = this.gridElement.querySelectorAll('.cell'); 
        cells.forEach(cell => {
            cell.classList.remove('ship', 'hit', 'miss');
            delete cell.dataset.attacked;
        });
        if (this.board) {
            this.board.reset();
        }
    }
}