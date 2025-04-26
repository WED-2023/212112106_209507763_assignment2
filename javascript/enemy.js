class Enemy {
    constructor(x, y, row, type = "red") {
        this.x = x;
        this.y = y;
        this.row = row;
        this.width = 60; //was 40*40 before
        this.height = 60;
        this.type = type;
    }

    move(direction, speed) {
        this.x += direction * speed;
    }

    draw(ctx) {
        ctx.drawImage(enemyImg, this.x, this.y, this.width, this.height);
    }
}