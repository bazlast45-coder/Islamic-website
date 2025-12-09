// ===== Daily Hadiths & Verses =====
const dailyHadiths = [
    { text: "Actions are judged by intentions.", reference: "Sahih Bukhari" },
    { text: "The strong believer is better than the weak believer.", reference: "Muslim" },
    { text: "The best of people are those who are most beneficial to people.", reference: "Daraqutni" },
    { text: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.", reference: "Bukhari & Muslim" },
    { text: "A smile for your brother is charity.", reference: "Tirmidhi" },
    { text: "Feed the hungry, visit the sick, free the captives.", reference: "Bukhari" }
];

const dailyVerses = [
    { text: "Indeed, Allah is with the patient.", reference: "Surah Al-Baqarah 2:153" },
    { text: "So remember Me; I will remember you.", reference: "Surah Al-Baqarah 2:152" },
    { text: "And whoever relies upon Allah – then He is sufficient for him.", reference: "Surah At-Talaq 65:3" },
    { text: "Indeed, Allah does not wrong the people at all.", reference: "Surah Yunus 10:44" },
    { text: "And establish prayer and give zakah.", reference: "Surah Al-Baqarah 2:43" },
    { text: "Whoever does righteousness, it is for his own soul.", reference: "Surah Al-Baqarah 2:286" }
];

// ===== Helper: get daily item from localStorage =====
function getDailyItem(type) {
    const today = new Date().toISOString().slice(0,10);
    const stored = localStorage.getItem(type + '-' + today);
    if (stored) return JSON.parse(stored);
    const array = type === 'hadith' ? dailyHadiths : dailyVerses;
    const item = array[Math.floor(Math.random() * array.length)];
    localStorage.setItem(type + '-' + today, JSON.stringify(item));
    return item;
}

// ===== Display functions =====
function showHadith() {
    const homeElem = document.getElementById('hadith-display');
    const pageElem = document.getElementById('hadith-display-page');
    const hadith = getDailyItem('hadith');
    if (homeElem) homeElem.innerText = `"${hadith.text}" – ${hadith.reference}`;
    if (pageElem) pageElem.innerText = `"${hadith.text}" – ${hadith.reference}`;
}

function showVerse() {
    const homeElem = document.getElementById('verse-display');
    const pageElem = document.getElementById('verse-display-page');
    const verse = getDailyItem('verse');
    if (homeElem) homeElem.innerText = `"${verse.text}" – ${verse.reference}`;
    if (pageElem) pageElem.innerText = `"${verse.text}" – ${verse.reference}`;
}

// ===== Daily Challenge =====
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
    const today = new Date().toISOString().slice(0,10);
    let stored = localStorage.getItem('challenge-' + today);
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

    // Reward message
    alert(`Mashallah! You have completed the challenge 🌙\nMay Allah reward you in the Akhira 🤲`);
}

// ===== Event Listeners =====
document.addEventListener('DOMContentLoaded', () => {
    showHadith();
    showVerse();

    const btn = document.getElementById('generate-challenge');
    if (btn) btn.addEventListener('click', generateChallenge);

    loadChallengeHistory();
});
