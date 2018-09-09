document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        currentKey = event.key;
    }
    else if (event.key >= 'a' && event.key <= 'z') {
        totalStrikes++;
        shoot(event.key);

        strikes.innerText = totalStrikes;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === currentKey) {
        currentKey = '';
    }
});