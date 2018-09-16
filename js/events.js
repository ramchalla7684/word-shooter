document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        currentKey = event.key;
    }
    else if (event.key >= 'a' && event.key <= 'z') {
        totalStrikes++;
        strikes.innerText = totalStrikes;
        if (!shoot(event.key)) {
            accuracy.innerText = ((correctStrikes / totalStrikes) * 100).toFixed(1) + '%';
            misses.innerText = totalStrikes - correctStrikes;
        }
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === currentKey) {
        currentKey = '';
    }
});

window.addEventListener('blur', pause);
window.addEventListener('focus', resume);