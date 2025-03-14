const { BattleLogic } = require('../modules/gameLogic.js');

describe('BattleLogic', () => {
    let game, player, computer;

    beforeEach(() => {
        // Mock board with reset method
        const mockBoard = {
            ships: [],
            getCell: jest.fn(),
            reset: jest.fn(), // Ensure reset is mocked
        };
        player = {
            name: 'Player',
            board: mockBoard,
            setupShips: jest.fn(),
            setEnemyBoard: jest.fn()
        };
        computer = {
            name: 'Computer',
            board: mockBoard,
            setupShips: jest.fn(),
            setEnemyBoard: jest.fn()
        };
        game = new BattleLogic(player, computer);
        game.initialize();
    });

    test('playerTurn should return null for invalid turn', () => {
        game.gameActive = false;
        expect(game.playerTurn(0, 0)).toBeNull();
    });

    test('playerTurn should return null if not player turn', () => {
        game.gameActive = true;
        game.currentTurn = 'computer';
        game.gameState = 'playing';
        expect(game.playerTurn(0, 0)).toBeNull();
    });

    test('playerTurn should return null if gameState is not playing', () => {
        game.gameActive = true;
        game.currentTurn = 'player';
        game.gameState = 'setup';
        expect(game.playerTurn(0, 0)).toBeNull();
    });

    test('playerTurn should return null if cell already attacked', () => {
        game.gameActive = true;
        game.currentTurn = 'player';
        game.gameState = 'playing';
        computer.board.getCell.mockReturnValue({
            hit: jest.fn().mockReturnValue(false),
            hitPositions: [[0, 0]]
        });
        const result = game.playerTurn(0, 0);
        expect(result).toBeNull();
    });

    test('playerTurn should return result with hit false on a miss', () => {
        game.gameActive = true;
        game.currentTurn = 'player';
        game.gameState = 'playing';
        computer.board.getCell.mockReturnValue(null);
        const result = game.playerTurn(0, 0);
        expect(result).toEqual({ row: 0, col: 0, hit: false });
        expect(game.currentTurn).toBe('computer');
    });

    test('playerTurn should return result when valid', () => {
        game.gameActive = true;
        game.currentTurn = 'player';
        game.gameState = 'playing';
        computer.board.getCell.mockReturnValue({
            hit: jest.fn().mockReturnValue(true),
            hitPositions: []
        });
        const result = game.playerTurn(0, 0);
        expect(result).toEqual({ row: 0, col: 0, hit: true });
    });

    test('playerTurn should update score on a hit', () => {
        game.gameActive = true;
        game.currentTurn = 'player';
        game.gameState = 'playing';
        computer.board.getCell.mockReturnValue({
            hit: jest.fn().mockReturnValue(true),
            hitPositions: []
        });
        game.playerTurn(0, 0);
        expect(game.getScores().player).toBe(10);
    });

    // test('computerTurn should return a random move when no previous hits', () => {
    //     game.gameActive = true;
    //     game.currentTurn = 'computer';
    //     game.gameState = 'playing';
    //     game.initialize();
    //     player.board.getCell.mockReturnValue({
    //         hit: jest.fn().mockReturnValue(false), // Simulate a miss
    //         hitPositions: []
    //     });
    //     const result = game.computerTurn();
    //     expect(result).toHaveProperty('row');
    //     expect(result).toHaveProperty('col');
    //     expect(result).toHaveProperty('hit', false); // Expect a miss
    //     expect(game.currentTurn).toBe('player');
    // });

    test('checkWinner should return player name when computer ships sunk', () => {
        computer.board.ships = [{ isSunk: jest.fn().mockReturnValue(true) }];
        expect(game.checkWinner()).toBe('Player');
    });

    test('checkWinner should return null when no winner', () => {
        computer.board.ships = [{ isSunk: jest.fn().mockReturnValue(false) }];
        player.board.ships = [{ isSunk: jest.fn().mockReturnValue(false) }];
        expect(game.checkWinner()).toBeNull();
    });

    test('startGame should initialize game state', () => {
        game.startGame();
        expect(game.gameState).toBe('playing');
        expect(game.gameActive).toBe(true);
        expect(game.currentTurn).toBe('player');
    });

    test('endGame should set game to finished state', () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        game.endGame('Player');
        expect(game.gameActive).toBe(false);
        expect(game.currentTurn).toBeNull();
        expect(game.gameState).toBe('finished');
        window.alert.mockRestore();
    });

    test('restartGame should reset the game state', () => {
        game.gameActive = true;
        game.currentTurn = 'player';
        game.gameState = 'playing';
        game.restartGame();
        expect(game.gameState).toBe('setup');
        expect(game.gameActive).toBe(false);
        expect(game.currentTurn).toBeNull();
    });

    test('getGameState should return current game state', () => {
        game.gameState = 'playing';
        expect(game.getGameState()).toBe('playing');
    });

    test('getScores should return a copy of scores', () => {
        game.scores.player = 50;
        game.scores.computer = 30;
        const scores = game.getScores();
        expect(scores).toEqual({ player: 50, computer: 30 });
        scores.player = 100;
        expect(game.getScores().player).toBe(50);
    });
});