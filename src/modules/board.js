import { Ship } from './ship.js';

export class Board {
    constructor() {
        this.grid = Array(10).fill().map(() => Array(10).fill(null));
        this.ships = [];
        this.shipSizes = [4, 3, 3, 2, 1];
    }

    canPlaceShip(row, col, size, isHorizontal) {
        for(let i = 0; i < size; i++) {
            const r = isHorizontal ? row : row + i;
            const c = isHorizontal ? col + i : col;
            if (r >= 10 || c >= 10 || this.grid[r][c] !== null) return false;
        }
        return true;
    }

    placeShip(size) {
        const ship = new Ship(size);
        let placed = false;
        while(!placed) {
            const isHorizontal = Math.random() > 0.5;
            const row = Math.floor(Math.random() * 10);
            const col = Math.floor(Math.random() * 10);
            if (this.canPlaceShip(row, col, size, isHorizontal)) {
                ship.setPosition(row, col, isHorizontal);
                ship.positions.forEach(([r, c]) => this.grid[r][c] = ship);
                this.ships.push(ship);
                placed = true;
            }
        }
    }

    placeAllShips() {
        this.shipSizes.forEach(size => this.placeShip(size));
    }

    getCell(row, col) {
        return this.grid[row][col];
    }
}