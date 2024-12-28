let studyTime = 25 * 60; // 25 minutes in seconds
let breakTime = 5 * 60; // 5 minutes in seconds
let isStudyTime = true;
let timerInterval;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');

function updateTimerDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function startTimer() {
    timerInterval = setInterval(function () {
        if (isStudyTime) {
            if (studyTime > 0) {
                studyTime--;
                updateTimerDisplay(studyTime);
            } else {
                clearInterval(timerInterval);
                alert('Time to take a break!');
                isStudyTime = false;
                startTimer();
            }
        } else {
            if (breakTime > 0) {
                breakTime--;
                updateTimerDisplay(breakTime);
            } else {
                clearInterval(timerInterval);
                alert('Break over! Time to study!');
                isStudyTime = true;
                startTimer();
            }
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    isStudyTime = true;
    studyTime = 25 * 60;
    breakTime = 5 * 60;
    updateTimerDisplay(studyTime);
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

// Initialize the timer display
updateTimerDisplay(studyTime);
