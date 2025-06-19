function updateCurrentTime() {
    const now = new Date();
    document.getElementById("current-time").textContent = now.toLocaleTimeString();
}
setInterval(updateCurrentTime, 1000);

// Carica le pause effettuate oggi
let todayBreaks = JSON.parse(localStorage.getItem("todayBreaks") || "[]");
const today = new Date().toISOString().split("T")[0];
todayBreaks = todayBreaks.filter(b => b.date === today);
localStorage.setItem("todayBreaks", JSON.stringify(todayBreaks));
updateBreakList();

function startBreak() {
    const now = new Date();
    const duration = 15 * 60 * 1000; // 15 minuti
    const endTime = new Date(now.getTime() + duration);

    document.getElementById("start-time").textContent = now.toLocaleTimeString();
    document.getElementById("end-time").textContent = endTime.toLocaleTimeString();

    playAudio('start');

    startCountdown(duration);

    // Registra la pausa
    todayBreaks.push({ date: today, time: now.toLocaleTimeString() });
    localStorage.setItem("todayBreaks", JSON.stringify(todayBreaks));
    updateBreakList();
}

function startCountdown(duration) {
    const countdownEl = document.getElementById("countdown");
    let timer = duration / 1000;

    countdownEl.textContent = formatTime(timer);

    const interval = setInterval(() => {
        timer--;
        if (timer <= 0) {
            clearInterval(interval);
            countdownEl.textContent = "Fine pausa!";
            playAudio('end');
        } else {
            countdownEl.textContent = formatTime(timer);
        }
    }, 1000);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateBreakList() {
    const list = document.getElementById("breaks-list");
    list.innerHTML = "";
    todayBreaks.forEach(b => {
        const li = document.createElement("li");
        li.textContent = `Pausa alle ${b.time}`;
        list.appendChild(li);
    });
}

function playAudio(type) {
    const sound = document.getElementById(type + "Sound");
    sound.currentTime = 0;
    sound.play();
}

window.onload = () => {
    updateCurrentTime();
};