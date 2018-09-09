class Bullet {
    constructor(x, y, rotation) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;

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
        else if (Math.pow(this.x - targetWord.x, 2) + Math.pow(this.y - targetWord.y, 2) < Math.pow(minDistance, 2)) {
            this.isDestroyed = true;

            correctStrikes++;
            targetWord.text = targetWord.text.substring(1, targetWord.length);
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