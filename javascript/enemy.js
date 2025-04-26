class Enemy {
    constructor(x, y, row, type = "red") {
        this.x = x;
        this.y = y;
        this.row = row;
        this.width = 40;
        this.height = 40;
        this.type = type;
    }

    move(direction, speed) {
        this.x += direction * speed;
    }

    draw(ctx) {
        ctx.drawImage(enemyImg, this.x, this.y, this.width, this.height);
    }
}