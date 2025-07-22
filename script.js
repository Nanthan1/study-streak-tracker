const display = document.getElementById('timerDisplay');
const calendar = document.getElementById('calendar');
const durationInput = document.getElementById('duration');
const totalDaysDisplay = document.getElementById('totalDays');

let timer = null;
let timeLeft = 0;
let streak = JSON.parse(localStorage.getItem("streak") || "{}");
if (!display || !calendar || !durationInput || !totalDaysDisplay) {
  console.error("Missing required DOM elements. Check your HTML.");
  return;
}

function updateDisplay() {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  display.textContent = `${mins}:${secs}`;
}
function setTimerButtons(running) {
  document.getElementById("startTimer").disabled = running;
  document.getElementById("endEarly").disabled = !running;
}

function startTimer() {
  if (timer) return;
  setTimerButtons(true);

  const minutes = parseInt(durationInput.value);
  if (isNaN(minutes) || minutes < 1) {
    alert("Enter a valid number of minutes.");
    return;
  }

  timeLeft = minutes * 60;
  updateDisplay();

  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      timer = null;
      markStreak();
      setTimerButtons(false);

    }
  }, 1000);
}

function endEarly() {
  if (timer) {
    clearInterval(timer);
    timer = null;
    markStreak();
  }
}

function markStreak() {
  const todayKey = new Date().toISOString().split("T")[0];
  const selectedSubject = document.getElementById("subject").value.trim();

  if (!selectedSubject) {
    alert("Please enter a subject before ending the session.");
    return;
  }

  if (!streak[todayKey]) {
    streak[todayKey] = [];
  }

  streak[todayKey].push(selectedSubject); // Track multiple sessions per day
  localStorage.setItem("streak", JSON.stringify(streak));
  renderCalendar();
  document.getElementById("subject").value = ""; // Clear after use

}

function renderCalendar() {
  calendar.innerHTML = "";

  const today = new Date();
  const yearAgo = new Date();
  yearAgo.setFullYear(today.getFullYear() - 1);
  const totalActive = Object.keys(streak).length;

  let date = new Date(yearAgo);
  while (date <= today) {
    const key = date.toISOString().split("T")[0];

    const box = document.createElement("div");
    box.classList.add("day");

    if (streak[key]) {
      box.classList.add("active-day");

      let subjects = [];

      if (Array.isArray(streak[key])) {
        subjects = streak[key];
      } else if (typeof streak[key] === "string") {
        subjects = [streak[key]];
      } else if (typeof streak[key] === "object" && streak[key] !== null) {
        subjects = Object.values(streak[key]);
      }

      box.title = subjects.join(", ");
    }

    calendar.appendChild(box);
    date.setDate(date.getDate() + 1);
  }

  totalDaysDisplay.textContent = totalActive;
}

function downloadStreak() {
  const blob = new Blob([JSON.stringify(streak, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'streak.json';
  link.click();
}


updateDisplay();
renderCalendar();

document.getElementById("startTimer").addEventListener("click", startTimer);
document.getElementById("endEarly").addEventListener("click", endEarly);
