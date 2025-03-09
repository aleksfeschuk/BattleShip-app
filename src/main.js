import { GameDisplay } from "./modules/display.js";
import { BattleLogic } from "./modules/gameLogic.js";
import { EventManager } from "./modules/eventsHandlers.js";
import { Player } from "./modules/player.js";

const playerGrid = document.querySelector('.player-grid');
const computerGrid = document.querySelector('.computer-grid');

const player = new Player('Player');
const computer = new Player('Computer', true);

const playerDisplay = new GameDisplay(playerGrid, player.board);
const computerDisplay = new GameDisplay(computerGrid, computer.board);

playerDisplay.createGrid();
computerDisplay.createGrid();

const battleLogic = new BattleLogic(player, computer);
const eventManager = new EventManager(playerDisplay, computerDisplay, battleLogic);
eventManager.setupListeners();