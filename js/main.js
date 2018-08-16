let width = 1080;
let height = width * 9 / 16;

let spaceshipSize = 40;
let bulletSize = 75;
let orbitRadius = 20;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const accuracy = document.getElementById('accuracy');

const background = new Image();
const spaceship = new Image();
const bullet = new Image();

let deltaTime = 1;
let rotation = 0;
let currentKey = '';

let bullets = [];
let words = [];
let W = [];
let wStart = 0;

let targetWord;

let totalStrikes = 0;
let correctStrikes = 0;

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        currentKey = event.key;
    }
    else if (event.key >= 'a' && event.key <= 'z') {
        totalStrikes++;
        shoot(event.key);

        accuracy.innerText = ((correctStrikes / totalStrikes) * 100).toFixed(1) + '%';
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === currentKey) {
        currentKey = '';
    }
});

class Bullet {
    constructor(x, y, rotation) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;

        this.isDestroyed = false;

        this.vX = (this.x - width / 2) / 2;
        this.vY = (this.y - height / 2) / 2;
    }

    move() {
        this.x += this.vX * deltaTime;
        this.y += this.vY * deltaTime;

        if (this.x < -1 || this.x > width + 1 || this.y < -1 || this.y > height + 1) {
            this.isDestroyed = true;
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

function drawBullets() {
    for (let i = 0; i < bullets.length;) {
        bullets[i].move();
        bullets[i].draw();

        if (bullets[i].isDestroyed) {
            bullets.splice(i, 1);
        }
        else {
            i++;
        }
    }
}

function drawWords() {
    for (let i = 0; i < words.length;) {

        words[i].move();
        if (words[i] !== targetWord) {
            words[i].draw();
        }

        if (words[i].isDestroyed) {
            words.splice(i, 1);
        }
        else {
            i++;
        }
    }

    if (targetWord) {
        targetWord.draw();
    }
}

function addWords() {

    setInterval(() => {
        for (let i = wStart; i < (wStart + 1) % W.length; i++) {

            let r = Math.random();
            let x, y;
            if (r < 0.25) {
                x = width;
                y = Math.random() * height;
            }
            else if (r <= 0.5) {
                x = Math.random() * width;
                y = height;
            }
            else if (r <= 0.75) {
                x = 0;
                y = Math.random() * height;
            }
            else {
                x = Math.random() * width;
                y = 0;
            }

            words.push(new Word(x, y, W[i]));
        }

        wStart = (wStart + 1) % W.length;
    }, 2000);
}

function shoot(key) {
    if (!targetWord) {
        for (let i = 0; i < words.length; i++) {
            if (words[i].text[0] === key) {
                targetWord = words[i];
                break;
            }
        }
    }

    if (targetWord) {
        if (targetWord.text[0] === key) {
            correctStrikes++;
            targetWord.text = targetWord.text.substring(1, targetWord.length);

            rotation = Math.atan2(targetWord.y - height / 2, targetWord.x - width / 2);
            bullets.push(new Bullet(width / 2 + orbitRadius * Math.cos(rotation), height / 2 + orbitRadius * Math.sin(rotation), rotation));
        }
    }
}

function setup() {
    canvas.width = width;
    canvas.height = height;

    background.src = '../word-shooter/sprites/background.png';
    spaceship.src = '../word-shooter/sprites/ship.png';
    bullet.src = '../word-shooter/sprites/bullet.png';

    fetch('../word-shooter/words.txt')
        .then(response => {
            if (!response.ok) {

                throw Error(response.statusText);
            }
            return response.text()
                .then(text => {
                    W = text.split('\n');
                    addWords();
                });

        })
        .catch(error => {
            console.log(error);
        });

    window.requestAnimationFrame(draw);
}

function draw() {
    context.clearRect(0, 0, width, height);

    context.drawImage(background, 0, 0, width, height);

    context.beginPath();
    context.arc(width / 2, height / 2, orbitRadius, 0, Math.PI * 2, false);
    context.strokeStyle = 'rgba(200, 200, 200, 0.5)';
    context.lineWidth = 1.5;
    context.stroke();

    context.save();
    context.translate(width / 2, height / 2);
    if (currentKey == 'ArrowLeft') {
        rotation -= 0.05;
    }
    else if (currentKey == 'ArrowRight') {
        rotation += 0.05;
    }

    if (rotation > Math.PI * 2 || rotation < -Math.PI * 2) {
        rotation = 0;
    }
    context.rotate(rotation);
    context.drawImage(spaceship, -spaceshipSize / 2 + orbitRadius, -spaceshipSize / 2, spaceshipSize, spaceshipSize);

    context.restore();
    drawBullets();
    drawWords();

    window.requestAnimationFrame(draw);
}

setup();