/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/board.js":
/*!******************************!*\
  !*** ./src/modules/board.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Board: () => (/* binding */ Board)
/* harmony export */ });
/* harmony import */ var _ship_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship.js */ "./src/modules/ship.js");


class Board {
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
        const ship = new _ship_js__WEBPACK_IMPORTED_MODULE_0__.Ship(size);
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

/***/ }),

/***/ "./src/modules/display.js":
/*!********************************!*\
  !*** ./src/modules/display.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GameDisplay: () => (/* binding */ GameDisplay)
/* harmony export */ });
/* harmony import */ var _ship_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship.js */ "./src/modules/ship.js");


class GameDisplay {
    constructor(gridElement, board) {
        this.gridElement = gridElement;
        this.board = board;
    }

    createGrid() {
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                this.gridElement.appendChild(cell);
            }
        }
    }

    updateGrid(showShips = false) {
        const cells = this.gridElement.querySelectorAll('.cell');
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            cell.classList.remove('ship', 'hit', 'miss');
            const cellContent = this.board.getCell(row, col);
            if (showShips && cellContent instanceof _ship_js__WEBPACK_IMPORTED_MODULE_0__.Ship) {
                cell.classList.add('ship');
            }
            if (cellContent?.hitPositions?.some(([r, c]) => r === row && c === col)) {
                cell.classList.add('hit');
            } else if (cell.dataset.attacked === 'true') { 
                cell.classList.add('miss');
            }
        });
    }

    markAttack(row, col, hit) {
        const cell = this.gridElement.querySelector(
            `.cell[data-row="${row}"][data-col="${col}"]`
        );
        cell.dataset.attacked = true;
        cell.classList.add(hit ? 'hit' : 'miss');
    }

    clearGrid() {
        const cells = this.gridElement.querySelectorAll('.cell'); 
        cells.forEach(cell => {
            cell.classList.remove('ship', 'hit', 'miss');
            delete cell.dataset.attacked;
        });
        if (this.board) {
            this.board.reset();
        }
    }
}

/***/ }),

/***/ "./src/modules/eventsHandlers.js":
/*!***************************************!*\
  !*** ./src/modules/eventsHandlers.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventManager: () => (/* binding */ EventManager)
/* harmony export */ });
class EventManager {
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

/***/ }),

/***/ "./src/modules/gameLogic.js":
/*!**********************************!*\
  !*** ./src/modules/gameLogic.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BattleLogic: () => (/* binding */ BattleLogic)
/* harmony export */ });
// import { Board } from './board.js';

class BattleLogic {
    constructor(player, computer) {
        this.player = player;
        this.computer = computer;
        this.gameState = 'setup';
        this.gameActive = false;
        this.currentTurn = null;
        this.moveHistory = [];
        this.scores = {
            player: 0,
            computer: 0
        };

        this.lastComputerHit = null;
        this.potentialTargets = [];

        //add code
        this.hitSequence = [];
        this.unhitCells = [];
    }

    initialize() {
        this.player.setupShips();
        this.computer.setupShips();
        this.player.setEnemyBoard(this.computer.board);
        this.computer.setEnemyBoard(this.player.board);
        this.gameState = 'setup';
        this.moveHistory = [];
        this.hitSequence = [];
        
        this.unhitCells = [];
        for (let r = 0; r < 10; r++) {
            for(let c = 0; c < 10; c++) {
                this.unhitCells.push([r, c]);
            }
        }
    }


    startGame() {
        if(!this.player.board.ships.length || !this.computer.board.ships.length) {
            this.initialize();
        }
        this.gameState = 'playing';
        this.gameActive = true;
        this.currentTurn = 'player';
    }

    playerTurn(row, col) {
        if (!this.gameActive || this.currentTurn !== 'player' || this.gameState !== 'playing') return null;

        const enemyCell = this.computer.board.getCell(row, col);
        const alreadyAttacked = enemyCell?.hitPositions?.some(([r, c]) => r === row && c === col);

        if (alreadyAttacked) return null;

        const hit = enemyCell?.hit(row, col) || false;
        this.moveHistory.push({
            player: this.player.name, 
            row,
            col,
            hit,
            timestamp: Date.now()
        });

        if (hit) this.scores.player += 10;

        this.currentTurn = 'computer';
        return { row, col, hit};

    }


    computerTurn() {
        if (!this.gameActive || this.currentTurn !== 'computer' || this.gameState !== 'playing' ) return null;

        let row, col, enemyCell;

        if (this.lastComputerHit && this.potentialTargets.length > 0) {
            const target = this.potentialTargets.shift();
            row = target[0];
            col = target[1];
        } else {
            const index = Math.floor(Math.random() * this.unhitCells.length);
            const target = this.unhitCells.splice(index, 1)[0];
            row = target[0];
            col = target[1];
        }   

        enemyCell = this.player.board.getCell(row, col);
        const hit = enemyCell?.hit(row, col) || false;

        if (hit) {
            this.scores.computer += 10;
            this.lastComputerHit = [row, col];
            // add
            this.hitSequence.push([row, col])
            this.moveHistory.push({
                player: this.computer.name,
                row,
                col,
                hit,
                timestamp: Date.now()
            });
            if (enemyCell?.isSunk()) {
                this.hitSequence = []; 
                console.log('Hit sequence:', this.hitSequence)
                this.lastComputerHit = null;
                this.potentialTargets = [];
            } else {
                this.updatePotentialTargets(row, col);
            }
        } else {
            if (!this.potentialTargets.length) {
                this.lastComputerHit = null;
            }
        }
        

        this.currentTurn = 'player';
        return { row, col, hit };

    }


    updatePotentialTargets(row, col) {
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];

        this.potentialTargets = [];
        let isHorizontal = false;
        let isVertical = false;
        let lastHit = null;
        let secondLastHit = null;
        //optimization AI
        if (this.hitSequence.length >= 2) {
            lastHit = this.hitSequence[this.hitSequence.length - 1];
            secondLastHit = this.hitSequence[this.hitSequence.length - 2];
            isHorizontal = lastHit[0] === secondLastHit[0];
            isVertical = lastHit[1] === secondLastHit[1];


            if (isHorizontal) {
                if (col - 1 >= 0) {
                    const cellLeft = this.player.board.getCell(row, col - 1);
                    const hitLeft = cellLeft?.hitPositions?.some(([r, c]) => r === row && c === col - 1);
                    if(!hitLeft) this.potentialTargets.push([row, col - 1]);
                } 
                if (col + 1 < 10) {
                    // Same checks for [row, col + 1]
                }
                console.log('Working?', this.potentialTargets);
            } 
            if (isVertical) {
                if(row - 1 >= 0) {
                    // Same checks for [row - 1, col]
                }
                if (row + 1 < 10) {
                    const cellDown = this.player.board.getCell(row + 1, col);
                    const hitDown = cellDown?.hitPositions?.some(([r, c]) => r === row + 1 && c === col);
                    if(!hitDown) this.potentialTargets.push([row + 1, col]);
                }
            }
            if (isHorizontal) {
                if (col + 1 < 10) {
                    const cellRight = this.player.board.getCell(row, col + 1);
                    const hitRight = cellRight?.hitPositions?.some(([r, c]) => r === row && c === col + 1);
                    if(!hitRight) this.potentialTargets.push([row, col + 1]);
                }
            }
            if (isVertical) {
                if (row - 1 >= 0) {
                    const cellUp = this.player.board.getCell(row - 1, col);
                    const hitUp = cellUp?.hitPositions.some(([r, c]) => r === row - 1 && c === col);
                    if (!hitUp) this.potentialTargets.push([row - 1, col]);
                }
            }
        } else {
            directions.forEach(([dr, dc]) => {
                const newRow = row + dr;
                const newCol = col + dc;
                if(newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
                    const cell = this.player.board.getCell(newRow, newCol);
                    const alreadyHit = cell?.hitPositions?.some(([r, c]) => r === newRow && c === newCol);
                    if (!alreadyHit) {
                        this.potentialTargets.push([newRow, newCol]);
                    }
                }
            });
        }
    }


    checkWinner() {
        if (this.computer.board.ships.every(ship => ship.isSunk())) {
            this.scores.player += 100;
            return this.player.name;
        }

        if (this.player.board.ships.every(ship => ship.isSunk())) {
            this.scores.computer += 100;
            return this.computer.name;
        }
        return null;
    }

    endGame(winner) {
        this.gameActive = false;
        this.currentTurn = null;
        this.gameState = 'finished';
        this.lastComputerHit = null;
        this.potentialTargets = [];
        alert(`${winner} wins!\nScores:\n${this.player.name}: ${this.scores.player}\n${this.computer.name}: ${this.scores.computer}`);
    }

    restartGame() {
        this.gameState = 'setup';
        this.gameActive = false;
        this.currentTurn = null;
        this.moveHistory = [];
        this.lastComputerHit = null;
        this.potentialTargets = [];
        this.player.board.reset();
        this.computer.board.reset();
        this.initialize();
    }

    getGameState() {
        return this.gameState;
    }

    getScores() {
        return { ...this.scores };
    }

    getMoveHistory() {
        return [...this.moveHistory];
    }
}

/***/ }),

/***/ "./src/modules/player.js":
/*!*******************************!*\
  !*** ./src/modules/player.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Player: () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _board_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./board.js */ "./src/modules/board.js");


class Player {
    constructor(name, isComputer = false) {
        this.name = name;
        this.isComputer = isComputer;
        this.board = new _board_js__WEBPACK_IMPORTED_MODULE_0__.Board();
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
    //     }
    //     return null;
    // }
 }

/***/ }),

/***/ "./src/modules/ship.js":
/*!*****************************!*\
  !*** ./src/modules/ship.js ***!
  \*****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ship: () => (/* binding */ Ship)
/* harmony export */ });
class Ship {
    constructor(size) {
        this.size = size;
        this.hits = 0;
        this.positions = [];
        this.hitPositions = [];
    }

    setPosition(row, col, isHorizontal) {
        if (row < 0 || col < 0 || row >= 10 || col >= 10 || 
            (isHorizontal && col + this.size > 10) || 
            (!isHorizontal && row + this.size > 10)) {
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
                return false;
            } else {
                this.hitPositions.push([row, col]);
                this.hits++;
                return true;
            }
        } 
        return false;
    }

    isSunk() {
        return this.hits >= this.size;
    }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_display_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/display.js */ "./src/modules/display.js");
/* harmony import */ var _modules_gameLogic_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/gameLogic.js */ "./src/modules/gameLogic.js");
/* harmony import */ var _modules_eventsHandlers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/eventsHandlers.js */ "./src/modules/eventsHandlers.js");
/* harmony import */ var _modules_player_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/player.js */ "./src/modules/player.js");






document.addEventListener('DOMContentLoaded', () => {
    const playerGrid = document.querySelector('.player-grid');
    const computerGrid = document.querySelector('.computer-grid');

    const player = new _modules_player_js__WEBPACK_IMPORTED_MODULE_3__.Player('Player');
    const computer = new _modules_player_js__WEBPACK_IMPORTED_MODULE_3__.Player('Computer', true);

    const playerDisplay = new _modules_display_js__WEBPACK_IMPORTED_MODULE_0__.GameDisplay(playerGrid, player.board);
    const computerDisplay = new _modules_display_js__WEBPACK_IMPORTED_MODULE_0__.GameDisplay(computerGrid, computer.board);

    playerDisplay.createGrid();
    computerDisplay.createGrid();

    const battleLogic = new _modules_gameLogic_js__WEBPACK_IMPORTED_MODULE_1__.BattleLogic(player, computer);
    const eventManager = new _modules_eventsHandlers_js__WEBPACK_IMPORTED_MODULE_2__.EventManager(playerDisplay, computerDisplay, battleLogic);


    
    try {
        eventManager.setupListeners();
    } catch (error) {
        console.log(error);
    }
});



})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map