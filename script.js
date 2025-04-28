const startGameBtn = document.getElementById('startGameBtn');
const startNightBtn = document.getElementById('startNightBtn');
const submitVoteBtn = document.getElementById('submitVoteBtn');
const playerRole = document.getElementById('playerRole');
const messages = document.getElementById('messages');
const voteArea = document.getElementById('voteArea');
const timer = document.getElementById('time');

let playerName = '';
let playerRoleValue = '';
let players = [];
let votes = {};
let killedPlayer = null;
let protectedPlayer = null;

startGameBtn.addEventListener('click', startGame);
startNightBtn.addEventListener('click', startNight);
submitVoteBtn.addEventListener('click', submitVote);

function startGame() {
    playerName = prompt("ادخل اسمك:");
    playerRoleValue = prompt("اختر دورك (مستذئب / قروي / ساحرة / عراف / حارس):");
    players.push(playerName);

    playerRole.innerHTML = `اسمك هو: ${playerName}<br>دورك هو: ${playerRoleValue}`;

    startGameBtn.disabled = true;
    startNightBtn.classList.remove('hidden');
}

function startNight() {
    startNightBtn.classList.add('hidden');
    messages.innerHTML = `<p>الليل بدأ...</p>`;
    voteArea.classList.add('hidden');
    
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
    if (killedPlayer && killedPlayer !== protectedPlayer) {
        messages.innerHTML += `<p>لقد مات اللاعب: ${killedPlayer}</p>`;
    } else {
        messages.innerHTML += `<p>لم يمت أحد هذه الليلة.</p>`;
    }
    voteArea.classList.remove('hidden');
    startNightBtn.classList.remove('hidden');
    votes = {};
}

function submitVote() {
    const votedPlayer = prompt("صوت ضد من تريد؟ اكتب اسمه:");
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