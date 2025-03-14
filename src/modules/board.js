import  Ship  from './ship.js';

export default class Board {
    constructor(shipSizes = [5, 4, 3, 2, 2]) {
        this.grid = Array(10).fill().map(() => Array(10).fill(null));
        this.ships = [];
        this.shipSizes = shipSizes;
        this.hits = 0;
        this.miss = 0;
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

    placeAllShips() {
        try {
            this.shipSizes.forEach(size => this.placeShip(size));
        } catch (error) {
            console.log('Clear board', error.message);
            this.reset();
            this.placeAllShips();
        }
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

    

    getCell(row, col) {
        return this.grid[row][col];
    }

    // reset method
    reset() { 
        this.grid.forEach(row => row.fill(null));
        this.ships = [];
        this.hits = 0;
        this.misses = 0;
    }
}