export class EventManager {
    constructor(playerDisplay, computerDisplay, battleLogic) {
        this.playerDisplay = playerDisplay;
        this.computerDisplay = computerDisplay;
        this.battleLogic = battleLogic;
        this.placeShipsBtn = document.querySelector('#placeShips');
        this.startGameBtn = document.querySelector('#startGame');
    }

    setupListeners() {
        this.placeShipsBtn.addEventListener('click', () => {
            this.battleLogic.initialize();
            this.playerDisplay.updateGrid(true);
            this.computerDisplay.updateGrid(false);
        });

        this.startGameBtn.addEventListener('click', () => {
            this.playerDisplay.updateGrid(true);
            this.computerDisplay.updateGrid(false);
            this.setupComputerGridClicks();
        });
    }

    setupComputerGridClicks() {
        const cells = this.computerDisplay.gridElement.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                const result = this.battleLogic.playerTurn(row, col);
                if (result) {
                    this.computerDisplay.markAttack(result.row, result.col, result.hit);

                    setTimeout(() => {
                        const compResult = this.battleLogic.computerTurn();
                        this.playerDisplay.markAttack(compResult.row, compResult.col, compResult.hit)
                    }, 1000);
                }
            })
        });
    }

}