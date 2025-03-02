export class Ship {
    constructor(size) {
        this.size = size;
        this.hits = 0;
        this.positions = [];
    }

    setPosition(row, col, isHorizontal) {
        if (!Array.isArray(this.positions)) {
            this.positions = [];
        }
        this.positions.length = 0;
        for(let i = 0; i < this.size; i++) {
            const r = isHorizontal ? row : row + i;
            const c = isHorizontal ? col + i : col;
            this.positions.push([r, c]);
        }
    }

    hit(row, col) {
        const hitPosition = this.positions.some(([r, c]) => r === row && c === col);
        if (hitPosition) this.hits++;
        return hitPosition;
    }

    isSunk() {
        return this.hits >= this.size;
    }
}