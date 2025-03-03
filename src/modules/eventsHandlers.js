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
                if (!this.battleLogic.gameActive) return;
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                const playerResult = this.battleLogic.playerTurn(row, col);
                if (playerResult) {
                    this.computerDisplay.markAttack(playerResult.row, playerResult.col, playerResult.hit);

                    setTimeout(() => {
                        const compResult = this.battleLogic.computerTurn();
                        if (compResult) {
                            this.playerDisplay.markAttack(compResult.row, compResult.col, compResult.hit)
                        }    
                    }, 1000);
                }
            });
        });
    }

}