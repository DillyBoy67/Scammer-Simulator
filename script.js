// Data structures
const contacts = [];
const messages = {};
const player = {
  money: 1000,
  trustworthiness: 50,
  reliability: 50,
  speed: 50
};
const upgrades = {
  trustworthiness: 0,
  reliability: 0,
  speed: 0
};

// Generate contacts
function generateContacts() {
  const names = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Hannah", "Ian", "Jane", "Kyle", "Laura", "Mike", "Nina", "Oscar", "Paul", "Quinn", "Rachel", "Steve", "Tina", "Uma", "Victor", "Wendy", "Xander", "Yara", "Zane"];
  for(let i=1; i<=50; i++) {
    const name = names[Math.floor(Math.random() * names.length)] + " " + (i);
    const age = Math.floor(Math.random() * 40) + 18;
    const phone = "+1" + Math.floor(100000000 + Math.random()*899999999);
    contacts.push({name, age, phone});
  }
}

// Initialize contacts in WhatsDat and Phone
function loadContacts() {
  const contactsDiv = document.getElementById('contacts');
  const phoneDiv = document.getElementById('phoneContacts');
  contactsDiv.innerHTML = '';
  phoneDiv.innerHTML = '';
  contacts.forEach((c, index) => {
    const contactEl = document.createElement('div');
    contactEl.textContent = `${c.name} (Age: ${c.age})`;
    contactEl.style.cursor = 'pointer';
    contactEl.onclick = () => selectContact(index);
    contactsDiv.appendChild(contactEl);

    const phoneContactEl = document.createElement('div');
    phoneContactEl.textContent = `${c.name} (${c.phone})`;
    phoneContactEl.style.cursor = 'pointer';
    phoneContactEl.onclick = () => selectContact(index);
    phoneDiv.appendChild(phoneContactEl);
  });
}

let selectedContactIndex = null;

function selectContact(index) {
  selectedContactIndex = index;
  if(!messages[index]) {
    messages[index] = [];
  }
  loadMessages();
}

function loadMessages() {
  const msgDiv = document.getElementById('messages');
  msgDiv.innerHTML = '';
  if(selectedContactIndex === null) return;
  messages[selectedContactIndex].forEach(msg => {
    const msgEl = document.createElement('div');
    msgEl.textContent = msg;
    msgDiv.appendChild(msgEl);
  });
  msgDiv.scrollTop = msgDiv.scrollHeight;
}

// Send message
document.getElementById('sendMessageBtn').onclick = () => {
  const input = document.getElementById('messageInput');
  const msg = input.value.trim();
  if(msg && selectedContactIndex !== null) {
    messages[selectedContactIndex].push("You: " + msg);
    simulateReply(selectedContactIndex, msg);
    input.value = '';
    loadMessages();
  }
};

// Simulate reply
const replyTemplates = [
  "Thanks for reaching out.",
  "I'm not interested.",
  "Can you call me later?",
  "What do you want?",
  "Send me the details.",
  "I'm busy right now.",
  "Okay, but make it quick.",
  "No way!",
  "Maybe later.",
  "Sure, I can do that."
];

function simulateReply(contactIndex, message) {
  let reply = replyTemplates[Math.floor(Math.random() * replyTemplates.length)];
  setTimeout(() => {
    messages[contactIndex].push("Person: " + reply);
    loadMessages();
  }, 1000);
}

// App control
function openApp(appId) {
  document.querySelectorAll('.window').forEach(w => w.style.display = 'none');
  document.getElementById(appId).style.display = 'flex';
  if(appId === 'whatsdat') {
    loadContacts();
  } else if(appId === 'phone') {
    loadContacts();
  }
}

function closeApp(appId) {
  document.getElementById(appId).style.display = 'none';
}

// Money management
function depositMoney() {
  const amount = prompt('Enter amount to deposit:', '0');
  const amt = parseFloat(amount);
  if(!isNaN(amt) && amt > 0 && amt <= player.money) {
    player.money -= amt;
    document.getElementById('playerMoney').textContent = player.money;
  } else {
    alert('Invalid amount.');
  }
}

function withdrawMoney() {
  const amount = prompt('Enter amount to withdraw:', '0');
  const amt = parseFloat(amount);
  if(!isNaN(amt) && amt > 0) {
    player.money += amt;
    document.getElementById('playerMoney').textContent = player.money;
  }
}

// Upgrade purchase
function buyUpgrade(type) {
  if(player.money >= 200) {
    player.money -= 200;
    upgrades[type] = (upgrades[type] || 0) + 1;
    document.getElementById('playerMoney').textContent = player.money;
    document.getElementById('upgradeStatus').textContent = `Purchased ${type} upgrade!`;
    if(type === 'trustworthiness') {
      player.trustworthiness += 10;
    } else if(type === 'reliability') {
      player.reliability += 10;
    } else if(type === 'speed') {
      player.speed += 10;
    }
  } else {
    alert('Not enough money.');
  }
}

// Police - swat
function swatTarget() {
  const successChance = Math.random() * 100;
  const resultDiv = document.getElementById('policeResult');
  if(successChance < 50 + player.reliability) {
    resultDiv.textContent = 'Swat successful! You intimidated the target.';
  } else {
    resultDiv.textContent = 'Swat failed! The target is alerted.';
  }
}

// Phone - request money
let currentPerson = null;
document.getElementById('requestMoneyBtn').onclick = () => {
  if(selectedContactIndex !== null) {
    currentPerson = selectedContactIndex;
    document.getElementById('moneyRequestModal').style.display = 'flex';
  }
};

function closeMoneyModal() {
  document.getElementById('moneyRequestModal').style.display = 'none';
}

function sendMoneyRequest() {
  const amount = parseFloat(document.getElementById('moneyAmount').value);
  if(isNaN(amount) || amount <= 0) {
    alert('Enter a valid amount.');
    return;
  }
  const reluctanceFactor = Math.random() * 100;
  const contactTrust = Math.random() * 100;
  if(reluctanceFactor + contactTrust > 150 - player.trustworthiness) {
    alert('They refused to send money.');
  } else {
    alert(`They sent you $${amount}!`);
    player.money += amount;
    document.getElementById('playerMoney').textContent = player.money;
  }
  closeMoneyModal();
}

// Initialize game
generateContacts();
loadContacts();
