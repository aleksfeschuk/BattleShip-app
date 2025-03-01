export class GameDisplay {
    constructor(gridElement) {
        this.gridElement = gridElement;
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

    updateCell(row, col, state) {
        const cells = this.gridElement.querySelectorAll('.cell');
        const cell = Array.from(cells).find(
            c => parseInt(c.dataset.row) === row && parseInt(c.dataset.col) === col
        );
        if (state === 'ship') cell.classList.add('ship');
    }

    clearGrid() {
        this.gridElement.querySelectorAll('.ship').forEach(
            cell => cell.classList.remove('ship'));
    }
}