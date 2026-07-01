class Enemy {
    constructor(x, y) {
        this.x = x; this.y = y; this.width = 40; this.height = 60;
        this.health = 50; this.speed = 2; this.vx = this.speed;
        this.startX = x; this.dead = false;
    }
    update(player, platforms) {
        const dist = Math.hypot(player.x - this.x, player.y - this.y);
        this.vx = dist < 300 ? (player.x > this.x ? this.speed*1.5 : -this.speed*1.5) : (this.x > this.startX + 150 ? -this.speed : this.speed);
        this.x += this.vx;
        this.y += 5;
        platforms.forEach(p => {
            if (this.x < p.x + p.width && this.x + this.width > p.x && this.y + this.height > p.y && this.y + this.height < p.y + 20) {
                this.y = p.y - this.height;
            }
        });
    }
    render(ctx) {
        ctx.fillStyle = '#1a0f0a'; ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#ff4444'; ctx.fillRect(this.x+10, this.y+15, 8, 8); ctx.fillRect(this.x+25, this.y+15, 8, 8);
    }
}
