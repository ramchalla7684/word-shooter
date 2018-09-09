class Word {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text.trim();

        this.isDestroyed = false;

        this.vX = (width / 2 - this.x) / 800;
        this.vY = (height / 2 - this.y) / 800;

        this.setBoundaries();
    }

    setBoundaries() {
        if (this.x < width / 2) {
            this.dirX = 1;
        }
        else {
            this.dirX = -1;
        }
        if (this.y < height / 2) {
            this.dirY = 1;
        }
        else {
            this.dirY = -1;
        }
    }

    move() {
        this.x += this.vX * deltaTime;
        this.y += this.vY * deltaTime;

        if (this.text === '') {
            this.isDestroyed = true;

            if (this === targetWord) {
                targetWord = undefined;
            }
            return;
        }

        let q1 = this.dirX == -1 && this.dirY == 1;
        let q2 = this.dirX == 1 && this.dirY == 1;
        let q3 = this.dirX == 1 && this.dirY == -1;
        let q4 = this.dirX == -1 && this.dirY == -1;

        let outOfBoundary = q1 && this.x < width / 2 + orbitRadius && this.y > height / 2 - orbitRadius;
        outOfBoundary = outOfBoundary || (q2 && this.x > width / 2 - orbitRadius && this.y > height / 2 - orbitRadius);
        outOfBoundary = outOfBoundary || (q3 && this.x > width / 2 - orbitRadius && this.y < height / 2 + orbitRadius);
        outOfBoundary = outOfBoundary || (q4 && this.x < width / 2 + orbitRadius && this.y < height / 2 + orbitRadius);

        if (outOfBoundary) {
            if (this === targetWord) {
                targetWord = undefined;
            }
            this.isDestroyed = true;
        }
    }

    draw() {

        let textWidth = context.measureText(this.text).width + 10;
        let textHeight = 15 + 10;

        context.beginPath();
        context.rect(this.x - textWidth / 2, this.y - textHeight / 2, textWidth, textHeight);
        context.fillStyle = 'rgba(127, 127, 127, 1)';
        context.fill();
        context.strokeStyle = 'rgba(192, 192, 192, 1)';
        context.stroke();

        if (this === targetWord) {
            context.fillStyle = 'rgba(255, 255, 0, 1)';
        }
        else {
            context.fillStyle = 'rgba(255, 255, 255, 1)';
        }
        context.font = '15px helvetica';
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.fillText(this.text, this.x, this.y);
    }
}