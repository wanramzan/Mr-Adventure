const CONFIG = { canvasWidth: 1280, canvasHeight: 720, gravity: 0.6 };
const GameState = { MENU: 'menu', PLAYING: 'playing', PAUSED: 'paused' };

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = CONFIG.canvasWidth;
        this.canvas.height = CONFIG.canvasHeight;
        
        this.state = GameState.MENU;
        this.player = null;
        this.enemies = [];
        this.platforms = [];
        this.collectibles = [];
        this.camera = { x: 0, y: 0 };
        this.keys = {};
        this.crystals = 0;
        this.currentLevel = 1;
        
        this.init();
    }
    
    init() {
        this.setupEvents();
        this.loop(0);
    }
    
    setupEvents() {
        window.addEventListener('keydown', e => {
            this.keys[e.code] = true;
            if (e.code === 'Escape' && this.state === GameState.PLAYING) this.togglePause();
            if (e.code === 'KeyF' && this.state === GameState.PLAYING) this.player?.attack();
            if (e.code === 'Space' && this.state === GameState.PLAYING) { e.preventDefault(); this.player?.jump(); }
        });
        window.addEventListener('keyup', e => this.keys[e.code] = false);
        
        document.getElementById('btn-start').addEventListener('click', () => this.startGame());
        document.getElementById('btn-manual').addEventListener('click', () => this.showScreen('manual-screen'));
        document.getElementById('btn-back-menu').addEventListener('click', () => this.showScreen('main-menu'));
        document.getElementById('btn-resume').addEventListener('click', () => this.togglePause());
        document.getElementById('btn-quit').addEventListener('click', () => this.showScreen('main-menu'));
        document.getElementById('dialog-next').addEventListener('click', () => this.nextDialog());
    }
    
    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        this.state = id === 'game-screen' ? GameState.PLAYING : GameState.MENU;
    }
    
    startGame() {
        this.showScreen('game-screen');
        this.loadLevel(1);
        this.showIntroDialog();
    }
    
    loadLevel(lvl) {
        this.enemies = []; this.platforms = []; this.collectibles = [];
        this.crystals = 0;
        Level1.load(this); // Load Level 1 data
        this.player = new Player(100, 500);
    }
    
    showIntroDialog() {
        this.dialogs = [
            { s: 'ORION', t: 'Selamat datang, penjelajah. Tahun 1920, dunia kehilangan Arkana Crystal.' },
            { s: 'ORION', t: 'Cari 5 Magic Leaves di hutan misteri ini. Gunakan WASD untuk bergerak, F untuk menyerang.' }
        ];
        this.dialogIdx = 0;
        this.updateDialog();
        document.getElementById('dialog-box').classList.remove('hidden');
    }
    
    nextDialog() {
        this.dialogIdx++;
        if (this.dialogIdx < this.dialogs.length) this.updateDialog();
        else document.getElementById('dialog-box').classList.add('hidden');
    }
    
    updateDialog() {
        document.getElementById('dialog-speaker').textContent = this.dialogs[this.dialogIdx].s;
        document.getElementById('dialog-text').textContent = this.dialogs[this.dialogIdx].t;
    }
    
    togglePause() {
        this.state = this.state === GameState.PLAYING ? GameState.PAUSED : GameState.PLAYING;
        document.getElementById('pause-menu').classList.toggle('hidden');
    }
    
    loop(timestamp) {
        if (this.state === GameState.PLAYING) {
            this.update();
            this.render();
        }
        requestAnimationFrame(t => this.loop(t));
    }
    
    update() {
        this.player.update(this.keys, this.platforms);
        this.camera.x = this.player.x - CONFIG.canvasWidth / 2;
        this.camera.x = Math.max(0, Math.min(this.camera.x, 3000 - CONFIG.canvasWidth));
        
        // Collision with enemies
        this.enemies.forEach(e => {
            e.update(this.player, this.platforms);
            if (this.checkCol(this.player, e)) {
                if (this.player.isAttacking) { e.health -= 20; if(e.health<=0) e.dead=true; }
                else { this.player.takeDamage(10); }
            }
        });
        this.enemies = this.enemies.filter(e => !e.dead);
        
        // Collectibles
        this.collectibles.forEach(c => {
            if (!c.collected && this.checkCol(this.player, c)) {
                c.collected = true;
                this.crystals++;
                document.getElementById('crystal-text').textContent = `${this.crystals}/5`;
            }
        });

        // HUD
        document.getElementById('hp-bar').style.width = `${this.player.health}%`;
        document.getElementById('energy-bar').style.width = `${this.player.energy}%`;
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Background
        this.ctx.fillStyle = '#2c1810';
        this.ctx.fillRect(this.camera.x, this.camera.y, CONFIG.canvasWidth, CONFIG.canvasHeight);
        
        this.platforms.forEach(p => {
            this.ctx.fillStyle = p.type === 'climbable' ? '#5c4033' : '#3d2817';
            this.ctx.fillRect(p.x, p.y, p.width, p.height);
        });
        
        this.collectibles.forEach(c => {
            if (!c.collected) {
                this.ctx.fillStyle = '#2ecc71';
                this.ctx.beginPath();
                this.ctx.arc(c.x + 15, c.y + 15, 10, 0, Math.PI*2);
                this.ctx.fill();
            }
        });
        
        this.enemies.forEach(e => e.render(this.ctx));
        this.player.render(this.ctx);
        
        // Film Grain Effect
        this.ctx.fillStyle = 'rgba(255,255,255,0.03)';
        for(let i=0; i<150; i++) {
            this.ctx.fillRect(Math.random()*CONFIG.canvasWidth + this.camera.x, Math.random()*CONFIG.canvasHeight + this.camera.y, 2, 2);
        }
        
        this.ctx.restore();
    }
    
    checkCol(a, b) {
        return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    }
}

window.onload = () => { window.game = new Game(); };
