const startGameBtn = document.getElementById('startGameBtn');
const startNightBtn = document.getElementById('startNightBtn');
const submitVoteBtn = document.getElementById('submitVoteBtn');
const playerRole = document.getElementById('playerRole');
const messages = document.getElementById('messages');
const voteArea = document.getElementById('voteArea');
const timer = document.getElementById('time');
const voteSelect = document.getElementById('voteSelect');
const nightImage = document.getElementById('nightImage');
const dayImage = document.getElementById('dayImage');
const chatInput = document.getElementById('chatInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const chatMessages = document.getElementById('chatMessages');

let playerName = '';
let playerRoleValue = '';
let players = [];
let votes = {};
let killedPlayer = null;
let protectedPlayer = null;

const roles = ['مستذئب', 'قروي', 'ساحرة', 'عراف', 'حارس'];

startGameBtn.addEventListener('click', startGame);
startNightBtn.addEventListener('click', startNight);
submitVoteBtn.addEventListener('click', submitVote);
sendMessageBtn.addEventListener('click', sendMessage);

let countdown;
let timeLeft = 120; // دقيقتين (120 ثانية)

function startGame() {
    if (players.length < 2) {
        alert("يجب أن يكون هناك 2 لاعبين على الأقل لبدء اللعبة.");
        return;
    }

    playerName = prompt("ادخل اسمك:");
    playerRoleValue = assignRole(); // اختيار الدور عشوائيًا
    players.push(playerName);

    playerRole.innerHTML = `اسمك هو: ${playerName}<br>دورك هو: ${playerRoleValue}`;

    startGameBtn.disabled = true;
    startNightBtn.classList.remove('hidden');
    updatePlayerCount();
}

function assignRole() {
    const randomIndex = Math.floor(Math.random() * roles.length);
    return roles[randomIndex];
}

function updatePlayerCount() {
    messages.innerHTML = `<p>عدد اللاعبين الحاليين: ${players.length} / 4</p>`;
    if (players.length < 4) {
        messages.innerHTML += `<p>ينبغي أن يكون عدد اللاعبين 4 على الأقل لبدء اللعبة.</p>`;
    }
}

function startNight() {
    startNightBtn.classList.add('hidden');
    messages.innerHTML += `<p>الليل بدأ...</p>`;
    voteArea.classList.add('hidden');
    
    // عرض صورة الليل
    nightImage.classList.remove('hidden');
    dayImage.classList.add('hidden');

    startCountdown();

    if (playerRoleValue === 'مستذئب') {
        promptWolfKill();
    } else if (playerRoleValue === 'حارس') {
        promptGuard();
    } else if (playerRoleValue === 'ساحرة') {
        promptWitch();
    } else if (playerRoleValue === 'عراف') {
        promptSeer();
    } else {
        waitForMorning();
    }
}

function startCountdown() {
    countdown = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(countdown);
            messages.innerHTML += `<p>الوقت انتهى!</p>`;
            waitForMorning();
        } else {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timer.innerHTML = `الوقت المتبقي: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
            timeLeft--;
        }
    }, 1000);
}

function promptWolfKill() {
    const target = prompt("كمستذئب، اختر اسم اللاعب الذي تريد قتله:");
    killedPlayer = target;
    waitForMorning();
}

function promptGuard() {
    const target = prompt("كحارس، اختر من تريد حمايته هذه الليلة:");
    protectedPlayer = target;
    waitForMorning();
}

function promptWitch() {
    if (killedPlayer) {
        const save = confirm(`الساحرة: اللاعب ${killedPlayer} سيموت. هل تريدين إنقاذه؟`);
        if (save) {
            killedPlayer = null;
        }
    }
    const killAnother = confirm("الساحرة: هل تريدين قتل لاعب آخر؟");
    if (killAnother) {
        const newTarget = prompt("من تريدين قتله؟");
        killedPlayer = newTarget;
    }
    waitForMorning();
}

function promptSeer() {
    const target = prompt("العراف: اختر اسم لاعب لتكشف هويته:");
    alert(`هوية اللاعب: (تخيل أنه مثلا مستذئب أو قروي - حسب لعبتنا المبسطة)`);
    waitForMorning();
}

function waitForMorning() {
    setTimeout(() => {
        morningPhase();
    }, 3000);
}

function morningPhase() {
    nightImage.classList.add('hidden');
    dayImage.classList.remove('hidden');

    if (killedPlayer && killedPlayer !== protectedPlayer) {
        messages.innerHTML += `<p>لقد مات اللاعب: ${killedPlayer}</p>`;
    } else {
        messages.innerHTML += `<p>لم يمت أحد هذه الليلة.</p>`;
    }
    updateVoteArea();
}

function updateVoteArea() {
    voteArea.classList.remove('hidden');
    voteSelect.innerHTML = '';
    players.forEach(player => {
        const option = document.createElement('option');
        option.value = player;
        option.textContent = player;
        voteSelect.appendChild(option);
    });
}

function submitVote() {
    const votedPlayer = voteSelect.value;
    if (!votes[votedPlayer]) {
        votes[votedPlayer] = 1;
    } else {
        votes[votedPlayer]++;
    }

    alert("تم تسجيل صوتك.");
    checkVotes();
}

function checkVotes() {
    let maxVotes = 0;
    let eliminated = null;

    for (const player in votes) {
        if (votes[player] > maxVotes) {
            maxVotes = votes[player];
            eliminated = player;
        }
    }

    if (eliminated) {
        messages.innerHTML += `<p>تم طرد اللاعب: ${eliminated}</p>`;
        players = players.filter(p => p !== eliminated);
        checkWinCondition();
    }

    votes = {};
}

function checkWinCondition() {
    let wolves = 0;
    let villagers = 0;

    players.forEach(player => {
        if (playerRoleValue === 'مستذئب') {
            wolves++;
        } else {
            villagers++;
        }
    });

    if (wolves === 0) {
        alert("القرويون فازوا!");
        resetGame();
    } else if (wolves >= villagers) {
        alert("المستذئبون فازوا!");
        resetGame();
    }
}

function resetGame() {
    location.reload();
}

// إرسال الرسالة إلى الشات
function sendMessage() {
    const message = chatInput.value.trim();
    if (message !== '') {
        const messageElement = document.createElement('p');
        messageElement.textContent = `${playerName}: ${message}`;
        chatMessages.appendChild(messageElement);
        chatInput.value = ''; // مسح صندوق النص بعد الإرسال

        // جعل الشات دائمًا يظهر أسفل أحدث رسالة
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}