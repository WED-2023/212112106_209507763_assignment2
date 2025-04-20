class Player {
    constructor(x, y, width = 100, height = 100, speed = 5, color = "blue") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;
    }
    move(keys, canvas) {
        if (keys["ArrowLeft"] && this.x > 0) this.x -= this.speed;
        if (keys["ArrowRight"] && this.x < canvas.width - this.width) this.x += this.speed;
        if (keys["ArrowUp"] && this.y > canvas.height * 0.6) this.y -= this.speed;
        if (keys["ArrowDown"] && this.y < canvas.height - this.height) this.y += this.speed;
    }

    draw(ctx, img) {
        ctx.drawImage(img, this.x, this.y, this.width, this.height);
    }

    shoot(bullets) {
        bullets.push({ x: this.x + this.width / 2, y: this.y, speed: 7 });
    }
}