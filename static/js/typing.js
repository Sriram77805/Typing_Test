let time = testTime;
let timeLeft = testTime;
let timer = null;
let started = false;
let startTime = 0;
let correctChars = 0;
let totalTyped = 0;

const inputArea = document.getElementById('inputArea');
const paragraphEl = document.getElementById('paragraph');
const timerEl = document.getElementById('timer');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const progressBar = document.getElementById('progressBar');
const username = document.getElementById('username');

function startTest() {
  if (started) return;
  started = true;
  startTime = Date.now();
  timeLeft = time;
  timerEl.textContent = time;
  inputArea.disabled = false;
  inputArea.value = "";
  inputArea.focus();

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    progressBar.style.width = `${((time - timeLeft) / time) * 100}%`;
    if (timeLeft <= 0) finishTest();
  }, 1000);
}

function finishTest() {
  clearInterval(timer);
  inputArea.disabled = true;
  const elapsed = (Date.now() - startTime) / 1000;
  const wpm = (correctChars / 5) / (elapsed / 60);
  const accuracy = (correctChars / totalTyped) * 100 || 0;
  wpmEl.textContent = wpm.toFixed(2);
  accuracyEl.textContent = accuracy.toFixed(2);

  fetch('/submit_result', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name: username.value,
      wpm: wpm,
      accuracy: accuracy,
      time: time
    })
  })
  .then(res => res.json())
  .then(data => window.location.href = `/result/${data.id}`);
}

inputArea.addEventListener('input', () => {
  if (!started) startTest();
  const typed = inputArea.value;
  totalTyped = typed.length;

  let display = "";
  correctChars = 0;
  for (let i = 0; i < paragraph.length; i++) {
    const char = paragraph[i];
    if (i < typed.length) {
      if (typed[i] === char) {
        display += `<span class='correct'>${char}</span>`;
        correctChars++;
      } else {
        display += `<span class='incorrect'>${char}</span>`;
      }
    } else {
      display += `<span>${char}</span>`;
    }
  }
  paragraphEl.innerHTML = display;

  const elapsed = (Date.now() - startTime) / 1000;
  const wpm = (correctChars / 5) / (elapsed / 60);
  const accuracy = (correctChars / totalTyped) * 100 || 0;
  wpmEl.textContent = wpm.toFixed(2);
  accuracyEl.textContent = accuracy.toFixed(2);
});

document.getElementById('startBtn').addEventListener('click', startTest);
document.getElementById('restartBtn').addEventListener('click', () => window.location.reload());
