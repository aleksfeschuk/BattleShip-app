export default class EventManager {
    constructor(playerDisplay, computerDisplay, battleLogic) {
        this.playerDisplay = playerDisplay;
        this.computerDisplay = computerDisplay;
        this.battleLogic = battleLogic;
        this.placeShipsBtn = document.querySelector('#placeShips');
        this.startGameBtn = document.querySelector('#startGame');
        this.restartGameBtn = document.querySelector('#restartGame');

        this.setupComputerGridClicks();
        this.setupRestartButton();
    }

    setupListeners() {
        this.placeShipsBtn.addEventListener('click', () => {
            this.battleLogic.initialize();
            this.playerDisplay.updateGrid(true);
            this.computerDisplay.updateGrid(false);
        });

        this.startGameBtn.addEventListener('click', () => {
            this.battleLogic.startGame();
            this.playerDisplay.updateGrid(true);
            this.computerDisplay.updateGrid(false);
        });
    }


    setupComputerGridClicks() {
        const cells = this.computerDisplay.gridElement.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                if (!this.battleLogic.gameActive || this.battleLogic.currentTurn !== 'player') return;
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                const playerResult = this.battleLogic.playerTurn(row, col);
                if (playerResult) {
                    this.computerDisplay.markAttack(playerResult.row, playerResult.col, playerResult.hit);
                    this.computerDisplay.updateGrid(false);
                    const winner = this.battleLogic.checkWinner();
                    if (winner) {
                        setTimeout(() =>
                            this.battleLogic.endGame(winner), 500);
                            setTimeout(() => {
                                this.playerDisplay.clearGrid();
                                this.computerDisplay.clearGrid();
                                this.battleLogic.restartGame();
                                this.playerDisplay.updateGrid(true);
                                this.computerDisplay.updateGrid(false);
                                this.setupComputerGridClicks();
                            }, 1000)
                        return;
                    }
                    setTimeout(() => {
                        const compResult = this.battleLogic.computerTurn();
                        if (compResult) {
                            this.playerDisplay.markAttack(compResult.row, compResult.col, compResult.hit);
                            this.playerDisplay.updateGrid(true);
                            const winner = this.battleLogic.checkWinner();
                            if (winner) {
                                setTimeout(() => this.battleLogic.endGame(winner), 500);
                                    setTimeout(() => {
                                        this.playerDisplay.clearGrid();
                                        this.computerDisplay.clearGrid();
                                        this.battleLogic.restartGame();
                                        this.playerDisplay.updateGrid(true);
                                        this.computerDisplay.updateGrid(false);
                                        this.setupComputerGridClicks();
                                    }, 1000)
                            }
                        } else {
                            console.log('Computer turn failed');
                        }
                    }, 1000);
                } else {
                    console.log('Player turn failed')
                }
            });
        });
    }


    setupRestartButton() {
        if (this.restartGameBtn) {
            this.restartGameBtn.addEventListener('click', () => {
                this.battleLogic.restartGame();
                this.playerDisplay.clearGrid();
                this.computerDisplay.clearGrid();
                this.playerDisplay.updateGrid(true);
                this.computerDisplay.updateGrid(false);
            });
        } else {
            this.restartGameBtn = document.createElement('button');
            this.restartGameBtn.id = 'restartGame';
            this.restartGameBtn.textContent = 'Restart Game';
            this.restartGameBtn.className = 'button restart';
            document.querySelector('.buttons').appendChild(this.restartGameBtn);
            this.restartGameBtn.addEventListener('click', () => {
                this.battleLogic.restartGame();
                this.playerDisplay.clearGrid();
                this.computerDisplay.clearGrid();
                this.playerDisplay.updateGrid(true);
                this.computerDisplay.updateGrid(false);
            })
        }
    }
}