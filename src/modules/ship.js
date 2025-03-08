export class Ship {
    constructor(size) {
        this.size = size;
        this.hits = 0;
        this.positions = [];
        this.hitPositions = [];
    }

    setPosition(row, col, isHorizontal) {
        if (row < 0 || col < 0 || row >= 10 || col >= 10 || 
            (isHorizontal && col + this.size > 10) ||
            (isHorizontal && row + this.size > 10)) {
                throw new Error(`Invalid ship placement: row=${row}, col=${col}, size=${this.size}, horizontal=${isHorizontal}`); 
            }
            this.positions = [];
            for (let i = 0; i < this.size; i++) {
                const r = isHorizontal ? row : row + i;
                const c = isHorizontal ? col + i : col;
                this.positions.push([r, c]);
            }
    
    }


    hit(row, col) {
        const hitPosition = this.positions.some(([r, c]) => r === row && c === col);
        if (hitPosition) {
            const alreadyHit = this.hitPositions.some(([r, c]) => r === row && c === col);
            if (alreadyHit) {
                this.hitPositions.push([row, col]);
                this.hits++;
            }
        }
        return hitPosition;
    }

    isSunk() {
        return this.hits >= this.size;
    }
}