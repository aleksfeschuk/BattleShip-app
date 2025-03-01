export class GameLogic {
    constructor(gridElement) {
        this.gridElement = gridElement;
        this.shipSizes = [4, 3, 3, 2, 1];
    }

    canPlaceShip(row, col, size, isHorizontal) {
        const cells = this.gridElement.querySelectorAll('.cell');
        for (let i = 0; i < size; i++) {
            const r = isHorizontal ? row : row + i;
            const c = isHorizontal ? col + i : col;
            if (r >= 10 || c >= 10) return false;
            const cell = Array.from(cells).find(
                c => parseInt(c.dataset.row) === r && parseInt(c.dataset.col) === c
            );
            if (cell.classList.contains('ship')) return false;
        }
        return true;
    }

    placeShip(size) {
        let placed = false;
        while (!placed) {
            const isHorizontal = Math.random() > 0.5;
            const row = Math.floor(Math.random() * 10);

            if (this.canPlaceShip(row, col, size, isHorizontal)) {
                const cells = this.gridElement.querySelectorAll('.cell');
                for(let i = 0; i < size; i++) {
                    const r = isHorizontal ? row : row + i;
                    const c = isHorizontal ? col + i : col;
                    const cell = Array.from(cells).find(
                        c => parseInt(c.dataset.row) ===  r && parseInt(c.dataset.col) === c
                    );
                    cell.classList.add('ship'); 
                }
                placed = true;
            }
        }
    }
    placeAllShips() {
        this.shipSizes.forEach(size => this.placeShip(size));
    }
}