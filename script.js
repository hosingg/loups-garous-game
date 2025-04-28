let players = [];
let chatMessages = [];

function addPlayer() {
  const nameInput = document.getElementById("playerName");
  const name = nameInput.value.trim();
  if (name) {
    players.push({ name: name, votes: 0 });
    nameInput.value = "";
    updatePlayerList();
  }
}

function updatePlayerList() {
  const list = document.getElementById("playerList");
  list.innerHTML = "";
  players.forEach(player => {
    const li = document.createElement("li");
    li.textContent = player.name;
    list.appendChild(li);
  });
}

function sendMessage() {
  const chatInput = document.getElementById("chatInput");
  const message = chatInput.value.trim();
  if (message) {
    chatMessages.push(message);
    chatInput.value = "";
    updateChat();
  }
}

function updateChat() {
  const chatBox = document.getElementById("chatMessages");
  chatBox.innerHTML = "";
  chatMessages.forEach(msg => {
    const div = document.createElement("div");
    div.textContent = msg;
    chatBox.appendChild(div);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

function startVoting() {
  const voteArea = document.getElementById("voteArea");
  voteArea.innerHTML = "<h3>صوت على اللاعب الذئب!</h3>";

  players.forEach((player, index) => {
    const btn = document.createElement("button");
    btn.textContent = player.name;
    btn.onclick = () => vote(index);
    voteArea.appendChild(btn);
  });
}

function vote(index) {
  players[index].votes++;
  alert(`صوتك ذهب إلى: ${players[index].name}`);
  checkWinner();
}

function checkWinner() {
  const maxVotes = Math.max(...players.map(p => p.votes));
  const winners = players.filter(p => p.votes === maxVotes);

  if (winners.length === 1) {
    alert(`الفائز هو: ${winners[0].name}!`);
  } else if (winners.length > 1) {
    alert(`تعادل بين: ${winners.map(w => w.name).join(", ")}`);
  }
}

function restartGame() {
  if (confirm("هل تريد إعادة اللعبة؟")) {
    players = [];
    chatMessages = [];
    updatePlayerList();
    updateChat();
    document.getElementById("voteArea").innerHTML = "";
  }
}