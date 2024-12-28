let timer;
let isRunning = false;
const timeDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

startBtn.addEventListener('click', () => {
    if (isRunning) return;

    isRunning = true;
    let timeLeft = 25 * 60;

    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            isRunning = false;
            alert('Pomodoro session completed!');
            return;
        }

        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
});

resetBtn.addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    timeDisplay.textContent = '25:00';
});
