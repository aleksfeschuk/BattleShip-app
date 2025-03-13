const { BattleLogic } = require('../modules/gameLogic.js')


describe('BattleLogic', () => {
    test('playerTurn should return null for invalid turn', () => {
        const mockGetCell = jest.fn().mockReturnValue({
            hit: jest.fn().mockReturnValue(false),
            hitPositions: []
        });
        const player = { 
            name: 'Player', 
            board: { ships: [], getCell: mockGetCell}, 
            setupShips: () => {}, 
            setEnemyBoard: () => {} };
        const computer = { 
            name: 'Computer', 
            board: { ships: [], getCell: mockGetCell}, 
            setupShips: () => {}, 
            setEnemyBoard: () => {} };
        const game = new BattleLogic(player, computer);
        game.gameActive = false;
        const result = game.playerTurn(0, 0);
        expect(result).toEqual({row: 0, col: 0, hit: true});
    });
});