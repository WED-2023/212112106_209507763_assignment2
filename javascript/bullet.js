class Bullet {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
    }

    move(direction) {
        this.y += this.speed * direction;
    }

    draw(ctx, color = "magenta") {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 6, 0, 2 * Math.PI);
        ctx.fill();
    }
}