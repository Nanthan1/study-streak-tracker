const display = document.getElementById('timerDisplay');
const calendar = document.getElementById('calendar');
const durationInput = document.getElementById('duration');
const totalDaysDisplay = document.getElementById('totalDays');

let timer = null;
let timeLeft = 0;
let streak = JSON.parse(localStorage.getItem("streak") || "{}");

function updateDisplay() {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  display.textContent = `${mins}:${secs}`;
}

function startTimer() {
  if (timer) return;

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
  const selectedSubject = document.getElementById("subject").value;

  if (!streak[todayKey]) {
    streak[todayKey] = [];
  }

  streak[todayKey].push(selectedSubject); // Track multiple sessions per day
  localStorage.setItem("streak", JSON.stringify(streak));
  renderCalendar();
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
    const level = streak[key] || 0;

    const box = document.createElement("div");
    box.classList.add("day");

    if (level > 0) {
      if (level >= 4) box.classList.add("level-4");
      else if (level === 3) box.classList.add("level-3");
      else if (level === 2) box.classList.add("level-2");
      else box.classList.add("level-1");
    }

   if (streak[key]) {
  let subjects = [];

  if (Array.isArray(streak[key])) {
    subjects = streak[key];
  } else if (typeof streak[key] === "string") {
    subjects = [streak[key]];
  } else if (typeof streak[key] === "object" && streak[key] !== null) {
    subjects = Object.values(streak[key]); // handles { subject: "Math" }
  }

  box.title = subjects.join(", ");
}

calendar.appendChild(box);

    date.setDate(date.getDate() + 1);
  }

  totalDaysDisplay.textContent = totalActive;
}

updateDisplay();
renderCalendar();

document.getElementById("startTimer").addEventListener("click", startTimer);
document.getElementById("endEarly").addEventListener("click", endEarly);
