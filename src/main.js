import { GameDisplay } from "./modules/display.js";
import { GameLogic } from "./modules/gameLogic.js";
import { EventManager } from "./modules/eventsHandlers.js";


// Find the grids
const playerGrid = document.querySelector('.player-grid');
const computerGrid = document.querySelector('.computer-grid');

// Create class instances
const playerDisplay = new GameDisplay(playerGrid);
const computerDisplay = new GameDisplay(computerGrid);
const playerLogic = new GameLogic(playerGrid);
const computerLogic = new GameLogic(computerGrid);

// Initialize the meshes

playerDisplay.createGrid();
computerDisplay.createGrid();

// Setting up event handlers

const eventManager = new EventManager(playerDisplay, computerDisplay, playerLogic, computerLogic);
eventManager.setupListeners();