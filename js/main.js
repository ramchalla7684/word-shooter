let width = 1080;
let height = width * 10 / 16;

let spaceshipSize = 40;
let bulletSize = 75;
let orbitRadius = 20;

let minDistance = bulletSize - 5;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const accuracy = document.getElementById('accuracy');
const strikes = document.getElementById('strikes');
const misses = document.getElementById('misses');

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

let isPaused = false;

function drawBullets() {
    for (let i = 0; i < bullets.length;) {
        if (bullets[i].isDestroyed) {
            bullets.splice(i, 1);

            accuracy.innerText = ((correctStrikes / totalStrikes) * 100).toFixed(1) + '%';
            misses.innerText = totalStrikes - correctStrikes;
        }
        else {
            bullets[i].move();
            bullets[i].draw();
            i++;
        }
    }
}


function drawWords() {
    for (let i = 0; i < words.length;) {

        if (words[i].text !== '') {
            words[i].move();
        }

        if (words[i] !== targetWord) {
            words[i].draw();
        }

        if (words[i].isDestroyed) {
            words.splice(i, 1);
            targetWord = undefined;
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

        if (!isPaused) {
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
        }
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
            bullets.push(new Bullet(width / 2 + orbitRadius * Math.cos(rotation), height / 2 + orbitRadius * Math.sin(rotation), rotation, targetWord));
            return true;
        }
    }

    return false;
}

function pause() {
    isPaused = true;
}

function resume() {
    isPaused = false;
    update();
}

function start() {
    canvas.width = width;
    canvas.height = height;

    background.src = './sprites/background.png';
    spaceship.src = './sprites/ship.png';
    bullet.src = './sprites/bullet.png';

    fetch('./words.txt')
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
}

function update() {
    if (isPaused) {
        return;
    }

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

    window.requestAnimationFrame(update);
}

start();