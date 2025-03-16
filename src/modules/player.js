import  Board  from "./board.js";

export default class Player {
    constructor(name, isComputer = false) {
        this.name = name;
        this.isComputer = isComputer;
        this.board = new Board();
        this.enemyBoard = null;
    }

    setupShips() {
        this.board.placeAllShips();
    }

    setEnemyBoard(enemyBoard) {
        this.enemyBoard = enemyBoard;
    }

    // // Add code

    // checkWinner() {
    //     if (this.enemyBoard && this.enemyBoard.ships.every(ship => ship.isSunk())) {
    //         return `${this.name} wins`;
 }