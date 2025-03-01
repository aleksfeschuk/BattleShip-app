export class EventManager {
    constructor(playerDisplay, computerDisplay, playerLogic, computerLogic) {
        this.playerDisplay = playerDisplay;
        this.computerDisplay = computerDisplay;
        this.playerLogic = playerLogic;
        this.computerLogic = computerLogic;
        this.placeShipsBtn = document.querySelector('#placeShips');
        this.startGameBtn = document.querySelector('#startGame');
    }

    setupListeners() {
        this.placeShipsBtn.addEventListener('click', () => {
            this.playerDisplay.clearGrid();
            this.computerDisplay.clearGrid();
            this.playerLogic.placeAllShips();
            this.computerLogic.placeAllShips();
        });

        this.startGameBtn.addEventListener('click', () => {
            console.log('Game started!');
        });
    }

}