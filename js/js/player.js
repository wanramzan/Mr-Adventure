class Player {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.width = 40; this.height = 80;
        this.vx = 0; this.vy = 0;
        this.speed = 5; this.jumpPower = -12;
        this.health = 100; this.energy = 100;
        this.grounded = false; this.facingRight = true;
        this.isAttacking = false; this.isCrouching = false;
        this.attackCooldown = 0;
    }

    update(keys, platforms) {
        // Movement
        if (keys['KeyA'] || keys['ArrowLeft']) { this.vx = -this.speed; this.facingRight = false; }
        else if (keys['KeyD'] || keys['ArrowRight']) { this.vx = this.speed; this.facingRight = true; }
        else this.vx *= 0.8;

        // Crouch
        if ((keys['KeyS'] || keys['ArrowDown']) && this.grounded) {
            this.isCrouching = true; this.height = 45; this.y += 35;
        } else if (this.isCrouching) {
            this.isCrouching = false; this.height = 80; this.y -= 35;
        }

        // Climb
        if ((keys['KeyW'] || keys['ArrowUp']) && this.isNearClimbable(platforms)) {
            this.vy = -4; // Panjat
        } else {
            this.vy += CONFIG.gravity; // Gravity
        }

        this.x += this.vx; this.y += this.vy;

        // Platform Collision
        this.grounded = false;
        platforms.forEach(p => {
            if (this.x < p.x + p.width && this.x + this.width > p.x &&
                this.y + this.height > p.y && this.y + this.height < p.y + 20 && this.vy >= 0) {
                this.y = p.y - this.height; this.vy = 0; this.grounded = true;
            }
        });

        if (this.attackCooldown > 0) this.attackCooldown--;
        if (this.attackCooldown === 0) this.isAttacking = false;
        if (this.energy < 100) this.energy += 0.2;
    }

    isNearClimbable(platforms) {
        return platforms.some(p => p.type === 'climbable' && Math.abs(this.x - p.x) < 50);
    }

    jump() {
        if (this.grounded && !this.isCrouching) { this.vy = this.jumpPower; this.grounded = false; this.energy -= 5; }
    }

    attack() {
        if (this.attackCooldown === 0 && this.energy >= 10) {
            this.isAttacking = true; this.attackCooldown = 20; this.energy -= 10;
        }
    }

    takeDamage(amt) { this.health = Math.max(0, this.health - amt); }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height);
        if (!this.facingRight) ctx.scale(-1, 1);
        ctx.translate(-this.width/2, -this.height);

        // Lukis Watak Realistik 1920s (Jaket Kulit, Goggles, Turtleneck)
        const w = this.width, h = this.height;
        
        // Kaki & But
        ctx.fillStyle = '#2a1810'; ctx.fillRect(w*0.2, h*0.6, w*0.25, h*0.4); ctx.fillRect(w*0.55, h*0.6, w*0.25, h*0.4);
        ctx.fillStyle = '#1a0f0a'; ctx.fillRect(w*0.15, h*0.9, w*0.35, h*0.1); ctx.fillRect(w*0.5, h*0.9, w*0.35, h*0.1);
        
        // Jaket Kulit
        ctx.fillStyle = '#4a2c1a'; ctx.fillRect(w*0.1, h*0.3, w*0.8, h*0.35);
        ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(w*0.5, h*0.3); ctx.lineTo(w*0.5, h*0.65); ctx.stroke();
        
        // Turtleneck Cream
        ctx.fillStyle = '#e8dcc5'; ctx.fillRect(w*0.3, h*0.2, w*0.4, h*0.15);
        
        // Kepala & Rambut
        ctx.fillStyle = '#e0ac82'; ctx.beginPath(); ctx.ellipse(w*0.5, h*0.12, w*0.25, h*0.12, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#8b6914'; ctx.beginPath(); ctx.ellipse(w*0.5, h*0.08, w*0.28, h*0.1, 0, Math.PI, Math.PI*2); ctx.fill();
        
        // Goggles Tembaga
        ctx.fillStyle = '#d4af37'; ctx.fillRect(w*0.25, h*0.02, w*0.5, h*0.06);
        ctx.fillStyle = '#87ceeb'; ctx.beginPath(); ctx.arc(w*0.35, h*0.05, 6, 0, Math.PI*2); ctx.arc(w*0.65, h*0.05, 6, 0, Math.PI*2); ctx.fill();

        // Attack Effect
        if (this.isAttacking) {
            ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';
            ctx.beginPath(); ctx.arc(w + 20, h/2, 30, 0, Math.PI*2); ctx.fill();
        }

        ctx.restore();
    }
}
