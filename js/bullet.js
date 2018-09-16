class Bullet {
    constructor(x, y, rotation, target) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.target = target;

        this.isDestroyed = false;

        this.vX = (this.x - width / 2);
        this.vY = (this.y - height / 2);
    }

    move() {
        this.x += this.vX * deltaTime;
        this.y += this.vY * deltaTime;

        if (this.x < -1 || this.x > width + 1 || this.y < -1 || this.y > height + 1) {
            this.isDestroyed = true;
        }
        else if (Math.pow(this.x - this.target.x, 2) + Math.pow(this.y - this.target.y, 2) < Math.pow(minDistance, 2)) {
            this.isDestroyed = true;

            if (this.target.text === '') {
                this.target.isDestroyed = true;
            }
        }
    }

    draw() {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        context.drawImage(bullet, 0, -bulletSize / 2, bulletSize, bulletSize);
        context.restore();
    }
}