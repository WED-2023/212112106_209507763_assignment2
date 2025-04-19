class Enemy {
    constructor(x, y, row) {
        this.x = x;
        this.y = y;
        this.row = row;
        this.width = 40;
        this.height = 40;
    }

    move(direction, speed) {
        this.x += direction * speed;
    }

    draw(ctx, color) {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}