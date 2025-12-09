// ==== Daily Hadiths & Verses ====
const dailyHadiths = [
    { text: "Actions are judged by intentions.", reference: "Sahih Bukhari" },
    { text: "The strong believer is better than the weak believer.", reference: "Muslim" },
    { text: "The best of people are those who are most beneficial to people.", reference: "Daraqutni" },
    { text: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.", reference: "Bukhari & Muslim" }
];

const dailyVerses = [
    { text: "Indeed, Allah is with the patient.", reference: "Surah Al-Baqarah 2:153" },
    { text: "So remember Me; I will remember you.", reference: "Surah Al-Baqarah 2:152" },
    { text: "And whoever relies upon Allah – then He is sufficient for him.", reference: "Surah At-Talaq 65:3" },
    { text: "Indeed, Allah does not wrong the people at all.", reference: "Surah Yunus 10:44" }
];

function getDailyItem(type) {
    const today = new Date().toISOString().slice(0, 10);
    const stored = localStorage.getItem(type + '-' + today);
    if (stored) return JSON.parse(stored);
    let array = type === 'hadith' ? dailyHadiths : dailyVerses;
    const item = array[Math.floor(Math.random() * array.length)];
    localStorage.setItem(type + '-' + today, JSON.stringify(item));
    return item;
}

function showHadith() {
    const elemHome = document.getElementById('hadith-display');
    const elemPage = document.getElementById('hadith-display-page');
    const hadith = getDailyItem('hadith');
    if (elemHome) elemHome.innerText = `"${hadith.text}" – ${hadith.reference}`;
    if (elemPage) elemPage.innerText = `"${hadith.text}" – ${hadith.reference}`;
}

function showVerse() {
    const elemHome = document.getElementById('verse-display');
    const elemPage = document.getElementById('verse-display-page');
    const verse = getDailyItem('verse');
    if (elemHome) elemHome.innerText = `"${verse.text}" – ${verse.reference}`;
    if (elemPage) elemPage.innerText = `"${verse.text}" – ${verse.reference}`;
}

// ==== Daily Challenge ====
const challenges = [
    "Give charity today.",
    "Read 5 pages of Quran.",
    "Pray an extra voluntary prayer.",
    "Help someone in need.",
    "Share Islamic knowledge with a friend."
];

function loadChallengeHistory() {
    const history = JSON.parse(localStorage.getItem('challenge-history')) || [];
    const ul = document.getElementById('history-list');
    if (!ul) return;
    ul.innerHTML = '';
    history.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c;
        ul.appendChild(li);
    });
}

function generateChallenge() {
    const today = new Date().toISOString().slice(0, 10);
    const stored = localStorage.getItem('challenge-' + today);
    let challenge;
    if (stored) {
        challenge = stored;
    } else {
        challenge = challenges[Math.floor(Math.random() * challenges.length)];
        localStorage.setItem('challenge-' + today, challenge);
    }
    const display = document.getElementById('challenge-display');
    if (display) display.innerText = challenge;

    // Add to history if not already there
    let history = JSON.parse(localStorage.getItem('challenge-history')) || [];
    if (!history.includes(challenge)) {
        history.push(challenge);
        localStorage.setItem('challenge-history', JSON.stringify(history));
    }

    loadChallengeHistory();

    // Show completion message
    alert(`Mashallah! You have completed the challenge 🌙\nMay Allah reward you in the Akhira 🤲`);
}

// ==== Event Listeners ====
document.addEventListener('DOMContentLoaded', () => {
    showHadith();
    showVerse();

    const btn = document.getElementById('generate-challenge');
    if (btn) btn.addEventListener('click', generateChallenge);

    loadChallengeHistory();
});
