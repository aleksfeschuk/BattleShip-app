import { Ship } from './ship.js';

export class Board {
    constructor(shipSizes = [5, 4, 3, 2, 2]) {
        this.grid = Array(10).fill().map(() => Array(10).fill(null));
        this.ships = [];
        this.shipSizes = shipSizes;
    }

    canPlaceShip(row, col, size, isHorizontal) {
        const buffer = 2;
        for(let i = 0; i < size; i++) {
            const r = isHorizontal ? row : row + i;
            const c = isHorizontal ? col + i : col;
            if (r >= 10 || c >= 10) return false;

            for(let dr = -buffer; dr <= buffer; dr++) {
                for(let dc = -buffer; dc <= buffer; dc++) {
                    const checkRow = r + dr;
                    const checkCol = c + dc;
                    if(checkRow >= 0 && checkRow < 10 &&
                       checkCol >= 0 && checkCol < 10 &&
                       this.grid[checkRow][checkCol] !== null 
                    ) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    placeShip(size) {
        const ship = new Ship(size);
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;
        while(!placed && attempts < maxAttempts) {
            const isHorizontal = Math.random() > 0.5;
            const row = Math.floor(Math.random() * 10);
            const col = Math.floor(Math.random() * 10);
            if (this.canPlaceShip(row, col, size, isHorizontal)) {
                ship.setPosition(row, col, isHorizontal);
                ship.positions.forEach(([r, c]) => this.grid[r][c] = ship);
                this.ships.push(ship);
                placed = true;
            }
            attempts++;
        }
        if (!placed) {
            throw new Error("Unable to place ship: not enough space");
        }
    }

    placeAllShips() {
        this.shipSizes.forEach(size => this.placeShip(size));
    }

    getCell(row, col) {
        return this.grid[row][col];
    }
}