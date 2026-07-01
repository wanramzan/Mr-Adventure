const Level1 = {
    load(game) {
        game.platforms = [
            { x: 0, y: 650, width: 3000, height: 100 },
            { x: 300, y: 550, width: 150, height: 20 },
            { x: 600, y: 450, width: 150, height: 20 },
            { x: 900, y: 350, width: 200, height: 20 },
            { x: 1800, y: 300, width: 40, height: 350, type: 'climbable' }
        ];
        game.enemies = [new Enemy(500, 590), new Enemy(1000, 590)];
        game.collectibles = [
            { x: 350, y: 500, width: 30, height: 30, collected: false },
            { x: 650, y: 400, width: 30, height: 30, collected: false },
            { x: 950, y: 300, width: 30, height: 30, collected: false },
            { x: 1220, y: 450, width: 30, height: 30, collected: false },
            { x: 1550, y: 350, width: 30, height: 30, collected: false }
        ];
    }
};
