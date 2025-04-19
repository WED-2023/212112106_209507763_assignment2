function resizeCanvas() {
    if (!canvas) return; // Defensive check

    // If clientWidth is too small (like 0), use a safe default
    const width = canvas.clientWidth || 960;
    const height = canvas.clientHeight || 720;

    canvas.width = width;
    canvas.height = height;
}

function updateLivesDisplay() {
    const livesContainer = document.getElementById("livesContainer");
    livesContainer.innerHTML = ""; // Clear old hearts
    for (let i = 0; i < 3 - passes; i++) {
        const heart = document.createElement("img");
        heart.src = "images/health.png"; // You need a heart image in your images folder
        heart.alt = "Heart";
        livesContainer.appendChild(heart);
    }
}

function updateGameHistory() {
    const list = document.getElementById("historyList");
    list.innerHTML = ""; // Clear old list

    // Sort by score descending
    const sortedHistory = [...gameHistory].sort((a, b) => b.score - a.score);

    sortedHistory.forEach((entry) => {
        const li = document.createElement("li");
        li.textContent = `Game ${entry.gameNumber}: ${entry.score}`;

        // Highlight if this is the last played game
        if (entry.gameNumber === gameHistory.length) {
            li.classList.add("lastScore");
        }

        list.appendChild(li);
    });
}

function pauseGame() {
    stopTimer();
    stopGameLoop();
}

function resumeGame() {
    if (!gameOver) {
        startTimer(gameDuration);
        loop();
    }
}